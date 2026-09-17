"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";

const SHOW_AFTER_PX = 480;

/**
 * A floating return to the top of whatever page is open — mounted once in
 * `app/layout.tsx`, so it follows every route (the front door and every
 * document alike) rather than being wired into each page separately.
 *
 * Hidden until the reader has actually scrolled past the fold, so it never
 * competes with the hero's own call to action on a page that hasn't been
 * scrolled yet.
 */
export function BackToTop(): ReactElement {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop(): void {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-5 bottom-5 z-50 flex size-11 items-center justify-center rounded-full border border-fd-border bg-fd-background text-fd-foreground shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-fd-primary/40 hover:text-fd-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring motion-reduce:transition-none sm:right-6 sm:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
