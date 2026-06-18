"use client";

import { useState, useMemo } from "react";
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

export function PaperAirplaneGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const [phase, setPhase] = useState<"idle" | "flying" | "landed" | "unfolded">("idle");
  const [showFinal, setShowFinal] = useState(false);

  function throwPlane() {
    if (phase !== "idle") return;
    setPhase("flying");
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    setTimeout(() => {
      setPhase("landed");
      playToneSound("ding", tone);
      setTimeout(() => {
        setPhase("unfolded");
        setTimeout(() => setShowFinal(true), 1500);
      }, 600);
    }, 1200);
  }

  const step = phase === "idle" ? 0 : phase === "flying" ? 1 : phase === "landed" ? 2 : 3;
  const totalSteps = 4;

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Paper Airplane</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {phase === "idle" ? "Fold and fling" : phase === "flying" ? "Flying..." : phase === "landed" ? "It landed!" : "Unfolded"}
            </h2>
            <p className="mt-5 text-white/75">
              {phase === "idle" ? "Fold your message into a paper airplane and fling it across the sky." : null}
            </p>
            <div className="mt-10 flex flex-col items-center">
              <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-b from-sky-500/20 to-indigo-600/10 sm:h-72">
                {phase === "idle" && (
                  <div className="absolute left-8 top-12 transition-all duration-700">
                    <svg viewBox="0 0 60 30" className="h-16 w-32 fill-white/80 drop-shadow-lg">
                      <polygon points="0,25 55,15 60,12 55,10 0,5 8,15" />
                    </svg>
                  </div>
                )}
                {phase === "flying" && (
                  <div className="absolute transition-all duration-[1200ms] animate-plane-fly">
                    <svg viewBox="0 0 60 30" className="h-12 w-24 fill-amber-300/80 drop-shadow-lg">
                      <polygon points="0,25 55,15 60,12 55,10 0,5 8,15" />
                    </svg>
                  </div>
                )}
                {phase === "landed" && (
                  <div className="absolute right-8 bottom-12 animate-bounce">
                    <svg viewBox="0 0 60 30" className="h-12 w-24 fill-white/60 drop-shadow-lg">
                      <polygon points="0,25 55,15 60,12 55,10 0,5 8,15" />
                    </svg>
                  </div>
                )}
                {phase === "unfolded" && (
                  <div className="absolute inset-4 flex items-center justify-center animate-section-fade">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center max-w-xs">
                      <p className="text-xs font-bold text-white/40">Unfolded message</p>
                      <p className="mt-2 text-sm font-bold text-white/90"><TypewriterText text={message} speed={30} /></p>
                    </div>
                  </div>
                )}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-white/20"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
              {phase === "idle" && (
                <button onClick={throwPlane} className="premium-button mt-6">
                  Throw it →
                </button>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <style jsx>{`
        @keyframes plane-fly {
          0% { left: 10%; top: 20%; transform: rotate(15deg) scale(1); }
          50% { left: 50%; top: 10%; transform: rotate(5deg) scale(0.8); }
          100% { left: 80%; top: 60%; transform: rotate(-10deg) scale(0.6); }
        }
        .animate-plane-fly { animation: plane-fly 1.2s ease-in-out forwards; }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
