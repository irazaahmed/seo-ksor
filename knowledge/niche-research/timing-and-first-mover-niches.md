---
type: Document
title: Seasonality, timing, and first-mover niches
description: Why a stable niche beats a spiking one, how to use Google Trends to find and validate first-mover opportunities, and a tool for fine-tuning a niche by location once it's chosen.
status: stable
order: 3.5
generated: { by: human:ahmedraza, at: 2026-09-20T15:30:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-20T15:30:00Z }
sources:
  - id: iskills-course-notes
    title: iSkills — course notes
    resource: "iSkills SEO course notes, compiled 2026"
verified: [{ by: human:ahmedraza, at: 2026-09-20T15:30:00Z }]
---

## Seasonality: why a spike is a trap, not an opportunity

Check seasonality in Google Trends before committing to a niche. A niche that
looks huge right now can be a spike that's already fading by the time a site
is actually built and ready to rank — building takes time, and a niche needs
to still be alive when that time is up. Prefer a **stable** niche over a
spiking one for exactly this reason.[^iskills-course-notes]

## FMA (First Mover Advantage), and where to find it

Being first into a niche gives a real edge — AI-related niches right now are
one current example — but finding one before everyone else does is the hard
part. Google Trends has three different windows for this, each suited to a
different question:[^iskills-course-notes]

- **"Trending Now"** — shows roughly the last **7 days**. Good for catching
  something breaking right now, too narrow a window to judge whether it will
  last.
- **trends.google.com/tv** — surfaces **multilingual** niches specifically,
  worth checking separately from the main trends interface.
- **The "Explore" tab, filtered to 3 or 6 months** — for anything with a
  longer horizon than "Trending Now" shows: set the time filter there and
  read the data over that window instead of just the last week.

## Bonus: estimating volume for a keyword Google Trends shows as zero

Google Trends doesn't report a keyword's search volume as an absolute number —
it plots interest **relative to the peak inside whichever time window is
selected**. That's what this trick uses: a keyword can show as flat zero over
a long window and still be hiding real, periodic demand that only becomes
visible once the window is narrow enough that nothing else in it drowns it
out.[^iskills-course-notes]

1. Open **Google Trends → Explore**, region set to **Worldwide**.
2. Search the candidate keyword — the worked example in the course was
   **"roblux mod apk"**.
3. Apply the **Past 12 months** filter. If it shows no meaningful result
   (flat/near-zero), don't discard the keyword yet.
4. Narrow the window further — to **Past 24 hours**, then to **Past 4
   hours**. A spike can appear here that was completely invisible in the
   yearly view.
5. Read the spike pattern: count how many distinct spikes show up within
   **one hour** of that narrow view.
6. **Multiply that per-hour spike count by 730** (the average number of
   hours in a month) to get a rough estimated monthly search volume for a
   keyword that official tools were reporting as zero.

> [!NOTE]
> This is an estimate extrapolated from a very small sample window, not a
> number Google reports directly — treat it as a signal worth investigating
> further (e.g. cross-checking in Ahrefs or Keyword Everywhere once a real
> figure is available), not a final volume to build a whole site's
> projections on.

## Fine-tuning a niche by location

Once a niche is already decided, checking how it looks from a *different*
country or region — without your own search history or location biasing the
results — is a fine-tuning step, not a discovery one. A tool named
**"valetin.app"** in the course material does this: search from a specific
country or region, down to a specific city by entering its latitude and
longitude, to see the unbiased local SERP.[^iskills-course-notes]

[^iskills-course-notes]: iSkills SEO course notes, compiled 2026.
