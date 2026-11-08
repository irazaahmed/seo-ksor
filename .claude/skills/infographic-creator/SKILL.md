---
name: infographic-creator
description: Design and render professional class infographics (WebP) for lessons in knowledge/, in the house editorial style learned from the owner's 15 reference templates. Use when a lesson needs an infographic, when the owner supplies class notes, or when asked to recreate/redesign infographics. Write a JSON spec, run render.mjs, check the image, place it at the end of the lesson.
metadata:
  version: "1.0.0"
---

# Infographic creator

One JSON spec (or a JSON array of specs, one file per module) in `system/infographics/specs/`, rendered by
`render.mjs` (headless Chrome + sharp, lucide icons) to the WebP path named in
the spec's `out`. The spec is derived from the lesson; the lesson is the
source of truth, never the other way round.

```sh
node .agents/skills/infographic-creator/render.mjs system/infographics/specs/<name>.json
node .agents/skills/infographic-creator/render.mjs system/infographics/specs     # all
ONLY=<text> node .agents/skills/infographic-creator/render.mjs <file>             # only specs whose out contains <text>
```

## What the reference templates teach (the house style)

1. **One idea per image, said in the title.** A short, claim-like serif title
   ("The Delegation Loop", "AI owns the middle. You own both ends."), an
   italic one-line subtitle, a small uppercase kicker for the class/module.
2. **Warm editorial palette.** Cream page, navy ink, terra and gold accents,
   sage/blue/plum only to separate parallel items. Colour encodes grouping,
   never decoration.
3. **Shape follows the data** (the most important rule; pick per section):

   | The content is...                         | Use        |
   | ----------------------------------------- | ---------- |
   | 2 to 5 parallel ideas, pillars, types     | `cards`    |
   | an ordered pipeline, A then B then C      | `flow`     |
   | phases in time (before/during/after)      | `timeline` |
   | a repeating loop / iteration              | `cycle`    |
   | field, question, answer / spec sheet      | `table`    |
   | do vs avoid, A vs B, two sides            | `compare`  |
   | a procedure of 5 to 10 steps              | `steps`    |
   | items mapped across 2 to 3 contexts       | `rows`     |
   | headline numbers (only if the lesson has) | `stats`    |
   | a set of names, tools, categories         | `chips`    |
   | the one sentence to remember              | `callout`  |

4. **Hierarchy in three levels**: title, section heading, card title + one
   short line. Card text is a phrase, not a paragraph (about 15 words max).
5. **Every block has an icon or a number** so the eye can scan; icons are
   literal (search for research, link for backlinks, dollar-sign for money).
6. **End on a takeaway**: a dark `callout` with the lesson's key rule, and/or
   a `footer` line. Both must be sentences the lesson actually says.
7. **Breathing room over density.** 3 to 6 sections per image. If a lesson has
   more, choose what a student must remember; the lesson keeps the rest.

## Spec format

```json
{
  "out": "knowledge/<path>/<lesson>-infographic.webp",
  "kicker": "SEO Class 4 · Content coverage",
  "title": "Short claim-like title",
  "subtitle": "One italic line",
  "sections": [ { "type": "cards", "heading": "optional", "items": [] } ],
  "footer": "optional takeaway line"
}
```

Section fields (any text supports `**bold**`; `tone` is one of terra, gold,
sage, blue, plum, navy and otherwise rotates):

- `cards`: `cols?`, `items: [{icon?, tag?, title, text?, points?: [], foot?, tone?}]`
- `flow`: `items: [{icon?, label?, title, text?}]` (3 to 6 boxes with arrows)
- `timeline`: `items: [{label, icon?, title, text?, points?}]` (2 to 5)
- `cycle`: `items: [{title, text?}]` (3 to 8), `center?: {title, text}`, `side?: {title, text?, points?, foot?}`
- `table`: `columns?: []`, `rows: [[k, ...]]`, `highlight?: [rowIndex]`
- `compare`: `columns: [{title, icon?, tone?, text?, items: [], foot?}]`
- `steps`: `cols?`, `items: ["text" | {title, text?, tag?}]` (prefer even counts with 2 columns)
- `rows`: `columns: [..]`, `items: [{icon?, title, text?, cells: [..]}]`
- `stats`: `items: [{value, label}]`
- `chips`: `items: ["..."]`
- `callout`: `icon?`, `quote`, `text?`
- `note`: `text`
- `split`: `ratio?: [1,1]`, `parts: [section | [sections]]` (side by side)

Icons are lucide names in kebab-case (`node_modules/lucide-react/dist/esm/icons/`);
an unknown name warns and falls back.

## Rules for this record

- **Say only what the lesson says.** Every figure, tool name, threshold and
  step is copied from the lesson. No invented stats, no outside tips. If the
  lesson has no numbers, there is no `stats` section.
- Respect the owner's style: no em or en dashes in any text; use commas,
  colons, periods or a middle dot.
- `out` may be an array to publish one design beside several lessons.
- Name the file `<lesson>-infographic.webp` (or the existing name being
  replaced) beside the lesson, and keep it as the lesson's last element under
  `## Class infographic(s)`. Alt text: `Infographic: <what it covers>`.
- After rendering, look at a downscaled copy (sharp resize to 1000px) and fix
  overflow, orphan cards, or crowding before moving on.
- Replacing an image does not change the lesson body, so no stamp change is
  needed; adding or editing the image reference is a body edit (advance
  `generated.at` and `ksor.approval.at`). Run `npm run gallery` when the set
  of images changes, then `npm run check` and `npm run build`.
