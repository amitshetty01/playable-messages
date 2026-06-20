"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

// ─── Types ───
type Message = {
  id: number;
  room_id: string;
  session_id: string;
  nickname: string;
  message_type: "text" | "image" | "video" | "sticker";
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  deleted: boolean;
  created_at: string;
};

type RoomInfo = { roomId: string; code: string; createdAt: string };

// ─── Helpers ───
function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts: string) {
  const d = new Date(ts);
  const today = new Date();
  const yest = new Date(today);
  yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function shouldShowDate(prev: string, curr: string) {
  if (!prev) return true;
  return new Date(prev).toDateString() !== new Date(curr).toDateString();
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1048576).toFixed(1)}MB`;
}

export default function ChatPage() {
  // ─── Step state ───
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [roomInput, setRoomInput] = useState("");
  const [roomError, setRoomError] = useState("");

  // ─── Chat state ───
  const [messages, setMessages] = useState<Message[]>([]);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [pendingFile, setPendingFile] = useState<{ file: File; preview: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [typingUsers, setTypingUsers] = useState<{ nickname: string; timestamp: number }[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef("");
  const sessionIdRef = useRef(Math.random().toString(36).slice(2, 12));
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nicknameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [welcomeBackName, setWelcomeBackName] = useState<string | null>(null);

  function getSavedNameForRoom(code: string): string | null {
    try {
      const map = JSON.parse(localStorage.getItem("chat_nicknames") || "{}");
      return map[code.trim().toLowerCase()] || null;
    } catch { return null; }
  }

  function saveNameForRoom(code: string, name: string) {
    try {
      const map = JSON.parse(localStorage.getItem("chat_nicknames") || "{}");
      map[code.trim().toLowerCase()] = name;
      localStorage.setItem("chat_nicknames", JSON.stringify(map));
    } catch { /* ignore */ }
  }

  // ─── Restore session & saved name ───
  useEffect(() => {
    // Load saved nickname from localStorage (persists across sessions)
    const savedName = localStorage.getItem("chat_nickname");
    if (savedName) {
      setNickname(savedName);
      nicknameRef.current = savedName;
    }

    // Restore last room session
    const stored = sessionStorage.getItem("chat_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.roomId && parsed.code) {
          setRoomInfo(parsed);
          sessionIdRef.current = parsed.sessionId || sessionIdRef.current;
          setStep(2);
        }
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  // ─── Save nickname to localStorage whenever it changes ───
  useEffect(() => {
    if (nickname.trim()) {
      localStorage.setItem("chat_nickname", nickname.trim());
      if (roomInfo?.code) {
        saveNameForRoom(roomInfo.code, nickname.trim());
      }
    }
  }, [nickname, roomInfo?.code]);

  // ─── Save session ───
  useEffect(() => {
    if (step === 2 && roomInfo) {
      sessionStorage.setItem("chat_session", JSON.stringify({
        roomId: roomInfo.roomId,
        code: roomInfo.code,
        nickname,
        sessionId: sessionIdRef.current,
      }));
    }
  }, [step, roomInfo, nickname]);

  // ─── Load messages + realtime ───
  useEffect(() => {
    if (step !== 2 || !roomInfo) return;

    setChatLoading(true);
    fetch(`/api/chat/messages?room=${roomInfo.roomId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages.filter((m: Message) => !m.deleted));
        setChatLoading(false);
      });

    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      const channel = supabase
        .channel(`room-${roomInfo.roomId}`)
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomInfo.roomId}`,
        }, (payload) => {
          const msg = payload.new as Message;
          if (!msg.deleted) setMessages((prev) => [...prev, msg]);
        })
        .on("postgres_changes", {
          event: "UPDATE",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomInfo.roomId}`,
        }, (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => prev.map((m) => m.id === msg.id ? msg : m));
        })
        .subscribe();

      const presence = supabase.channel(`presence-${roomInfo.roomId}`, {
        config: { presence: { key: "chat-presence" } },
      });
      presence.on("presence", { event: "sync" }, () => {
        setOnlineCount(Object.keys(presence.presenceState()).length);
      });
      presence.on("presence", { event: "join" }, () => {
        setOnlineCount(Object.keys(presence.presenceState()).length);
      });
      presence.on("presence", { event: "leave" }, () => {
        setOnlineCount(Object.keys(presence.presenceState()).length);
      });
      presence.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setConnected(true);
          await presence.track({ online_at: Date.now() });
        }
      });

      const timeout = setTimeout(() => setConnected(true), 3000);

      return () => {
        clearTimeout(timeout);
        supabase.removeChannel(channel);
        supabase.removeChannel(presence);
      };
    }

    // Polling fallback
    setConnected(true);
    const poll = setInterval(() => {
      fetch(`/api/chat/messages?room=${roomInfo.roomId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.messages) setMessages(data.messages.filter((m: Message) => !m.deleted));
        });
    }, 3000);
    return () => clearInterval(poll);
  }, [step, roomInfo]);

  // ─── Typing cleaner ───
  useEffect(() => {
    if (typingUsers.length === 0) return;
    const t = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) => prev.filter((u) => now - u.timestamp < 3000));
    }, 500);
    return () => clearInterval(t);
  }, [typingUsers.length]);

  // ─── Auto-scroll ───
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Room: Create ───
  async function handleCreateRoom() {
    setLoading(true);
    const res = await fetch("/api/chat/room", { method: "POST" });
    const data = await res.json();
    if (data.roomId) {
      setRoomInfo(data);
      setStep(1);
    } else {
      setRoomError(data.error || "Failed to create room");
    }
    setLoading(false);
  }

  // ─── Room: Join by code ───
  async function handleJoinRoom(code: string) {
    if (!code.trim()) return;
    setLoading(true);
    setRoomError("");
    const res = await fetch("/api/chat/room/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim().toLowerCase() }),
    });
    const data = await res.json();
    if (data.roomId) {
      setRoomInfo(data);
      const savedName = getSavedNameForRoom(code.trim().toLowerCase());
      if (savedName) {
        setNickname(savedName);
        nicknameRef.current = savedName;
      }
      setStep(2);
    } else {
      setRoomError(data.error || "Room not found");
    }
    setLoading(false);
  }

  // ─── Room: Create from step 0 ───
  function handleGoToRoom() {
    handleCreateRoom();
  }

  // ─── Enter with code ───
  function handleEnterWithCode() {
    if (roomInput.trim()) {
      handleJoinRoom(roomInput);
    } else if (roomInfo) {
      setStep(2);
    }
  }

  // ─── Send message ───
  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!roomInfo || !nickname.trim() || sending) return;
    if (!content.trim() && !pendingFile) return;

    setSending(true);
    nicknameRef.current = nickname.trim();

    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      let fileSize: number | null = null;
      let messageType = "text";

      if (pendingFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", pendingFile.file);
        fd.append("roomId", roomInfo.roomId);
        const uploadRes = await fetch("/api/chat/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          fileUrl = uploadData.url;
          fileName = uploadData.name;
          fileSize = uploadData.size;
          messageType = uploadData.type || "file";
        }
        setUploading(false);
        setPendingFile(null);
      }

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomInfo.roomId,
          sessionId: sessionIdRef.current,
          nickname: nickname.trim(),
          messageType,
          content: content.trim() || null,
          fileUrl,
          fileName,
          fileSize,
        }),
      });
      await res.json();
      setContent("");
    } catch { /* fallback — message will appear via realtime/poll */ }
    setSending(false);
  }

  // ─── Delete message ───
  async function handleDeleteMessage(messageId: number) {
    await fetch("/api/chat/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, sessionId: sessionIdRef.current }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }

  // ─── Typing ───
  function handleContentChange(value: string) {
    setContent(value);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      /* stop typing — no broadcast for now since we focus on reliability */
    }, 2000);
  }

  // ─── Leave room ───
  function handleLeaveRoom() {
    sessionStorage.removeItem("chat_session");
    setMessages([]); setConnected(false); setRoomInfo(null);
    setNickname(""); setStep(0);
  }

  // ─── File picker ───
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPendingFile({ file, preview });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveFile() {
    if (pendingFile) URL.revokeObjectURL(pendingFile.preview);
    setPendingFile(null);
  }

  // ─── Loading ───
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-10 w-10">
            <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-violet-400 animate-spin" />
            <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-transparent border-r-cyan-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  //  STEP 0 — Explanation + Create / Join
  // ═══════════════════════════════════════════════
  if (step === 0) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[100px] animate-pulse" />
          <div className="absolute right-1/4 bottom-1/4 h-56 w-56 translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative w-full max-w-lg">
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-[1px] shadow-2xl shadow-violet-500/5">
            <div className="rounded-3xl bg-[#0d0a15]/90 px-8 py-10 text-center backdrop-blur-2xl">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 shadow-inner shadow-violet-500/10">
                <span className="text-4xl drop-shadow-lg">🏠</span>
              </div>

              <h1 className="display-title mb-2 text-[1.75rem] leading-tight">
                <span className="text-gradient">Secret Room</span>
              </h1>
              <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-white/50">
                A private chat room with a unique access code. Messages, photos, and media stay until you delete them.
              </p>

              <div className="mb-6 space-y-3 text-left">
                {[
                  { icon: "◆", text: "Unique room code — only people with the code can enter" },
                  { icon: "◆", text: "Messages, photos, videos & stickers — all preserved" },
                  { icon: "◆", text: "Delete anything you own, whenever you want" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 120}ms` }}>
                    <span className="mt-0.5 text-[0.6rem] text-violet-400/70">{item.icon}</span>
                    <span className="text-xs leading-relaxed text-white/40">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    nicknameRef.current = e.target.value;
                  }}
                  placeholder="Your display name..."
                  maxLength={30}
                  className="input min-h-[46px] w-full text-sm"
                />
              </div>

              <button type="button" onClick={handleGoToRoom} className="group relative mb-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 p-[1px] shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30">
                <div className="rounded-full bg-[#0d0a15] px-6 py-3.5 transition-all group-hover:bg-transparent">
                  <span className="text-sm font-extrabold tracking-wide text-white">Create a New Room →</span>
                </div>
              </button>

              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0d0a15] px-3 text-[0.6rem] font-bold tracking-widest text-white/40 uppercase">or join a room</span>
                </div>
              </div>

              {welcomeBackName && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-2.5 text-left animate-fade-in">
                  <span className="text-sm">👋</span>
                  <span className="text-xs text-emerald-300/80">
                    Welcome back, <strong className="text-emerald-200">{welcomeBackName}</strong>
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => {
                    setRoomInput(e.target.value);
                    setWelcomeBackName(getSavedNameForRoom(e.target.value));
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleJoinRoom(roomInput); }}
                  placeholder="Enter a room code..."
                  className="input min-h-[46px] flex-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleJoinRoom(roomInput)}
                  disabled={!roomInput.trim()}
                  className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg shadow-violet-500/20 transition-all enabled:hover:scale-105 disabled:opacity-30"
                >
                  ➤
                </button>
              </div>

              {roomError && <p className="mt-3 text-xs text-red-400">{roomError}</p>}

              <p className="mt-6 text-[0.55rem] tracking-widest text-white/30 uppercase">
                Only visible to those who know where to look
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  //  STEP 1 — Room Created / Show Code
  // ═══════════════════════════════════════════════
  if (step === 1) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/3 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/8 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute right-1/3 bottom-1/3 h-52 w-52 translate-x-1/2 translate-y-1/2 rounded-full bg-violet-500/8 blur-[100px] animate-pulse" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-[1px] shadow-2xl shadow-violet-500/5">
            <div className="rounded-3xl bg-[#0d0a15]/90 px-8 py-10 text-center backdrop-blur-2xl">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 shadow-inner shadow-amber-500/10">
                <span className="text-4xl drop-shadow-lg">🔑</span>
              </div>

              <h1 className="display-title mb-2 text-[1.75rem] leading-tight text-white">Your Room Code</h1>
              <p className="mx-auto mb-8 max-w-xs text-sm leading-relaxed text-white/50">
                Share this code with anyone you want to invite. They enter it on the previous screen to join.
              </p>

              <div className="mb-8 flex items-center justify-center gap-3">
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] px-6 py-4">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent" style={{ animation: "scan-line 2s linear infinite" }} />
                  </div>
                  <code className="relative font-mono text-lg font-bold tracking-[0.15em] text-violet-300">
                    {roomInfo?.code || "••••••••"}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(roomInfo?.code || "")}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-lg transition-all hover:bg-white/[0.08] hover:shadow-lg active:scale-95"
                  title="Copy code"
                >
                  📋
                </button>
              </div>

              <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-left">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sm">⚠️</span>
                  <div>
                    <p className="text-xs font-bold tracking-wide text-amber-300/90">Save this code</p>
                    <p className="mt-1 text-[0.65rem] leading-relaxed text-amber-200/50">
                      You need it to come back. Messages stay forever until you delete them.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 p-[1px] shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30"
              >
                <div className="rounded-full bg-[#0d0a15] px-6 py-3.5 transition-all group-hover:bg-transparent">
                  <span className="text-sm font-extrabold tracking-wide text-white">Enter Room →</span>
                </div>
              </button>

              <button type="button" onClick={() => setStep(0)}
                className="mt-4 text-[0.7rem] font-bold tracking-wider text-white/40 underline underline-offset-4 transition-colors hover:text-white/60">
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  //  STEP 2 — Chat
  // ═══════════════════════════════════════════════
  const typingText = typingUsers
    .filter((u) => u.nickname !== nickname.trim())
    .map((u) => u.nickname)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0d0a15]">
      {/* ─── Header ─── */}
      <div className="flex shrink-0 items-center justify-center border-b border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
        <div className="flex w-full max-w-2xl items-center justify-between px-3 sm:px-0 py-2.5 sm:py-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="relative grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 shadow-inner shadow-violet-500/10">
            <span className="text-sm sm:text-lg drop-shadow">🏠</span>
            <span className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-[#0d0a15] shadow-sm ${connected ? "bg-emerald-400 shadow-emerald-500/30" : "bg-amber-400 shadow-amber-500/30"}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="truncate text-xs sm:text-sm font-extrabold text-white/90">Room</h2>
              <code className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[0.5rem] sm:text-[0.55rem] font-mono font-bold tracking-wider text-violet-300/60">
                {roomInfo?.code}
              </code>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} />
              <span className="truncate text-[0.6rem] sm:text-[0.65rem] font-medium text-white/50 tracking-wide">
                {connected
                  ? onlineCount > 1
                    ? `${onlineCount} online`
                    : onlineCount === 1
                    ? "1 online"
                    : "Connected"
                  : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
          <button type="button" onClick={handleLeaveRoom}
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3 text-[0.65rem] sm:text-[0.7rem] font-bold text-white/50 transition-all hover:bg-white/[0.06] hover:text-white/80">
            <span>🚪</span>
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>

      {/* ─── Messages ─── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
        {chatLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 border-white/10 border-t-violet-400 animate-spin" />
              </div>
              <span className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-widest text-white/40 uppercase">Loading</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8">
            <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-xl sm:rounded-2xl bg-white/[0.03]">
              <span className="text-xl sm:text-2xl opacity-40">💬</span>
            </div>
            <div className="text-center max-w-xs">
              <p className="text-xs sm:text-sm font-bold text-white/50">No messages yet</p>
              <p className="mt-1 text-[0.6rem] sm:text-[0.65rem] text-white/45 leading-relaxed">
                Messages, photos, and media are preserved until you delete them.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            {messages.map((msg, idx) => {
              const isOwn = msg.session_id === sessionIdRef.current;
              const showDate = shouldShowDate(messages[idx - 1]?.created_at ?? "", msg.created_at);
              return (
                <div key={msg.id} className="mb-1 group">
                  {showDate && (
                    <div className="relative my-3 sm:my-4 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.04]" />
                      </div>
                      <span className="relative rounded-full border border-white/[0.06] bg-[#0d0a15] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[0.45rem] sm:text-[0.55rem] font-bold tracking-widest text-white/45 uppercase">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                  )}

                  {msg.deleted ? (
                    <div className="flex items-center gap-2 px-1 py-1 opacity-40">
                      <span className="text-[0.55rem] sm:text-[0.6rem] italic text-white/40">This message was deleted</span>
                    </div>
                  ) : (
                    <div className={`flex items-end gap-2 sm:gap-2.5 px-1 ${isOwn ? "flex-row-reverse" : ""} animate-fade-in`}>
                      <div className={`relative grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-xl sm:rounded-2xl text-[0.55rem] sm:text-[0.65rem] font-bold shadow-sm ${
                        isOwn
                          ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-violet-500/20"
                          : "bg-white/[0.06] text-white/40"
                      }`}>
                        {msg.nickname.charAt(0).toUpperCase()}
                      </div>

                      <div className={`flex max-w-[82%] sm:max-w-[75%] flex-col ${isOwn ? "items-end" : "items-start"}`}>
                        {!isOwn && (
                          <span className="mb-0.5 sm:mb-1 ml-1 sm:ml-1.5 text-[0.45rem] sm:text-[0.5rem] font-bold tracking-wide text-violet-300/50 uppercase">
                            {msg.nickname}
                          </span>
                        )}

                        <div className={`relative ${
                          msg.message_type === "text"
                            ? isOwn
                              ? "bg-gradient-to-br from-violet-500/90 to-cyan-500/90 text-white shadow-lg shadow-violet-500/10 rounded-[1.1rem] sm:rounded-[1.25rem] rounded-br-md"
                              : "bg-white/[0.05] text-white/85 border border-white/[0.04] rounded-[1.1rem] sm:rounded-[1.25rem] rounded-bl-md"
                            : ""
                        }`}>
                          {msg.message_type === "text" ? (
                            <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm leading-relaxed">{msg.content}</div>
                          ) : msg.message_type === "image" || msg.message_type === "sticker" ? (
                            <div className={`overflow-hidden ${isOwn ? "rounded-[1.1rem] rounded-br-md sm:rounded-[1.25rem]" : "rounded-[1.1rem] rounded-bl-md sm:rounded-[1.25rem]"} border border-white/[0.04]`}>
                              <a href={msg.file_url || "#"} target="_blank" rel="noopener noreferrer" className="block">
                                <img
                                  src={msg.file_url || ""}
                                  alt={msg.file_name || "Image"}
                                  className={`w-full object-cover ${msg.message_type === "sticker" ? "h-28 w-28 sm:h-32 sm:w-32" : "max-h-64 sm:max-h-80"}`}
                                  loading="lazy"
                                />
                              </a>
                              {msg.content && (
                                <div className={`px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm leading-relaxed ${isOwn ? "bg-violet-500/90 text-white" : "bg-white/[0.05] text-white/85"}`}>
                                  {msg.content}
                                </div>
                              )}
                            </div>
                          ) : msg.message_type === "video" ? (
                            <div className={`overflow-hidden ${isOwn ? "rounded-[1.1rem] rounded-br-md sm:rounded-[1.25rem]" : "rounded-[1.1rem] rounded-bl-md sm:rounded-[1.25rem]"} border border-white/[0.04]`}>
                              <video src={msg.file_url || ""} controls className="max-h-64 sm:max-h-80 w-full" preload="metadata">
                                <a href={msg.file_url || ""} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm underline">Download video</a>
                              </video>
                              {msg.content && (
                                <div className={`px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm leading-relaxed ${isOwn ? "bg-violet-500/90 text-white" : "bg-white/[0.05] text-white/85"}`}>
                                  {msg.content}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={`flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 ${isOwn ? "bg-violet-500/90 text-white" : "bg-white/[0.05] text-white/85 border border-white/[0.04]"}`}>
                              <span className="text-base sm:text-lg">📎</span>
                              <div className="min-w-0">
                                <p className="truncate text-xs sm:text-sm font-bold">{msg.file_name}</p>
                                {msg.file_size && <p className="text-[0.5rem] sm:text-[0.6rem] opacity-60">{formatFileSize(msg.file_size)}</p>}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className={`mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <span className="text-[0.45rem] sm:text-[0.5rem] font-medium tracking-wide text-white/45">
                            {formatTime(msg.created_at)}
                          </span>
                          {isOwn && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[0.5rem] sm:text-[0.55rem] text-red-400/50 hover:text-red-400"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {typingText && (
              <div className="flex items-end gap-2 sm:gap-2.5 px-1 mt-1 animate-fade-in">
                <div className="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-xl sm:rounded-2xl bg-white/[0.04]">
                  <span className="text-[0.5rem] sm:text-[0.6rem] text-white/40">✎</span>
                </div>
                <div className="rounded-[1.1rem] rounded-bl-md sm:rounded-[1.25rem] bg-white/[0.04] border border-white/[0.04] px-3.5 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="ml-1.5 text-[0.45rem] sm:text-[0.5rem] font-bold tracking-wide text-white/45 uppercase">{typingText}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ─── Privacy Bar ─── */}
      <div className="shrink-0 border-t border-white/[0.03] bg-white/[0.01] px-3 sm:px-6 py-1 sm:py-1.5">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2 sm:gap-3 text-[0.4rem] sm:text-[0.5rem] font-medium tracking-wider text-white/25 uppercase">
          <span>Private</span>
          <span className="h-1 w-1 rounded-full bg-white/[0.06]" />
          <span>Preserved</span>
          <span className="h-1 w-1 rounded-full bg-white/[0.06]" />
          <span>You control</span>
        </div>
      </div>

      {/* ─── Input Area ─── */}
      <form onSubmit={handleSend} className="shrink-0 border-t border-white/[0.04] bg-white/[0.02] px-3 sm:px-6 py-2.5 sm:py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl flex-col sm:flex-row gap-2 sm:gap-2.5">
          {/* Name */}
          <input
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); nicknameRef.current = e.target.value; }}
            placeholder="Your name"
            className="min-h-[36px] sm:min-h-[32px] w-full sm:w-24 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-[0.7rem] sm:text-[0.65rem] font-bold text-white/60 outline-none transition-all placeholder:text-white/30 focus:border-violet-500/30 focus:bg-white/[0.05]"
            maxLength={30}
          />

          {/* Input + file preview */}
          <div className="flex-1">
            {pendingFile && (
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-2.5 sm:px-3 py-1.5 sm:py-2">
                {pendingFile.file.type.startsWith("image/") ? (
                  <img src={pendingFile.preview} alt="" className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover" />
                ) : (
                  <span className="text-base sm:text-lg">🎬</span>
                )}
                <span className="flex-1 truncate text-[0.6rem] sm:text-[0.65rem] text-white/50">{pendingFile.file.name}</span>
                <button type="button" onClick={handleRemoveFile}
                  className="text-xs text-white/40 hover:text-white/70">✕</button>
              </div>
            )}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={pendingFile ? "Add a caption..." : "Type a message..."}
                className="input min-h-[46px] resize-none py-3 pl-10 pr-12 text-sm"
                rows={1}
                maxLength={2000}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
              />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1.5 left-1.5 grid h-9 w-9 place-items-center rounded-xl text-sm text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/70"
                title="Attach file">
                📎
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
              <button type="submit"
                disabled={!nickname.trim() || (!content.trim() && !pendingFile) || sending || uploading}
                className="absolute bottom-1.5 right-1.5 grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-sm text-white shadow-lg shadow-violet-500/20 transition-all enabled:hover:scale-105 enabled:hover:shadow-violet-500/30 enabled:active:scale-95 disabled:opacity-25">
                {sending || uploading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : "➤"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
