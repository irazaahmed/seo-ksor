"use client";

import { Check, Copy } from "lucide-react";
import { useState, type ReactElement } from "react";

/**
 * A labelled value with a one-click copy button — the MCP URL on the
 * homepage's connect section, so a reader pastes it into Claude/ChatGPT's
 * connector form instead of retyping it by hand.
 */
export function CopyField({ label, value }: { label: string; value: string }): ReactElement {
  const [copied, setCopied] = useState(false);

  async function onCopy(): Promise<void> {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="group flex w-full max-w-md items-center justify-between gap-3 rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-left transition-colors hover:border-fd-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
    >
      <span className="min-w-0">
        <span className="block font-mono text-[10px] tracking-widest text-fd-muted-foreground uppercase">
          {label}
        </span>
        <span className="block truncate font-mono text-sm text-fd-foreground">{value}</span>
      </span>
      {copied ? (
        <Check className="size-4 shrink-0 text-fd-primary" aria-hidden />
      ) : (
        <Copy
          className="size-4 shrink-0 text-fd-muted-foreground transition-colors group-hover:text-fd-primary"
          aria-hidden
        />
      )}
      <span className="sr-only">{copied ? "Copied" : `Copy ${label}`}</span>
    </button>
  );
}
