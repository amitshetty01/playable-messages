"use client";

import { useState } from "react";
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

export function PartyPopperGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const [popped, setPopped] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; angle: number; delay: number }[]>([]);
  const [showFinal, setShowFinal] = useState(false);

  function pullString() {
    if (popped) return;
    playToneSound("ding", tone);
    hapticTone("ding", tone);
    setPopped(true);
    const colors = ["#ff5fb7", "#ffd166", "#23d3ee", "#7c5cff", "#ff6b8a", "#a070ff", "#4ade80"];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 50 + (Math.random() - 0.5) * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      delay: Math.random() * 300,
    }));
    setParticles(newParticles);
    setTimeout(() => setShowFinal(true), 2500);
  }

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
        <StepTransition step={popped ? 1 : 0}>
          <PlayerCard>
            <ProgressBar current={popped ? 100 : 1} total={100} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Party Popper</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Pull the string!</h2>
            <p className="mt-5 text-white/75">Pull the string on the party popper to reveal your message.</p>
            <div className="relative mt-10 flex flex-col items-center">
              <div className={`relative flex h-48 w-36 items-end justify-center rounded-t-[5rem] rounded-b-2xl bg-gradient-to-b from-amber-400/30 to-amber-600/20 border-2 border-amber-400/30 transition-all duration-500 ${popped ? "scale-105 opacity-80" : "hover:scale-105"}`}>
                {!popped && (
                  <div className="absolute -bottom-3 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-white/30" />
                )}
                {popped && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl">🎉</div>
                )}
                {!popped && (
                  <button
                    onClick={pullString}
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-6 py-2 text-sm font-bold text-white/80 hover:bg-white/20 transition-all"
                  >
                    Pull string ↓
                  </button>
                )}
              </div>
              {particles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      className="absolute h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: p.color,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        animation: `confetti-burst 0.9s ease-out ${p.delay}ms forwards`,
                        opacity: 0,
                      }}
                    />
                  ))}
                </div>
              )}
              {popped && (
                <div className="mt-8 w-full animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Your banner</p>
                  <p className="mt-2 text-lg font-bold text-white/90 sm:text-xl"><TypewriterText text={message} speed={30} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <style jsx>{`
        @keyframes confetti-burst {
          0% { transform: scale(0) translateY(0); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: scale(1) translateY(-80px) translateX(${Math.random() > 0.5 ? "" : "-"}40px); opacity: 0; }
        }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
