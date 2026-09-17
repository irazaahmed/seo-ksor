import { useId, type ReactElement } from "react";

/**
 * The record's own mark: a magnifying glass over a rising bar chart — reading
 * the record, and what reading it is for. Drawn once, as paths rather than a
 * checked-in raster, so every place that needs it (navbar, favicon, apple
 * touch icon, the link-preview image, the cover) asks for it at whatever size
 * it needs and gets a crisp result instead of a scaled bitmap.
 *
 * `currentColor`, deliberately: a consumer sets color with an ordinary
 * `text-*` class or inline `color`, the same way any icon font would, rather
 * than this component owning a hardcoded brand blue that would need editing
 * in two places the day the accent changes (`global.css`'s `--primary`).
 */
export function BrandMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}): ReactElement {
  // `clipPath` needs an id unique per instance — this mark renders more than
  // once on the same page (navbar + hero), and a duplicate id would clip the
  // second instance's bars against the first instance's circle.
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="12" />
        </clipPath>
      </defs>
      {/* The rising bars, clipped to the lens so they read as findings inside
          it rather than shapes that happen to overlap it. */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="12.5" y="21" width="4.5" height="9" rx="1.4" fill="currentColor" />
        <rect x="18.75" y="15" width="4.5" height="15" rx="1.4" fill="currentColor" />
        <rect x="25" y="9" width="4.5" height="21" rx="1.4" fill="currentColor" />
      </g>
      {/* The lens, drawn last so its ring sits crisp over the bars' edges. */}
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="4" />
      <line
        x1="29"
        y1="29"
        x2="39.5"
        y2="39.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
