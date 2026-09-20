---
type: Document
title: Article structure — headings, competitor analysis, and keyword prominence
description: How to structure an SEO article with HTML headings, build it from competitor heading analysis, and place the main keyword for maximum prominence.
status: stable
order: 12
generated: { by: human:ahmedraza, at: 2026-09-20T12:00:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-20T12:00:00Z }
sources:
  - id: iskills-course-notes
    title: iSkills — course notes
    resource: "iSkills SEO course notes, compiled 2026"
verified: [{ by: human:ahmedraza, at: 2026-09-20T12:00:00Z }]
---

## Heading structure

- **H1** — main title, used only once per article.
- **H2** — major sections (e.g. Features, How to Download).
- **H3** — sub-sections under an H2 (e.g. individual features).
- **H4** — further breakdown under an H3 (e.g. Classic Bikes, Heavy Bikes).
- Avoid H5/H6 — not useful for a standard article.

Other core tags: `<p>` paragraphs, `<table>` tables, `<li>`/`<ol>`/`<ul>` lists,
`<a href>` links, `<strong>` bold text.[^iskills-course-notes]

### Template

```
H1: Main Title
Intro: 1-3 paragraphs
H2: What is [Topic]?
H2: Features
  H3: Feature Group 1
    H4: Feature Detail A
    H4: Feature Detail B
  H3: Feature Group 2
H2: How to Download
  H3: Download for PC
  H3: Download for Android
```

Content should serve two readers at once: the user (easy to read, useful,
well organized) and Google (proper HTML structure, keywords, headings that
make indexing straightforward).

## Building headings from competitors

1. Google the main keyword.
2. Open the top 10 ranking articles.
3. Do not copy headings directly — remove the headings that appear on
   *every* competitor (those are commodity, not an edge).
4. Combine the *unique* headings each site contributes into your own
   structure.

This produces a more complete piece than any single competitor, without
copying anyone's structure verbatim. A Chrome extension that copies a page's
heading list speeds this up — install it, open a competitor article, copy its
headings, then strip anything promotional before reusing the SEO-relevant
structure.

## Writing the introduction

**Rule: 2–3 paragraphs**, each containing one *power sentence* (the main
idea) plus 1–2 *supporting/"toy" sentences* (small supporting detail).

This matters because Google reads content more like a human than a keyword
matcher — it uses AI systems (e.g. RankBrain) and NLP to understand context,
not just literal keyword occurrence. An introduction stuffed with keywords
reads worse to both the user and the ranking system than one that is natural
and informative.

**Rule: reuse competitor H2s.** If multiple top-ranking sites use the same H2
(e.g. "About Traffic Rider APK"), use it too — headings are not copyrighted,
and a heading that is already proven to rank is not something to avoid on
principle.

### Writing under each heading

1. **First paragraph** — write your own general explanation from your own
   knowledge and known facts (e.g. developer name, release date, core
   features).
2. **Second paragraph** — search the topic, open 3–4 top competitors, read
   (never copy) their content under the matching heading, and summarize the
   key points in your own words.

### Analyzing competitor content

- Search the target keyword; don't revisit sites you've already reviewed.
- Open new competitor pages and note their headings and the specific facts
  they mention (models, effects, features).
- Rewrite those points in your own language rather than paraphrasing
  sentence-by-sentence.

Google's ranking systems (RankBrain, NLP) read for meaning, not just keyword
occurrence, so the writing should stay clear, avoid unnecessary repetition,
and use keywords naturally rather than forcing them in.

## Above-the-fold content

"Above the fold" is the part of a page visible without scrolling — a user's
first impression forms here, and Google weighs this area heavily during
crawling. Poor engagement in this area raises bounce rate.

Practical elements: a clear, keyword-rich H1; a relevant, visually appealing
featured image; a CTA button ("Download Now", "Try Free"); and a short
2-line hook that engages before any scrolling happens.

## The first paragraph, restated as a rule

**"First paragraph = article summary + hook + main keyword."** It should
connect with the reader's actual problem, use the main keyword naturally,
summarize what the article will resolve, and create curiosity to keep
reading. Avoid fluff — get to the point.

## Keyword intent and prominence

Google determines the "main" keyword for a page from user intent, page
content relevance (which keyword repeats naturally), and context (headings,
slug, meta). A page failing to rank for its intended keyword usually means
the keyword was not made prominent enough, or the page reads as unclear about
which keyword deserves priority.

| Where the main keyword should appear | Action |
| --- | --- |
| H1 tag | Exact match of the main keyword |
| Meta title / description | Include it naturally |
| URL slug | Include the main keyword |
| First paragraph | Use it once, naturally |
| Headings | At least one H2 or H3 |
| Body paragraphs | 0.5%–0.8% density |
| Bold/italic | Highlight it at least once |
| Image alt tag | At least one image |

**Density guide:** for 1,000 words, use the main keyword 5–8 times
(0.5–0.8%) — check with a keyword density or word-count tool.

## Matching or exceeding competitor length

Don't set a word count blindly — check the top 10 ranking URLs for the
keyword in Ahrefs, find their minimum and maximum word counts (e.g. 260 to
3300+ in one worked example), and target the higher end. Longer,
better-structured content tends to outrank shorter, weaker pages.

## Competitor heading analysis with AI

1. Google the main keyword and copy the top 10–20 URLs.
2. Ask an AI assistant: "Extract H1, H2, H3 from these URLs."
3. If it just repeats existing headings, ask explicitly for unique,
   SEO-optimized versions instead.
4. Once headings are finalized, ask it to write the full article against
   those headings, with research and data.

## Keeping AI-generated tone consistent

A common failure mode: each AI-written section ends up in a different tone.
Fix it by fixing the tone up front ("Write like a skincare expert", "use my
intro as reference tone"), repeating the instruction at the start of each new
section ("use the same writing style as above, detailed, expert-like tone"),
and resetting explicitly if it drifts ("Forget all previous instructions. Now
use this new tone...").

## Related-keyword repetition

Use each related term naturally 1–2 times, spread across the article rather
than bunched in one paragraph — e.g. for an anti-aging niche: anti-aging,
wrinkle repair, cream for fine lines, firming night cream.

## Final checklist

- Above-the-fold area structured?
- Intro connects with the reader and uses the keyword?
- Keyword intent clear?
- Main keyword prominent in H1, meta, and slug?
- Keyword density between 0.5%–0.8%?
- Related keywords included?
- Article word count matches or exceeds top competitors?
- Headings analyzed and used?
- AI prompted with consistent instructions throughout?

[^iskills-course-notes]: iSkills SEO course notes, compiled 2026.
