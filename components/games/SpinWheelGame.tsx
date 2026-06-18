"use client";

import { useState, useCallback, useRef } from "react";
import { playToneSound } from "@/lib/flowSounds";
import type { Tone } from "@/lib/types";

const SEGMENTS = [
  "🔥 HOT TAKE", "💀 SAVAGE", "😭 BRUTAL", "🤣 ROAST",
  "😤 SHADE", "😂 COMEDY",
];
const COLORS = [
  "#ff6b8a", "#ff8fab", "#ffd166", "#ff5fb7", "#b8a5ff", "#97dadf",
];

export function SpinWheelGame({
  onComplete,
  tone,
}: {
  onComplete: () => void;
  tone: Tone;
}) {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = useCallback(() => {
    if (spinning || landed) return;
    setSpinning(true);
    playToneSound("whoosh", tone);

    const target = 1800 + Math.random() * 720;
    const start = angle;
    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = start + target * eased;
      setAngle(current);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        setLanded(true);
        playToneSound("ding", tone);
        setTimeout(() => onComplete(), 800);
      }
    };
    requestAnimationFrame(animate);
  }, [spinning, landed, angle, tone, onComplete]);

  const segmentAngle = 360 / SEGMENTS.length;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <div className="relative">
        <div
          ref={wheelRef}
          className="h-52 w-52 rounded-full transition-all duration-100 sm:h-60 sm:w-60"
          style={{
            transform: `rotate(${angle}deg)`,
            background: `conic-gradient(${SEGMENTS.map(
              (_, i) =>
                `${COLORS[i % COLORS.length]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
            ).join(", ")})`,
            boxShadow: landed ? "0 0 40px rgba(255,107,138,0.3)" : "0 0 20px rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex h-full items-center justify-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-ink text-xl font-bold text-white shadow-lg">
              🎯
            </div>
          </div>
        </div>

        {/* Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-white/80" />
        </div>

        {/* Segment labels */}
        {!spinning && !landed && (
          <div className="absolute inset-0 flex items-center justify-center">
            {SEGMENTS.map((seg, i) => {
              const a = i * segmentAngle + segmentAngle / 2;
              const rad = (a * Math.PI) / 180;
              const r = 72;
              const x = 50 + (r / 130) * 50 * Math.sin(rad);
              const y = 50 - (r / 130) * 50 * Math.cos(rad);
              return (
                <span
                  key={i}
                  className="absolute text-[7px] font-bold leading-tight text-white/80 sm:text-[8px]"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {seg.split(" ")[0]}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {!spinning && !landed && (
        <button
          type="button"
          onClick={spin}
          className="premium-button text-sm"
        >
          Spin the wheel
        </button>
      )}

      {spinning && (
        <p className="animate-pulse text-xs tracking-widest text-white/30 uppercase">
          Spinning...
        </p>
      )}

      {landed && (
        <p className="animate-reveal-up text-sm font-bold text-ember">
          Landed on your roast! 🔥
        </p>
      )}
    </div>
  );
}
