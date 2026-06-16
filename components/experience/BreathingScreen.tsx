"use client";

import { useEffect, useState } from "react";

export function BreathingScreen({ seconds = 10, onComplete }: { seconds?: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          onComplete();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="mt-8 text-center">
      <div className="mx-auto grid min-h-48 place-items-center sm:min-h-56">
        <div className="breath-circle h-28 w-28 rounded-full border border-cyan-100/30 bg-cyan-100/20 shadow-[0_0_80px_rgba(35,211,238,.22)] sm:h-36 sm:w-36" />
      </div>
      <p className="text-white/70">Comfort unlocks in <strong className="text-white">{remaining}</strong> seconds.</p>
    </div>
  );
}
