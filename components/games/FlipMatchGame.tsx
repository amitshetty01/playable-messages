"use client";

import { useState, useCallback } from "react";
import { playToneSound } from "@/lib/flowSounds";
import type { Tone } from "@/lib/types";

const PAIRS = [
  { id: "a", emoji: "📸" },
  { id: "b", emoji: "❤️" },
  { id: "c", emoji: "🌟" },
];

type Card = {
  pairId: string;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlipMatchGame({
  onComplete,
  tone,
}: {
  onComplete: () => void;
  tone: Tone;
}) {
  const [cards, setCards] = useState<Card[]>(() => {
    const items = shuffle([...PAIRS, ...PAIRS]);
    return items.map((p): Card => ({
      pairId: p.id, emoji: p.emoji, flipped: false, matched: false,
    }));
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [locked, setLocked] = useState(false);

  const flip = useCallback(
    (idx: number) => {
      if (locked || cards[idx].flipped || cards[idx].matched) return;
      playToneSound("tap", tone);

      const next = cards.map((c, i) =>
        i === idx ? { ...c, flipped: true } : c
      );
      setCards(next);
      const newSelected = [...selected, idx];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setLocked(true);
        const [a, b] = newSelected;
        if (next[a].pairId === next[b].pairId) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
            );
            setSelected([]);
            setLocked(false);
            const total = matchedCount + 1;
            setMatchedCount(total);
            playToneSound("ding", tone);
            if (total >= PAIRS.length) {
              setTimeout(() => onComplete(), 600);
            }
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c))
            );
            setSelected([]);
            setLocked(false);
          }, 900);
        }
      }
    },
    [locked, cards, selected, matchedCount, tone, onComplete]
  );

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${PAIRS.length}, 1fr)` }}
      >
        {cards.map((card, i) => (
          <button
            key={i}
            type="button"
            onClick={() => flip(i)}
            disabled={locked || card.flipped || card.matched}
            className="memory-card-root"
            style={{ perspective: 900, width: 96, height: 132 }}
          >
            <div
              className={`memory-card-inner ${card.flipped || card.matched ? "flipped" : ""}`}
            >
              {/* Front face (shown when NOT flipped): "?" on warm sepia gradient */}
              <div className="memory-card-front">
                <span className="text-3xl font-bold text-[#3A2E1A]/60">?</span>
              </div>
              {/* Back face (shown when flipped): the emoji */}
              <div className="memory-card-back">
                <span className="text-4xl">{card.emoji}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10 sm:w-48">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C9A063] to-rose transition-all duration-300"
            style={{ width: `${(matchedCount / PAIRS.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-white/40">{matchedCount}/{PAIRS.length}</span>
      </div>

      <style>{`
        .memory-card-inner {
          position: relative; width: 100%; height: 100%;
          transition: transform 0.5s cubic-bezier(0.4, 0.15, 0.2, 1);
          transform-style: preserve-3d;
        }
        .memory-card-inner.flipped { transform: rotateY(180deg); }
        .memory-card-front, .memory-card-back {
          position: absolute; inset: 0; backface-visibility: hidden;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .memory-card-front {
          background: linear-gradient(155deg, #D8B97C, #C9A063);
          border: 2px solid rgba(201,160,99,0.4);
        }
        .memory-card-back {
          background: linear-gradient(155deg, #F4E9D8, #E9D9BD);
          border: 2px solid rgba(233,217,189,0.5);
          transform: rotateY(180deg);
        }
        .memory-card-root:focus-visible { outline: 2px solid #C9A063; outline-offset: 3px; border-radius: 14px; }
        .memory-card-root:disabled { pointer-events: none; opacity: 0.7; }
        @media (prefers-reduced-motion: reduce) {
          .memory-card-inner { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
