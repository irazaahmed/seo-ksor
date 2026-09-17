"use client";

import { useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

export default function SignInPage(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (signInError) {
      setError(signInError.message ?? "Sign-in failed.");
      return;
    }
    window.location.assign("/");
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
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Welcome back to AskSEO.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
              autoComplete="current-password"
            />
            {error !== null ? <p className="text-destructive text-sm">{error}</p> : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
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
          <p className="text-muted-foreground text-center text-sm">
            No account?{" "}
            <a href="/sign-up" className="text-foreground underline underline-offset-4">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
