/**
 * A chapter's DISPLAY name, from the folder name fumadocs derives off the
 * directory slug ("on-page-and-technical-seo" -> "On page and technical seo").
 *
 * Display only. The regenerated `index.md` headings come from
 * `record/index-file.ts`'s `humanise()`, which is part of the governed build,
 * so the fix lives here in the site instead of changing what the record
 * writes. Every surface that shows a chapter name to a reader (sidebar,
 * breadcrumb, folder page heading) goes through this one function.
 */

// Words a plain sentence-case pass gets wrong: acronyms and brand names.
const TERMS: Record<string, string> = {
  ai: "AI",
  apk: "APK",
  gbp: "GBP",
  nlp: "NLP",
  saas: "SaaS",
  seo: "SEO",
  serp: "SERP",
  ugc: "UGC",
  wordpress: "WordPress",
};

// Compound modifiers the slug loses its hyphen for.
const PHRASES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bon page\b/gi, "on-page"],
  [/\boff page\b/gi, "off-page"],
];

export function chapterLabel(name: string): string {
  let out = name
    .split(/(\s+)/)
    .map((word) => TERMS[word.toLowerCase()] ?? word)
    .join("");
  for (const [pattern, replacement] of PHRASES) out = out.replace(pattern, replacement);
  return out.charAt(0).toUpperCase() + out.slice(1);
}
