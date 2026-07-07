import { NextRequest, NextResponse } from "next/server";
import { setExperienceReply } from "@/lib/experiences";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { reply?: string; reactionEmoji?: string };
  if (!body.reply && !body.reactionEmoji) {
    return NextResponse.json({ error: "Missing reply or reaction." }, { status: 400 });
  }
  const { ok, error } = await setExperienceReply(id, body.reply ?? "", body.reactionEmoji);
  if (!ok) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
