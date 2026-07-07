import { NextResponse } from "next/server";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_type, created_at, metadata, duration_ms")
      .eq("experience_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const events = (data ?? []).map((e) => ({
      eventType: e.event_type,
      createdAt: e.created_at,
      metadata: e.metadata ?? {},
      durationMs: e.duration_ms ?? null,
    }));

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
  }
}
