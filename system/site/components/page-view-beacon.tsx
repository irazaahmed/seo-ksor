"use client";

/**
 * Counts a page view for the admin page: one small beacon per route the
 * reader opens. No cookie and no identifier is set; the auth service derives
 * a daily visitor hash on its side. Fails silently: a blocked beacon must
 * never affect reading.
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageViewBeacon(): null {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    try {
      const body = JSON.stringify({ path: pathname, referrer: document.referrer });
      navigator.sendBeacon("/api/stats/hit", new Blob([body], { type: "application/json" }));
    } catch {
      // Reading never depends on the count.
    }
  }, [pathname]);
  return null;
}
