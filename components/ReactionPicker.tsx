"use client";

import { useState } from "react";
import { playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import type { Tone } from "@/lib/types";

const REACTIONS = [
  { emoji: "❤️", label: "Loved it" },
  { emoji: "😂", label: "Made me laugh" },
  { emoji: "😢", label: "Got me emotional" },
  { emoji: "😮", label: "Surprised me" },
  { emoji: "🔥", label: "That was fire" },
  { emoji: "💯", label: "Perfect" },
];

export function ReactionPicker({ tone, onReact }: { tone: Tone; onReact?: (emoji: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handlePick(emoji: string) {
    if (sent) return;
    setSelected(emoji);
    playToneSound("ding", tone);
    hapticTone("ding", tone);
    setSent(true);
    onReact?.(emoji);
  }

  return (
    <div className="mt-8 text-center">
      <p className="text-xs font-bold tracking-[0.08em] text-white/50 mb-4">
        {sent ? `You reacted with ${selected}` : "How did this feel?"}
      </p>
      {!sent ? (
        <div className="flex flex-wrap justify-center gap-2">
          {REACTIONS.map((r) => (
            <button
              key={r.emoji}
              type="button"
              onClick={() => handlePick(r.emoji)}
              className="group flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-all duration-200 hover:scale-110 hover:border-white/25 hover:bg-white/10"
            >
              <span className="text-2xl transition-transform duration-200 group-hover:scale-125">{r.emoji}</span>
              <span className="text-[10px] font-bold text-white/40 group-hover:text-white/70">{r.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-[section-in_400ms_cubic-bezier(.22,1,.36,1)_both] inline-block">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
            <span className="text-xl">{selected}</span>
            <span className="text-xs font-bold text-white/60">Sent!</span>
          </span>
        </div>
      )}
    </div>
  );
}
