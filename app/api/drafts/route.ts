import { NextResponse } from "next/server";
import { createDraft, updateDraft, getDraftByCode, deleteDraft } from "@/lib/draft-service";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      templateId?: string;
      formState?: Record<string, unknown>;
      draftId?: string;
    };

    if (body.draftId) {
      const { data, error } = await updateDraft(body.draftId, {
        templateId: body.templateId,
        formState: body.formState,
      });
      if (error) return NextResponse.json({ error }, { status: 500 });
      return NextResponse.json({ data }, { status: 200 });
    }

    if (!body.templateId) {
      return NextResponse.json({ error: "templateId is required for new drafts." }, { status: 400 });
    }

    const { data, error } = await createDraft({
      templateId: body.templateId,
      formState: body.formState ?? {},
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Failed to save draft:", err);
    return NextResponse.json({ error: "Failed to save draft." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing resume code." }, { status: 400 });
  }

  const { data, error } = await getDraftByCode(code);
  if (error) return NextResponse.json({ error }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Draft not found." }, { status: 404 });

  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json() as { draftId: string };
    if (!body.draftId) {
      return NextResponse.json({ error: "Missing draftId." }, { status: 400 });
    }
    const { ok, error } = await deleteDraft(body.draftId);
    if (!ok) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Failed to delete draft:", err);
    return NextResponse.json({ error: "Failed to delete draft." }, { status: 500 });
  }
}
