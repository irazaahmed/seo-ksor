import Link from "next/link";
import type { ReactElement } from "react";
import { MessageCircle, Search, Sparkles } from "lucide-react";

import { CopyField } from "@/components/copy-field";
import { basePath } from "@/lib/source";

/**
 * The "how an agent uses this" explainer.
 *
 * Site chrome, not record content: it explains the MCP connection generically
 * (Claude, ChatGPT, or any MCP-compatible agent) rather than asserting a live
 * endpoint — `instance.md`'s `mcp_url` stays unset until the door is actually
 * serving (AGENTS.md: "an invented URL is worse than none"). The URL chip and
 * guide link below only render once the caller actually has one to hand —
 * see `mcpUrl` below.
 */
const STEPS: { icon: typeof MessageCircle; title: string; body: string }[] = [
  {
    icon: MessageCircle,
    title: "Connect",
    body: "Point Claude, ChatGPT, or any MCP-compatible agent at this record's MCP server.",
  },
  {
    icon: Search,
    title: "Ask",
    body: "Ask anything this record covers — niche research, keyword research, on-page SEO, and more.",
  },
  {
    icon: Sparkles,
    title: "Get a grounded answer",
    body: "The agent answers only from what's in this record, citing the source document — or says plainly when something isn't covered yet.",
  },
];

export function LandingConnect({
  mcpUrl,
}: {
  /** `null` until the owner has published one — never invented here. */
  mcpUrl: string | null;
}): ReactElement {
  return (
    <section className="border-t border-fd-border bg-fd-muted/20">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <p className="ksor-section-label">Built for agents, not just readers</p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-[-0.015em] text-balance sm:text-4xl">
          Connect Claude or ChatGPT to this record
        </h2>
        <p className="mt-4 max-w-2xl text-base/relaxed text-fd-muted-foreground">
          This record is built to be served over MCP, so an AI agent can answer SEO questions
          strictly from what was actually taught in class — never a guess from general training
          data.
        </p>

        <div className="relative mt-10 grid gap-8 sm:mt-14 sm:grid-cols-3">
          {/* The step sequence, as a rule — only where three columns actually
              sit in a row. Positioned at the chip's vertical center (the
              chip is size-10, so 20px). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[16.6%] top-5 hidden h-px bg-fd-border sm:block"
          />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-fd-primary font-mono text-sm font-semibold text-fd-primary-foreground ring-4 ring-fd-muted/20">
                  {i + 1}
                </span>
                <h3 className="font-display text-base font-semibold">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm/relaxed text-fd-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>

        {mcpUrl === null ? null : (
          <div className="mt-12 flex flex-col items-start gap-4 border-t border-fd-border pt-8 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
            <CopyField label="MCP Server URL" value={mcpUrl} />
            <Link
              href={`${basePath}/docs/connect-claude-and-chatgpt`}
              className="shrink-0 text-sm font-medium text-fd-primary underline underline-offset-4 transition-colors hover:text-fd-primary/80"
            >
              Read the full connect guide &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
