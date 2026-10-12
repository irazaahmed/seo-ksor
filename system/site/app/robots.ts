import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/shared";
import { basePath } from "@/lib/source";

export const dynamic = "force-static";

// Crawl the record; keep crawlers out of the account and OAuth screens, which
// are not content and only spend crawl budget.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/sign-in/",
        "/sign-up/",
        "/oauth/",
        "/api/",
        "/rumi-oauth-callback/",
      ].map((p) => `${basePath}${p}`),
    },
    sitemap: `${siteUrl}${basePath}/sitemap.xml`,
  };
}
