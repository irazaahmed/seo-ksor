import { ArrowRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

import { chapterStyle } from "@/lib/chapter-style";
import { entriesUnder, folderHeading } from "@/lib/source";

/** The last segment of a bundle-relative directory: the chapter-style key. */
function slugOf(dir: string): string {
  return dir.slice(dir.lastIndexOf("/") + 1);
}

/** The directory a document path sits in ("" for a top-level document). */
function dirOf(path: string): string {
  return path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
}

/**
 * The head of a section page: the chapter's own icon, where it sits
 * in the course, what it holds, and a way straight into its first lesson.
 *
 * Built only from the record's tree and the site's chapter map — the heading
 * is the folder's display name, the counts are what the stage holds — so it
 * authors nothing (critical rule 1). It replaces the bare title the page used
 * to open on, which gave a reader no sense of the chapter they had entered
 * (owner, 2026-10-22).
 */
export function SectionHero({ dir }: { dir: string }): ReactElement {
  const { icon: Icon } = chapterStyle(slugOf(dir));
  const entries = entriesUnder(dir);
  const sections = entries.filter((e) => e.documents > 0);
  const lessons = entries.filter((e) => e.documents === 0);
  const total = lessons.length + sections.reduce((n, e) => n + e.documents, 0);
  const parts = dir.split("/");
  const trail = parts.slice(0, -1).map((_, i) => folderHeading(parts.slice(0, i + 1).join("/")));
  const first = lessons[0] ?? sections[0] ?? null;

  return (
    <header className="ksor-hero">
      <span className="ksor-hero-glow" aria-hidden />
      <span className="ksor-hero-icon" aria-hidden>
        <Icon />
      </span>
      <p className="ksor-hero-eyebrow">{trail.length === 0 ? "Chapter" : trail.join("  /  ")}</p>
      <h1 className="ksor-hero-title">{folderHeading(dir)}</h1>
      <div className="ksor-hero-stats">
        <span>
          <BookOpen aria-hidden />
          {`${total} ${total === 1 ? "lesson" : "lessons"}`}
        </span>
        {sections.length === 0 ? null : (
          <span>
            <Layers aria-hidden />
            {`${sections.length} ${sections.length === 1 ? "section" : "sections"}`}
          </span>
        )}
        {first === null ? null : (
          <Link href={first.url} className="ksor-hero-cta">
            {first.documents > 0 ? "Open the first section" : "Start lesson 01"}
            <ArrowRight aria-hidden />
          </Link>
        )}
      </div>
    </header>
  );
}

/**
 * The line above a lesson's title: which chapter it belongs to, in the
 * site's accent, and where it sits in it ("Lesson 3 of 9"). Links back to
 * the chapter. Renders nothing for a top-level document, which has no chapter.
 */
export function LessonEyebrow({ path, url }: { path: string; url: string }): ReactElement | null {
  const dir = dirOf(path);
  if (dir === "") return null;
  const { icon: Icon } = chapterStyle(slugOf(dir));
  const lessons = entriesUnder(dir).filter((e) => e.documents === 0);
  const at = lessons.findIndex((e) => e.url === url);
  return (
    <p className="ksor-eyebrow">
      <Link href={`/docs/${dir}`} className="ksor-eyebrow-chip">
        <span className="ksor-eyebrow-icon" aria-hidden>
          <Icon />
        </span>
        {folderHeading(dir)}
      </Link>
      {at === -1 ? null : <span className="ksor-eyebrow-pos">{`Lesson ${at + 1} of ${lessons.length}`}</span>}
    </p>
  );
}
