import { ArrowRight, BookOpen, Layers, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { BrandMark } from "@/components/brand-mark";
import { RecordStack } from "@/components/record-stack";
import { chapterStyle } from "@/lib/chapter-style";
import type { RecordEntry } from "@/lib/source";

/**
 * The cover of the record: one screen, standing alone.
 *
 * It is cover stock, one step off the page beneath it — pale in light, and in
 * the dark the surface that catches the light. Every colour on it is a
 * `--ksor-cover-*` token or the site's green accent, so the whole composition
 * follows the theme.
 *
 * The record's own words on the left, the record ITSELF on the right — the
 * document it opens on, and the entries standing behind it.
 *
 * Redesigned with the section pages (owner, 2026-10-22: "hero section home
 * page ka bhi update karo"): the same display face and dot-grid texture as a
 * section's hero, a second way in ("Browse chapters"), what the record holds
 * as pills rather than a separate stats band, and a strip of every chapter's
 * icon in the colour the sidebar gives it, each one a link.
 */
export function HomeCover({
  foot,
  name,
  title,
  purpose,
  documents,
  chapters,
  firstUrl,
  lead,
  behind,
}: {
  name: string;
  title: string;
  purpose: string | null;
  documents: number;
  /** The record's chapters (top-level folders), in sidebar order. */
  chapters: readonly RecordEntry[];
  firstUrl: string;
  /** The document `Start learning` opens, as the record describes it. */
  lead: RecordEntry;
  /** The entries standing behind it in the stack. */
  behind: readonly RecordEntry[];
  /** Signed from inside the cover, so the front door is one screen. */
  foot?: ReactElement;
}): ReactElement {
  // The cover fills the window under the navbar (the shell's `h-14`). `dvh`
  // rather than `vh`, so a phone's collapsing browser chrome leaves no gap.
  return (
    <section className="ksor-home relative isolate flex min-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden bg-[var(--ksor-cover)] text-[var(--ksor-cover-foreground)]">
      <div aria-hidden className="ksor-aurora pointer-events-none absolute inset-0 -z-10" />
      {/* A dot grid, fading out towards the text: the same texture a section
          page's hero carries, so the front door and the pages behind it read
          as one design. */}
      <div aria-hidden className="ksor-home-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="ksor-home-orb pointer-events-none absolute -z-10" />

      <div className="relative flex flex-1 items-center">
        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div className="min-w-0">
            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
              <p className="ksor-home-eyebrow">
                <span className="ksor-home-eyebrow-mark" aria-hidden>
                  <BrandMark size={14} />
                </span>
                <span>Free SEO course notes</span>
                <span aria-hidden className="ksor-home-eyebrow-sep" />
                <span className="font-mono text-[0.6875rem] tracking-wider">{name}</span>
              </p>

              <h1 className="ksor-home-title">
                <span className="ksor-gradient-text">{title}</span>
              </h1>
              <div className="ksor-accent-rule mt-6 h-1 w-24 rounded-full" />
            </div>

            {purpose === null ? null : (
              <p className="relative mt-7 max-w-xl text-lg/[1.65] text-pretty text-[var(--ksor-cover-muted)] sm:text-xl/[1.6] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 motion-safe:[animation-delay:120ms] motion-safe:[animation-fill-mode:backwards]">
                {purpose}
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 motion-safe:[animation-delay:220ms] motion-safe:[animation-fill-mode:backwards]">
              {/* The primary way in: the first document in governed order,
                  which the card beside it names ("Opens here"). */}
              <Link
                href={firstUrl}
                className="ksor-cta group inline-flex items-center gap-2.5 rounded-xl bg-fd-primary px-6 py-3.5 text-sm font-bold text-fd-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring motion-reduce:transition-none"
              >
                Start learning
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                />
              </Link>
              {/* The second way in: straight to the chapter cards below,
                  for a reader who knows which topic they came for. */}
              <a
                href="#chapters"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--ksor-cover-rule)] bg-[var(--ksor-cover)]/40 px-5 py-3.5 text-sm font-bold backdrop-blur-sm transition-colors hover:border-fd-primary/50 hover:bg-fd-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
              >
                Browse chapters
              </a>
            </div>

            {/* What the record holds, read from its tree: these replace the
                separate stats band that used to sit under the cover. */}
            <div className="ksor-cover-stats mt-8 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 motion-safe:[animation-delay:320ms] motion-safe:[animation-fill-mode:backwards]">
              <span>
                <BookOpen aria-hidden />
                <strong>{documents}</strong> lessons
              </span>
              <span>
                <Layers aria-hidden />
                <strong>{chapters.length}</strong> chapters
              </span>
              <span>
                <Sparkles aria-hidden />
                Free to read
              </span>
            </div>

            {/* Every chapter at a glance, in the colour and icon the sidebar
                gives it — and each one a way straight in. */}
            {chapters.length === 0 ? null : (
              <ul className="ksor-home-strip motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 motion-safe:[animation-delay:420ms] motion-safe:[animation-fill-mode:backwards]">
                {chapters.map((chapter) => {
                  const slug = chapter.url.split("/").filter(Boolean).pop() ?? "";
                  const { icon: Icon, tone } = chapterStyle(slug);
                  return (
                    <li key={chapter.url}>
                      <Link
                        href={chapter.url}
                        className={`ksor-ch-tile ksor-strip-tile ksor-tone-${tone}`}
                        title={chapter.title}
                        aria-label={chapter.title}
                      >
                        <Icon aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* `minmax(0,…)` and `min-w-0` because an `auto` track grows to its
              widest item's min-content, and the stack's one-line titles made
              that wider than a phone (owner's screenshot, 2026-09-24). */}
          <div className="flex min-w-0 justify-center lg:justify-end">
            <RecordStack lead={lead} behind={behind} documents={documents} />
          </div>
        </div>
      </div>
      {foot === undefined ? null : <div className="relative pb-10">{foot}</div>}
    </section>
  );
}
