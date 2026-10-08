/**
 * The site's connection to its own account backend.
 *
 * No `baseURL` here, deliberately: Better Auth's client falls back to
 * `window.location.origin + "/api/auth"` on its own when none is given,
 * which is exactly the same-origin address the nginx gateway puts the `auth`
 * service at, so this works unmodified on every domain the site is served
 * from, and the session cookie is an ordinary first-party cookie (no CORS, no
 * `SameSite=None`). A literal `"/api/auth"` string here would crash
 * `next build`'s prerender: Better Auth parses `baseURL` with `new URL(...)`,
 * which throws on a relative path outside a browser.
 *
 * `oauthProviderClient` carries an assistant's signed authorization request
 * (the query string the sign-in page was opened with) into every sign-in and
 * sign-up call, so signing in mid-connect continues the assistant's flow.
 */

import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [emailOTPClient(), oauthProviderClient()],
});

export const { useSession, signIn, signUp, signOut, emailOtp } = authClient;

/**
 * Where to go once a sign-in or verification succeeds: back into the
 * assistant's authorization flow when the server says so, home otherwise.
 */
export function continueAfterAuth(data: unknown): void {
  const url = (data as { url?: unknown } | null)?.url;
  window.location.assign(typeof url === "string" && url !== "" ? url : "/");
}
