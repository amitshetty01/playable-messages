import { NextResponse } from "next/server";
import { getDailyPrompt } from "@/lib/mood-prompts";

export async function GET() {
  const prompt = getDailyPrompt();
  return NextResponse.json({ ok: true, prompt });
}
