/**
 * The admin's numbers: page views, people, and who is connected over MCP.
 *
 * Page views arrive from a beacon on every site page (`POST /api/stats/hit`).
 * The admin overview (`GET /api/admin/overview`) is readable only by a signed
 * in, verified account whose email is in `ADMIN_EMAILS`.
 */

import { createHmac } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

import { pool } from "./db.ts";

const secret = process.env["BETTER_AUTH_SECRET"] ?? "";
const adminEmails = new Set(
  (process.env["ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e !== ""),
);

const BOT = /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|curl|wget|python|axios|node-fetch/i;

/** First connection of this user to this assistant? Records it either way. */
export async function recordConnection(userId: string, clientId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `INSERT INTO askseo_mcp_connection (user_id, client_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, clientId],
  );
  return rowCount === 1;
}

function clientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
  return first ?? req.socket.remoteAddress ?? "";
}

async function readBody(req: IncomingMessage, limit = 4096): Promise<string> {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > limit) break;
  }
  return body;
}

export async function handleHit(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const ua = req.headers["user-agent"] ?? "";
  res.statusCode = 204;
  if (BOT.test(ua)) return void res.end();
  let path = "/";
  let referrer: string | null = null;
  try {
    const parsed = JSON.parse(await readBody(req)) as { path?: unknown; referrer?: unknown };
    if (typeof parsed.path === "string") path = parsed.path.slice(0, 300);
    if (typeof parsed.referrer === "string" && parsed.referrer !== "") {
      const host = new URL(parsed.referrer).hostname.slice(0, 200);
      // Moving between pages of the site itself is not a source of visitors.
      if (host !== String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "").split(":")[0]) referrer = host;
    }
  } catch {
    // A malformed beacon still counts as a view of "/".
  }
  const day = new Date().toISOString().slice(0, 10);
  const visitor = createHmac("sha256", secret).update(`${day}|${clientIp(req)}|${ua}`).digest("hex").slice(0, 32);
  await pool.query(`INSERT INTO askseo_page_view (path, visitor, referrer) VALUES ($1, $2, $3)`, [
    path,
    visitor,
    referrer,
  ]);
  res.end();
}

/** The session's user, if the caller is a verified admin. */
async function adminOf(req: IncomingMessage, getSession: (headers: Headers) => Promise<unknown>) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
  }
  const session = (await getSession(headers)) as { user?: { email?: string; emailVerified?: boolean } } | null;
  const user = session?.user;
  if (user?.email === undefined || user.emailVerified !== true) return null;
  return adminEmails.has(user.email.toLowerCase()) ? user : null;
}

export async function handleOverview(
  req: IncomingMessage,
  res: ServerResponse,
  getSession: (headers: Headers) => Promise<unknown>,
): Promise<void> {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  if ((await adminOf(req, getSession)) === null) {
    res.statusCode = 403;
    return void res.end(JSON.stringify({ error: "admins only" }));
  }
  const [totals, daily, pages, referrers, users, connections] = await Promise.all([
    pool.query(`SELECT
        count(*) FILTER (WHERE viewed_at >= now() - interval '1 day')::int  AS views_1d,
        count(DISTINCT visitor) FILTER (WHERE viewed_at >= now() - interval '1 day')::int AS visitors_1d,
        count(*) FILTER (WHERE viewed_at >= now() - interval '30 days')::int AS views_30d,
        count(*)::int AS views_all
      FROM askseo_page_view`),
    pool.query(`SELECT to_char(date_trunc('day', viewed_at), 'YYYY-MM-DD') AS day,
        count(*)::int AS views, count(DISTINCT visitor)::int AS visitors
      FROM askseo_page_view WHERE viewed_at >= now() - interval '30 days'
      GROUP BY 1 ORDER BY 1`),
    pool.query(`SELECT path, count(*)::int AS views FROM askseo_page_view
      WHERE viewed_at >= now() - interval '30 days' GROUP BY path ORDER BY views DESC LIMIT 10`),
    pool.query(`SELECT referrer, count(*)::int AS views FROM askseo_page_view
      WHERE viewed_at >= now() - interval '30 days' AND referrer IS NOT NULL
      GROUP BY referrer ORDER BY views DESC LIMIT 10`),
    pool.query(`SELECT count(*)::int AS users,
        count(*) FILTER (WHERE "emailVerified")::int AS verified,
        count(*) FILTER (WHERE "createdAt" >= now() - interval '7 days')::int AS new_7d
      FROM "user"`),
    pool.query(`SELECT u.name, u.email, c.name AS client, m.connected_at
      FROM askseo_mcp_connection m
      JOIN "user" u ON u.id = m.user_id
      LEFT JOIN "oauthClient" c ON c."clientId" = m.client_id
      ORDER BY m.connected_at DESC LIMIT 500`),
  ]);
  const people = new Set(connections.rows.map((r: { email: string }) => r.email)).size;
  res.end(
    JSON.stringify({
      site: totals.rows[0],
      daily: daily.rows,
      topPages: pages.rows,
      referrers: referrers.rows,
      users: users.rows[0],
      mcp: { people, connections: connections.rows },
    }),
  );
}
