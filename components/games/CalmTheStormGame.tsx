"use client";

import { useState, useRef, useEffect } from "react";
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

export function CalmTheStormGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const [breaths, setBreaths] = useState(0);
  const [holding, setHolding] = useState(false);
  const [circleSize, setCircleSize] = useState(60);
  const [showFinal, setShowFinal] = useState(false);
  const holdStart = useRef<number | null>(null);
  const animFrame = useRef<number | null>(null);

  const stormIntensity = Math.max(0, 1 - breaths / 3);

  function handlePointerDown() {
    if (breaths >= 3) return;
    holdStart.current = Date.now();
    setHolding(true);
  }

  function handlePointerUp() {
    if (!holdStart.current) return;
    const elapsed = Date.now() - holdStart.current;
    setHolding(false);
    setCircleSize(60);
    if (holdStart.current) animFrame.current && cancelAnimationFrame(animFrame.current);
    if (elapsed >= 1500) {
      const newBreaths = breaths + 1;
      setBreaths(newBreaths);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      if (newBreaths >= 3) {
        setTimeout(() => setShowFinal(true), 1500);
      }
    }
    holdStart.current = null;
  }

  useEffect(() => {
    if (holding) {
      function grow() {
        setCircleSize((s) => Math.min(s + 0.5, 120));
        animFrame.current = requestAnimationFrame(grow);
      }
      animFrame.current = requestAnimationFrame(grow);
    }
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [holding]);

  const totalSteps = 4;
  const step = breaths;

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
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {!showFinal ? (
        <StepTransition step={step}>
          <PlayerCard>
            <ProgressBar current={step + 1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Calm the Storm</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {breaths >= 3 ? "Storm settled" : `Breathe through the storm (${breaths}/3)`}
            </h2>
            <p className="mt-5 text-white/75">
              {breaths >= 3 ? "The storm has passed. Your apology is clear." : "Press and hold to inhale. Release after 1.5s to exhale. Calm the storm one breath at a time."}
            </p>
            <div className="relative mt-10 flex flex-col items-center">
              <div
                className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl"
                style={{
                  background: `linear-gradient(180deg, rgba(60,60,120,${0.3 + stormIntensity * 0.5}) 0%, rgba(30,30,80,${0.4 + stormIntensity * 0.4}) 100%)`,
                }}
              >
                {stormIntensity > 0 && (
                  <>
                    {Array.from({ length: Math.ceil(stormIntensity * 15) }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-px w-20 bg-white/20"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          transform: `rotate(${Math.random() * 60 - 30}deg)`,
                          animation: `rain-fall ${0.5 + Math.random() * 0.5}s linear infinite`,
                          animationDelay: `${Math.random() * 0.5}s`,
                        }}
                      />
                    ))}
                  </>
                )}
                <button
                  onMouseDown={handlePointerDown}
                  onMouseUp={handlePointerUp}
                  onMouseLeave={handlePointerUp}
                  onTouchStart={handlePointerDown}
                  onTouchEnd={handlePointerUp}
                  className="relative z-10 cursor-pointer select-none"
                  style={{ touchAction: "none" }}
                >
                  <div
                    className="rounded-full bg-gradient-to-br from-white/30 to-white/10 transition-all duration-100"
                    style={{
                      width: `${circleSize}px`,
                      height: `${circleSize}px`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center text-xs font-bold text-white/60">
                      {holding ? "Hold" : breaths >= 3 ? "✓" : "Tap"}
                    </div>
                  </div>
                </button>
                {holding && (
                  <p className="absolute bottom-6 text-xs font-bold text-white/40 animate-pulse">
                    Keep holding... release after 1.5s
                  </p>
                )}
                {!holding && breaths > 0 && breaths < 3 && (
                  <p className="absolute bottom-6 text-xs font-bold text-emerald-300/60">
                    {breaths === 1 ? "Good. Two more." : "Almost there. One more."}
                  </p>
                )}
              </div>
              {breaths >= 3 && (
                <div className="mt-6 w-full animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Storm cleared</p>
                  <p className="mt-1 text-lg font-bold text-white/90"><TypewriterText text={message} speed={40} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <style jsx>{`
        @keyframes rain-fall {
          0% { transform: translateY(-20px) rotate(15deg); opacity: 0.3; }
          100% { transform: translateY(200px) rotate(15deg); opacity: 0; }
        }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
