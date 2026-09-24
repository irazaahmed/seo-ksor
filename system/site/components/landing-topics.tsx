import Link from "next/link";
import type { ReactElement } from "react";

import { Card } from "@/components/ui/card";
import { chapterStyle, documentIcon } from "@/lib/chapter-style";
import type { RecordEntry } from "@/lib/source";

/**
 * The "what's inside" grid.
 *
 * Every card is one of the record's own top-level entries — its real title,
 * description and document count (`entriesUnder("")`, the same data the
 * sidebar and the cover's stack read) — never authored copy standing in for
 * the record (scaffolded AGENTS.md, critical rule 1). The icon and colour per
 * chapter are the SIDEBAR's (lib/chapter-style.ts), so a chapter looks the
 * same on the front door as in the rail a reader then navigates by; a loose
 * document wears its own icon in the accent.
 */
function styleFor(entry: RecordEntry): { Icon: ReturnType<typeof documentIcon>; tone: string } {
  const slug = entry.url.split("/").filter(Boolean).pop() ?? "";
  if (entry.documents > 0) {
    const { icon, tone } = chapterStyle(slug);
    return { Icon: icon, tone };
  }
  return { Icon: documentIcon(slug), tone: "blue" };
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
            const { Icon, tone } = styleFor(entry);
            return (
              <Link key={entry.url} href={entry.url} className={`group ksor-topic ksor-tone-${tone}`}>
                <Card className="ksor-topic-card h-full gap-3 border-fd-border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none sm:p-6">
                  <div className="flex items-center gap-3.5">
                    <span className={`ksor-ch-tile ksor-topic-tile ksor-tone-${tone}`} aria-hidden>
                      <Icon />
                    </span>
                    <h3 className="ksor-topic-title font-display text-base font-semibold transition-colors">
                      {entry.title}
                    </h3>
                  </div>
                  {entry.description === null ? null : (
                    <p className="text-sm/relaxed text-fd-muted-foreground">{entry.description}</p>
                  )}
                  {entry.documents === 0 ? null : (
                    <p className="ksor-topic-count mt-auto pt-2 font-mono text-[11px] tracking-widest uppercase tabular-nums">
                      {entry.documents} {entry.documents === 1 ? "lesson" : "lessons"}
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
