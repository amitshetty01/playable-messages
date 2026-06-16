import { NextResponse } from "next/server";
import { createExperience } from "@/lib/experiences";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const { data, error } = await createExperience(body);
    if (error || !data) {
      return NextResponse.json({ error: error || "Could not create experience." }, { status: 503 });
    }
    return NextResponse.json({ id: data.id, experience: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
  }
}
