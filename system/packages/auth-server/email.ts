/**
 * Every email this server sends, through Resend's HTTP API.
 *
 * `RESEND_API_KEY` is required. `RESEND_FROM` is the sender, an address on a
 * domain verified in Resend. For a local run with no key, set
 * `AUTH_EMAIL_TO_CONSOLE=1` and the email is printed instead of sent, so a
 * developer can still read the verification code.
 */

export interface Email {
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}

const apiKey = process.env["RESEND_API_KEY"] ?? "";
const toConsole = process.env["AUTH_EMAIL_TO_CONSOLE"] === "1";
const from = process.env["RESEND_FROM"] ?? "AskSEO <askseo@cybrumsolutions.dev>";
const siteUrl = process.env["BETTER_AUTH_URL"] ?? "https://askseo.cybrumsolutions.dev";

if (apiKey === "" && !toConsole) {
  throw new Error(
    "RESEND_API_KEY is required, set it before starting the auth server " +
      "(or AUTH_EMAIL_TO_CONSOLE=1 for a local run).",
  );
}

export async function sendEmail(to: string, email: Email): Promise<void> {
  if (apiKey === "") {
    console.log(`[email to ${to}] ${email.subject}\n${email.text}`);
    return;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: email.subject, text: email.text, html: email.html }),
  });
  if (!response.ok) {
    throw new Error(`Resend refused the email (${response.status}): ${await response.text()}`);
  }
}

function escape(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function layout(body: string): string {
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
<p style="font-size:18px;font-weight:700;color:#047857;margin:0 0 16px">AskSEO</p>
${body}
<p style="font-size:12px;color:#64748b;margin-top:32px">AskSEO, ${escape(siteUrl.replace(/^https?:\/\//, ""))}</p>
</div>`;
}

export function otpEmail(otp: string, type: string): Email {
  const reset = type === "forget-password";
  const subject = reset ? "Reset your AskSEO password" : "Verify your AskSEO account";
  return {
    subject,
    text: `Your AskSEO verification code is ${otp}. It expires in 5 minutes. If you did not ask for it, ignore this email.`,
    html: layout(`<p>Your AskSEO verification code is:</p>
<p style="font-size:30px;font-weight:700;letter-spacing:6px;margin:12px 0">${escape(otp)}</p>
<p>It expires in 5 minutes. If you did not ask for it, you can ignore this email.</p>`),
  };
}

export function connectedEmail(name: string, client: string): Email {
  const who = name.trim() === "" ? "there" : name.trim();
  return {
    subject: `${client} is now connected to AskSEO`,
    text:
      `Hi ${who},\n\n${client} is now connected to AskSEO. Ask it anything from the course, ` +
      `for example "Use AskSEO and explain how to find an untapped niche", and it will answer ` +
      `from the record and cite the lesson.\n\nRead the lessons: ${siteUrl}/docs\n\n` +
      `If you did not connect it, sign in at ${siteUrl}/sign-in and tell the admin.`,
    html: layout(`<p>Hi ${escape(who)},</p>
<p><strong>${escape(client)}</strong> is now connected to AskSEO.</p>
<p>Ask it anything from the course, for example <em>"Use AskSEO and explain how to find an untapped niche"</em>, and it will answer from the record and cite the lesson.</p>
<p><a href="${escape(siteUrl)}/docs" style="display:inline-block;background:#047857;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Read the lessons</a></p>
<p style="font-size:13px;color:#64748b">If you did not connect it, sign in at ${escape(siteUrl)}/sign-in and tell the admin.</p>`),
  };
}
