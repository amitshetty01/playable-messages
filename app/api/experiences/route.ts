import { NextResponse } from "next/server";
import { createExperience } from "@/lib/experiences";
import { validateOrigin, validateBody } from "@/lib/api-guard";

export async function POST(request: Request) {
  const origin = validateOrigin(request);
  if (origin.error) return origin.error;

  try {
    const body = await request.json() as Record<string, unknown>;
    const fieldError = validateBody(body, ["templateId", "finalMessage"]);
    if (fieldError) return NextResponse.json({ error: fieldError }, { status: 400 });

    const { data, error } = await createExperience(body);
    if (error || !data) {
      return NextResponse.json({ error: error || "Could not create experience." }, { status: 503 });
    }
    return NextResponse.json({ id: data.id, experience: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
  }
}
