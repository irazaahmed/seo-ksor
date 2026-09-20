import Link from "next/link";
import type { ComponentType, ReactElement } from "react";
import {
  BookOpen,
  Compass,
  FileText,
  Layers,
  Link2,
  MapPin,
  PenLine,
  Search,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { RecordEntry } from "@/lib/source";

/**
 * The "what's inside" grid.
 *
 * Every card is one of the record's own top-level entries — its real title,
 * description and document count (`entriesUnder("")`, the same data the
 * sidebar and the cover's stack read) — never authored copy standing in for
 * the record (scaffolded AGENTS.md, critical rule 1). The icon per folder is
 * the one piece of decoration, keyed on the folder's own slug so it costs
 * nothing to keep in sync when a folder is renamed: it just falls back to a
 * generic mark.
 */
const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "niche-research": Compass,
  "keyword-research-and-content-planning": Search,
  "content-writing": PenLine,
  wordpress: Layers,
  "on-page-and-technical-seo": Wrench,
  "apk-websites": Smartphone,
  "off-page-seo": Link2,
  "local-seo": MapPin,
  "quick-skills": Store,
};

function iconFor(entry: RecordEntry): ComponentType<{ className?: string }> {
  const slug = entry.url.split("/").filter(Boolean).pop() ?? "";
  return ICONS[slug] ?? (entry.documents > 0 ? BookOpen : FileText);
}

export function LandingTopics({ entries }: { entries: readonly RecordEntry[] }): ReactElement {
  return (
    <section className="border-t border-fd-border bg-fd-background">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <p className="ksor-section-label">What&rsquo;s inside</p>
        <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-[-0.015em] text-balance sm:text-4xl">
          Every topic this record is authoritative for
        </h2>
        <p className="mt-4 max-w-2xl text-base/relaxed text-fd-muted-foreground">
          Organized the way the course is taught. Open a topic to read the governed documents
          inside it.
        </p>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const Icon = iconFor(entry);
            return (
              <Link key={entry.url} href={entry.url} className="group">
                <Card className="h-full gap-3 border-fd-border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-fd-primary/50 hover:bg-fd-muted/40 hover:shadow-md motion-reduce:transform-none">
                  <div className="flex items-center gap-3.5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary transition-colors group-hover:bg-fd-primary group-hover:text-fd-primary-foreground">
                      <Icon className="size-[19px]" aria-hidden />
                    </span>
                    <h3 className="font-display text-base font-semibold transition-colors group-hover:text-fd-primary">
                      {entry.title}
                    </h3>
                  </div>
                  {entry.description === null ? null : (
                    <p className="text-sm/relaxed text-fd-muted-foreground">{entry.description}</p>
                  )}
                  {entry.documents === 0 ? null : (
                    <p className="mt-auto pt-2 font-mono text-[11px] tracking-widest text-fd-muted-foreground uppercase tabular-nums">
                      {entry.documents} {entry.documents === 1 ? "document" : "documents"}
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
