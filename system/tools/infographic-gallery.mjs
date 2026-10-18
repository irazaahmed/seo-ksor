#!/usr/bin/env node
// Regenerates knowledge/infographics.md: every class infographic in the
// record, gathered on one page by module and chapter, each linked back to the
// chapter it closes.
//
// The images are not copied. The gallery references the same files the
// chapters do, so each infographic appears twice (in its chapter, and here)
// while existing once on disk.
//
// Run after adding or changing a chapter's infographic:
//   npm run gallery
// It rewrites the page only when its body would change, and then moves the
// document's generated/approval stamps forward, as a body edit requires.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const KNOWLEDGE = path.join(ROOT, "knowledge");
const OUT = path.join(KNOWLEDGE, "infographics.md");
const OWNER = "human:ahmedraza";

// Section names, where a folder's generated index heading reads poorly.
const MODULE_NAMES = {
  "ai-agents": "AI Agents",
  "keyword-research-and-content-planning": "Keyword research and content coverage",
  "niche-research": "Niche research",
  "quick-skills/etsy": "Quick Skills: Etsy",
};

const INFOGRAPHIC = /^!\[Infographic:\s*(.+?)\]\(([^)\s]+)\)\s*$/gm;

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return {};
  const get = (key) => m[1].match(new RegExp(`^${key}:\\s*(.*)$`, "m"))?.[1]?.trim();
  const unquote = (v) => (v && /^".*"$/.test(v) ? JSON.parse(v) : v);
  return { title: unquote(get("title")), order: Number(get("order") ?? Infinity) };
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.name.endsWith(".md") && e.name !== "index.md" && !e.name.endsWith(".summary.md") ? [p] : [];
  });
}

function moduleName(folder) {
  if (MODULE_NAMES[folder]) return MODULE_NAMES[folder];
  const index = path.join(KNOWLEDGE, folder, "index.md");
  const heading = fs.existsSync(index) && fs.readFileSync(index, "utf8").match(/^# (.+)$/m)?.[1];
  return heading || folder;
}

const chapters = [];
for (const file of walk(KNOWLEDGE)) {
  if (file === OUT) continue;
  const text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const images = [...text.matchAll(INFOGRAPHIC)].map(([, caption, src]) => ({ caption, src }));
  if (images.length === 0) continue;
  const rel = path.relative(KNOWLEDGE, file).split(path.sep).join("/");
  const folder = path.posix.dirname(rel);
  const { title, order } = frontmatter(text);
  chapters.push({ rel, folder, title, order, images });
}

// Modules in the order their first chapter sits in the sidebar; chapters by
// their own order, then by name.
const byOrder = (a, b) => a.order - b.order || a.rel.localeCompare(b.rel);
chapters.sort(byOrder);

// One infographic can close several chapters (a revision class spans three);
// the gallery shows it once, under the first of them.
const seen = new Set();
for (const c of chapters) {
  c.images = c.images.filter(({ caption }) => !seen.has(caption) && seen.add(caption));
}
for (let i = chapters.length - 1; i >= 0; i--) if (chapters[i].images.length === 0) chapters.splice(i, 1);

const modules = new Map();
for (const c of chapters) {
  if (!modules.has(c.folder)) modules.set(c.folder, []);
  modules.get(c.folder).push(c);
}

const total = chapters.reduce((n, c) => n + c.images.length, 0);
let body = `*Every class infographic in this record, gathered in one place by module
and chapter. Each one also sits at the end of its own chapter: open the
chapter's title to read the full lesson behind it.*\n`;
for (const [folder, list] of modules) {
  body += `\n## ${moduleName(folder)}\n`;
  for (const c of list) {
    body += `\n### [${c.title}](${c.rel})\n`;
    for (const img of c.images) {
      const src = path.posix.join(c.folder === "." ? "" : c.folder, img.src);
      body += `\n![Infographic: ${img.caption}](${src})\n`;
    }
  }
}

const previous = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
const previousBody = previous.replace(/^---\n[\s\S]*?\n---\n\n?/, "");
if (previousBody === body) {
  console.log(`gallery: unchanged (${total} infographics, ${chapters.length} chapters)`);
  process.exit(0);
}

const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const added = previous.match(/^added:\s*(\S+)/m)?.[1] ?? now;
const head = `---
type: Document
title: All class infographics
description: Every class infographic in the record on one page, grouped by module and chapter, each linked to the chapter it summarises.
status: stable
order: 0.6
added: ${added}
generated: { by: ${OWNER}, at: ${now} }
ksor:
  audience: [public]
  owner: ${OWNER}
  approval: { by: ${OWNER}, at: ${now} }
---

`;
fs.writeFileSync(OUT, head + body);
console.log(`gallery: wrote knowledge/infographics.md (${total} infographics, ${chapters.length} chapters)`);
