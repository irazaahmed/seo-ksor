import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { chapterStyle } from "@/lib/chapter-style";
import { badgeLabel, badgeTone } from "@/lib/governance";
import type { RecordEntry } from "@/lib/source";

/** The last path segment of a route: the slug chapter-style is keyed by. */
function slugOf(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

/**
 * What the record holds below this point, as a course's lesson cards.
 *
 * The site renders the record; this renders its shape. Every value comes from
 * the record — title, description, status and the count below an entry are
 * frontmatter and tree, and the order is the governed `order:` key — so
 * nothing is authored in the site (critical rule 1).
 *
 * The third treatment of this list. Hairline rows had no affordance on touch
 * screens; stacked full-width boxes (2026-08-22) had one, but a section of
 * nine lessons read as nine identical grey slabs with a raw actor id in each
 * (owner, 2026-10-22: "chapters ka andaz ... bohot ajeeb hai, isko unique or
 * stylish or attractive karo"). So each lesson is now a numbered card, two to
 * a row where there is room: the number says where it sits in the course, a
 * sub-section wears its chapter's icon, and the whole card is the link. The
 * colour stays the site's one accent ("color theme wahi rakho jo last thi").
 *
 * The owner is no longer printed on each card: it was the same actor on every
 * card of the record, so it said nothing, and the document page itself still
 * shows it. A lifecycle badge stays, because that one is a caveat.
 *
 * Server-rendered plain markup — it survives print, a failed bundle and
 * JavaScript off, like every other governance fact.
 */
export function RecordIndex({
  entries,
  heading,
  variant = "section",
}: {
  entries: readonly RecordEntry[];
  heading: string;
  variant?: "section" | "related";
}): ReactElement | null {
  if (entries.length === 0) return null;

  let lesson = 0;
  return (
    <section className="ksor-cards" data-variant={variant}>
      <h2 className="ksor-cards-head">
        <span>{heading}</span>
        <span className="ksor-cards-count">{entries.length}</span>
      </h2>

      <ol className="ksor-cards-grid">
        {entries.map((entry) => {
          const isSection = entry.documents > 0;
          if (!isSection) lesson += 1;
          const number = String(lesson).padStart(2, "0");
          const own = isSection ? chapterStyle(slugOf(entry.url)) : null;
          const Icon = own?.icon;
          return (
            <li key={entry.url}>
              <Link
                href={entry.url}
                className="ksor-card group"
                data-kind={isSection ? "section" : "lesson"}
                data-num={isSection ? undefined : number}
              >
                <span className="ksor-card-top">
                  {Icon === undefined ? (
                    <span className="ksor-card-num" aria-hidden>
                      {number}
                    </span>
                  ) : (
                    <span className="ksor-card-icon" aria-hidden>
                      <Icon />
                    </span>
                  )}
                  <span className="ksor-card-kicker">
                    {isSection
                      ? `Section · ${entry.documents} ${entry.documents === 1 ? "lesson" : "lessons"}`
                      : variant === "related"
                        ? "Lesson"
                        : `Lesson ${number}`}
                  </span>
                  {entry.badge === null ? null : (
                    <span
                      className={`ml-auto rounded-sm border border-fd-border px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-fd-foreground uppercase ${badgeTone(entry.badge)}`}
                    >
                      {badgeLabel(entry.badge)}
                    </span>
                  )}
                </span>

                <span className="ksor-card-title">{entry.title}</span>

                {entry.description === null ? null : (
                  <span className="ksor-card-desc">{entry.description}</span>
                )}

                <span className="ksor-card-foot">
                  <span>{isSection ? "Open section" : "Read lesson"}</span>
                  <ArrowUpRight aria-hidden className="ksor-card-arrow" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
