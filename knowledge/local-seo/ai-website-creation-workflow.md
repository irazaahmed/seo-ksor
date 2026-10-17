---
type: Document
title: "AI website creation, Lecture 1: the 16-step workflow with Claude Code"
description: Sir Khurram Malik's stack and 16-step workflow for building a hyper-local rank and rent website with WordPress, Kadence, Rank Math and Claude Code, including the research inputs and the prompts used.
status: stable
order: 36.3
added: 2026-10-15T18:48:19Z
generated: { by: process:claude-code, at: 2026-10-15T18:44:22Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-10-15T18:44:22Z }
sources:
  - id: khurram-notes
    title: "Local SEO, AEO & GEO: AI-Powered Ranking Notes, Sir Khurram Malik"
    resource: "Course notes PDF compiled from Sir Khurram Malik's lectures, July to September 2026, chapter 3, supplied by human:ahmedraza"
verified: [{ by: human:ahmedraza, at: 2026-10-15T18:44:22Z }]
---

*Chapter 3 of the Local SEO, AEO & GEO course notes, from Sir Khurram
Malik's first AI website creation lecture.*

**Stack:** WordPress + Kadence theme + Rank Math + Claude
Code.[^khurram-notes]

## Before starting: WordPress setup

1. Install WordPress.
2. Kadence theme + the Cornerstone starter template.
3. Required plugins + Rank Math setup.
4. **Only then** bring AI in, not before.[^khurram-notes]

## AI warm-up: Sonnet model

| Phase | Reasoning setting |
| --- | --- |
| Planning | Medium reasoning |
| Execution | Low reasoning (faster) |

Initial prompt:[^khurram-notes]

```text
Hi buddy, you're an elite Local SEO expert specializing in Rank & Rent without GMB. Please update yourself with 2026 trends in AI SEO, AEO, GEO, LLM optimization, AI Overview.
```

## The 16-step workflow

1. **Keyword research**: variations, SERP, SEMrush, GAP.
2. **Market research prompt**:

   ```text
   Analyze [Target City] market: customer pain points, problems, weather, landmarks, local events. Goal: hyper-local EEAT + AEO + GEO website.
   ```

3. **Semantic entities**: Wikipedia, GMB reviews, the Harpa tool.
4. **YouTube research**: creators from the target city, their transcripts,
   the local language.
5. **Real user data**: Reddit, Quora, LinkedIn, WikiHow, Facebook Groups
   (e.g. `site:reddit.com "your niche" issue`).
6. **SEMrush topic research**: download the report and give it to Claude.
7. **Competitor analysis**: content gaps, structure, EEAT, internal links.
8. **Master structure prompt**: attach all the data and have Claude
   generate the complete site structure (homepage, service pages, location
   pages, supporting pages).
9. **Rank Math setup**: connect Gmail, site name, settings.
10. **Image collection**: YouTube screenshots and Facebook.
11. **Image SEO**: remove EXIF data, convert to WEBP, geo-tag 40 to 50% of
    images.
12. **Upload and URLs**: upload to the WordPress media library, copy the
    URLs and give them to Claude.
13. **Tone of voice**: have Claude analyze the audience and recommend the
    best tone.
14. **Homepage content prompt**:

    ```text
    Write homepage content considering: target audience, market research, semantic entities, inline questions, FAQs, EEAT, NLP, AEO, GEO, local pain points, landmarks, ZIP codes, natural keywords, CTAs, heading hierarchy. Tone: real local business owner from [City].
    ```

15. **Claude Code design prompt**:

    ```text
    Design this website [URL]: clean, premium, professional. Kadence Theme + required plugins installed.
    ```

16. **Done!**[^khurram-notes]

> [!TIP]
> The more real data you give Claude, the better the website you get. Rich
> data in = rich output.

[^khurram-notes]: Local SEO, AEO & GEO: AI-Powered Ranking Notes, Sir Khurram Malik, chapter 3.
