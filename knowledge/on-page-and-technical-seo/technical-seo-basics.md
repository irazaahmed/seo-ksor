---
type: Document
title: Technical SEO basics — Core Web Vitals and page speed
description: What technical SEO covers, Google's three Core Web Vitals, and the plugins and steps used to fix page-speed issues.
status: stable
order: 21
generated: { by: human:ahmedraza, at: 2026-09-22T10:00:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-22T10:00:00Z }
verified: [{ by: human:ahmedraza, at: 2026-09-22T10:00:00Z }]
---

## What is technical SEO?

Technical SEO optimizes a website's infrastructure so search engines can
crawl and index it efficiently — covering site speed, schema, the sitemap,
`robots.txt`, and more.

**Scope covered in this course:** Core Web Vitals (page speed), schema
markup, sitemap optimization, and `.htaccess`/`robots.txt`.

## Core Web Vitals

Google's key metrics for user experience:

1. **LCP (Largest Contentful Paint)** — measures loading performance. Ideal:
   under 2.5 seconds.
2. **INP (Interaction to Next Paint)** — measures interactivity. Ideal: under
   200ms.
3. **CLS (Cumulative Layout Shift)** — measures visual stability. Ideal:
   under 0.1. To avoid CLS, define fixed sizes for elements like images and
   ads.

**Tool:** Google PageSpeed Insights checks all three.

## Fixing page speed

- **Reduce rendering blockers** — fix render-blocking JavaScript and CSS;
  load only what's needed.
- **Remove unused code** — strip unused CSS/JS; load only what each page
  actually requires.
- **Enable caching** — reduces repeated load times. Recommended plugins:
  LiteSpeed Cache, or WP Rocket.
- **Convert images to WebP** — smaller file size, faster load. Use a WebP
  converter plugin: install it, import a preset (or use defaults), and
  convert images automatically.
- **File optimization** — combine multiple CSS/JS files to cut the number of
  requests; use `preload`, `defer`, or `async` attributes deliberately.
- **`robots.txt` and `.htaccess`** — use `robots.txt` to control crawler
  access, and `.htaccess` for caching, redirection, and security
  configuration.

## Summary

| Element | Action needed |
| --- | --- |
| Core Web Vitals | Improve LCP, INP, CLS |
| Page speed | Reduce unused CSS/JS, enable caching |
| Plugins | LiteSpeed Cache or WP Rocket |
| Images | Convert to WebP |
| Layout shifts (CLS) | Fixed widths/heights on elements |
| File optimization | Combine/minify JS and CSS |
| robots.txt & .htaccess | Proper configuration for SEO and speed |

## Applying a pre-built settings file

A ready-made caching-plugin settings file can be imported directly: install
the plugin (LiteSpeed Cache or WP Rocket), open its Import option, and import
the provided file — this applies every setting automatically, with no manual
configuration needed.
