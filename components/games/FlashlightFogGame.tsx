"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { playToneSound } from "@/lib/flowSounds";
import type { Tone } from "@/lib/types";

export function FlashlightFogGame({
  onComplete,
  message,
  tone,
}: {
  onComplete: () => void;
  message: string;
  tone: Tone;
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);
  const [explored, setExplored] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const exploredCells = useRef(new Set<string>());

  const GRID = 8;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setActive(true);
      handleMove(e);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      if (!active) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });

      const cx = Math.floor((x / 100) * GRID);
      const cy = Math.floor((y / 100) * GRID);
      const key = `${cx}-${cy}`;
      if (!exploredCells.current.has(key)) {
        exploredCells.current.add(key);
        const total = GRID * GRID;
        const newCount = exploredCells.current.size;
        setExplored(newCount);

        if (newCount >= total * 0.6) {
          setActive(false);
          playToneSound("ding", tone);
          setTimeout(() => onComplete(), 500);
        }
      }
    },
    [active, tone, onComplete]
  );

  const handlePointerUp = useCallback(() => setActive(false), []);

  const progress = explored / (GRID * GRID);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handleMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full max-w-sm flex-1 touch-none select-none overflow-hidden rounded-2xl sm:max-w-md"
        style={{ minHeight: 220 }}
      >
        {/* Base text */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="text-center text-lg font-bold leading-relaxed text-white/90 sm:text-xl">
            {message}
          </p>
        </div>

        {/* Fog overlay with flashlight cutout */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            background: active
              ? `radial-gradient(circle 80px at ${pos.x}% ${pos.y}%, transparent 0%, rgba(3,2,10,0.97) 60%, rgba(3,2,10,1) 100%)`
              : "rgba(3,2,10,0.97)",
          }}
        >
          {/* Fog texture particles */}
          <div className="pointer-events-none absolute inset-0 opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute animate-float-particle text-sm"
                style={{
                  left: `${(i * 23 + 7) % 100}%`,
                  top: `${(i * 41 + 13) % 100}%`,
                  animationDelay: `${i * 0.6}s`,
                  animationDuration: `${6 + (i % 3) * 3}s`,
                }}
              >
                🌫️
              </span>
            ))}
          </div>
        </div>

        {/* Flashlight border glow */}
        {active && (
          <div
            className="pointer-events-none absolute rounded-full border border-neon/20"
            style={{
              width: 160,
              height: 160,
              left: `calc(${pos.x}% - 80px)`,
              top: `calc(${pos.y}% - 80px)`,
              boxShadow: "0 0 60px rgba(35,211,238,0.08)",
              transition: "left 0.05s ease, top 0.05s ease",
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10 sm:w-48">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon to-violet transition-all duration-200"
            style={{ width: `${Math.min(progress * 100, 60)}%` }}
          />
        </div>
        <span className="text-xs font-bold text-white/40">
          {Math.round(progress * 100)}%
        </span>
      </div>

      {!active && explored === 0 && (
        <p className="text-xs tracking-widest text-white/20 uppercase">
          Drag to move the flashlight
        </p>
      )}
    </div>
  );
}
