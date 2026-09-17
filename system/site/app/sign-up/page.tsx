"use client";

import { useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

type Step = "details" | "verify";

export default function SignUpPage(): React.ReactElement {
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreateAccount(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signUpError } = await authClient.signUp.email({ name, email, password });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message ?? "Could not create the account.");
      return;
    }
    setStep("verify");
  }

  async function onVerify(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: verifyError } = await authClient.emailOtp.verifyEmail({ email, otp });
    setBusy(false);
    if (verifyError) {
      setError(verifyError.message ?? "That code didn't work.");
      return;
    }
    window.location.assign("/");
  }

  async function onResend(): Promise<void> {
    setError(null);
    await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" });
  }

  async function onGoogle(): Promise<void> {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
          <BrandMark size={26} />
        </span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{step === "details" ? "Create an account" : "Check your email"}</CardTitle>
          <CardDescription>
            {step === "details"
              ? "Sign up for AskSEO."
              : `We sent a 6-digit code to ${email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {step === "details" ? (
            <>
              <form onSubmit={onCreateAccount} className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                {error !== null ? <p className="text-destructive text-sm">{error}</p> : null}
                <Button type="submit" disabled={busy}>
                  {busy ? "Creating account…" : "Create account"}
                </Button>
              </form>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-border h-px flex-1" />
                or
                <div className="bg-border h-px flex-1" />
              </div>
              <Button type="button" variant="outline" onClick={() => void onGoogle()}>
                Continue with Google
              </Button>
            </>
          ) : (
            <form onSubmit={onVerify} className="flex flex-col gap-3">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                autoComplete="one-time-code"
              />
              {error !== null ? <p className="text-destructive text-sm">{error}</p> : null}
              <Button type="submit" disabled={busy}>
                {busy ? "Verifying…" : "Verify"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => void onResend()}>
                Resend code
              </Button>
            </form>
          )}
          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <a href="/sign-in" className="text-foreground underline underline-offset-4">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
