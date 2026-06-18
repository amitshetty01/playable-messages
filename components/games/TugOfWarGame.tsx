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
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

export function TugOfWarGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const [position, setPosition] = useState(0);
  const [pulls, setPulls] = useState(0);
  const [won, setWon] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  function pull() {
    if (won) return;
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    const newPulls = pulls + 1;
    let newPos = position + 10;
    if (newPulls % 3 === 0) {
      newPos = Math.max(0, newPos - 3);
    }
    if (newPos >= 90) {
      setPosition(100);
      setWon(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 1500);
    } else {
      setPosition(newPos);
    }
    setPulls(newPulls);
  }

  const totalSteps = 11;
  const step = Math.min(Math.floor(position / 10), 10);

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Tug of War</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {won ? "You won!" : "Pull the rope"}
            </h2>
            <p className="mt-5 text-white/75">
              {won ? "You earned the message." : "Pull steadily. Every 3rd pull the rope slips back. Keep going until you win the message."}
            </p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="relative h-6 w-full max-w-sm rounded-full bg-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2 w-full rounded-full bg-white/5 mx-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-200"
                      style={{ width: `${position}%` }}
                    />
                  </div>
                </div>
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-200"
                  style={{ left: `calc(${position}% - 10px)` }}
                />
              </div>
              <div className="flex justify-between w-full max-w-sm text-xs text-white/40">
                <span>You</span>
                <span>Opponent</span>
              </div>
              {!won && (
                <button onClick={pull} className="premium-button">
                  Pull!
                </button>
              )}
              {won && (
                <div className="mt-4 w-full animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Message earned</p>
                  <p className="mt-1 text-lg font-bold text-white/90"><TypewriterText text={message} speed={40} /></p>
                </div>
              )}
              {pulls > 0 && !won && (
                <p className="text-xs text-white/40">
                  Pulls: {pulls} {pulls % 3 === 0 && position < 90 ? "(slipped back!)" : ""}
                </p>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <Watermark />
    </ExperienceLayout>
  );
}
