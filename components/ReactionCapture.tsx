"use client";

import { useState } from "react";

type ReactionCaptureProps = {
  experienceId: string;
  onReply?: () => void;
  onSent?: () => void;
};

const BIG_EMOJIS = [
  { emoji: "❤️", label: "Love" },
  { emoji: "😂", label: "Funny" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "🥺", label: "Aww" },
  { emoji: "💀", label: "Dead" },
];

export function ReactionCapture({ experienceId, onReply, onSent }: ReactionCaptureProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const handleReact = async (emoji: string) => {
    setSelected(emoji);
    setSending(true);
    try {
      await fetch(`/api/experiences/${experienceId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: emoji }),
      });
    } catch {}
    setSending(false);
    setSent(true);
    onSent?.();
  };

  if (sent) {
    return (
      <div className="glass rounded-[2rem] p-6 text-center">
        <p className="text-4xl mb-2">{selected}</p>
        <p className="text-white/70 font-bold">Reaction sent!</p>
        {onReply && !showReply && (
          <button
            type="button"
            onClick={() => setShowReply(true)}
            className="mt-4 text-xs font-bold text-white/40 hover:text-white/60 transition-colors underline underline-offset-4"
          >
            Send a message back
          </button>
        )}
        {onReply && showReply && (
          <div className="mt-4 animate-section-fade space-y-3">
            <p className="text-sm text-white/50">Type a reply back?</p>
            <div className="flex gap-2 justify-center">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="input max-w-[200px]"
                placeholder="Quick reply..."
                maxLength={80}
              />
              <button type="button" onClick={onReply} className="premium-button text-sm">Send</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass rounded-[2rem] p-6">
      <p className="text-center text-sm font-bold text-white/60 mb-4">React to this message</p>
      <div className="flex justify-center gap-3">
        {BIG_EMOJIS.map((item) => (
          <button
            key={item.emoji}
            type="button"
            onClick={() => handleReact(item.emoji)}
            disabled={sending}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-4 py-3 text-2xl transition-all duration-200 hover:scale-110 ${
              selected === item.emoji
                ? "border-white/40 bg-white/15 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "border-white/10 bg-white/[0.04] opacity-70 hover:opacity-100 hover:border-white/25"
            }`}
            aria-label={`React with ${item.label}`}
          >
            <span>{item.emoji}</span>
            <span className="text-[10px] font-bold text-white/40">{item.label}</span>
          </button>
        ))}
      </div>
      {onReply && !showReply && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowReply(true)}
            className="text-xs font-bold text-white/30 hover:text-white/50 transition-colors underline underline-offset-4"
          >
            Write a reply instead
          </button>
        </div>
      )}
      {onReply && showReply && (
        <div className="mt-4 animate-section-fade space-y-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="input w-full"
            placeholder="Write a short reply..."
            rows={2}
            maxLength={200}
          />
          <button
            type="button"
            onClick={() => reply.trim() && handleReact(reply.trim())}
            className="premium-button text-sm w-full"
            disabled={!reply.trim()}
          >
            Send reply
          </button>
        </div>
      )}
    </div>
  );
}
