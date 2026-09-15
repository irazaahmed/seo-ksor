# SEO Knowledge System of Record

A governed **Knowledge System of Record (KSoR)** for SEO — Complete SEO,
Local SEO, Blogging, and Quick Skills (Etsy), sourced from real course
material. It exists so anyone can connect this record to Claude or ChatGPT
over MCP and be guided strictly from what's actually in it, instead of a
generic AI answer.

## What this covers

Complete SEO, Local SEO, Blogging, and Quick Skills (Etsy) — as the owner
adds it. It does not cover institute administration, or anything not
explicitly added to `knowledge/`. Outside its scope, the record says so
plainly rather than guessing.

## What's inside `knowledge/`

36 governed documents, organized by topic:

| Folder | Covers |
| --- | --- |
| `niche-research/` | Selection criteria, marketplace/Ahrefs/AI-tool methods, APK niches, country & language targeting |
| `keyword-research-and-content-planning/` | Keyword grouping, research methods, content coverage |
| `content-writing/` | Article structure, SEO copywriting, NLP entity extraction, multilingual content |
| `wordpress/` | Setup, theme, and page design |
| `on-page-and-technical-seo/` | Meta tags, Core Web Vitals, schema, audits, Search Console, reverse engineering |
| `apk-websites/` | APK hosting and AdSense approval |
| `off-page-seo/` | Backlinks, anchor text, outreach, guest posting |
| `local-seo/` | Google Business Profile, local ranking factors |

Plus `glossary.md` and `why-seo-matters.md` at the root.

Every document is `status: stable`, approved by the record's owner, and
cites its source via a footnote — see `AGENTS.md` for the full governance
rules this record follows.

## Quick start

```sh
npm install
npm run dev   # browse the record at http://localhost:3000
```

## Connecting an AI agent (Claude, ChatGPT) via MCP

This record can be served as an MCP tool so an agent answers only from what's
here, declining anything out of scope. Setup needs a Postgres database (free
tier works) and a Gemini API key (also free for embeddings) — the full,
step-by-step walkthrough is in `AGENTS.md` under **"Serving to agents"**.

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

## Built on KSoR

This project is scaffolded from [`@panaversity/ksor`](https://github.com/panaversity/ksor),
a governed knowledge-system framework. `AGENTS.md` is the full working
contract for this repository — read it before changing how documents are
written, structured, or served.
