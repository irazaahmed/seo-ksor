import type { ReactElement } from "react";
import { MessageCircle, Search, Sparkles } from "lucide-react";

/**
 * The "how an agent uses this" explainer.
 *
 * Site chrome, not record content: it explains the MCP connection generically
 * (Claude, ChatGPT, or any MCP-compatible agent) rather than asserting a live
 * endpoint — `instance.md`'s `mcp_url` stays unset until the door is actually
 * serving (AGENTS.md: "an invented URL is worse than none").
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

export function LandingConnect(): ReactElement {
  return (
    <section className="border-t border-fd-border bg-fd-muted/20">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <p className="ksor-section-label">Built for agents, not just readers</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.015em] text-balance sm:text-4xl">
          Connect Claude or ChatGPT to this record
        </h2>
        <p className="mt-4 max-w-2xl text-base/relaxed text-fd-muted-foreground">
          This record is built to be served over MCP, so an AI agent can answer SEO questions
          strictly from what was actually taught in class — never a guess from general training
          data.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-fd-primary/10 font-mono text-sm font-semibold text-fd-primary">
                  {i + 1}
                </span>
                <h3 className="font-display text-base font-semibold">{step.title}</h3>
              </div>
              <p className="mt-3 text-sm/relaxed text-fd-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
