"use client";

/**
 * The consent step of an assistant's connect flow: the reader is signed in,
 * and an assistant (Claude, ChatGPT, Muse...) asks to read AskSEO on their
 * behalf. The authorization server opens this page with its signed request
 * in the query; `oauthProviderClient` sends that query with the decision.
 */

import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient, useSession } from "@/lib/auth/client";

interface PublicClient {
  readonly client_name?: string;
  readonly client_uri?: string;
}

export default function ConsentPage(): React.ReactElement {
  const { data: session } = useSession();
  const [client, setClient] = useState<PublicClient | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = new URLSearchParams(window.location.search).get("client_id");
    if (clientId === null) return;
    void authClient.$fetch<PublicClient>("/oauth2/public-client", { query: { client_id: clientId } }).then(
      ({ data }) => setClient(data ?? null),
    );
  }, []);

  async function decide(accept: boolean): Promise<void> {
    setBusy(true);
    setError(null);
    const { data, error: consentError } = await authClient.$fetch<{ redirect_uri?: string; url?: string }>(
      "/oauth2/consent",
      { method: "POST", body: { accept } },
    );
    if (consentError) {
      setBusy(false);
      setError(consentError.message ?? "Something went wrong. Try connecting again from your assistant.");
      return;
    }
    const next = data?.redirect_uri ?? data?.url;
    if (typeof next === "string") window.location.assign(next);
  }

  const name = client?.client_name ?? "An AI assistant";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
          <BrandMark size={26} />
        </span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connect {name} to AskSEO</CardTitle>
          <CardDescription>
            {session?.user.email !== undefined
              ? `Signed in as ${session.user.email}.`
              : "Checking your account..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <p>
            <strong>{name}</strong> will be able to search and read the AskSEO lessons for you, and
            to see your name and email.
          </p>
          <p className="text-muted-foreground">
            You can disconnect it at any time from the assistant's connector settings.
          </p>
          {error !== null ? <p className="text-destructive">{error}</p> : null}
          <div className="flex gap-2">
            <Button className="flex-1" disabled={busy} onClick={() => void decide(true)}>
              {busy ? "Connecting..." : "Allow"}
            </Button>
            <Button className="flex-1" variant="outline" disabled={busy} onClick={() => void decide(false)}>
              Deny
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
