import { NextResponse } from "next/server";
import { trackExperienceEvent } from "@/lib/experiences";
import type { AnalyticsPayload } from "@/lib/types";

const allowedEvents = new Set(["experience_opened", "experience_completed", "selected_mood_choice", "final_cta_clicked", "template_used"]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as AnalyticsPayload;
    if (!allowedEvents.has(body.eventType)) {
      return NextResponse.json({ error: "Unsupported analytics event." }, { status: 400 });
    }

    const result = await trackExperienceEvent(id, {
      eventType: body.eventType,
      templateId: body.templateId?.slice(0, 80),
      choice: body.choice?.slice(0, 80)
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
  }
}
