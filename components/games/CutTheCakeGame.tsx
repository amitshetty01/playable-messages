"use client";

import { useRef, useState, useCallback, useMemo, useEffect, lazy, Suspense } from "react";
import type { Tone } from "@/lib/types";
import { playToneSound } from "@/lib/flowSounds";

const LazyCakeScene = lazy(() => import("./CakeScene").then((m) => ({ default: m.CakeScene })));

export function CutTheCakeGame({
  onComplete,
  tone,
}: {
  onComplete: () => void;
  tone: Tone;
}) {
  const [cut, setCut] = useState(false);
  const [ready, setReady] = useState(false);

  const handleCut = useCallback(() => {
    if (cut) return;
    setCut(true);
    playToneSound("ding", tone);
    setTimeout(() => onComplete(), 1500);
  }, [cut, tone, onComplete]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4">
      <div className="relative h-64 w-full max-w-sm sm:h-72 sm:max-w-md">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <span className="animate-pulse text-4xl">🎂</span>
            </div>
          }
        >
          <LazyCakeScene cut={cut} onCut={handleCut} />
        </Suspense>
      </div>

      <div className="flex items-center gap-2">
        {!cut && <p className="text-xs tracking-widest text-white/30 uppercase">Drag across the cake to cut it</p>}
        {cut && <p className="animate-reveal-up text-sm font-bold text-gold">Cake cut! 🎉</p>}
      </div>
    </div>
  );
}
