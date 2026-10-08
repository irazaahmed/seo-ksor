"use client";

/**
 * The "Continue with Google / GitHub" buttons, shared by sign-in and sign-up.
 * Brand marks are inline SVG: the icon set the site uses ships no logos.
 */

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

function GoogleMark(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

function GitHubMark(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export function AuthProviders(): React.ReactElement {
  async function go(provider: "google" | "github"): Promise<void> {
    await authClient.signIn.social({ provider, callbackURL: "/" });
  }
  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" onClick={() => void go("google")}>
        <GoogleMark />
        Continue with Google
      </Button>
      <Button type="button" variant="outline" onClick={() => void go("github")}>
        <GitHubMark />
        Continue with GitHub
      </Button>
    </div>
  );
}

/**
 * The page's query string, read after hydration (a static page has none at
 * build time). Non-empty when an assistant's connect flow opened the page.
 */
export function useCarriedQuery(): string {
  const [query, setQuery] = useState("");
  useEffect(() => setQuery(window.location.search), []);
  return query;
}
