---
type: Document
title: Technical SEO — advanced crawl control
description: Robots.txt, meta robots tags, llms.txt, sitemap.xml, crawl-budget optimization, canonical tags, and .htaccess — the files that control how a crawler treats a site.
status: stable
order: 23
generated: { by: human:ahmedraza, at: 2026-09-15T11:37:20Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-15T11:37:20Z }
sources:
  - id: iskills-course-notes
    title: iSkills — course notes
    resource: "iSkills SEO course notes, compiled 2025"
---

## Robots.txt

- **Purpose:** controls which pages search engines are allowed to crawl.
- **Location:** always in the root directory (`https://example.com/robots.txt`).
- **Usage:** allow/disallow specific directories or pages; block duplicate
  content from being crawled.
- In WordPress, the Rank Math plugin can manage `robots.txt` settings
  directly.[^iskills-course-notes]

## Robots meta tags and X-Robots-Tag

- **Meta robots tag** — placed in the HTML `<head>` to control indexing per
  page: `index`/`noindex`, `follow`/`nofollow`.
- **X-Robots-Tag** — the same control, added via HTTP headers instead, for
  non-HTML files (PDFs, images).
- Typical use: blocking indexing of thank-you pages, admin areas, or staging
  sites.

## llms.txt

An emerging standard, positioned as a guide for AI crawlers: it sits in the
root directory like `robots.txt` and is used to control how AI systems use
and crawl the site's content.

## Sitemap.xml

- **Purpose:** tells search engines which URLs on the site matter.
- **Best practices:** include only indexable pages; update it automatically
  as new content is added; submit it in Google Search Console.

## Crawl budget optimization

Reduce unnecessary crawling by blocking irrelevant pages in `robots.txt`,
fixing redirect chains, and eliminating duplicate URLs. The payoff: search
engines spend their limited crawl budget on the pages that actually matter.

## Canonical tags

Prevent duplicate-content issues by naming the preferred version of a page:

```html
<link rel="canonical" href="https://example.com/main-page">
```

Typical uses: HTTP/HTTPS duplicates, www/non-www duplicates, and pagination.

## .htaccess

A server configuration file used for 301 redirects, forcing HTTPS, blocking
specific IPs, and custom error pages.

[^iskills-course-notes]: iSkills SEO course notes, compiled 2025.
