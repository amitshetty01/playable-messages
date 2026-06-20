"use client";

import { useState, useEffect } from "react";

const notes = [
  "That button has trust issues.",
  "It panicked. Try again, gently.",
  "Forgiveness is buffering dramatically.",
  "It moved before you could catch it.",
  "Almost. It is getting suspiciously fast.",
  "Okay. The button is tired of running now."
];

export function MovingButton({ label, onComplete }: { label: string; onComplete: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ left: 50, top: 50 });

  useEffect(() => {
    if (attempts >= 7) onComplete();
  }, [attempts, onComplete]);

  function attempt() {
    setAttempts((current) => current + 1);
    if (attempts < 6) setPosition({ left: Math.round(Math.random() * 72 + 14), top: Math.round(Math.random() * 58 + 21) });
  }

  return (
    <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-dashed border-white/20 bg-white/10 p-4 sm:p-5">
      <p className="mb-5 min-h-6 text-sm font-bold text-white/75">{notes[Math.max(0, attempts - 1)] || "Try pressing the forgiveness button."}</p>
      <div className="relative min-h-56 overflow-hidden rounded-[1.2rem] bg-white/[0.04] sm:min-h-72">
        <button
          className="absolute w-auto -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-gradient-to-br from-white/25 to-white/10 px-5 py-3 font-extrabold text-white shadow-soft transition-[left,top,transform] duration-500 hover:scale-105 sm:px-6 sm:py-4"
          type="button"
          onClick={attempt}
          onPointerEnter={attempt}
          style={{ left: `${position.left}%`, top: `${position.top}%` }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
