import { NextRequest, NextResponse } from "next/server";
import { updateExperience, getExperience } from "@/lib/experiences";
import { validateOrigin } from "@/lib/api-guard";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const origin = validateOrigin(request);
  if (origin.error) return origin.error;

  const { id } = await params;

  const existing = await getExperience(id);
  if (existing.error) {
    return NextResponse.json({ error: existing.error }, { status: 404 });
  }

  const body = await request.json() as Record<string, unknown>;
  body.id = id;
  const result = await updateExperience(body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ id });
}
