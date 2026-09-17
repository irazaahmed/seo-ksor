import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

/**
 * The iOS home-screen icon — same mark as `icon.tsx`, at Apple's own
 * requested size, with the rounded-square background iOS otherwise adds
 * itself with its own (inconsistent) corner radius.
 */
export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #1d4ed8 60%, #1e3a8a 100%)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 48 48" fill="none">
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
