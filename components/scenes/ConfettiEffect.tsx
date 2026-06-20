"use client";

import { useEffect, useState } from "react";

const COLORS = ["#ff6b8a", "#ffd166", "#97dadf", "#b8a5ff", "#ff5fb7", "#7c5cff"];

export function ConfettiEffect({ active, duration = 3000 }: { active: boolean; duration?: number }) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; delay: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    const newPieces = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), duration + 1000);
    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            background: p.color,
            animationName: "confetti-fall",
            animationDuration: `${2 + Math.random() * 2}s`,
            animationTimingFunction: "ease-out",
            animationFillMode: "forwards",
            animationDelay: `${p.delay}s`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}
