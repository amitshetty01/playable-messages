"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function TypewriterText({ text, speed = 30, className, onComplete, isPaused = false }: { text: string; speed?: number; className?: string; onComplete?: () => void; isPaused?: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    indexRef.current = 0;
    lastTimeRef.current = 0;
    setDisplayed("");
    setDone(false);
  }, []);

  useEffect(() => {
    reset();
    if (!text) { setDone(true); setDisplayed(""); onComplete?.(); return; }
    if (isPaused) { setDisplayed(text); setDone(true); return; } // Skip typing if paused

    let accumulated = 0;
    const step = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      accumulated += timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      while (accumulated >= speed && indexRef.current < text.length) {
        accumulated -= speed;
        indexRef.current++;
      }

      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current < text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDone(true);
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [text, speed, reset, onComplete]);

  function skip() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    indexRef.current = text.length;
    setDisplayed(text);
    setDone(true);
    onComplete?.();
  }

  const isTyping = !done && displayed.length > 0;

  return (
    <span className={className} onClick={skip} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") skip(); }} role="button" tabIndex={0} aria-label={isTyping ? "Click to skip typewriter" : "Text revealed"}>
      {displayed}
      {isTyping ? <span className="inline-block w-[2px] h-[1em] ml-[1px] bg-white/60 align-middle animate-pulse" /> : null}
    </span>
  );
}
