"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function RedactedDecoderGame({
  onComplete,
  message,
}: {
  onComplete: () => void;
  message: string;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(0);
  const [active, setActive] = useState(false);
  const totalChars = message.length;
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(() => setActive(true), []);
  const handlePointerUp = useCallback(() => setActive(false), []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!active) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPos({ x, y });

      const chars = containerRef.current?.querySelectorAll("span.char");
      if (!chars) return;
      let count = 0;
      chars.forEach((c) => {
        const el = c as HTMLElement;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2 - rect.left;
        const cy = r.top + r.height / 2 - rect.top;
        const dist = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2);
        const revealed = dist < 40;
        el.style.opacity = revealed ? "1" : "0";
        if (revealed) count++;
      });
      setRevealed(count);
      if (count >= totalChars) {
        setTimeout(() => onComplete(), 500);
      }
    },
    [active, totalChars, onComplete]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.querySelectorAll("span.char").forEach((c) => {
      (c as HTMLElement).style.opacity = "0";
    });
  }, []);

  const progress = totalChars > 0 ? revealed / totalChars : 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full max-w-sm touch-none select-none rounded-2xl bg-white/5 p-6"
      >
        <p className="text-center text-lg font-bold leading-relaxed sm:text-xl">
          {message.split("").map((ch, i) => (
            <span
              key={i}
              className="char relative inline transition-opacity duration-150"
              style={{ opacity: 0 }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </p>
        {active && (
          <div
            className="pointer-events-none absolute rounded-full border-2 border-neon/60"
            style={{
              width: 80,
              height: 80,
              left: pos.x - 40,
              top: pos.y - 40,
              boxShadow: "0 0 40px rgba(35,211,238,0.2), inset 0 0 40px rgba(35,211,238,0.1)",
            }}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10 sm:w-48">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon to-violet transition-all duration-200"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs font-bold text-white/40">{revealed}/{totalChars}</span>
      </div>

      {!active && revealed === 0 && (
        <p className="text-xs tracking-widest text-white/20 uppercase">
          Drag the lens to decode
        </p>
      )}
    </div>
  );
}
