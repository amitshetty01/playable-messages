"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const REPLY_EMOJIS = [
  { emoji: "❤️", label: "Love" },
  { emoji: "😊", label: "Happy" },
  { emoji: "😂", label: "Funny" },
  { emoji: "🥹", label: "Touched" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "💔", label: "Heartbreak" },
  { emoji: "😭", label: "Crying" },
  { emoji: "✨", label: "Beautiful" },
];

type ReplyScreenProps = {
  experienceId: string;
};

export function ReplyScreen({ experienceId }: ReplyScreenProps) {
  const [reply, setReply] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!reply.trim() && !selectedEmoji) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/experiences/${experienceId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: reply.trim(), reactionEmoji: selectedEmoji }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to send reply");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[2rem] p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-white"
        >
          Your reply was sent!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-white/50 mt-2"
        >
          {selectedEmoji && <span className="text-2xl mr-2">{selectedEmoji}</span>}
          {reply && <span>"{reply}"</span>}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0.3 }}
      className="glass rounded-[2rem] p-6 space-y-5"
    >
      <p className="text-center text-sm font-bold text-white/60">
        Send a reply back 💬
      </p>

      <div>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write your reply..."
          className="input w-full min-h-[80px] resize-none"
          maxLength={500}
          rows={3}
        />
        <p className="text-right text-xs text-white/30 mt-1">{reply.length}/500</p>
      </div>

      <div>
        <p className="text-xs font-bold text-white/40 mb-3 text-center">Pick an emoji (optional)</p>
        <div className="grid grid-cols-4 gap-2">
          {REPLY_EMOJIS.map((item, i) => (
            <motion.button
              key={item.emoji}
              type="button"
              onClick={() => setSelectedEmoji(selectedEmoji === item.emoji ? null : item.emoji)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-xl transition-all duration-200 ${
                selectedEmoji === item.emoji
                  ? "border-white/40 bg-white/15 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  : "border-white/10 bg-white/[0.04] opacity-70 hover:opacity-100 hover:border-white/25"
              }`}
              aria-label={item.label}
            >
              <span>{item.emoji}</span>
              <span className="text-[9px] font-bold text-white/40">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        type="button"
        onClick={handleSend}
        disabled={sending || (!reply.trim() && !selectedEmoji)}
        whileTap={{ scale: 0.97 }}
        className="premium-button w-full text-sm"
      >
        {sending ? "Sending..." : "Send Reply"}
      </motion.button>
    </motion.div>
  );
}
