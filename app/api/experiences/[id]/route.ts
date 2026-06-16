import { NextRequest, NextResponse } from "next/server";
import { updateExperience, getExperience } from "@/lib/experiences";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
