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
              backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 256 256" fill="none">
              <circle cx="108" cy="108" r="52" stroke="#fff" strokeWidth="18" />
              <line
                x1="147"
                y1="147"
                x2="196"
                y2="196"
                stroke="#fff"
                strokeWidth="20"
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
