import { NextResponse } from "next/server";
import { getMessages, createMessage, deleteMessage, editMessage, toggleReaction } from "@/lib/chat-store";
import { validateOrigin, validateBody } from "@/lib/api-guard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("room");
  if (!roomId) return NextResponse.json({ error: "room parameter is required" }, { status: 400 });

  const result = await getMessages(roomId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ messages: result.messages });
}

export async function POST(request: Request) {
  const origin = validateOrigin(request);
  if (origin.error) return origin.error;

  const body = await request.json();
  const fieldError = validateBody(body, ["roomId", "sessionId", "nickname"]);
  if (fieldError) return NextResponse.json({ error: fieldError }, { status: 400 });

  const { roomId, sessionId, nickname, messageType, content, fileUrl, fileName, fileSize } = body;
  const result = await createMessage({ roomId, sessionId, nickname, messageType, content, fileUrl, fileName, fileSize });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ message: result.message });
}

export async function PATCH(request: Request) {
  const origin = validateOrigin(request);
  if (origin.error) return origin.error;

  const body = await request.json();
  const fieldError = validateBody(body, ["messageId", "sessionId"]);
  if (fieldError) return NextResponse.json({ error: fieldError }, { status: 400 });

  const { messageId, sessionId, action, content, emoji } = body;

  if (action === "edit") {
    if (!content) return NextResponse.json({ error: "content is required for edit" }, { status: 400 });
    const result = await editMessage(messageId, sessionId, content);
    if (result.error) {
      const status = result.error === "You can only edit your own messages" ? 403 : 404;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "react") {
    if (!emoji) return NextResponse.json({ error: "emoji is required for react" }, { status: 400 });
    const result = await toggleReaction(messageId, sessionId, emoji);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  const result = await deleteMessage(messageId, sessionId);
  if (result.error) {
    const status = result.error === "You can only delete your own messages" ? 403 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json({ ok: true });
}
