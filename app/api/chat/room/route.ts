import { NextResponse } from "next/server";
import { createRoom } from "@/lib/chat-store";

export async function POST() {
  const result = await createRoom();
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json(result);
}
