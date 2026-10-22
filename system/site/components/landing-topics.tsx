import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { chapterStyle, documentIcon } from "@/lib/chapter-style";
import type { RecordEntry } from "@/lib/source";

/**
 * The "what's inside" grid.
 *
 * Every card is one of the record's own top-level entries — its real title,
 * description and document count (`entriesUnder("")`, the same data the
 * sidebar and the cover's stack read) — never authored copy standing in for
 * the record (scaffolded AGENTS.md, critical rule 1).
 *
 * Drawn as the same cards a section page lists its lessons in
 * (components/record-index.tsx), so the front door and the pages behind it
 * read as one design (owner, 2026-10-22: "bilkul bahir ka home page bhi update
 * kar do"). Two groups, the way the sidebar groups them: the loose documents
 * to start with, then the numbered chapters. Each chapter keeps the sidebar's
 * icon and colour on its tile (lib/chapter-style.ts), so a chapter looks the
 * same here as in the rail a reader then navigates by; the cards themselves
 * are the site's one green accent.
 */
function slugOf(entry: RecordEntry): string {
  return entry.url.split("/").filter(Boolean).pop() ?? "";
}

function Group({
  id,
  label,
  heading,
  children,
  count,
}: {
  id?: string;
  label: string;
  heading: string;
  count: number;
  children: ReactElement[];
}): ReactElement {
  return (
    <section id={id} className="ksor-cards scroll-mt-20" data-variant="home">
      <p className="ksor-section-label">{label}</p>
      <h2 className="ksor-cards-head mt-2">
        <span>{heading}</span>
        <span className="ksor-cards-count">{count}</span>
      </h2>
      <ol className="ksor-cards-grid">{children}</ol>
    </section>
  );
}

export function LandingTopics({ entries }: { entries: readonly RecordEntry[] }): ReactElement {
  const chapters = entries.filter((entry) => entry.documents > 0);
  const loose = entries.filter((entry) => entry.documents === 0);

  return (
    <div className="border-t border-fd-border bg-fd-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-16 sm:py-20">
        {loose.length === 0 ? null : (
          <Group label="Start here" heading="Begin with these" count={loose.length}>
            {loose.map((entry) => {
              const Icon = documentIcon(slugOf(entry));
              return (
                <li key={entry.url}>
                  <Link href={entry.url} className="ksor-card group" data-kind="lesson">
                    <span className="ksor-card-top">
                      <span className="ksor-card-icon" aria-hidden>
                        <Icon />
                      </span>
                      <span className="ksor-card-kicker">Start here</span>
                    </span>
                    <span className="ksor-card-title">{entry.title}</span>
                    {entry.description === null ? null : (
                      <span className="ksor-card-desc">{entry.description}</span>
                    )}
                    <span className="ksor-card-foot">
                      <span>Read</span>
                      <ArrowUpRight aria-hidden className="ksor-card-arrow" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </Group>
        )}

        <Group id="chapters" label="What's inside" heading="Every chapter of the course" count={chapters.length}>
          {chapters.map((entry, i) => {
            const { icon: Icon, tone } = chapterStyle(slugOf(entry));
            const number = String(i + 1).padStart(2, "0");
            return (
              <li key={entry.url}>
                <Link href={entry.url} className="ksor-card group" data-kind="section" data-num={number}>
                  <span className="ksor-card-top">
                    <span className={`ksor-ch-tile ksor-home-tile ksor-tone-${tone}`} aria-hidden>
                      <Icon />
                    </span>
                    <span className="ksor-card-kicker">{`Chapter ${number}`}</span>
                  </span>
                  <span className="ksor-card-title">{entry.title}</span>
                  <span className="ksor-card-meta">
                    {`${entry.documents} ${entry.documents === 1 ? "lesson" : "lessons"}`}
                  </span>
                  <span className="ksor-card-foot">
                    <span>Open chapter</span>
                    <ArrowUpRight aria-hidden className="ksor-card-arrow" />
                  </span>
                </Link>
              </li>
            );
          })}
        </Group>
      </div>
    </div>
  );
}
