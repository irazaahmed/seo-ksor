import type { Metadata } from "next";
import type { ReactElement } from "react";

import { FooterMark } from "@/components/footer-mark";
import { HomeCover } from "@/components/home-cover";
import { LandingConnect } from "@/components/landing-connect";
import { LandingStats } from "@/components/landing-stats";
import { LandingTopics } from "@/components/landing-topics";
import { appDescription, appName, appPurpose, appTitle, mcpEndpoint, siteUrl } from "@/lib/shared";
import { baseOpenGraph, baseTwitter } from "@/lib/seo";
import { basePath, entriesUnder, entryFor, getSortedPages } from "@/lib/source";

// The search-result face of the front door. Targets the head terms from the
// 2026-10-12 keyword report ("learn seo", "seo training", "wordpress seo",
// "local seo course") while naming only what the record actually covers.
const homeTitle = "Learn SEO: Free SEO Training, WordPress SEO and Local SEO | AskSEO";
const homeDescription =
  "Learn SEO free with AskSEO: complete SEO training notes on keyword research, niche research, on-page, technical and off-page SEO, WordPress SEO, Local SEO and Etsy SEO.";

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: `${basePath}/` },
  openGraph: {
    ...baseOpenGraph,
    type: "website",
    title: homeTitle,
    description: homeDescription,
    url: `${basePath}/`,
  },
  twitter: { ...baseTwitter, title: homeTitle, description: homeDescription },
};

/** WebSite + the course it holds, as JSON-LD; `<` escaped like every inline JSON here. */
function homeJsonLd(): string {
  const url = `${siteUrl}${basePath}/`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: appTitle,
        description: appDescription ?? homeDescription,
        inLanguage: "en",
      },
      {
        "@type": "Course",
        "@id": `${url}#course`,
        name: "Learn SEO: the AskSEO curriculum",
        description: homeDescription,
        url,
        isAccessibleForFree: true,
        inLanguage: "en",
        provider: { "@type": "Organization", name: appTitle, url },
      },
    ],
  }).replaceAll("<", "\\u003c");
}

/**
 * The front door of a system of record.
 *
 * It has four jobs and no fifth (research/site-design.md §4): say what the
 * record is authoritative for, name the identity citations carry, open the
 * record, and point at the surfaces agents read — the last from `/llms.txt`
 * and each document's markdown twin, where agents already look, rather than
 * from a list of addresses printed at a reader. Every string comes from
 * `instance.md` or a document's own frontmatter; the site never contains
 * authored content (scaffolded AGENTS.md, critical rule 1).
 *
 * One full screen, standing alone: no sidebar, no document chrome. The design
 * lives in components/home-cover; this file's job is to hand it the record.
 */
export default function HomePage(): ReactElement {
  // The first document in sidebar order — never a hardcoded path, so deleting
  // the example the scaffold ships cannot leave a link pointing at nothing, and
  // a record that grows a root `index.md` opens on that instead with no change
  // here.
  const pages = getSortedPages();
  const [first] = pages;

  if (first === undefined) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <p className="text-fd-muted-foreground">
          the record is empty — add a document to <code>knowledge/</code>
        </p>
      </main>
    );
  }

  // The record as the cover shows it: the document the button opens, then the
  // entries standing behind it. The lead is looked up among the top-level
  // entries so a folder keeps the count of what it holds, and falls back to
  // building an entry directly — the first document in governed order can sit
  // BELOW the top level, where the root's own listing would never return it.
  const entries = entriesUnder("");
  const lead = entries.find((entry) => entry.url === first.url) ?? entryFor(first);
  const behind = entries.filter((entry) => entry.url !== lead.url).slice(0, 3);
  // Folders hold documents; the two root-level leaves (glossary,
  // why-seo-matters) do not — so this counts topic AREAS, not every entry.
  const topics = entries.filter((entry) => entry.documents > 0).length;

  return (
    <main className="flex flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeJsonLd() }} />
      <HomeCover
        name={appName}
        // instance.md's own H1 — a human name, not the machine slug — so a
        // fresh scaffold reads "Knowledge System of Record" until the intake
        // interview writes the real one.
        title={appTitle}
        // The record's own words: instance.md's first paragraph, which is also
        // what `ksor serve` gives the MCP server as its instructions. The
        // framework's marketing line used to sit here, which put ksor's voice
        // above somebody else's knowledge (research/site-design.md F7).
        purpose={appPurpose}
        documents={pages.length}
        firstUrl={first.url}
        lead={lead}
        behind={behind}
      />
      <LandingStats documents={pages.length} topics={topics} />
      <LandingTopics entries={entries} />
      <LandingConnect mcpUrl={mcpEndpoint()} />
      <footer className="border-t border-fd-border bg-fd-muted/10">
        <p className="mx-auto w-full max-w-6xl px-6 py-8 font-mono text-xs tracking-wider text-fd-muted-foreground uppercase">
          <FooterMark />
        </p>
      </footer>
    </main>
  );
}
