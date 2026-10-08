/**
 * One Postgres pool for Better Auth and for this server's own two tables.
 *
 * A long connect timeout, not a large pool: Neon (like the record's own
 * Postgres) scales its compute to zero on idle, so the first query after a
 * quiet spell pays a cold start rather than failing outright.
 */

import { Pool } from "pg";

const dsn = process.env["KSOR_DB_URL"];
if (dsn === undefined || dsn === "") {
  throw new Error("KSOR_DB_URL is required, set it before starting the auth server.");
}

export const pool = new Pool({ connectionString: dsn, connectionTimeoutMillis: 45_000 });

/**
 * This server's own tables, created on boot if missing. Additive only: no
 * statement here alters or drops anything that exists.
 *
 * - `askseo_page_view`: one row per page view. `visitor` is a keyed hash of
 *   the reader's IP and user agent, salted per day, so a visitor counts once
 *   a day and no raw IP is ever stored.
 * - `askseo_mcp_connection`: one row per (user, assistant) the first time
 *   that person connects that assistant, so the welcome email goes once.
 */
export async function ensureTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS askseo_page_view (
      id         bigserial PRIMARY KEY,
      viewed_at  timestamptz NOT NULL DEFAULT now(),
      path       text NOT NULL,
      visitor    text NOT NULL,
      referrer   text
    );
    CREATE INDEX IF NOT EXISTS askseo_page_view_viewed_at ON askseo_page_view (viewed_at);
    CREATE TABLE IF NOT EXISTS askseo_mcp_connection (
      user_id       text NOT NULL,
      client_id     text NOT NULL,
      connected_at  timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, client_id)
    );
  `);
}
