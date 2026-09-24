---
type: Document
title: "Finding Etsy keywords in bulk: three methods and the selection formula"
description: Three ways to collect related Etsy keywords in bulk (manual autocomplete, an AI prompt, and mining the top 10 listings' titles) and the metric combination a keyword has to pass before you use it.
status: stable
order: 52.5
generated: { by: human:ahmedraza, at: 2026-09-24T18:35:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-24T18:35:00Z }
sources:
  - id: etsy-class-08
    title: "Etsy module, Class 08: Keyword Research, Find Keyword in Bulk"
    resource: "iSkills Quick Skills (Etsy) Class 08 notes, Keyword Research: Find Keyword in Bulk, taught by Sir Zafar Ali"
  - id: owner-clarification-2026-09-24
    title: "Owner's clarification: shop criteria versus keyword criteria"
    resource: "Clarification from human:ahmedraza (owner), 2026-09-24T18:35:00Z, recorded by Claude: the RankKW class's criteria are for a shop, and Class 08's criteria are for keywords"
verified: [{ by: human:ahmedraza, at: 2026-09-24T18:35:00Z }]
---

*This whole document is from Class 08 of the Etsy module, Keyword Research:
Find Keyword in Bulk, taught by Sir Zafar Ali.*

## Why keywords decide an Etsy listing

- Any word a buyer types into the search bar is a **keyword**.
- If a listing's SEO were scored out of 100, **70 to 80 of those points come
  from keywords**.
- A keyword with **low keyword difficulty (KD)** and **high search volume**
  can bring a sale within a week.
- **Keyword difficulty** means how many listings are competing to rank for
  that keyword.
- Before choosing a keyword, know its **trend**, its **sales**, and its
  **revenue structure**, not just its volume.
- Keyword search is the most important part of Etsy SEO.[^etsy-class-08]

**One keyword is not enough.** Find multiple related keywords around the
main one: without related keywords, a shop cannot rank.[^etsy-class-08]

## Method 1: manual, from Etsy's own search suggestions

1. Pick the **focus keyword**, the word the shop is built around. Example:
   to work on planners, the focus keyword is **"planner"**.
2. Type the focus keyword into Etsy's search bar and press **space**. The
   suggestions that appear after it are related keywords; note them all
   down.
3. Then type the focus keyword followed by each letter of the alphabet in
   turn (**a, b, c, d**, and so on) and note down the suggestions that each
   letter brings up.
4. By the time you reach **z**, you will have collected a large list of
   keywords. Note every one of them.[^etsy-class-08]

## Method 2: ask an AI assistant (any LLM)

Give the assistant a prompt along these lines: that you want to sell a
digital product on Etsy, and you want low-KD, high-search-volume keywords
that rank easily on Etsy. Name your niche in the same prompt (for example, a
coloring book). You can also ask it to search on Etsy itself and to give the
**KD, search volume, and, where possible, the trend** beside every
keyword.[^etsy-class-08]

The result is a keyword list with KD, volume and trend
together.[^etsy-class-08]

## Method 3: mine the top 10 listings' titles (the recommended method)

This is the unique method the class recommends:

1. Search the **main keyword** on Etsy.
2. Open the **top 10 listings** for it.
3. Copy all ten titles and give them to any AI assistant, with the prompt
   below.[^etsy-class-08]

The first version of the prompt, as given in class:

```text
act as seo expert which one have more than 20 year experience in seo to rank etsy listing on first page. i face issue to find related low kd and high search volume keyword give me good keyword from this title which one give you add all this keyword on table which one also mention search volume kd trend graphy country
```

The improved version, which asks for the same thing in a structured way and
explicitly forbids the assistant from inventing numbers:[^etsy-class-08]

```text
Act as an Etsy SEO expert with 20+ years of experience in keyword research, search intent, Etsy ranking, and listing optimization.

I will give you an Etsy product title. Your task is to analyze the title and identify the most relevant keywords and related keyword variations that could help the listing rank on Etsy.

My main goal is to find keywords that have:
1. High search volume
2. Low competition or low keyword difficulty
3. Strong buyer/commercial intent
4. High relevance to the actual product
5. Positive or stable search trends
6. Potential to generate targeted Etsy traffic

Do not simply generate generic or broad keywords. Focus on realistic, highly relevant keywords that an Etsy buyer would actually search for.

For every keyword, provide the following information in a table:

| Keyword | Search Volume | Keyword Difficulty (KD) | Competition | Search Intent | Trend | Trend Direction | Country | Relevance | Priority |

Also:

• Identify the primary keyword that should be the main target.
• Identify secondary/supporting keywords.
• Identify long-tail keywords with lower competition.
• Identify keyword variations and closely related terms.
• Avoid keyword stuffing, irrelevant keywords, and keywords that change the actual product intent.
• If a keyword has high search volume but very high competition, clearly mention that.
• If a keyword has lower search volume but significantly lower competition and stronger buyer intent, highlight it as an opportunity.
• Analyze the keywords specifically for Etsy, not just Google SEO.
• Consider Etsy buyer intent, product relevance, competition, and ranking difficulty.
• Prefer keywords that can realistically be targeted by a newer or lower-authority Etsy shop.

For trend analysis, mention whether the keyword is:
Growing, Stable, Declining, Seasonal, or Unclear.

For country analysis, identify the country where the keyword has the strongest search demand, especially considering major Etsy markets such as the United States, United Kingdom, Canada, Australia, and Germany.

At the end, provide:

1. Top 5 primary keyword opportunities
2. Top 10 secondary keywords
3. Top 10 long-tail keywords
4. Keywords to avoid and why
5. Recommended Etsy title structure using the strongest keywords
6. Recommended Etsy tags based on the research

Important:
Do not invent search volume, KD, trend, or country data. If actual data is unavailable, clearly mark it as "Data unavailable" and do not estimate it.

Here is the Etsy product title:

[PASTE TITLE HERE]
```

## The keyword selection formula

A keyword is worth using only when it passes all of these together:[^etsy-class-08]

| Metric | Threshold |
| --- | --- |
| Competition | Under 50K |
| Average views | Over 5K |
| Average price | Over $2 |
| Favourites per view | Over 1% |
| Google volume | Green / healthy |
| 12-month trend | Stable or growing |
| Target countries | USA, UK, Canada, Germany |
| KD | 50 or below (easy or medium) |

> [!IMPORTANT]
> The classroom rule: never select a keyword on one strong metric alone. Use
> the complete combination. These thresholds are a screening method for
> keyword research, not a guarantee of sales or ranking.[^etsy-class-08]

The line to remember: **low competition, strong views, healthy engagement,
stable demand, and KD under 50.**[^etsy-class-08]

These criteria are for choosing a **keyword**. The criteria for a **shop**
(at least two of the top 10 listings under three months old, and so on)
are from an earlier class, in [RankKW: the Etsy SEO tool and shop
criteria](etsy-rankkw-tool-and-listing-criteria.md).[^owner-clarification-2026-09-24]

[^etsy-class-08]: iSkills Quick Skills (Etsy) Class 08 notes, Keyword
    Research: Find Keyword in Bulk, taught by Sir Zafar Ali.

[^owner-clarification-2026-09-24]: Clarification from the record's owner,
    2026-09-24: the RankKW class's criteria are for a shop; Class 08's are
    for keywords.
