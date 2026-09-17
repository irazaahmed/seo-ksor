---
type: Document
title: Connect Claude or ChatGPT to this record
description: Step-by-step setup for adding AskSEO as a custom MCP connector in Claude and in ChatGPT, so either one answers grounded in this record instead of guessing.
status: stable
order: 1.5
generated: { by: human:ahmedraza, at: 2026-09-17T14:00:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-17T14:00:00Z }
verified: [{ by: human:ahmedraza, at: 2026-09-17T14:00:00Z }]
---

This record is served live over MCP. Connecting Claude or ChatGPT to it means either
one answers SEO questions strictly from what this record actually covers — niche
research, keyword research, on-page and technical SEO, off-page, local SEO, APK
sites, WordPress — citing the source document, or saying plainly when something
isn't covered yet, instead of guessing from general training data.

No login and no API key are needed to connect: this door is public and read-only.
Both setups below use the same two values —

- **Name:** AskSEO
- **MCP Server URL:** `https://askseo.cybrumsolutions.dev/mcp`

## Connect Claude

1. Open **Settings → Connectors** in claude.ai.
2. Click **Add custom connector**.
3. Paste the **Name** and the **MCP Server URL** above.
4. Leave everything else blank — there is no OAuth Client ID or Client Secret to
   enter, since this connector needs neither.
5. Click **Add** to save it.
6. Find it in your connectors list, click **Connect**, and approve access when
   Claude asks.
7. Ask it something and watch it answer from the record: *"Use AskSEO and explain
   what a nano niche is."*

## Connect ChatGPT

1. Open **Settings → Connectors → Advanced**, and turn on **Developer mode** if it
   isn't already on.
2. Back in Connectors, click **Create** (or **Add custom connector**).
3. Paste the **Name** and the **MCP Server URL** above.
4. Set **Authentication** to **None**.
5. Save.
6. Enable the connector inside a chat, then ask it an AskSEO question the same way.

> [!NOTE]
> Custom connectors are currently available on ChatGPT's paid plans (Plus and
> above) — Free and the lower-cost Go plan may not show the Developer mode option
> at all. This changes over time as OpenAI rolls the feature out further, so check
> Settings → Connectors → Advanced on your own account rather than assuming.

## What "grounded" means here

Both connectors point at the same read-only record. An agent connected this way
never receives write access, and it answers only from documents this record
actually admits to its machine surface — a draft or a withdrawn document is never
handed over as an answer.
