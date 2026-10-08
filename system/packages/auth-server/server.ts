/**
 * The auth service's entrypoint, an ordinary Node http server, same shape as
 * the door's own container (`ENV PORT`, nothing host-specific).
 *
 * Besides Better Auth's own `/api/auth/*`, it answers:
 * - the RFC 8414 metadata document at the ROOT path an assistant derives
 *   from the issuer (`/.well-known/oauth-authorization-server/api/auth`),
 *   and its OpenID twin;
 * - `POST /api/stats/hit`, the site's page-view beacon;
 * - `GET /api/admin/overview`, the admin page's numbers.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import {
  oauthProviderAuthServerMetadata,
  oauthProviderOpenIdConfigMetadata,
} from "@better-auth/oauth-provider";
import { getMigrations } from "better-auth/db/migration";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./auth.ts";
import { ensureTables } from "./db.ts";
import { handleHit, handleOverview } from "./stats.ts";

const port = Number(process.env["PORT"] ?? 80);

// Additive schema only: Better Auth's own tables (including the OAuth
// provider's), then this server's two. Nothing is altered or dropped.
const { runMigrations } = await getMigrations(auth.options);
await runMigrations();
await ensureTables();

const betterAuth = toNodeHandler(auth);
const authServerMetadata = oauthProviderAuthServerMetadata(auth);
const openIdMetadata = oauthProviderOpenIdConfigMetadata(auth);

async function sendWebResponse(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}

function webRequest(req: IncomingMessage): Request {
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost";
  const proto = req.headers["x-forwarded-proto"] ?? "http";
  return new Request(`${String(proto)}://${String(host)}${req.url ?? "/"}`, { method: "GET" });
}

const getSession = (headers: Headers) => auth.api.getSession({ headers });

const server = createServer((req, res) => {
  const path = (req.url ?? "/").split("?")[0] ?? "/";
  const route = async (): Promise<void> => {
    if (path === "/.well-known/oauth-authorization-server/api/auth") {
      return sendWebResponse(res, await authServerMetadata(webRequest(req)));
    }
    if (path === "/.well-known/openid-configuration/api/auth") {
      return sendWebResponse(res, await openIdMetadata(webRequest(req)));
    }
    if (path === "/api/stats/hit" && req.method === "POST") return handleHit(req, res);
    if (path === "/api/admin/overview" && req.method === "GET") return handleOverview(req, res, getSession);
    return betterAuth(req, res);
  };
  route().catch((error: unknown) => {
    console.error(error);
    if (!res.headersSent) res.statusCode = 500;
    res.end();
  });
});

server.listen(port, () => {
  console.log(`auth server listening on :${port}`);
});
