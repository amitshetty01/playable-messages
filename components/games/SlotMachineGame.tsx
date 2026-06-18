"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { playToneSound } from "@/lib/flowSounds";
import type { Tone } from "@/lib/types";

const SYMBOLS = ["🍌", "🔥", "🎉", "💥", "😂"];
const SYMBOL_HEIGHT = 80;
const LOOPS = 3;
const TARGET_INDEX = 4; // lands on 😂 every time

export function SlotMachineGame({
  onComplete,
  tone,
}: {
  onComplete: () => void;
  tone: Tone;
}) {
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const [offset, setOffset] = useState(0);
  const [blur, setBlur] = useState(false);
  const offsetRef = useRef(0);

  const stripRef = useRef<HTMLDivElement>(null);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Build the symbol strip — enough symbols for several spins */
  const symbols = useRef<string[]>([]);
  if (symbols.current.length === 0) {
    for (let i = 0; i < 20; i++) {
      SYMBOLS.forEach((s) => symbols.current.push(s));
    }
  }

  const spin = useCallback(() => {
    if (spinning || done) return;
    setSpinning(true);
    setBlur(true);
    setDone(false);
    playToneSound("whoosh", tone);

    const current = offsetRef.current;
    const target =
      current + (LOOPS * SYMBOLS.length + TARGET_INDEX) * SYMBOL_HEIGHT;

    /* Animate to target */
    offsetRef.current = target;
    setOffset(target);

    snapTimerRef.current = setTimeout(() => {
      setBlur(false);
      playToneSound("ding", tone);
      setDone(true);
      setSpinning(false);

      /* Snap strip back to an equivalent early position (invisible to user) */
      setTimeout(() => {
        const snapBack = (TARGET_INDEX + SYMBOLS.length) * SYMBOL_HEIGHT;
        offsetRef.current = snapBack;
        setOffset(snapBack);
      }, 300);

      setTimeout(() => onComplete(), 1000);
    }, 1900);
  }, [spinning, done, tone, onComplete]);

  useEffect(() => {
    return () => {
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6">
      {/* Reel housing with inset "drum" shadow */}
      <div className="flex items-center gap-3">
        <div
          className="reel-housing"
          style={{
            width: 80,
            height: SYMBOL_HEIGHT,
            overflow: "hidden",
            borderRadius: 10,
            background: "#1B1722",
            boxShadow:
              "inset 0 12px 16px -10px rgba(0,0,0,0.7), inset 0 -12px 16px -10px rgba(0,0,0,0.7)",
          }}
        >
          <div
            ref={stripRef}
            className={`reel-strip ${blur ? "spinning" : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              transition: spinning
                ? "transform 1.9s cubic-bezier(0.1, 0.7, 0.15, 1)"
                : "none",
              transform: `translateY(-${offset}px)`,
              filter: blur ? "blur(3px)" : "none",
            }}
          >
            {symbols.current.map((sym, i) => (
              <div
                key={i}
                className="reel-symbol"
                style={{
                  height: SYMBOL_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  flexShrink: 0,
                  width: 80,
                }}
              >
                {sym}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spin button */}
      {!done && (
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="spin-btn"
          style={{
            background: "#FF6B4A",
            color: "#2A1208",
            border: "none",
            padding: "10px 28px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.02em",
            cursor: spinning ? "default" : "pointer",
            opacity: spinning ? 0.5 : 1,
          }}
        >
          {spinning ? "SPINNING..." : "SPIN"}
        </button>
      )}

      {done && (
        <div className="animate-reveal-up flex flex-col items-center gap-1">
          <p className="text-xl font-bold text-[#FF6B4A]">JACKPOT! 🎉</p>
        </div>
      )}

      {!spinning && !done && (
        <p className="text-xs tracking-widest text-white/20 uppercase">
          Tap SPIN to pull the lever
        </p>
      )}

      <style>{`
        .reel-housing::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .reel-strip { transition: none !important; }
          .reel-strip.spinning { filter: none !important; }
        }
      `}</style>
    </div>
  );
}
