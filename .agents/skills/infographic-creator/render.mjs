#!/usr/bin/env node
// Renders infographic specs (JSON) into lesson-ready WebP images.
//
//   node .agents/skills/infographic-creator/render.mjs <spec.json | dir> [...]
//   node .agents/skills/infographic-creator/render.mjs --html <spec.json>   (keep the HTML for debugging)
//
// A spec is { out, kicker?, title, subtitle?, sections: [...], footer? }.
// Section types and their fields are documented in SKILL.md. Rendering is
// headless Chrome (installed browser) + sharp, so nothing is fetched except
// the two Google Fonts, which fall back to Georgia / Segoe UI offline.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const require = createRequire(path.join(ROOT, "package.json"));
const sharp = require("sharp");
const ICON_DIR = path.join(ROOT, "node_modules/lucide-react/dist/esm/icons");
const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => p && fs.existsSync(p));

const WIDTH = 1400; // CSS px; rendered at 1.5x => 2100px wide WebP
const SCALE = 1.5;
const BG = "#FBF5EC";
const TONES = ["terra", "gold", "sage", "blue", "plum", "navy"];

// ---------- helpers ----------
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// **bold** inside any text field
const t = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const tone = (i, given) => given || TONES[i % TONES.length];

const iconCache = new Map();
function icon(name, cls = "ic") {
  if (!name) return "";
  const file = path.join(ICON_DIR, `${name}.mjs`);
  if (!iconCache.has(name)) {
    if (!fs.existsSync(file)) {
      console.warn(`  ! unknown icon "${name}" (lucide name, kebab-case); using circle-dot`);
      return icon("circle-dot", cls);
    }
    let src = fs.readFileSync(file, "utf8");
    const alias = src.match(/from '\.\/([\w-]+)\.mjs'/);
    if (alias && !src.includes("__iconNode")) src = fs.readFileSync(path.join(ICON_DIR, `${alias[1]}.mjs`), "utf8");
    const m = src.match(/const __iconNode = (\[[\s\S]*?\]);\n/);
    const nodes = Function(`return ${m[1]}`)();
    const inner = nodes
      .map(([tag, attrs]) => {
        const a = Object.entries(attrs)
          .filter(([k]) => k !== "key")
          .map(([k, v]) => `${k}="${v}"`)
          .join(" ");
        return `<${tag} ${a}/>`;
      })
      .join("");
    iconCache.set(name, inner);
  }
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${iconCache.get(name)}</svg>`;
}

const head = (s) =>
  s.heading
    ? `<div class="sh"><span></span><h3>${t(s.heading)}</h3><span></span></div>`
    : "";

// ---------- section renderers ----------
const R = {
  cards(s) {
    const cols = s.cols || Math.min(s.items.length, 4);
    return `${head(s)}<div class="grid" style="grid-template-columns:repeat(${cols},1fr)">${s.items
      .map(
        (it, i) => `<div class="card top ${tone(i, it.tone)}">
        ${it.icon ? `<div class="bub">${icon(it.icon)}</div>` : ""}
        ${it.tag ? `<div class="tag">${t(it.tag)}</div>` : ""}
        <h4>${t(it.title)}</h4><i class="rule"></i>
        ${it.text ? `<p>${t(it.text)}</p>` : ""}
        ${it.points ? `<ul>${it.points.map((p) => `<li>${t(p)}</li>`).join("")}</ul>` : ""}
        ${it.foot ? `<div class="pill">${t(it.foot)}</div>` : ""}
      </div>`,
      )
      .join("")}</div>`;
  },

  flow(s) {
    const n = s.items.length;
    return `${head(s)}<div class="flow">${s.items
      .map(
        (it, i) => `<div class="fbox ${tone(i, it.tone)}">
          <div class="fnum">${it.label ? t(it.label) : String(i + 1).padStart(2, "0")}</div>
          ${it.icon ? `<div class="bub sm">${icon(it.icon)}</div>` : ""}
          <h4>${t(it.title)}</h4>${it.text ? `<p>${t(it.text)}</p>` : ""}
        </div>${i < n - 1 ? `<div class="arrow">${icon("arrow-right", "ar")}</div>` : ""}`,
      )
      .join("")}</div>`;
  },

  timeline(s) {
    const n = s.items.length;
    return `${head(s)}<div class="tl"><div class="tline"></div><div class="grid" style="grid-template-columns:repeat(${n},1fr)">${s.items
      .map(
        (it, i) => `<div class="tcol ${tone(i, it.tone)}">
          <div class="tlab">${t(it.label || `Step ${i + 1}`)}</div><div class="dot"></div>
          <div class="card ${tone(i, it.tone)} edge">
            ${it.icon ? `<div class="bub">${icon(it.icon)}</div>` : ""}
            <h4 class="tc">${t(it.title)}</h4><i class="rule"></i>
            ${it.text ? `<p>${t(it.text)}</p>` : ""}
            ${it.points ? `<ul>${it.points.map((p) => `<li>${t(p)}</li>`).join("")}</ul>` : ""}
          </div></div>`,
      )
      .join("")}</div></div>`;
  },

  table(s) {
    const cols = s.columns;
    return `${head(s)}<table class="tbl">${
      cols ? `<tr>${cols.map((c) => `<th>${t(c)}</th>`).join("")}</tr>` : ""
    }${s.rows
      .map(
        (r, i) =>
          `<tr class="${(s.highlight || []).includes(i) ? "hl" : ""}">${r
            .map((c, j) => (j === 0 ? `<td class="k">${t(c)}</td>` : `<td>${t(c)}</td>`))
            .join("")}</tr>`,
      )
      .join("")}</table>`;
  },

  cycle(s) {
    const n = s.items.length;
    const W = s.width || (s.side ? 960 : 1180), H = s.height || 640, cx = W / 2, cy = H / 2;
    const rx = W / 2 - 150, ry = H / 2 - 70;
    const boxes = s.items
      .map((it, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
        const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
        return `<div class="cbox ${tone(i, it.tone)}" style="left:${x}px;top:${y}px">
          <div class="cn">${i + 1}</div><h4>${t(it.title)}</h4>${it.text ? `<p>${t(it.text)}</p>` : ""}</div>`;
      })
      .join("");
    const side = s.side
      ? `<div class="card side"><h4>${t(s.side.title)}</h4><i class="rule"></i>${(s.side.text ? [s.side.text] : [])
          .map((p) => `<p>${t(p)}</p>`)
          .join("")}${s.side.points ? `<ul>${s.side.points.map((p) => `<li>${t(p)}</li>`).join("")}</ul>` : ""}${
          s.side.foot ? `<p class="acc"><b>${t(s.side.foot)}</b></p>` : ""
        }</div>`
      : "";
    return `${head(s)}<div class="cwrap"><div class="cyc" style="width:${W}px;height:${H}px">
      <svg width="${W}" height="${H}" class="cring"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" /></svg>
      ${s.center ? `<div class="ccenter"><h4>${t(s.center.title)}</h4>${s.center.text ? `<p>${t(s.center.text)}</p>` : ""}</div>` : ""}
      ${boxes}</div>${side}</div>`;
  },

  compare(s) {
    return `${head(s)}<div class="grid" style="grid-template-columns:repeat(${s.columns.length},1fr)">${s.columns
      .map(
        (c, i) => `<div class="cmp ${tone(i, c.tone)}">
        <div class="cmph">${c.icon ? icon(c.icon) : ""}<span>${t(c.title)}</span></div>
        ${c.text ? `<p class="cmpt">${t(c.text)}</p>` : ""}
        <ul class="plus">${(c.items || []).map((p) => `<li>${t(p)}</li>`).join("")}</ul>
        ${c.foot ? `<div class="pill">${t(c.foot)}</div>` : ""}
      </div>`,
      )
      .join("")}</div>`;
  },

  steps(s) {
    const cols = s.cols || (s.items.length > 5 ? 2 : 1);
    return `${head(s)}<div class="grid steps" style="grid-template-columns:repeat(${cols},1fr)">${s.items
      .map((it, i) => {
        const o = typeof it === "string" ? { title: it } : it;
        return `<div class="step ${tone(i, o.tone)}"><div class="sn">${i + 1}</div><div><h5>${t(o.title)}</h5>${
          o.text ? `<p>${t(o.text)}</p>` : ""
        }</div>${o.tag ? `<div class="stag">${t(o.tag)}</div>` : ""}</div>`;
      })
      .join("")}</div>`;
  },

  rows(s) {
    // matrix: coloured label tile on the left, then cells
    return `${head(s)}${s.columns ? `<div class="mrow mhead"><div></div>${s.columns.map((c, i) => `<div class="mh ${tone(i + 5)}">${t(c)}</div>`).join("")}</div>` : ""}${s.items
      .map(
        (it, i) => `<div class="mrow" style="grid-template-columns:330px repeat(${it.cells.length},1fr)">
        <div class="mlab ${tone(i, it.tone)}">${it.icon ? icon(it.icon) : ""}<div><h5>${t(it.title)}</h5>${it.text ? `<p>${t(it.text)}</p>` : ""}</div></div>
        ${it.cells.map((c) => `<div class="mcell">${t(c)}</div>`).join("")}</div>`,
      )
      .join("")}`;
  },

  stats(s) {
    return `${head(s)}<div class="stats">${s.items
      .map((it, i) => `<div class="stat ${tone(i, it.tone)}"><b>${t(it.value)}</b><span>${t(it.label)}</span></div>`)
      .join("")}</div>`;
  },

  chips(s) {
    return `${head(s)}<div class="chips">${s.items
      .map((c, i) => `<span class="chip ${tone(i)}">${t(c)}</span>`)
      .join("")}</div>`;
  },

  callout(s) {
    return `<div class="callout">${icon(s.icon || "shield-check", "ci")}<div class="cbar"></div><div><div class="cq">${t(
      s.quote,
    )}</div>${s.text ? `<div class="ct">${t(s.text)}</div>` : ""}</div></div>`;
  },

  note(s) {
    return `<p class="note">${t(s.text)}</p>`;
  },

  split(s) {
    const w = s.ratio || [1, 1];
    return `<div class="split" style="grid-template-columns:${w.map((x) => x + "fr").join(" ")}">${s.parts
      .map((p) => `<div class="part">${(Array.isArray(p) ? p : [p]).map(section).join("")}</div>`)
      .join("")}</div>`;
  },
};

function section(s) {
  const fn = R[s.type];
  if (!fn) throw new Error(`unknown section type "${s.type}"`);
  return `<section class="s-${s.type}">${fn(s)}</section>`;
}

// ---------- page ----------
const CSS = `
:root{--bg:${BG};--card:#FFFDF9;--ink:#1E2B3C;--ink2:#4A5566;--line:#E9DCC7;
--terra:#C4532F;--terra-t:#FBE7DE;--gold:#C98F1E;--gold-t:#FBF0D6;--sage:#4F8256;--sage-t:#E3F0E2;
--blue:#2F5F95;--blue-t:#E1EAF5;--plum:#7A4E8C;--plum-t:#EFE5F3;--navy:#1E2B3C;--navy-t:#E3E7EE}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg)}
body{width:${WIDTH}px;background-color:var(--bg);background-repeat:no-repeat;color:var(--ink);font:400 19px/1.45 Inter,"Segoe UI",Arial,sans-serif;padding:56px 60px 52px;
background-image:radial-gradient(circle at 0 0,#F7E6D2 0,transparent 420px)}
.terra{--c:var(--terra);--ct:var(--terra-t)}.gold{--c:var(--gold);--ct:var(--gold-t)}.sage{--c:var(--sage);--ct:var(--sage-t)}
.blue{--c:var(--blue);--ct:var(--blue-t)}.plum{--c:var(--plum);--ct:var(--plum-t)}.navy{--c:var(--navy);--ct:var(--navy-t)}
b{font-weight:700;color:var(--ink)}
header{text-align:center;margin-bottom:34px}
.kick{display:flex;align-items:center;justify-content:center;gap:18px;font:600 15px/1 Inter,"Segoe UI";letter-spacing:.32em;color:var(--terra);text-transform:uppercase;margin-bottom:16px}
.kick:before,.kick:after{content:"";width:90px;height:2px;background:linear-gradient(90deg,transparent,var(--gold))}
.kick:after{transform:scaleX(-1)}
h1{font:700 60px/1.06 Fraunces,Georgia,serif;letter-spacing:-.01em;color:var(--ink)}
.sub{font:italic 400 24px/1.35 Fraunces,Georgia,serif;color:var(--ink2);margin-top:12px}
.orn{width:220px;height:2px;margin:18px auto 0;background:linear-gradient(90deg,transparent,var(--gold),transparent);position:relative}
.orn:after{content:"✦";position:absolute;left:50%;top:-12px;transform:translateX(-50%);color:var(--gold);font-size:18px;background:var(--bg);padding:0 8px}
section{margin-top:30px}
.sh{display:flex;align-items:center;gap:16px;margin-bottom:18px}.sh span{flex:1;height:1px;background:var(--line)}
.sh h3{font:600 26px/1.2 Fraunces,Georgia,serif;color:var(--ink);text-align:center}
.grid{display:grid;gap:20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px 22px 22px;box-shadow:0 6px 18px rgba(80,50,20,.07);text-align:center;position:relative}
.card.top{border-top:6px solid var(--c)}
.card.edge{border:2px solid var(--c)}
.card h4,.cbox h4{font:700 23px/1.2 Inter,"Segoe UI";color:var(--c,var(--ink))}
.card h4.tc{color:var(--c)}
.rule{display:block;width:46px;height:3px;background:var(--c,var(--gold));margin:10px auto 12px;border-radius:2px}
.card p{color:var(--ink2);font-size:18px}
.card ul{list-style:none;text-align:left;margin-top:6px}.card li{position:relative;padding-left:20px;margin:6px 0;color:var(--ink2);font-size:17.5px}
.card li:before{content:"";position:absolute;left:4px;top:10px;width:7px;height:7px;border-radius:50%;background:var(--c)}
.bub{width:78px;height:78px;border-radius:50%;background:var(--ct);color:var(--c);display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.bub.sm{width:56px;height:56px;margin-bottom:10px}.bub .ic{width:40px;height:40px}.bub.sm .ic{width:28px;height:28px}
.tag{display:inline-block;font:700 13px/1 Inter;letter-spacing:.12em;text-transform:uppercase;color:var(--c);background:var(--ct);padding:6px 10px;border-radius:20px;margin-bottom:10px}
.pill{margin-top:14px;background:var(--ct);color:var(--ink);font-weight:700;font-size:17px;border-radius:10px;padding:9px 12px}
.flow{display:flex;align-items:stretch;gap:8px}
.fbox{flex:1;background:var(--card);border:2px solid var(--c);border-radius:14px;padding:18px 16px;text-align:center;box-shadow:0 5px 14px rgba(80,50,20,.06)}
.fnum{font:700 14px/1 Inter;letter-spacing:.2em;color:var(--c);margin-bottom:10px;text-transform:uppercase}
.fbox h4{font:700 21px/1.2 Inter,"Segoe UI";color:var(--ink);margin-bottom:6px}.fbox p{font-size:16.5px;color:var(--ink2)}
.arrow{display:flex;align-items:center;color:var(--ink)}.ar{width:30px;height:30px}
.tl{position:relative}.tline{position:absolute;left:4%;right:1%;top:47px;height:3px;background:var(--ink)}
.tline:after{content:"";position:absolute;right:-4px;top:-8px;border-left:16px solid var(--ink);border-top:9px solid transparent;border-bottom:9px solid transparent}
.tcol{text-align:center}.tlab{font:700 17px/1 Inter;letter-spacing:.14em;text-transform:uppercase;color:var(--c);height:28px}
.dot{width:24px;height:24px;border-radius:50%;background:var(--c);border:4px solid var(--card);box-shadow:0 0 0 2px var(--c);margin:4px auto 22px;position:relative;z-index:2}
.tbl{width:100%;border-collapse:separate;border-spacing:0;background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 6px 18px rgba(80,50,20,.07)}
.tbl th{background:var(--navy);color:#fff;font:600 16px/1.2 Inter;letter-spacing:.08em;text-transform:uppercase;text-align:left;padding:14px 18px}
.tbl td{padding:14px 18px;border-top:1px solid var(--line);color:var(--ink2);font-size:18px;vertical-align:top}
.tbl td.k{font:700 21px/1.25 Fraunces,Georgia,serif;color:var(--ink);width:24%}
.tbl tr.hl td.k{box-shadow:inset 6px 0 0 var(--terra)}.tbl tr.hl td{background:#FDF3EA}
.cwrap{display:flex;gap:26px;align-items:center;justify-content:center}
.cyc{position:relative;flex:none}.cring{position:absolute;inset:0}
.cring ellipse{fill:none;stroke:var(--terra);stroke-width:2.5;stroke-dasharray:9 9;opacity:.7}
.cbox{position:absolute;transform:translate(-50%,-50%);width:250px;background:var(--card);border:2px solid var(--c);border-radius:14px;padding:22px 14px 12px;text-align:center;box-shadow:0 6px 16px rgba(80,50,20,.08)}
.cbox h4{font-size:20px}.cbox p{font-size:15.5px;color:var(--ink2);margin-top:4px;line-height:1.35}
.cn{position:absolute;top:-17px;left:50%;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;background:var(--c);color:#fff;font:700 17px/34px Inter;text-align:center}
.ccenter{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:330px;height:220px;border-radius:50%;background:#F4E8D6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px 34px}
.ccenter h4{font:700 25px/1.2 Fraunces,Georgia,serif}.ccenter p{font-size:16.5px;color:var(--ink2);margin-top:6px}
.card.side{width:260px;flex:none;border:2px solid var(--navy);text-align:center}.card.side h4{color:var(--ink)}.acc b{color:var(--terra)}
.cmp{background:var(--card);border:2px solid var(--c);border-radius:16px;overflow:hidden;box-shadow:0 6px 18px rgba(80,50,20,.07);padding-bottom:18px}
.cmph{background:var(--c);color:#fff;display:flex;align-items:center;justify-content:center;gap:12px;padding:15px;font:700 23px/1.2 Inter,"Segoe UI"}
.cmph .ic{width:28px;height:28px}.cmpt{padding:14px 22px 0;color:var(--c);font-weight:600;text-align:center;font-size:18px}
.plus{list-style:none;padding:8px 22px 0}.plus li{position:relative;padding-left:28px;margin:9px 0;color:var(--ink2);font-size:18px}
.plus li:before{content:"+";position:absolute;left:2px;top:-4px;font:700 26px/1 Inter;color:var(--c)}
.cmp .pill{margin:12px 22px 0;text-align:center}
.step{display:flex;gap:16px;align-items:flex-start;background:var(--card);border:1px solid var(--line);border-left:5px solid var(--c);border-radius:12px;padding:14px 16px;box-shadow:0 4px 12px rgba(80,50,20,.05)}
.sn{flex:none;width:38px;height:38px;border-radius:50%;background:var(--ct);color:var(--c);font:700 19px/38px Fraunces,Georgia,serif;text-align:center}
.step h5{font:700 20px/1.25 Inter,"Segoe UI";color:var(--ink)}.step p{font-size:17px;color:var(--ink2);margin-top:3px}
.step>div:nth-child(2){flex:1}.stag{flex:none;align-self:center;font:700 13px/1 Inter;letter-spacing:.12em;text-transform:uppercase;color:var(--c);background:var(--ct);padding:7px 11px;border-radius:20px}
.mrow{display:grid;grid-template-columns:330px repeat(2,1fr);gap:14px;margin-bottom:12px}
.mhead{margin-bottom:8px}.mh{background:var(--c);color:#fff;border-radius:10px 10px 0 0;text-align:center;font:600 18px/1 Inter;padding:12px}
.mlab{background:var(--c);color:#fff;border-radius:12px;padding:16px;display:flex;gap:14px;align-items:center}
.mlab .ic{width:38px;height:38px;flex:none}.mlab h5{font:700 21px/1.2 Inter}.mlab p{font-size:15.5px;opacity:.92;margin-top:3px}
.mcell{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 18px;display:flex;align-items:center;color:var(--ink2);font-size:17.5px}
.stats{display:flex;background:#FBEFD9;border:1px solid #EBD3A6;border-radius:16px;padding:20px 10px}
.stat{flex:1;text-align:center;border-left:1px solid #E5CC9C;padding:0 14px}.stat:first-child{border-left:0}
.stat b{display:block;font:700 46px/1.05 Fraunces,Georgia,serif;color:var(--c)}.stat span{color:var(--ink2);font-size:17px}
.chips{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.chip{background:var(--ct);color:var(--c);border:1.5px solid var(--c);border-radius:30px;padding:9px 18px;font-weight:600;font-size:18px}
.callout{display:flex;align-items:center;gap:22px;background:var(--navy);color:#fff;border-radius:18px;padding:24px 34px;box-shadow:0 10px 24px rgba(30,43,60,.25)}
.callout .ci{width:58px;height:58px;flex:none;color:#F2C46B}.cbar{width:2px;align-self:stretch;background:rgba(255,255,255,.3)}
.cq{font:700 28px/1.25 Fraunces,Georgia,serif}.ct{font-size:18px;opacity:.85;margin-top:5px}.callout b{color:#F2C46B}
.note{text-align:center;color:var(--ink2);font-style:italic;font-size:18px}
.split{display:grid;gap:30px;align-items:stretch}.part{display:flex;flex-direction:column}.part>section{flex:1;display:flex;flex-direction:column}.part>section>.grid{flex:1}.split section:first-child{margin-top:0}
.split .grid,.split .flow{gap:14px}
footer{margin-top:34px;padding-top:20px;border-top:1px solid var(--line);text-align:center;font:700 26px/1.3 Fraunces,Georgia,serif;color:var(--terra)}
footer:before{content:"✦  ";color:var(--gold)}footer:after{content:"  ✦";color:var(--gold)}
`;

function page(spec) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Inter:wght@400;600;700&display=block" rel="stylesheet">
<style>${CSS}</style></head><body>
<header>${spec.kicker ? `<div class="kick">${t(spec.kicker)}</div>` : ""}<h1>${t(spec.title)}</h1>${
    spec.subtitle ? `<div class="sub">${t(spec.subtitle)}</div>` : ""
  }<div class="orn"></div></header>
${spec.sections.map(section).join("\n")}
${spec.footer ? `<footer>${t(spec.footer)}</footer>` : ""}
</body></html>`;
}

async function render(spec, keepHtml) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "infog-"));
  const html = path.join(tmp, "page.html");
  const png = path.join(tmp, "shot.png");
  fs.writeFileSync(html, page(spec));
  execFileSync(CHROME, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    `--force-device-scale-factor=${SCALE}`, `--window-size=${WIDTH},${spec.maxHeight || 5200}`,
    "--virtual-time-budget=6000", `--screenshot=${png}`, "file:///" + html.replace(/\\/g, "/"),
  ], { stdio: "ignore" });
  // crop the unused bottom: find the last row that differs from the page background
  const img = sharp(png);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const [br, bgc, bb] = [0xfb, 0xf5, 0xec];
  let last = info.height - 1;
  const stride = info.width * info.channels;
  outer: for (; last > 0; last--) {
    for (let x = 0; x < info.width; x += 3) {
      const o = last * stride + x * info.channels;
      if (Math.abs(data[o] - br) + Math.abs(data[o + 1] - bgc) + Math.abs(data[o + 2] - bb) > 40) break outer;
    }
  }
  const h = Math.min(info.height, last + Math.round(48 * SCALE));
  if (h >= info.height - 2) console.warn(`  ! ${spec.out}: content may exceed maxHeight; raise "maxHeight"`);
  const outs = [].concat(spec.out); // an array publishes one design to several lessons
  for (const o of outs) {
    const out = path.join(ROOT, o);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(png).extract({ left: 0, top: 0, width: info.width, height: h }).webp({ quality: 84 }).toFile(out);
    if (keepHtml) fs.copyFileSync(html, out.replace(/\.webp$/, ".debug.html"));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`  ✓ ${outs.join(', ')}  ${info.width}x${h}`);
}

const args = process.argv.slice(2);
const keep = args.includes("--html");
const files = args
  .filter((a) => a !== "--html")
  .flatMap((a) =>
    fs.statSync(a).isDirectory()
      ? fs.readdirSync(a).filter((f) => f.endsWith(".json")).map((f) => path.join(a, f))
      : [a],
  );
if (!CHROME) throw new Error("Chrome not found; set CHROME_PATH");
if (!files.length) {
  console.log("usage: render.mjs <spec.json|dir> [...] [--html]");
  process.exit(1);
}
const only = process.env.ONLY; // render just the specs whose out contains this text
for (const f of files) {
  const parsed = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const spec of [].concat(parsed)) {
    if (only && ![].concat(spec.out).some((o) => o.includes(only))) continue;
    try { await render(spec, keep); } catch (e) { console.error(`  ✗ ${f} ${spec.out}: ${e.message}`); process.exitCode = 1; }
  }
}
