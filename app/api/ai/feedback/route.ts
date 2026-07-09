import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const VALID_FEEDBACK = ["positive", "negative"] as const;
const VALID_SOURCES = ["explicit", "implicit_generate", "implicit_customize", "implicit_regenerate"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conceptId, conceptTitle, templateType, vibe, visualStyle, feedbackType, source } = body;

    if (!conceptId || typeof conceptId !== "string") {
      return NextResponse.json({ error: "conceptId is required" }, { status: 400 });
    }
    if (!feedbackType || !VALID_FEEDBACK.includes(feedbackType)) {
      return NextResponse.json({ error: `feedbackType must be one of: ${VALID_FEEDBACK.join(", ")}` }, { status: 400 });
    }
    if (!source || !VALID_SOURCES.includes(source)) {
      return NextResponse.json({ error: `source must be one of: ${VALID_SOURCES.join(", ")}` }, { status: 400 });
    }

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from("ai_feedback").insert({
        concept_id: conceptId,
        concept_title: conceptTitle?.slice(0, 200) || "",
        template_type: templateType?.slice(0, 100) || "",
        vibe: vibe?.slice(0, 200) || "",
        visual_style: visualStyle?.slice(0, 200) || "",
        feedback_type: feedbackType,
        source,
        tone: body.tone?.slice(0, 50) || null,
        occasion: body.occasion?.slice(0, 50) || null,
        recipient: body.recipient?.slice(0, 50) || null,
      });

      if (error) {
        console.error("[Feedback DB Error]", error.message);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[Feedback Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
