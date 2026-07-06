"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { playToneSound } from "@/lib/flowSounds";
import type { Tone } from "@/lib/types";

export function RatingRoastGame({
  onComplete,
  tone,
  variant,
}: {
  onComplete: () => void;
  tone: Tone;
  variant?: "slots" | "wheel";
}) {
  const isWheel = variant === "wheel";
  const [screen, setScreen] = useState<"rateme" | "rateu" | "done">("rateme");
  const [value, setValue] = useState(5);
  const [displayValue, setDisplayValue] = useState(5);
  const [attempts, setAttempts] = useState(0);
  const isSavage = tone === "Savage";

  const handleRateMe = useCallback((v: number) => {
    setAttempts((a) => a + 1);
    if (v <= 1) {
      setValue(10);
      setDisplayValue(10);
    } else {
      setValue(v);
      setDisplayValue(v);
    }
  }, []);

  const handleNext = useCallback(() => {
    playToneSound("whoosh", tone);
    setScreen("rateu");
  }, [tone]);

  const handleReveal = useCallback(() => {
    playToneSound("ding", tone);
    setScreen("done");
    setTimeout(() => onComplete(), 1200);
  }, [tone, onComplete]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      {screen === "rateme" && (
        <>
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {isSavage ? "STEP 1: JUDGMENT" : "Step 1"}
            </p>
            <h2 className="display-title mt-2 text-3xl font-bold sm:text-4xl">
              {isSavage ? "RATE ME" : "Rate me from 1 to 10"}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {isSavage ? "Go ahead. I can take it." : "Be honest... or not"}
            </p>
          </div>

          <div className="w-full max-w-xs text-center">
            <div
              className={`text-7xl font-black tabular-nums tracking-tighter transition-all duration-150 ${
                displayValue >= 8 ? "text-green-400" : displayValue <= 3 ? "text-red-400" : "text-white"
              }`}
              key={`${displayValue}-${attempts}`}
            >
              {displayValue}
            </div>
            {isWheel ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleRateMe(n)}
                    className={`grid h-10 w-10 place-items-center rounded-full text-sm font-extrabold transition-all duration-200 ${
                      displayValue === n
                        ? "scale-110 bg-amber-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.4)]"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="mt-2 flex justify-between px-1 text-[10px] text-white/30">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={value}
                  onChange={(e) => handleRateMe(Number(e.target.value))}
                  className="mt-3 w-full h-2 appearance-none rounded-full bg-white/15 accent-amber-400 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-lg"
                />
              </>
            )}
            <p className="mt-3 text-xs text-white/40">
              {attempts > 5
                ? isSavage
                  ? "You really want that 1, huh? 😈"
                  : "Keep dreaming 😏"
                : attempts > 2
                  ? isSavage
                    ? "Nice try. Try again."
                    : "Nice try 😏"
                  : "Drag to rate me"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="premium-button text-sm"
          >
            {isSavage ? "NEXT →" : "Next →"}
          </button>
        </>
      )}

      {screen === "rateu" && (
        <>
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {isSavage ? "STEP 2: THE TRUTH" : "Step 2"}
            </p>
            <h2 className="display-title mt-2 text-3xl font-bold sm:text-4xl">
              {isSavage ? "RATE YOURSELF" : "Now rate yourself"}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {isSavage ? "Let's see how you measure up." : "Be fair this time"}
            </p>
          </div>

          <div className="w-full max-w-xs text-center">
            <div className="text-7xl font-black tabular-nums tracking-tighter text-amber-400">
              0
            </div>
            {isWheel ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <div
                    key={n}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-extrabold text-white/30"
                  >
                    {n}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 flex justify-between px-1 text-[10px] text-white/30">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            )}
            <input
              type="range"
              min={0}
              max={10}
              defaultValue={8}
              onChange={() => {}}
              className="mt-3 w-full h-2 appearance-none rounded-full bg-white/15 accent-amber-400 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-lg"
            />
            <p className="mt-3 text-sm font-bold text-amber-400">
              {isSavage
                ? "ZERO. DELUSIONAL."
                : "Still 0. Try again."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReveal}
            className="premium-button text-sm"
          >
            {isSavage ? "REVEAL THE TRUTH" : "See the verdict"}
          </button>
        </>
      )}

      {screen === "done" && (
        <div className="animate-reveal-up text-center">
          <p className="text-6xl">{isSavage ? "💀" : "😂"}</p>
          <p className="mt-4 text-sm font-bold text-white/50">
            {isSavage
              ? "The council has spoken."
              : "The people have spoken."}
          </p>
        </div>
      )}
    </div>
  );
}
