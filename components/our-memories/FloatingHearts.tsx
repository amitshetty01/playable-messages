"use client";

import { useEffect, useState } from "react";

type Heart = { id: number; x: number; size: number; delay: number; duration: number; opacity: number };

export function FloatingHearts({ color = "#f472b6", count = 15 }: { color?: string; count?: number }) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const h: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 10 + Math.random() * 18,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.35,
    }));
    setHearts(h);
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute animate-float-up"
          style={{
            left: `${h.x}%`,
            bottom: "-5%",
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill={color} className="h-full w-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
