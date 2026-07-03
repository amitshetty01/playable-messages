"use client";

import { useState } from "react";

type ReactionCaptureProps = {
  experienceId: string;
  onReply?: () => void;
};

const EMOJIS = ["❤️", "😂", "😢", "🔥", "🥺", "💀", "✨", "😭", "🥰", "😍", "💔", "🤣"];

export function ReactionCapture({ experienceId, onReply }: ReactionCaptureProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
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
  };

  if (sent) {
    return (
      <div className="glass rounded-[2rem] p-6 text-center">
        <p className="text-3xl mb-2">{selected}</p>
        <p className="text-white/70 font-bold">Reaction sent!</p>
        {onReply && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-white/50">Send a reply back?</p>
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
      <p className="text-center text-sm font-bold text-white/60 mb-3">React to this message</p>
      <div className="flex flex-wrap justify-center gap-2">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleReact(emoji)}
            disabled={sending}
            className={`rounded-xl px-2 py-1 text-xl transition hover:scale-125 ${
              selected === emoji ? "scale-125" : "opacity-60 hover:opacity-100"
            }`}
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="input w-full"
          placeholder="Or write a short reply..."
          rows={2}
          maxLength={200}
        />
        <button
          type="button"
          onClick={() => reply.trim() && handleReact(reply.trim())}
          className="premium-button mt-2 text-sm w-full"
          disabled={!reply.trim()}
        >
          Send reply
        </button>
      </div>
    </div>
  );
}
