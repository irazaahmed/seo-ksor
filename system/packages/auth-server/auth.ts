/**
 * The account backend behind the site's "Sign in" / "Sign up" pages.
 *
 * Runs as its own container (see Dockerfile + root vercel.json's `auth`
 * service), reachable at `/api/auth/*` via a Vercel rewrite — same-origin with
 * the static site, so the session cookie is an ordinary first-party cookie.
 *
 * Shares the record's own Postgres (`KSOR_DB_URL`): Better Auth creates its
 * own `user`/`session`/`account`/`verification` tables there, which do not
 * collide with anything ksor itself owns (`corpora`, `content_nodes`, etc.).
 */

import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { Pool } from "pg";

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(`${name} is required — set it before starting the auth server.`);
  }
  return value;
}

const zohoUser = required("ZOHO_SMTP_USER");
const zohoPass = required("ZOHO_SMTP_PASS");

const transport = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: { user: zohoUser, pass: zohoPass },
});

// The address readers see this arrive from. Defaults to the SMTP account
// itself, but a Zoho org can send as a different address it owns (an alias
// or another mailbox) without a second set of credentials.
const fromAddress = process.env["ZOHO_SMTP_FROM"] ?? zohoUser;

async function sendOtpEmail(to: string, subject: string, otp: string): Promise<void> {
  await transport.sendMail({
    from: `"AskSEO" <${fromAddress}>`,
    to,
    subject,
    text: `Your AskSEO verification code is ${otp}. It expires in a few minutes.`,
    html: `<p>Your AskSEO verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:4px">${otp}</p><p>It expires in a few minutes. If you didn't request this, you can ignore this email.</p>`,
  });
}

export const auth = betterAuth({
  baseURL: required("BETTER_AUTH_URL"),
  basePath: "/api/auth",
  secret: required("BETTER_AUTH_SECRET"),
  // A long connect timeout, not a large pool: Neon (like the record's own
  // Postgres) scales its compute to zero on idle, so the first query after a
  // quiet spell pays a cold-start rather than failing outright.
  database: new Pool({
    connectionString: required("KSOR_DB_URL"),
    connectionTimeoutMillis: 45_000,
  }),
  trustedOrigins: [
    "https://askseo.cybrumsolutions.dev",
    "https://askseo.vercel.app",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: required("GOOGLE_CLIENT_ID"),
      clientSecret: required("GOOGLE_CLIENT_SECRET"),
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        const subject =
          type === "forget-password" ? "Reset your AskSEO password" : "Verify your AskSEO account";
        await sendOtpEmail(email, subject, otp);
      },
    }),
  ],
});
