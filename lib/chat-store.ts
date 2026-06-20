import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

const STORE_PATH = path.join(os.tmpdir(), "chat-store.json");

type RoomRow = { id: string; code: string; created_at: string };
type MessageRow = {
  id: number; room_id: string; session_id: string; nickname: string;
  message_type: string; content: string | null; file_url: string | null;
  file_name: string | null; file_size: number | null; deleted: boolean;
  created_at: string;
};
type StoreData = { rooms: RoomRow[]; messages: Record<string, MessageRow[]>; nextId: number };

async function readStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { rooms: [], messages: {}, nextId: 1 };
  }
}

async function writeStore(data: StoreData) {
  try { await fs.writeFile(STORE_PATH, JSON.stringify(data), "utf-8"); } catch { /* non-critical */ }
}

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
  if (isSupabaseConfigured()) {
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

  // Local fallback
  const store = await readStore();
  let code = generateCode();
  while (store.rooms.find((r) => r.code === code)) code = generateCode();
  const id = generateId();
  const room: RoomRow = { id, code, created_at: new Date().toISOString() };
  store.rooms.push(room);
  store.messages[id] = [];
  await writeStore(store);
  return { roomId: id, code, createdAt: room.created_at };
}

export async function verifyRoom(code: string) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("chat_rooms").select("id, code, created_at").eq("code", code).maybeSingle();
    if (error) return { error: error.message };
    if (!data) return { error: "Room not found" };
    return { roomId: data.id, code: data.code, createdAt: data.created_at };
  }

  const store = await readStore();
  const room = store.rooms.find((r) => r.code === code);
  if (!room) return { error: "Room not found" };
  return { roomId: room.id, code: room.code, createdAt: room.created_at };
}

// ─── Message operations ───

export async function getMessages(roomId: string) {
  if (isSupabaseConfigured()) {
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

  const store = await readStore();
  const msgs = (store.messages[roomId] || []).filter((m) => !m.deleted);
  return { messages: msgs };
}

export async function createMessage(params: {
  roomId: string; sessionId: string; nickname: string;
  messageType?: string; content?: string | null;
  fileUrl?: string | null; fileName?: string | null; fileSize?: number | null;
}) {
  if (isSupabaseConfigured()) {
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

  const store = await readStore();
  const msg: MessageRow = {
    id: store.nextId++, room_id: params.roomId, session_id: params.sessionId,
    nickname: params.nickname.trim().slice(0, 50),
    message_type: params.messageType || "text",
    content: params.content?.trim().slice(0, 2000) || null,
    file_url: params.fileUrl || null, file_name: params.fileName?.slice(0, 255) || null,
    file_size: params.fileSize || null, deleted: false,
    created_at: new Date().toISOString(),
  };
  if (!store.messages[params.roomId]) store.messages[params.roomId] = [];
  store.messages[params.roomId].push(msg);
  await writeStore(store);
  return { message: msg };
}

export async function deleteMessage(messageId: number, sessionId: string) {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    const { data: msg } = await supabase.from("chat_messages").select("session_id").eq("id", messageId).single();
    if (!msg) return { error: "Message not found" };
    if (msg.session_id !== sessionId) return { error: "You can only delete your own messages" };
    const { error } = await supabase.from("chat_messages").update({ deleted: true }).eq("id", messageId);
    if (error) return { error: error.message };
    return { ok: true };
  }

  const store = await readStore();
  for (const roomMsgs of Object.values(store.messages)) {
    const m = roomMsgs.find((msg) => msg.id === messageId);
    if (m) {
      if (m.session_id !== sessionId) return { error: "You can only delete your own messages" };
      m.deleted = true;
      await writeStore(store);
      return { ok: true };
    }
  }
  return { error: "Message not found" };
}
