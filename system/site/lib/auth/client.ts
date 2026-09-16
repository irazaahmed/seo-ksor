/**
 * The site's connection to its own account backend.
 *
 * `/api/auth` is a relative path, routed same-origin to the `auth` service by
 * a rewrite in the root `vercel.json` — so this needs no per-domain env var,
 * and the session cookie it sets is an ordinary first-party cookie (no CORS,
 * no `SameSite=None`).
 */

import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
  plugins: [emailOTPClient()],
});

export const { useSession, signIn, signUp, signOut, emailOtp } = authClient;
