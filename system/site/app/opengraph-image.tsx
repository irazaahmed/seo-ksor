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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 22,
              backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1e3a8a 100%)",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 256 256" fill="none">
              <path
                d="M54 58 h148 a26 26 0 0 1 26 26 v82 a26 26 0 0 1 -26 26 H124 l-40 36 v-36 H54 a26 26 0 0 1 -26 -26 V84 a26 26 0 0 1 26 -26 Z"
                fill="#ffffff"
              />
              <circle cx="120" cy="116" r="33" stroke="#2f3fc4" strokeWidth="16" />
              <line
                x1="143"
                y1="139"
                x2="171"
                y2="167"
                stroke="#2f3fc4"
                strokeWidth="18"
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
