---
type: Document
title: "WordPress SEO basics: permalinks, categories, images, Rank Math"
description: URL/permalink structure, category taxonomy, image SEO, and the Rank Math plugin as applied inside WordPress.
status: stable
order: 19
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

## URL / permalink structure (slug)

The permalink is the article's link, e.g.
`https://yoursite.com/cinema-apk-vs-stremio`. Google reads the URL to
understand the page — a messy, overlong URL without the main keyword hurts
SEO.[^iskills-course-notes]

**Best practices:**

- Use the main keyword in the slug (e.g. `cinema-apk-vs-stremio`).
- Avoid dates or version numbers (no `2025`, `v3.4.1`).
- Lowercase only.
- Short and readable — never `post?id=123`.

**In WordPress:** Settings → Permalinks → select "Post Name", or use a
custom structure: `/%category%/%postname%/`.

## Categories and subcategories (taxonomy)

A category groups related articles. Example: parent category "Streaming
Apps", with children "cinema hd", "Stremio", "Pluto TV".

This helps Google and readers understand your site structure, surfaces
related posts together, and can help you rank for category-level keywords
too.

**SEO tip:** use one relevant category per post, and keep category names
clean, short, and keyword-rich.

## Image optimization

Large images slow a site down, and Google penalizes slow pages; images
without alt text or keyword-rich filenames also miss out on Google Images
traffic.

- **Compress** — e.g. ImageCompressor.com.
- **Rename** — e.g. `cinema-hd-interface.jpg`.
- **Alt text** — always add descriptive text using the target keyword, e.g.
  "Cinema hd home screen on Firestick".

## Rank Math plugin

Rank Math automates roughly 80% of on-page SEO work and is considered more
beginner-friendly than Yoast SEO for most users.

**Setup:** Plugins → Add New → search "Rank Math" → install, then follow the
setup wizard. It handles titles and meta descriptions, focus keywords, the
sitemap, and schema markup (e.g. FAQ rich results).

### Worked example — "Cinema hd vs. Stremio"

- **Slug:** `/streaming-apps/cinema-apk-vs-stremio`
- **Category:** Streaming Apps
- **Image name:** `cinema-vs-stremio-comparison.jpg`
- **Alt text:** "Comparison between Cinema hd and Stremio streaming
  platforms"

## Summary

| Element | Why it matters | What to do |
| --- | --- | --- |
| URL (slug) | Google reads it for SEO | Keep short, lowercase, add keyword |
| Category | Helps Google understand structure | One clear category per post |
| Images | Speed + image SEO | Compress, rename, add alt text |
| Rank Math plugin | All-in-one SEO tool | Configure it from the dashboard |

[^iskills-course-notes]: iSkills SEO course notes, compiled 2025.
