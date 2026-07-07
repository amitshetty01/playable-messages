import { NextRequest, NextResponse } from "next/server";
import { markExperienceViewed, deleteExperience, getExperience } from "@/lib/experiences";
import { validateOrigin } from "@/lib/api-guard";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const origin = validateOrigin(request);
  if (origin.error) return origin.error;
  const { id } = await params;
  const existing = await getExperience(id);
  if (existing.error) return NextResponse.json({ error: existing.error }, { status: 404 });
  await markExperienceViewed(id);
  if (existing.data?.viewOnce) {
    setTimeout(async () => { await deleteExperience(id); }, 0);
  }
  return NextResponse.json({ ok: true });
}
