"use client";

import { useState } from "react";

export function CatchObjectExperience({ lines, onComplete }: { lines: string[]; onComplete: () => void }) {
  const [caught, setCaught] = useState(0);
  const [position, setPosition] = useState({ left: 46, top: 42 });
  const shown = lines.slice(0, caught);

  function catchIt() {
    const next = caught + 1;
    if (next >= 3) {
      onComplete();
      return;
    }
    setCaught(next);
    setPosition({ left: Math.round(Math.random() * 64 + 18), top: Math.round(Math.random() * 50 + 20) });
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-bold text-white/70">Catch the card 3 times. Current catches: {caught}/3</p>
      <div className="relative mt-4 min-h-64 overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/[0.06] sm:min-h-72">
        <button
          className="absolute w-auto rounded-full bg-gradient-to-br from-white to-yellow-100 px-4 py-3 font-extrabold text-ink shadow-soft transition-all hover:scale-105 sm:px-6 sm:py-4"
          type="button"
          onClick={catchIt}
          style={{ left: `${position.left}%`, top: `${position.top}%`, transform: "translate(-50%, -50%)" }}
        >
          Catch me
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {shown.map((line) => <p className="break-words rounded-2xl border border-white/15 bg-white/10 p-3 text-white/80" key={line}>{line}</p>)}
      </div>
    </div>
  );
}
