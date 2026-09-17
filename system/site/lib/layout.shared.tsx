import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { BrandMark } from "@/components/brand-mark";
import { SignIn } from "@/components/sign-in";
import { appTitle } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // The record's display title (instance.md's H1), not the machine slug,
      // beside its own mark rather than bare text. The title's max-width
      // shrinks further than before (was 60vw) to leave the mark room at
      // 320px without the two colliding — checked against the longest
      // fixture title this scaffold ships.
      title: (
        <span className="flex items-center gap-2 text-fd-foreground">
          <BrandMark size={22} className="shrink-0 text-fd-primary" />
          <span className="max-w-[48vw] truncate font-display text-[0.9375rem] font-semibold tracking-[-0.005em] sm:max-w-none">
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
