"use client";

import { useState, useCallback } from "react";
import { TypewriterText } from "@/components/TypewriterText";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import { useShakeDetection } from "@/lib/useShakeDetection";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

export function ClimbMountainGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const roastLine = experience.customMessages.steps[0] || "You call that a comeback?";
  const message = experience.finalMessage;
  const [step, setStep] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  const checkpoints = [
    { label: "Base camp", text: roastLine },
    { label: "Checkpoint 1", text: "Steady pace. You might make it." },
    { label: "Checkpoint 2", text: "Almost there. The air is thinning." },
  ];

  const advance = useCallback(() => {
    if (step >= 3 || showFinal) return;
    if (step >= 2) {
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setStep(3);
      setTimeout(() => setShowFinal(true), 1500);
    } else {
      playToneSound("whoosh", tone);
      hapticTone("tap", tone);
      setStep((s) => s + 1);
    }
  }, [step, showFinal, tone]);

  useShakeDetection(advance, 18);

  const current = checkpoints[Math.min(step, 2)];
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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{current.label}</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {step >= 3 ? "Summit reached" : "Climb the mountain"}
            </h2>
            <div className="mt-8 flex flex-col items-center">
              <div className="relative h-64 w-full max-w-xs">
                <svg viewBox="0 0 200 200" className="h-full w-full">
                  <path d="M0 200 L40 130 L80 160 L120 90 L160 120 L200 60 L200 200 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <circle
                    cx={[40, 80, 120, 160][Math.min(step, 3)]}
                    cy={[190, 155, 110, 58][Math.min(step, 3)]}
                    r="6"
                    className="fill-amber-400 drop-shadow-lg transition-all duration-500"
                  />
                  {[0, 1, 2, 3].map((i) => (
                    <circle key={i} cx={[40, 80, 120, 160][i]} cy={[190, 155, 110, 58][i]} r="3" fill="rgba(255,255,255,0.3)" />
                  ))}
                  <text x="30" y="170" className="fill-white/40 text-[7px] font-bold">Base</text>
                  <text x="155" y="50" className="fill-white/40 text-[7px] font-bold">Summit</text>
                </svg>
                {step === 3 && (
                  <div className="absolute top-0 right-8 text-2xl animate-bounce">🚩</div>
                )}
              </div>
              <div className="mt-6 w-full rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                {step < 3 ? (
                  <p className="text-base font-semibold text-white/80"><TypewriterText text={current.text} speed={25} /></p>
                ) : (
                  <div className="animate-section-fade">
                    <p className="text-xs font-bold text-white/40">At the summit</p>
                    <p className="mt-1 text-lg font-bold text-white/90"><TypewriterText text={message} speed={40} /></p>
                  </div>
                )}
              </div>
              {step < 3 && (
                <p className="mt-4 text-xs text-white/30">Shake your device to climb — {3 - step} checkpoint{3 - step !== 1 ? "s" : ""} ahead</p>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <Watermark />
    </ExperienceLayout>
  );
}
