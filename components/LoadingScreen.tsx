"use client";

import { useEffect, useState, useRef } from "react";

type LoadingScreenProps = {
  name?: string;
  message?: string;
  onComplete?: () => void;
  duration?: number;
};

export function LoadingScreen({ name = "", message = "Creating something", onComplete, duration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = Date.now();
    function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        onComplete?.();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#15101f]">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-ping rounded-full bg-pink-500/20" />
        <div className="absolute h-20 w-20 animate-pulse rounded-full bg-fuchsia-500/30" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-500 to-purple-600 shadow-lg shadow-fuchsia-500/30">
          <span className="text-2xl">💌</span>
        </div>
      </div>

      <p className="text-xl font-bold text-white">
        {message}
        {name && <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-fuchsia-300"> {name}</span>}
        <span className="text-white/50">{dots}</span>
      </p>

      <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-pink-400/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}
