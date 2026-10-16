"use client";

import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Check, Expand, Share2 } from "lucide-react";
import { type ComponentProps, useState } from "react";

/**
 * A class infographic: an image whose alt text starts with `Infographic`.
 *
 * The record writes it as plain CommonMark (`![Infographic: …](x.jpeg)`), so
 * every other reader shows an ordinary image. Here it becomes a card a student
 * can use on a phone: tap the image to zoom it in place, "Open full size" to
 * get the raw file in the browser where pinch zoom works without limit, and
 * "Share" to hand the image's own link to the phone's share sheet (or copy it
 * where there is none).
 *
 * Every element is a `span`: markdown puts a lone image inside a `<p>`, and a
 * `<figure>` or `<div>` there is invalid HTML that React refuses to hydrate.
 */

const INFOGRAPHIC_ALT = /^infographic\b[:\s]*/i;

type ImgProps = ComponentProps<typeof ImageZoom>;

function srcOf(src: ImgProps["src"]): string {
  if (typeof src === "string") return src;
  if (src && typeof src === "object") return "default" in src ? src.default.src : src.src;
  return "";
}

export function Infographic(props: ImgProps) {
  const [copied, setCopied] = useState(false);
  const src = srcOf(props.src);
  const caption = (props.alt ?? "").replace(INFOGRAPHIC_ALT, "").trim();

  async function share() {
    const url = new URL(src, window.location.href).href;
    const title = caption || document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // The reader closed the share sheet: that is an answer, not a failure.
        if ((error as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <span className="ksor-infographic not-prose">
      <span className="ksor-infographic-head">
        <span className="ksor-infographic-badge">Class infographic</span>
        <span className="ksor-infographic-hint">Tap the image to zoom</span>
      </span>
      <span className="ksor-infographic-frame">
        <ImageZoom {...props} className="ksor-infographic-img" />
      </span>
      {caption ? <span className="ksor-infographic-caption">{caption}</span> : null}
      <span className="ksor-infographic-actions">
        <a className="ksor-infographic-btn" href={src} target="_blank" rel="noopener">
          <Expand aria-hidden className="size-4" />
          Open full size
        </a>
        <button type="button" className="ksor-infographic-btn" onClick={share}>
          {copied ? (
            <Check aria-hidden className="size-4" />
          ) : (
            <Share2 aria-hidden className="size-4" />
          )}
          {copied ? "Link copied" : "Share"}
        </button>
      </span>
    </span>
  );
}
