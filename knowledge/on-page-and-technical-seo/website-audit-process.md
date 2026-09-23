---
type: Document
title: Website audit process
description: Why a site audit is run, the manual-vs-tool-based distinction, and the tools used to crawl a site for technical and on-page issues.
status: stable
order: 25
generated: { by: human:ahmedraza, at: 2026-09-22T12:00:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-22T12:00:00Z }
sources:
  - id: seo-audit-sample
    title: SEO Audit Sample (leosbagels.com)
    resource: "SEO AUDIT SAMPLE.pdf, an automated audit report for leosbagels.com, iSkills course material"
verified: [{ by: human:ahmedraza, at: 2026-09-22T12:00:00Z }]
---

## Purpose of an audit

Identify technical and on-page SEO issues, and check crawlability, speed,
and indexation status.

## Types of audits

1. **Manual audit**: thorough but labour-intensive, checked by hand.
2. **Tool-based audit**: faster and scalable across many pages at once.

## Recommended tools

- Screaming Frog
- Sitebulb
- Ahrefs Site Audit
- SEMrush Site Audit

## Screaming Frog

Crawls a website the way a search-engine bot would, and checks for:

- Broken links
- Redirects
- Duplicate titles and descriptions
- Missing alt tags

## Reading an automated audit report: a worked example

A grading-style audit tool (the kind that scores a site A+ to F- across
On-Page SEO, Links, Usability, Performance, and Social) produces a report
shaped like this, worked through here on a real report for
`leosbagels.com`, a New York bagel shop's site, to show what each finding
actually means.[^seo-audit-sample]

**Overall grades:** C (On-Page SEO: C+, Links: C+, Usability: B,
Performance: D, Social: D), "could be better," with 20 recommendations
total.

**Title tag**: `Leo's Bagels | New York City`, 28 characters. The tool
flags this because the ideal range is 50 to 60 characters: a title well under
that range is a missed opportunity to include more ranking-relevant terms,
not a broken tag.

**Meta description**: 180 characters, above the ideal 120 to 160 range.
Both directions (too short or too long) draw a recommendation, because a
search engine truncates or ignores a description outside that window.

**Header tags**: H1 present, multiple heading levels in use: H2 ×10, H3
×12, H4 ×105, H5/H6 ×0. A large H4 count relative to H2/H3 usually means
the heading hierarchy is being used for visual styling somewhere on the
page rather than strictly for content structure, worth a manual check
even though the tool doesn't flag it directly.

**Keyword consistency**: the page's main keywords ("bagels", "bagel",
"leos", "fresh") were not well distributed across title, meta description,
and heading tags, present in body content (frequency 14, 12, 10, 9) but
under-used in the tags search engines weight most heavily.

**Content amount**: 798 words, judged sufficient ("a good level of
textual content").

**Image alt attributes**: 43 images on the page, 16 missing the `alt`
attribute (roughly 37%), a direct, countable on-page issue.

**Canonical tag, robots.txt, noindex**: no canonical tag set (Google's own
recommendation is that every page specify one); no `robots.txt` could be
retrieved at all; no noindex tag or header in use (so the page is at least
crawlable, even without a sitemap-guiding robots.txt).

**SSL and schema**: HTTPS enabled and redirecting correctly (a pass); no
Schema.org structured data detected anywhere on the page (a clear on-page
gap, see [Schema markup](schema-markup.md)).

**Rankings**: a real, concrete ranking table is exactly what this kind of
report is useful for: `leosbagels.com`'s page ranks position 1 for
"leo's bagels" (18,100 monthly searches) and several of its long-tail
variants, position 11 and 15 for higher-volume brand variants (368,000
searches), and holds 30 total position-1 keywords against 1,489 keywords
ranking only in positions 31 to 100, the estimated 65,977 monthly visits from
search comes overwhelmingly from that small position-1 set, not the long
tail of weak rankings.

**Backlink summary**: a "moderate" backlink profile: 1,100 total
backlinks from 417 referring domains, split 923 dofollow / 150 nofollow,
across 244 subnets and 286 IPs (subnet/IP diversity matters because many
links from the same small IP range look manipulated rather than earned).
The top individual backlinks are real editorial and directory placements:
Airbnb's own city guide, El País (a national Spanish newspaper), Klook,
Foursquare, a university innovation blog, Thrillist, Time Out New York, and
Eater NY, domain strength 90 to 95, the kind of coverage a purely
SEO-driven link-building campaign rarely produces on its own and that
usually comes from being a genuinely well-known local business.

Reading a report like this in order, on-page tag issues first (cheap,
fast fixes), then content/keyword distribution, then the structural gaps
(schema, canonical, robots.txt), then the off-page picture last, is what
turns a wall of automated findings into an actual priority
list.[^seo-audit-sample]

[^seo-audit-sample]: SEO AUDIT SAMPLE.pdf, an automated audit report for
    leosbagels.com, iSkills course material.
