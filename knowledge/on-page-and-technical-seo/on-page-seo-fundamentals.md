---
type: Document
title: On-page SEO fundamentals
description: The core components of on-page SEO — meta tags, image optimization, keyword placement, semantic HTML, and applying them practically in WordPress with an SEO plugin.
status: stable
order: 18
generated: { by: human:ahmedraza, at: 2026-09-22T10:00:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-22T10:00:00Z }
verified: [{ by: human:ahmedraza, at: 2026-09-22T10:00:00Z }]
---

## What is on-page SEO?

On-page SEO is every optimization made directly on a webpage to improve its
visibility in search results — the things you control directly on your own
site or blog page.

## Meta tags

- **Meta title** — the clickable headline in Google search. Limit: 50–60
  characters, and it must include the main keyword. Example: "How to Install
  App on Pixel 6 — Beginner's Guide".
- **Meta description** — the short summary under the title in results. Limit:
  150–160 characters, keyword included naturally.
- **index/noindex** — allows or disallows search-engine indexing.
- **follow/nofollow** — tells Google whether to follow the page's links.
- **canonical** — prevents duplicate-content issues by naming the preferred
  URL.
- **Breadcrumbs** — page-navigation structure. **Schema** — extra code
  helping Google understand content better (FAQs, recipes, reviews).

## Image optimization

- **File name** — descriptive and keyword-based, e.g.
  `install-app-pixel6.jpg`.
- **Alt text** — describes the image for Google, e.g. "Steps to install app
  on Pixel 6".
- **Size** — keep images light with a tool like TinyPNG, or use WebP format.

## Keyword optimization

- **Density** — 1–2% is a safe natural range.
- **Placement** — title (H1), first 100 words, subheadings (H2/H3), image alt
  tags, and the last paragraph.
- Avoid keyword stuffing; use synonyms and related terms to keep it natural.

## Semantic HTML

- **H1** once, for the page title; **H2** for main sections; **H3** for
  sub-sections under an H2.
- Use semantic HTML5 tags — `<article>`, `<section>`, `<aside>`, `<nav>`,
  `<footer>` — to give the layout real structural meaning.

## Breadcrumbs and table of contents

Breadcrumbs help both users and Google understand where a page sits in the
site. A table of contents (via a plugin such as Easy Table of Contents)
structures long articles and improves both UX and SEO.

## URL optimization

Keep URLs short, clean, and keyword-rich (`example.com/install-app-pixel6`
rather than `example.com/?p=123`), and use hyphens, not underscores.

## Applying this in WordPress

1. **Create the post** — WordPress → Posts → Add New, paste the content.
2. **Install an SEO plugin** — Rank Math SEO or Yoast SEO. After activation
   a dedicated SEO box appears on the post editor for the SEO title, meta
   description, and focus keyword.
3. **Optimize the content**:
   - Use multiple related keywords naturally: main title in H1, feature
     comparisons in H2, specifics like price/benefits/selection tips in H3.
   - Don't overuse the primary keyword — mix in synonyms across H2/H3.
   - Build keyword clusters around the main topic (e.g. for "garment steamer
     vs iron": "better for ironing", "is steamer better than iron", "best
     device for pressing clothes").

## On-page SEO checklist

- Meta title + description set
- URL optimized
- Headings structured H1 → H2 → H3
- Keyword placement covered
- Images optimized (alt text + size)
- TOC and breadcrumbs added
- Semantic tags used
- Rank Math (or equivalent) plugin configured
