import { NextRequest, NextResponse } from "next/server";
import { setExperienceReaction } from "@/lib/experiences";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { reaction?: string };
  if (!body.reaction) return NextResponse.json({ error: "Missing reaction." }, { status: 400 });
  const { ok, error } = await setExperienceReaction(id, body.reaction);
  if (!ok) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
