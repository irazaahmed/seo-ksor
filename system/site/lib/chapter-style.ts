import {
  BookA,
  Compass,
  FileText,
  Gauge,
  KeyRound,
  LayoutTemplate,
  Link2,
  MapPin,
  PenLine,
  Plug,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Each chapter's sidebar identity: an icon and a colour TONE, keyed by the
 * chapter's directory slug. Presentation only — the record names no icon and
 * no colour, so this lives in the site and a chapter the map does not know
 * still renders, with the fallback below.
 *
 * Nine chapters in one accent colour read as nine identical grey rows
 * (owner, 2026-09-24: "Chapters ki UI achi nahi lag rahi"). A tone per chapter
 * lets a reader find a chapter by its colour and shape before reading its
 * name, the way a printed book's section tabs work. The tones themselves are
 * hues defined once in global.css (`.ksor-tone-*`).
 */
export interface ChapterStyle {
  readonly icon: LucideIcon;
  readonly tone: string;
}

const CHAPTERS: Record<string, ChapterStyle> = {
  "niche-research": { icon: Compass, tone: "violet" },
  "keyword-research-and-content-planning": { icon: KeyRound, tone: "sky" },
  "content-writing": { icon: PenLine, tone: "pink" },
  wordpress: { icon: LayoutTemplate, tone: "blue" },
  "on-page-and-technical-seo": { icon: Gauge, tone: "emerald" },
  "apk-websites": { icon: Smartphone, tone: "amber" },
  "off-page-seo": { icon: Link2, tone: "orange" },
  "local-seo": { icon: MapPin, tone: "rose" },
  "quick-skills": { icon: Zap, tone: "lime" },
  etsy: { icon: ShoppingBag, tone: "orange" },
};

const FALLBACK: ChapterStyle = { icon: FileText, tone: "blue" };

export function chapterStyle(slug: string): ChapterStyle {
  return CHAPTERS[slug] ?? FALLBACK;
}

/** The loose top-level documents' icons, keyed by their slug. */
const DOCUMENTS: Record<string, LucideIcon> = {
  glossary: BookA,
  "connect-claude-and-chatgpt": Plug,
  "why-seo-matters": Sparkles,
};

export function documentIcon(slug: string): LucideIcon {
  return DOCUMENTS[slug] ?? FileText;
}
