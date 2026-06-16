"use client";

import { useEffect, useRef } from "react";

export function useAutoAdvance({ active, delay = 4000, onAdvance }: { active: boolean; delay?: number; onAdvance: () => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setTimeout(() => {
      onAdvance();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, delay, onAdvance]);
}
