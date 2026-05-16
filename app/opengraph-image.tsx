import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OverturnIt — Spell check for health insurance denials";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #14b8a6 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0f766e",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            O
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.5 }}>
            OverturnIt
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            Spell check for health insurance denials.
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: "#ccfbf1",
              maxWidth: 900,
            }}
          >
            75% of appeals win. Less than 1% are filed.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 24, color: "#a7f3d0" }}>
            Paste your denial → drafted appeal in 60 seconds.
          </div>
          <div style={{ fontSize: 22, color: "#a7f3d0", fontFamily: "monospace" }}>
            overturnit.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
