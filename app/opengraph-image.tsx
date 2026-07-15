import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo";

export const alt = "Craft Your Message interactive message generator";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg,#1a1018 0%,#3d2140 52%,#e89ab5 100%)",
          color: "#faf3ed",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: 80,
          textAlign: "center",
          width: "100%"
        }}
      >
        <div style={{ border: "2px solid rgba(255,255,255,.28)", borderRadius: 999, fontSize: 30, fontWeight: 800, letterSpacing: 2, padding: "18px 32px" }}>INTERACTIVE MESSAGE LINKS</div>
        <div style={{ fontSize: 92, fontWeight: 900, letterSpacing: -5, lineHeight: 1, marginTop: 38 }}>{siteName}</div>
        <div style={{ color: "rgba(255,248,241,.78)", fontSize: 34, lineHeight: 1.25, marginTop: 28, maxWidth: 820 }}>Create apology, birthday, friendship, confession, and funny roast messages people want to open.</div>
      </div>
    ),
    size
  );
}
