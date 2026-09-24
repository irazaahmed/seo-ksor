import type { ReactElement, ReactNode } from "react";

import { chapterStyle, documentIcon } from "@/lib/chapter-style";

/**
 * A chapter row's content in the sidebar: a coloured icon tile, the chapter's
 * name, and under it its number and how many lessons it holds — the shape of
 * a course's module list, so a reader can see the whole book's chapters at a
 * glance and how deep each one goes before opening it.
 *
 * The tone class sits on the tile AND on the text wrapper; global.css lifts it
 * onto the whole chapter (row, open tint, the timeline of its pages) with
 * `:has()`, since fumadocs renders the wrapper this lives inside and exposes
 * no class hook on it. The breadcrumb reuses this node and shows the name only.
 *
 * Every element returned here carries a `key`: fumadocs renders it as one
 * item of an ARRAY (`[node.icon, node.name]`), and without keys React warns on
 * every page of the dev server.
 */
export function renderChapter({
  slug,
  label,
  count,
  number,
}: {
  slug: string;
  label: string;
  count: number;
  /** Position among the top-level chapters; null for a nested one. */
  number: number | null;
}): ReactElement {
  const { icon: Icon, tone } = chapterStyle(slug);
  const lessons = count > 0 ? `${count} ${count === 1 ? "lesson" : "lessons"}` : null;
  const meta = [number === null ? null : String(number).padStart(2, "0"), lessons]
    .filter((part) => part !== null)
    .join(" · ");
  return (
    <span key="chapter" className="contents">
      <span
        className={`ksor-ch-tile ksor-tone-${tone}`}
        data-nested={number === null || undefined}
        aria-hidden
      >
        <Icon />
      </span>
      <span className={`ksor-ch-text ksor-tone-${tone}`}>
        <span className="ksor-ch-name">{label}</span>
        {meta !== "" ? <span className="ksor-ch-meta">{meta}</span> : null}
      </span>
    </span>
  );
}

/** A page inside a chapter: its title, clamped so a long one never floods the rail. */
export function renderLesson(name: ReactNode): ReactElement {
  return (
    <span key="lesson" className="ksor-lesson-name">
      {name}
    </span>
  );
}

/** A loose top-level document's icon. */
export function renderDocumentIcon(slug: string): ReactElement {
  const Icon = documentIcon(slug);
  return (
    <span key="icon" className="ksor-doc-icon" aria-hidden>
      <Icon />
    </span>
  );
}

/** A section label between the loose documents and the chapters. */
export function renderSection(label: string): ReactElement {
  return (
    <span key="section" className="ksor-section">
      {label}
    </span>
  );
}
