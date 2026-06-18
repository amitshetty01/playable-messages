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

const FILLERS = ["Ask again later.", "Signs point to maybe."];

export function ShakeForAnswerGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const fillerLines = experience.customMessages.steps.slice(0, 2);
  while (fillerLines.length < 2) fillerLines.push(FILLERS[fillerLines.length]);

  const [shakeCount, setShakeCount] = useState(0);
  const [wobbling, setWobbling] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [showFinal, setShowFinal] = useState(false);

  const doShake = useCallback(() => {
    if (wobbling || shakeCount >= 3) return;
    setWobbling(true);
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    setTimeout(() => {
      setWobbling(false);
      if (shakeCount >= 2) {
        setCurrentAnswer(message);
        setTimeout(() => setShowFinal(true), 1500);
      } else {
        setCurrentAnswer(fillerLines[shakeCount]);
      }
      setShakeCount((c) => c + 1);
    }, 600);
  }, [wobbling, shakeCount, tone, message, fillerLines]);

  useShakeDetection(doShake);

  const step = Math.min(shakeCount, 3);
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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Shake for an Answer</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Shake the ball</h2>
            <p className="mt-5 text-white/75">Shake your device or tap the ball. Three shakes — the last one holds the real answer.</p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div
                className={`flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-800/20 border-2 border-purple-400/30 transition-all cursor-pointer select-none ${wobbling ? "animate-shake" : "hover:scale-105 hover:border-purple-300/60"}`}
                onClick={doShake}
              >
                <span className="text-6xl">🔮</span>
              </div>
              {wobbling && <p className="text-sm text-white/40 animate-pulse">Shaking...</p>}
              {shakeCount < 3 && !wobbling && (
                <p className="text-xs text-white/30">{3 - shakeCount} shake{3 - shakeCount !== 1 ? "s" : ""} remaining — shake your device or tap the ball</p>
              )}
              {currentAnswer && (
                <div className="animate-section-fade w-full rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">{shakeCount >= 3 ? "Your message" : "Fortune says"}</p>
                  <p className="mt-1 text-base font-bold text-white/90 sm:text-lg"><TypewriterText text={currentAnswer} speed={shakeCount >= 3 ? 40 : 20} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <Watermark />
    </ExperienceLayout>
  );
}
