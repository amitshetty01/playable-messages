"use client";

import { useState, useEffect, useCallback } from "react";
import { TypewriterText } from "@/components/TypewriterText";

export function FinalReveal({ message, onReveal }: { message: string; onReveal?: () => void }) {
  const [phase, setPhase] = useState<"envelope" | "tearing" | "revealed" | "done">("envelope");
  const [tearProgress, setTearProgress] = useState(0);

  const startTear = useCallback(() => {
    setPhase("tearing");
    let p = 0;
    const interval = setInterval(() => {
      p += 0.04;
      setTearProgress(Math.min(p, 1));
      if (p >= 1) {
        clearInterval(interval);
        setPhase("revealed");
      }
    }, 30);
  }, []);

  useEffect(() => {
    if (phase === "envelope") {
      const t = setTimeout(startTear, 600);
      return () => clearTimeout(t);
    }
  }, [phase, startTear]);

  useEffect(() => {
    if (phase === "revealed") {
      const t = setTimeout(() => {
        setPhase("done");
        onReveal?.();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [phase, onReveal]);

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {phase === "envelope" || phase === "tearing" ? (
        <button
          type="button"
          onClick={startTear}
          className="relative w-full cursor-pointer text-center"
        >
          <div
            className="mx-auto grid h-48 w-48 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br from-blush/20 via-violet/20 to-neon/20 backdrop-blur-sm transition duration-500 hover:scale-105 hover:shadow-xl"
            style={{
              clipPath: phase === "tearing" ? `inset(0 ${(1 - tearProgress) * 50}% 0 ${(1 - tearProgress) * 50}%)` : undefined,
              transform: phase === "tearing" ? `scale(${1 - tearProgress * 0.15})` : undefined,
              opacity: phase === "tearing" ? 1 - tearProgress * 0.5 : undefined,
            }}
          >
            <svg className="size-16 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
            </svg>
            <p className="mt-4 text-sm font-bold text-white/60">Tap to open</p>
          </div>
        </button>
      ) : null}
      {phase === "revealed" || phase === "done" ? (
        <div className="animate-[section-in_500ms_cubic-bezier(.22,1,.36,1)_both]">
          <p className="text-xs font-bold tracking-[0.08em] text-white/50 text-center">Final reveal</p>
          <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl text-center">
            <TypewriterText text={message} speed={20} />
          </h2>
        </div>
      ) : null}
    </div>
  );
}
