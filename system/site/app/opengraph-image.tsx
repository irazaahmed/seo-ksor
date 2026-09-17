import { ImageResponse } from "next/og";

import { appTitle, appDescription } from "@/lib/shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Baked into the static export at build time — the same posture the site's
// other generated routes (llms.txt, /md/*) already take.
export const dynamic = "force-static";

/**
 * The link preview a reader sees before they click — WhatsApp, LinkedIn,
 * X/Twitter, Slack. Generated at build time from the record's own title and
 * description (never authored copy), so it stays true the day either
 * changes. System fonts only, matching the rest of this scaffold's
 * offline-build posture (see app/layout.tsx).
 */
export default function OpengraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0b1220",
          backgroundImage: "linear-gradient(135deg, #0b1220 0%, #14245c 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* The same mark as icon.tsx/apple-icon.tsx (duplicated, not
              imported — ImageResponse renders through Satori, not a real DOM,
              so components/brand-mark.tsx's useId() hook can't run here). */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 22,
              backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #1d4ed8 60%, #1e3a8a 100%)",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
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
              <line
                x1="29"
                y1="29"
                x2="39.5"
                y2="39.5"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: 40,
              color: "#8fb4ff",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            System of Record
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontFamily: "Georgia, serif",
            fontSize: 96,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.05,
          }}
        >
          {appTitle}
        </div>

        {appDescription === null ? null : (
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              color: "#b7c4e6",
              maxWidth: 980,
              lineHeight: 1.4,
            }}
          >
            {appDescription}
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
