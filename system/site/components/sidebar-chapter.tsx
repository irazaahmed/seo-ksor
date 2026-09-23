import type { ReactElement } from "react";

/**
 * A chapter row's content in the sidebar: its name, then how many documents
 * it holds. The count tells a reader how deep a chapter goes before they open
 * it, the same figure the home page already shows ("12 docs").
 *
 * Both spans sit directly inside fumadocs' flex row, so the name can take the
 * free width and the count stays pinned beside the chevron (global.css,
 * "Chapters bar"). The breadcrumb reuses this node and hides the count there.
 */
export function renderChapter(label: string, count: number): ReactElement {
  return (
    <>
      <span className="ksor-chapter-name">{label}</span>
      {count > 0 ? (
        <span
          className="ksor-chapter-count"
          aria-label={`${count} document${count === 1 ? "" : "s"}`}
        >
          {count}
        </span>
      ) : null}
    </>
  );
}
