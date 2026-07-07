import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo";

export const runtime = "edge";

function getEmoji(templateName?: string | null): string {
  if (!templateName) return "💌";
  const lower = templateName.toLowerCase();
  if (lower.includes("birthday") || lower.includes("blow") || lower.includes("cake") || lower.includes("candle")) return "🎂";
  if (lower.includes("love") || lower.includes("romantic") || lower.includes("heart") || lower.includes("crush")) return "💌";
  if (lower.includes("sorry") || lower.includes("apology") || lower.includes("repair")) return "💔";
  if (lower.includes("funny") || lower.includes("roast") || lower.includes("joke")) return "😂";
  if (lower.includes("mystery") || lower.includes("secret") || lower.includes("hidden")) return "🔮";
  if (lower.includes("friend") || lower.includes("memory") || lower.includes("nostalgia")) return "💓";
  return "💌";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || siteName;
    const description = searchParams.get("description") || "Create interactive messages people actually feel.";
    const type = searchParams.get("type") || "website";
    const receiverName = searchParams.get("receiverName");
    const templateName = searchParams.get("templateName");

    if (type === "message") {
      const displayName = receiverName || "Someone";
      const badge = templateName || "Interactive Message";
      const emoji = getEmoji(templateName);

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
              {badge.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 120,
                lineHeight: 1.4,
                marginTop: 20,
              }}
            >
              {emoji}
            </div>
            <div
              style={{
                fontSize: 92,
                fontWeight: 900,
                letterSpacing: -5,
                lineHeight: 1,
                marginTop: 10,
                maxWidth: 900,
              }}
            >
              {displayName}
            </div>
            <div
              style={{
                color: "#fff8f1",
                fontSize: 34,
                lineHeight: 1.25,
                marginTop: 16,
                maxWidth: 820,
                textShadow: "0 0 20px rgba(255,248,241,0.5), 0 0 40px rgba(255,248,241,0.3)",
              }}
            >
              Open to play
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const defaultDescription = receiverName
      ? `A secret message for ${receiverName}... Open to play.`
      : description;

    const badge = templateName || type;

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
            {badge.toUpperCase()}
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
            {defaultDescription}
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
