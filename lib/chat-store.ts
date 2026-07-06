import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";



const ADJECTIVES = [
  "swift", "calm", "bold", "quiet", "bright", "dark", "cool", "warm",
  "keen", "safe", "pure", "rare", "soft", "tall", "vast", "wild",
  "amber", "coral", "crisp", "divine", "eager", "fuzzy", "gentle", "holy",
];
const NOUNS = [
  "tiger", "river", "storm", "forest", "moon", "cloud", "flame", "stone",
  "eagle", "ocean", "peak", "dawn", "frost", "bloom", "cove", "vale",
  "brook", "crane", "dove", "ember", "grove", "hawk", "iris", "jade",
];

function generateCode() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = String(Math.floor(Math.random() * 100)).padStart(2, "0");
  return `${adj}-${noun}-${num}`;
}

function generateId() {
  return Math.random().toString(36).slice(2, 12);
}

// ─── Room operations ───

export async function createRoom() {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured. Add Supabase environment variables." };
  }

  const supabase = getSupabaseServerClient();
  let code = generateCode();
  for (let i = 0; i < 10; i++) {
    const { data: existing } = await supabase.from("chat_rooms").select("id").eq("code", code).maybeSingle();
    if (!existing) break;
    code = generateCode();
  }
  const id = generateId();
  const { data, error } = await supabase.from("chat_rooms").insert({ id, code }).select("*").single();
  if (error) return { error: error.message };
  return { roomId: data.id, code: data.code, createdAt: data.created_at };
}

export async function verifyRoom(code: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured. Add Supabase environment variables." };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("chat_rooms").select("id, code, created_at").eq("code", code).maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: "Room not found" };
  return { roomId: data.id, code: data.code, createdAt: data.created_at };
}

// ─── Message operations ───

export async function getMessages(roomId: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_id", roomId)
    .eq("deleted", false)
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) return { error: error.message };
  return { messages: data };
}

export async function createMessage(params: {
  roomId: string; sessionId: string; nickname: string;
  messageType?: string; content?: string | null;
  fileUrl?: string | null; fileName?: string | null; fileSize?: number | null;
}) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("chat_messages").insert({
    room_id: params.roomId, session_id: params.sessionId,
    nickname: params.nickname.trim().slice(0, 50),
    message_type: params.messageType || "text",
    content: params.content?.trim().slice(0, 2000) || null,
    file_url: params.fileUrl || null, file_name: params.fileName?.slice(0, 255) || null,
    file_size: params.fileSize || null,
  }).select("*").single();
  if (error) return { error: error.message };
  return { message: data };
}

export async function deleteMessage(messageId: number, sessionId: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data: msg } = await supabase.from("chat_messages").select("session_id").eq("id", messageId).single();
  if (!msg) return { error: "Message not found" };
  if (msg.session_id !== sessionId) return { error: "You can only delete your own messages" };
  const { error } = await supabase.from("chat_messages").update({ deleted: true }).eq("id", messageId);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function editMessage(messageId: number, sessionId: string, content: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data: msg } = await supabase.from("chat_messages").select("session_id").eq("id", messageId).single();
  if (!msg) return { error: "Message not found" };
  if (msg.session_id !== sessionId) return { error: "You can only edit your own messages" };
  const { error } = await supabase.from("chat_messages").update({ content: content.trim().slice(0, 2000), edited_at: new Date().toISOString() }).eq("id", messageId);
  if (error) return { error: error.message };
  return { ok: true };
}

export async function toggleReaction(messageId: number, sessionId: string, emoji: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = getSupabaseServerClient();
  const { data: msg } = await supabase.from("chat_messages").select("reactions").eq("id", messageId).single();
  if (!msg) return { error: "Message not found" };
  const reactions: Record<string, string[]> = msg.reactions || {};
  const users = reactions[emoji] || [];
  const idx = users.indexOf(sessionId);
  if (idx >= 0) users.splice(idx, 1);
  else users.push(sessionId);
  reactions[emoji] = users;
  const { error } = await supabase.from("chat_messages").update({ reactions }).eq("id", messageId);
  if (error) return { error: error.message };
  return { ok: true };
}
