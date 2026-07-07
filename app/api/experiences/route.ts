import { NextResponse } from "next/server";
import { createExperience } from "@/lib/experiences";
import { validateOrigin, validateBody } from "@/lib/api-guard";

const ALLOWED_FIELDS = [
  "templateId", "finalMessage", "creatorName", "receiverName", "relationshipTag",
  "showCreatorName", "tone", "theme", "customMessages", "images", "customPassword",
  "passwordQuestion", "passwordAnswer", "togetherSince", "expiresAt", "scheduledAt",
  "lockType", "lockValue", "giftSongUrl", "giftSongTitle", "isReply", "replyToId", "category",
  "isChain", "chainTarget",
] as const;

export async function POST(request: Request) {
  const origin = validateOrigin(request);
  if (origin.error) return origin.error;

  try {
    const body = await request.json() as Record<string, unknown>;
    const fieldError = validateBody(body, ["templateId", "finalMessage"]);
    if (fieldError) return NextResponse.json({ error: fieldError }, { status: 400 });

    const payload: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) payload[key] = body[key];
    }

    const { data, error } = await createExperience(payload);
    if (error || !data) {
      return NextResponse.json({ error: error || "Could not create experience." }, { status: 503 });
    }
    return NextResponse.json({ id: data.id, experience: data }, { status: 201 });
  } catch (error) {
    console.error("Failed to create experience:", error);
    return NextResponse.json({ error: "Failed to create experience." }, { status: 400 });
  }
}
