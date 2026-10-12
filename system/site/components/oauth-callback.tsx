"use client";

/**
 * Where an assistant that runs its connect flow from inside a chat (Muse AI's
 * agent registers itself with a callback on THIS site) lands after the
 * reader signs in and allows it. The site cannot finish the flow: only the
 * assistant holds the PKCE verifier. So the page shows the returned link and
 * asks the reader to paste it back into the chat, where the assistant
 * exchanges the code itself. The code is useless without that verifier.
 */

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OAuthCallback(): React.ReactElement {
  const [link, setLink] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLink(window.location.href);
    setCode(params.get("code"));
    setError(params.get("error_description") ?? params.get("error"));
  }, []);

  async function copy(): Promise<void> {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-fd-primary/10 text-fd-primary">
          <BrandMark size={26} />
        </span>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{error !== null ? "The connection was not completed" : "Almost connected"}</CardTitle>
          <CardDescription>
            {error !== null
              ? error
              : code !== null
                ? "Copy this link and paste it into the chat with your AI assistant. It will finish connecting AskSEO."
                : "Nothing to finish here. Start connecting from your AI assistant."}
          </CardDescription>
        </CardHeader>
        {error === null && code !== null ? (
          <CardContent className="flex flex-col gap-3">
            <code className="bg-muted block max-h-32 overflow-auto rounded-md p-3 text-xs break-all">{link}</code>
            <Button onClick={() => void copy()}>
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <p className="text-muted-foreground text-xs">
              The link works only for a few minutes, and only for the assistant that started the
              connection.
            </p>
          </CardContent>
        ) : null}
      </Card>
    </main>
  );
}
