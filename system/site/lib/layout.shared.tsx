import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { BrandMark } from "@/components/brand-mark";
import { SignIn } from "@/components/sign-in";
import { appTitle } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // The record's display title (instance.md's H1), not the machine slug,
      // beside its own mark rather than bare text.
      //
      // fumadocs renders this inside its OWN `<a>` wrapper, which this
      // project cannot add a class to — and without `min-width: 0` on that
      // specific element, a flex item's automatic minimum width defaults to
      // its content's min-content size, which a `truncate`d span inside it
      // does NOT shrink below (the overflow-hidden rule that lets a flex item
      // shrink past its content only looks at overflow on the item itself,
      // not on a descendant). That pushed the mobile search/menu buttons off
      // the right edge of the viewport (found live, 2026-09-17). The
      // `ksor-nav-title` marker class lets global.css reach that wrapper with
      // `:has()` instead — a `title` FUNCTION would fix it directly, but
      // fumadocs calls it as a plain closure, which cannot cross the
      // server/client boundary this module sits on (`ksor-nav-title-fn`
      // build error, tried live).
      title: (
        <span className="ksor-nav-title flex min-w-0 items-center gap-2 text-fd-foreground">
          <BrandMark size={22} className="shrink-0 text-fd-primary" />
          <span className="min-w-0 truncate font-display text-[0.9375rem] font-semibold tracking-[-0.005em]">
            {appTitle}
          </span>
        </span>
      ),
    },
    // `secondary` puts it at the navbar's trailing edge, beside the theme
    // toggle.
    links: [{ type: "custom", secondary: true, children: <SignIn /> }],
  };
}
