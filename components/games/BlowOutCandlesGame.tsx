"use client";

import { useState, useRef } from "react";
import { TypewriterText } from "@/components/TypewriterText";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

export function BlowOutCandlesGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const candleCount = 5;

  const [lit, setLit] = useState(Array(candleCount).fill(true));
  const [cakeCut, setCakeCut] = useState(false);
  const [knifePos, setKnifePos] = useState({ x: 50, y: 50 });
  const [showIcing, setShowIcing] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const cakeRef = useRef<HTMLDivElement>(null);

  function blowCandle(index: number) {
    if (!lit[index] || cakeCut) return;
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    const updated = [...lit];
    updated[index] = false;
    setLit(updated);
    if (updated.every((l) => !l)) {
      playToneSound("ding", tone);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!cakeRef.current || cakeCut) return;
    const rect = cakeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setKnifePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  function cutCake() {
    if (cakeCut) return;
    const allBlown = lit.every((l) => !l);
    if (!allBlown) return;
    setCakeCut(true);
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    setTimeout(() => {
      setShowIcing(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 3000);
    }, 800);
  }

  const blownCount = lit.filter((l) => !l).length;
  const allBlown = lit.every((l) => !l);
  const totalSteps = candleCount + 2;
  const step = cakeCut ? candleCount + 1 : blownCount;

  const final = (
    <FinalScreen
      ctaMessage={experience.customMessages.ctaMessage}
      experienceId={mode === "generated" ? experience.id : undefined}
      finalMessage={experience.finalMessage}
      shareUrl={shareUrl}
      templateId={template.id}
      templateTitle={template.title}
    />
  );

  return (
    <ExperienceLayout kicker="Happy Birthday" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {!showFinal ? (
        <StepTransition step={step}>
          <PlayerCard>
            <ProgressBar current={step + 1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Blow Out the Candles</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {cakeCut ? "Cake is cut!" : allBlown ? "Cut the cake!" : `Blow out candle ${blownCount + 1}`}
            </h2>
            <p className="mt-5 text-white/75">
              {cakeCut ? "The message appears in icing..." : allBlown ? "All candles out! Now move the knife and click to cut the cake." : "Click each candle to blow it out."}
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              {/* Cake area with candles + knife */}
              <div
                ref={cakeRef}
                className="relative h-64 w-full max-w-sm rounded-2xl bg-gradient-to-b from-amber-100/20 via-amber-200/10 to-amber-300/5 border-2 border-amber-400/20 overflow-hidden sm:h-72"
                onMouseMove={handleMouseMove}
                onClick={cutCake}
              >
                {/* Cake body */}
                <div className="absolute bottom-0 left-1/2 h-32 w-4/5 -translate-x-1/2 rounded-t-[3rem] bg-gradient-to-t from-amber-600/30 to-amber-400/20 border-2 border-amber-400/20">
                  {/* Icing layer */}
                  <div className="absolute -top-3 left-0 right-0 h-6 rounded-t-[3rem] bg-gradient-to-b from-white/30 to-transparent" />
                  {/* Cake split line */}
                  {cakeCut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-0.5 bg-white/30 animate-section-fade" />
                    </div>
                  )}
                </div>

                {/* Candles */}
                <div className="absolute bottom-32 left-1/2 flex -translate-x-1/2 gap-3">
                  {lit.map((isLit, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); blowCandle(i); }}
                      disabled={!isLit || cakeCut}
                      className={`flex flex-col items-center transition-all duration-300 ${isLit && !cakeCut ? "cursor-pointer hover:scale-110" : ""} ${!isLit ? "opacity-30" : ""}`}
                    >
                      {isLit ? (
                        <div className="mb-1">
                          <div className="h-6 w-2 animate-flicker rounded-full bg-gradient-to-t from-amber-400 via-yellow-300 to-white" style={{ animationDelay: `${i * 0.2}s` }} />
                        </div>
                      ) : (
                        <div className="mb-1 h-6 w-2 rounded-full bg-gray-500/30" />
                      )}
                      <div className="h-10 w-4 rounded-full bg-gradient-to-t from-rose-300/40 via-rose-200/30 to-rose-100/20 sm:h-12 sm:w-5" />
                    </button>
                  ))}
                </div>

                {/* Knife (follows cursor) */}
                {allBlown && !cakeCut && (
                  <div
                    className="absolute z-10 pointer-events-none transition-all duration-75"
                    style={{ left: `${knifePos.x}%`, top: `${knifePos.y}%`, transform: "translate(-50%, -50%) rotate(15deg)" }}
                  >
                    <svg viewBox="0 0 20 60" className="h-20 w-8 drop-shadow-lg">
                      <rect x="6" y="0" width="8" height="30" rx="1" fill="rgba(200,200,200,0.6)" />
                      <polygon points="10,30 0,55 20,55" fill="rgba(180,180,180,0.5)" />
                      <rect x="4" y="0" width="12" height="8" rx="2" fill="rgba(150,150,150,0.4)" />
                    </svg>
                  </div>
                )}

                {/* Click hint */}
                {allBlown && !cakeCut && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1 text-xs font-bold text-white/60 backdrop-blur-sm animate-pulse">
                    Click to cut
                  </div>
                )}
              </div>

              {/* Icing message */}
              {showIcing && (
                <div className="w-full animate-section-fade rounded-xl border border-amber-400/20 bg-amber-400/10 p-5 text-center">
                  <p className="text-xs font-bold text-amber-300/80">🎂 Icing message</p>
                  <p className="mt-1 text-lg font-bold text-white/90"><TypewriterText text={message} speed={35} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          25% { opacity: 0.8; transform: scaleY(0.9); }
          50% { opacity: 0.95; transform: scaleY(1.05); }
          75% { opacity: 0.7; transform: scaleY(0.85); }
        }
        .animate-flicker { animation: flicker 0.8s ease-in-out infinite; }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
