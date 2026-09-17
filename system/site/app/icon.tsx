import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
// Baked into the static export at build time, same posture as every other
// generated route here (llms.txt, /md/*, opengraph-image).
export const dynamic = "force-static";

/**
 * The browser-tab favicon, generated rather than a checked-in raster: same
 * glyph as `components/brand-mark.tsx` (the browser-safe version, which uses
 * a React hook this build-time renderer doesn't run), duplicated here as
 * plain SVG because `ImageResponse` renders through Satori, not a real DOM —
 * no hooks, so a static clip-path id is used instead of `useId()`. Only one
 * instance of this glyph ever renders per image, so the static id can't
 * collide with anything.
 */
export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #1d4ed8 60%, #1e3a8a 100%)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
          <defs>
            <clipPath id="lens-clip">
              <circle cx="20" cy="20" r="12" />
            </clipPath>
          </defs>
          <g clipPath="url(#lens-clip)">
            <rect x="12.5" y="21" width="4.5" height="9" rx="1.4" fill="#ffffff" />
            <rect x="18.75" y="15" width="4.5" height="15" rx="1.4" fill="#ffffff" />
            <rect x="25" y="9" width="4.5" height="21" rx="1.4" fill="#ffffff" />
          </g>
          <circle cx="20" cy="20" r="12" stroke="#ffffff" strokeWidth="4" />
          <line x1="29" y1="29" x2="39.5" y2="39.5" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
