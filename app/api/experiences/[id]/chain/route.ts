import { NextRequest, NextResponse } from "next/server";
import { addChainContribution, getChainContributions } from "@/lib/experiences";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await getChainContributions(id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ contributions: data });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { contributorName?: string; message?: string; contributionType?: string };
  if (!body.message?.trim()) return NextResponse.json({ error: "Missing message." }, { status: 400 });
  const { data, isComplete, contributionsCount, error } = await addChainContribution(id, {
    contributorName: body.contributorName || "Someone",
    message: body.message,
    contributionType: body.contributionType || "text",
  });
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true, isComplete: !!isComplete, contributionsCount: contributionsCount ?? 0 });
}
