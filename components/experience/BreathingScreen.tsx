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
        <div className="breath-circle h-28 w-28 rounded-full border border-rose-200/30 bg-rose-200/20 shadow-[0_0_80px_rgba(212,160,128,.22)] sm:h-36 sm:w-36" />
      </div>
      <p className="text-white/70">Comfort unlocks in <strong className="text-white">{remaining}</strong> seconds.</p>
    </div>
  );
}
