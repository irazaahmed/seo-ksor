/**
 * The site's connection to its own account backend.
 *
 * No `baseURL` here, deliberately: Better Auth's client falls back to
 * `window.location.origin + "/api/auth"` on its own when none is given,
 * which is exactly the same-origin address the root `vercel.json` rewrite
 * puts the `auth` service at — so this works unmodified on every domain the
 * site is served from, and the session cookie is an ordinary first-party
 * cookie (no CORS, no `SameSite=None`). A literal `"/api/auth"` string here
 * would crash `next build`'s prerender: Better Auth parses `baseURL` with
 * `new URL(...)`, which throws on a relative path outside a browser.
 */

import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
});

export const { useSession, signIn, signUp, signOut, emailOtp } = authClient;
