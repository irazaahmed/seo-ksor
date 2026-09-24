"use client";

import type { TOCItemType } from "fumadocs-core/toc";
import { ListTree, PanelRightClose } from "lucide-react";
import { createContext, use, useEffect, useState, type ReactElement, type ReactNode } from "react";

/**
 * The document's headings, handed down from the page.
 *
 * A slot is a component TYPE, not an element, so the page cannot close over its
 * own `toc` when it names one — a function cannot cross the server/client
 * boundary. Reading the items from the shell's observer context instead would
 * cost the server render: that context is filled in an effect, so the exported
 * HTML would ship an empty rail where it currently ships every anchor. A
 * context of our own, given serializable items by the server, keeps both.
 */
const TocItemsContext = createContext<readonly TOCItemType[]>([]);

export function TocItems({
  items,
  children,
}: {
  items: readonly TOCItemType[];
  children: ReactNode;
}): ReactElement {
  return <TocItemsContext value={items}>{children}</TocItemsContext>;
}

/**
 * "On this page", tracking where the reader actually is.
 *
 * The shell's own rail marks a heading active when 90% of it is visible
 * ANYWHERE in the viewport (`AnchorProvider` watches with `{ threshold: 0.9 }`
 * and no `rootMargin`), and then highlights whichever became active most
 * recently. On a long page that reads fine. On a governed record it does not:
 * these documents are short-sectioned, so several headings sit on screen at
 * once and the one entering from the BOTTOM wins — the marker ran two to four
 * headings ahead of the reader (measured 2026-08-22: reading "owner" while the
 * rail marked "description").
 *
 * The observer options are not configurable and the observer itself is not
 * exported, so the selection cannot be corrected from outside — only replaced.
 * This is the supported seam for that: `DocsPage`'s `slots.toc.main`. The
 * shell's provider and its small-screen popover are kept exactly as they are;
 * only the rail's choice of "here" is ours.
 *
 * The rule: the active heading is the LAST one whose top has passed the reading
 * line — which is what a person means by "the section I am in". Nothing below
 * the line can be it, however visible it is.
 */
export function RecordToc(): ReactElement | null {
  const items = use(TocItemsContext);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useOpenRail();

  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map((item) => item.url.slice(1));

    // Scroll position, not intersection: a heading is "here" once it has passed
    // the reading line, and stays here until the next one does. An observer
    // answers "is it visible", which is a different question and the reason the
    // shell's rail runs ahead.
    const READING_LINE = 140;
    let frame = 0;
    const measure = (): void => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element === null) continue;
        if (element.getBoundingClientRect().top <= READING_LINE) current = id;
      }
      // Before the first heading passes the line the reader is in the lead
      // paragraphs, which belong to the first section — highlighting nothing
      // there reads as broken rather than as honest.
      setActiveId(current ?? ids[0] ?? null);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1);
    };
    const onScroll = (): void => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  // The shallowest heading in THIS document is the left edge, so a document
  // whose sections start at h3 does not render its whole rail indented.
  const top = Math.min(...items.map((item) => item.depth));

  // The section the reader is IN, as well as the subsection they are AT.
  // Marking only the exact heading meant that scrolling down into a
  // subsection put the light on a minor entry and left the section it belongs
  // to dark — the rail stopped answering "where am I" the moment it mattered
  // most. Walk back from the active item, taking each heading shallower than
  // the last: the parent, then its parent.
  const ancestors = new Set<string>();
  const activeIndex = items.findIndex((item) => item.url.slice(1) === activeId);
  if (activeIndex > 0) {
    let depth = items[activeIndex]?.depth ?? top;
    for (let index = activeIndex - 1; index >= 0 && depth > top; index -= 1) {
      const candidate = items[index];
      if (candidate === undefined || candidate.depth >= depth) continue;
      ancestors.add(candidate.url);
      depth = candidate.depth;
    }
  }

  return (
    // The container is the shell's own grid area and height: it carries the
    // grid area and the sticky height, and `max-lg:hidden` hands small screens
    // to the shell's popover. Replacing a slot means supplying what the slot
    // supplied — a first version rendered only the list and the rail escaped
    // its column, laying 1156px wide across the page (found live, 2026-08-22).
    // Its WIDTH is global.css's, keyed on `html[data-toc]`, so opening the
    // rail widens the grid column rather than overlaying the article.
    <div
      id="nd-toc"
      data-open={open}
      className="sticky top-(--fd-docs-row-1) flex h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col [grid-area:toc] pt-12 pb-2 max-lg:hidden"
    >
      {open ? (
        <div className="ksor-toc-panel">
          <div className="ksor-toc-head">
            <span className="ksor-toc-icon" aria-hidden>
              <ListTree />
            </span>
            <span className="ksor-toc-title">On this page</span>
            <button
              type="button"
              className="ksor-toc-close"
              onClick={() => setOpen(false)}
              aria-label="Hide the list of sections"
              title="Hide"
            >
              <PanelRightClose aria-hidden />
            </button>
          </div>
          <div className="ksor-toc-progress" aria-hidden>
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          <nav aria-label="On this page" className="ksor-toc-list">
            {items.map((item) => {
              const id = item.url.slice(1);
              const here = id === activeId;
              const within = ancestors.has(item.url);
              return (
                <a
                  key={item.url}
                  href={item.url}
                  // Three states: AT this heading, INSIDE its section, or
                  // neither — the section keeps the reader's place without
                  // competing with the line they are actually on.
                  data-state={here ? "here" : within ? "within" : undefined}
                  data-depth={item.depth - top}
                  style={{ paddingInlineStart: `${(item.depth - top) * 0.75 + 0.875}rem` }}
                  aria-current={here ? "location" : undefined}
                >
                  {item.title}
                </a>
              );
            })}
          </nav>
        </div>
      ) : (
        // Closed: a slim strip — the open button, then a minimap of the page,
        // one mark per heading, so the reader still sees where they are and
        // can jump from it without opening the list.
        <div className="ksor-toc-strip">
          <button
            type="button"
            className="ksor-toc-open"
            onClick={() => setOpen(true)}
            aria-label="Show the list of sections on this page"
            title="On this page"
          >
            <ListTree aria-hidden />
          </button>
          <nav aria-label="On this page" className="ksor-toc-marks">
            {items.map((item) => {
              const here = item.url.slice(1) === activeId;
              return (
                <a
                  key={item.url}
                  href={item.url}
                  data-state={here ? "here" : undefined}
                  data-depth={item.depth - top}
                  title={typeof item.title === "string" ? item.title : undefined}
                  aria-current={here ? "location" : undefined}
                >
                  <span className="sr-only">{item.title}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

/**
 * Whether the rail is open: CLOSED by default, so the article has the width,
 * and remembered per reader in their own browser once they choose. Mirrored
 * onto `<html data-toc>`, which is what global.css sizes the grid column from.
 */
function useOpenRail(): [boolean, (open: boolean) => void] {
  const [open, setOpenState] = useState(false);
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem("ksor-toc");
    } catch {
      // Storage can be blocked; the default stands.
    }
    setOpenState(saved === "open");
  }, []);
  useEffect(() => {
    document.documentElement.dataset.toc = open ? "open" : "closed";
  }, [open]);
  const setOpen = (next: boolean): void => {
    setOpenState(next);
    try {
      window.localStorage.setItem("ksor-toc", next ? "open" : "closed");
    } catch {
      // Not remembered; still applied for this page.
    }
  };
  return [open, setOpen];
}
