# AskSEO

A governed knowledge record for SEO — Complete SEO, Local SEO, Blogging, and
Quick Skills (Etsy), sourced from real course material. It exists so anyone
can connect this record to Claude or ChatGPT over MCP and be guided strictly
from what's actually in it, instead of a generic AI answer.

## What this covers

Complete SEO, Local SEO, Blogging, and Quick Skills (Etsy) — as the owner
adds it. It does not cover institute administration, or anything not
explicitly added to `knowledge/`. Outside its scope, the record says so
plainly rather than guessing.

## What's inside `knowledge/`

46 governed documents, organized by topic:

| Folder | Covers |
| --- | --- |
| `niche-research/` | Selection criteria, marketplace/Ahrefs/AI-tool/backlink-UGC methods, APK niches, country & language targeting, timing & first-mover niches |
| `keyword-research-and-content-planning/` | Keyword grouping, research methods, content coverage |
| `content-writing/` | Article structure, SEO copywriting, NLP entity extraction, multilingual content |
| `wordpress/` | Setup, theme, and page design |
| `on-page-and-technical-seo/` | Meta tags, Core Web Vitals, schema, audits, Search Console, reverse engineering |
| `apk-websites/` | APK hosting and AdSense approval |
| `off-page-seo/` | Backlinks, anchor text, outreach, guest posting |
| `local-seo/` | Google Business Profile, local ranking factors |
| `quick-skills/etsy/` | Etsy account creation and safety, listing/competitor research, keyword research, ranking |

Plus `glossary.md`, `why-seo-matters.md`, and
`connect-claude-and-chatgpt.md` at the root.

Every document is `status: stable`, approved by the record's owner, and
cites its source via a footnote — see `AGENTS.md` for the full governance
rules this record follows.

## Quick start

```sh
npm install
npm run dev   # browse the record at http://localhost:3000
```

## Use AskSEO in Claude or ChatGPT — no setup needed

AskSEO is already live, served over MCP at
**`https://askseo.cybrumsolutions.dev/mcp`** — public, read-only, no login
and no API key required. Connecting Claude or ChatGPT to this URL makes it
answer SEO questions strictly from what this record actually covers, citing
the source document, and saying plainly when something isn't in here instead
of guessing.

**Claude** — Settings → Connectors → Add custom connector → paste
Name `AskSEO` and the MCP Server URL above → Continue → leave authentication
on **No sign-in** → Add.

**ChatGPT** — Settings → Developer mode (turn it on) → Plugins → **+** → New
Plugin → Name `AskSEO`, Connection **Server URL**, paste the URL, set
Authentication to **No Auth** → Create.

Then just ask it something: *"Use AskSEO and explain what a nano niche is."*

Full step-by-step with screenshots for both:
[`knowledge/connect-claude-and-chatgpt.md`](knowledge/connect-claude-and-chatgpt.md)
(also readable on the live site at
`askseo.cybrumsolutions.dev/docs/connect-claude-and-chatgpt`).

## Self-hosting your own instance

Cloning this repo and standing up your own MCP door (your own Postgres, your
own Gemini API key, your own domain) is a separate thing from using the
already-deployed one above — do this only if you want to run your own copy.
The full, step-by-step walkthrough is in `AGENTS.md` under
**"Serving to agents"**.

```sh
npm run provision   # once: apply schema + grant ingest
npm run refresh      # publish the record into a servable generation
npm run serve        # run the MCP server
```

## Adding new material

New sessions get folded in the same way the first batch was: raw
notes go through the `add-sources` skill (`.agents/skills/add-sources/`),
which converts them into governed markdown, verifies every number against
the source, and asks for approval before anything publishes. Then:

```sh
npm run refresh   # re-embeds only what changed
```

## Governance

- **Owner / approver:** Ahmed Raza (`human:ahmedraza`)
- **Audience:** public — every document is readable by anyone with this
  repository
- **Policy:** `.ksor/governance.yaml`

`AGENTS.md` is the full working contract for this repository — read it
before changing how documents are written, structured, or served.
