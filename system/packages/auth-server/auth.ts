/**
 * The account backend: the site's "Sign in" / "Sign up" pages, AND the OAuth
 * authorization server the MCP door trusts.
 *
 * Runs as its own container (docker-compose `auth` service), reachable at
 * `/api/auth/*` through the nginx gateway, same-origin with the static site,
 * so the session cookie is an ordinary first-party cookie.
 *
 * Shares the record's own Postgres (`KSOR_DB_URL`): Better Auth creates its
 * own tables there (`user`, `session`, `oauthClient`, ...), which do not
 * collide with anything ksor itself owns (`corpora`, `content_nodes`, etc.).
 *
 * The MCP side: an assistant (Claude, ChatGPT, Muse) registers itself through
 * dynamic client registration, sends the reader to `/sign-in`, then to
 * `/oauth/consent`, and receives an RS256 JWT whose `aud` is the door's
 * resource URL. The door verifies that token against this server's JWKS
 * (`KSOR_SSO_URL` = the issuer), and refuses everything else.
 */

import { oauthProvider } from "@better-auth/oauth-provider";
import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { emailOTP, jwt } from "better-auth/plugins";

import { pool } from "./db.ts";
import { connectedEmail, otpEmail, sendEmail } from "./email.ts";
import { recordConnection } from "./stats.ts";

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`${name} is required, set it before starting the auth server.`);
  }
  return value;
}

const baseURL = required("BETTER_AUTH_URL");

/** The one resource this server issues tokens for: the record's MCP door. */
export const mcpResource = required("KSOR_MCP_RESOURCE_URL");

export const auth = betterAuth({
  baseURL,
  basePath: "/api/auth",
  secret: required("BETTER_AUTH_SECRET"),
  database: pool,
  trustedOrigins: ["https://askseo.cybrumsolutions.dev", "http://localhost:3000"],
  // The oauth-provider plugin owns token issuance; Better Auth's own `/token`
  // (the jwt plugin's session-to-JWT exchange) would be a second door.
  disabledPaths: ["/token"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    // Verifying the emailed code signs the reader in, so a sign-up that began
    // inside an assistant's connect flow continues straight to consent.
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: required("GOOGLE_CLIENT_ID"),
      clientSecret: required("GOOGLE_CLIENT_SECRET"),
    },
    github: {
      clientId: required("GITHUB_CLIENT_ID"),
      clientSecret: required("GITHUB_CLIENT_SECRET"),
    },
  },
  hooks: {
    // The reader accepted an assistant's request: remember the connection
    // and, the first time this person connects this assistant, email them.
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/oauth2/consent" || ctx.body?.accept !== true) return;
      const user = ctx.context.session?.user;
      if (user === undefined) return;
      const clientId = await clientIdOfConsent(user.id);
      if (clientId === null) return;
      const first = await recordConnection(user.id, clientId);
      if (!first) return;
      const client = await clientName(clientId);
      void ctx.context.runInBackgroundOrAwait(
        sendEmail(user.email, connectedEmail(user.name, client)).catch((error: unknown) => {
          ctx.context.logger.error("connect email failed", error);
        }),
      );
    }),
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmail(email, otpEmail(otp, type));
      },
    }),
    // The door accepts RS256 only (it never introspects), so the signing key
    // is RSA, published at /api/auth/jwks and named in the metadata document.
    jwt({
      jwks: { keyPairConfig: { alg: "RS256", modulusLength: 2048 } },
      jwt: { issuer: `${baseURL}/api/auth` },
    }),
    oauthProvider({
      loginPage: "/sign-in",
      consentPage: "/oauth/consent",
      // Assistants register themselves: a reader pastes one URL and nothing
      // else. Registered clients are public (PKCE, no secret).
      allowDynamicClientRegistration: true,
      allowUnauthenticatedClientRegistration: true,
      resources: [mcpResource],
      clientRegistrationAllowedResources: [mcpResource],
      clientRegistrationDefaultResources: [mcpResource],
      scopes: ["openid", "profile", "email", "offline_access"],
    }),
  ],
});

/** The client whose consent this user most recently granted. */
async function clientIdOfConsent(userId: string): Promise<string | null> {
  const { rows } = await pool.query<{ clientId: string }>(
    `SELECT "clientId" FROM "oauthConsent" WHERE "userId" = $1 ORDER BY "updatedAt" DESC LIMIT 1`,
    [userId],
  );
  return rows[0]?.clientId ?? null;
}

async function clientName(clientId: string): Promise<string> {
  const { rows } = await pool.query<{ name: string | null }>(
    `SELECT "name" FROM "oauthClient" WHERE "clientId" = $1`,
    [clientId],
  );
  return rows[0]?.name ?? "your AI assistant";
}
