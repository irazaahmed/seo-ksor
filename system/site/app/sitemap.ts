import type { MetadataRoute } from "next";

import { readGovernance } from "@/lib/governance";
import { siteUrl } from "@/lib/shared";
import { basePath, folderSlugs, getMachinePages } from "@/lib/source";

export const dynamic = "force-static";

// Only what the machine surfaces admit (stable, effective, unexpired,
// undenied): a crawler is never pointed at a draft or a withdrawn document.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${siteUrl}${basePath}`;
  const docs = getMachinePages().map((page) => {
    const at = readGovernance(page.data, page.path).approval?.at;
    return {
      url: `${base}${page.url}/`,
      ...(at ? { lastModified: at } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });
  const folders = folderSlugs()
    .filter((slug) => slug.length > 0)
    .map((slug) => ({
      url: `${base}/docs/${slug.join("/")}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  return [{ url: `${base}/`, changeFrequency: "weekly", priority: 1 }, ...folders, ...docs];
}
