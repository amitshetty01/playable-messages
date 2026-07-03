import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || siteName;
    const description = searchParams.get("description") || "Create interactive messages people actually feel.";
    const type = searchParams.get("type") || "website";

    return new ImageResponse(
      (
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(135deg,#15101f 0%,#312345 52%,#f6b1c9 100%)",
            color: "#fff8f1",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Arial, sans-serif",
            height: "100%",
            justifyContent: "center",
            padding: 80,
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              border: "2px solid rgba(255,255,255,.28)",
              borderRadius: 999,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 2,
              padding: "18px 32px",
            }}
          >
            {type.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: -5,
              lineHeight: 1,
              marginTop: 38,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "rgba(255,248,241,.78)",
              fontSize: 34,
              lineHeight: 1.25,
              marginTop: 28,
              maxWidth: 820,
            }}
          >
            {description}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
