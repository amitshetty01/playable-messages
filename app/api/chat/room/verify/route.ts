import { NextResponse } from "next/server";
import { verifyRoom } from "@/lib/chat-store";

export async function POST(request: Request) {
  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Room code is required" }, { status: 400 });
  }
  const result = await verifyRoom(code.trim().toLowerCase());
  if (result.error) {
    const status = result.error === "Room not found" ? 404 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result);
}
