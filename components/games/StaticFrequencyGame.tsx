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

function randomFreq(min: number, max: number) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

export function StaticFrequencyGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;

  const [target] = useState(() => randomFreq(88, 108));
  const [freq, setFreq] = useState(() => randomFreq(88, 108));
  const [tuned, setTuned] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const staticOpacity = tuned ? 0 : Math.max(0, 1 - Math.abs(freq - target) / 20);

  function tuneUp() {
    if (tuned) return;
    playToneSound("tap", tone);
    const next = Math.min(108, freq + 0.3);
    setFreq(Math.round(next * 10) / 10);
    checkTuned(Math.round(next * 10) / 10);
  }

  function tuneDown() {
    if (tuned) return;
    playToneSound("tap", tone);
    const next = Math.max(88, freq - 0.3);
    setFreq(Math.round(next * 10) / 10);
    checkTuned(Math.round(next * 10) / 10);
  }

  function checkTuned(current: number) {
    if (Math.abs(current - target) <= 0.2) {
      setTuned(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 1500);
    }
  }

  const totalSteps = 7;
  const step = tuned ? 6 : Math.min(Math.floor((1 - staticOpacity) * 5), 5);

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Static Frequency</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {tuned ? "Locked in" : "Tune the dial"}
            </h2>
            <p className="mt-5 text-white/75">
              {tuned ? "The signal is clear." : "Turn the dial through the static until you find the right frequency."}
            </p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="relative flex h-48 w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 sm:h-56">
                <div className="relative z-10 text-center">
                  <p className="text-2xl font-mono font-bold text-white/80">{freq.toFixed(1)} FM</p>
                  {tuned ? (
                    <div className="mt-4 animate-section-fade">
                      <p className="text-xs font-bold text-emerald-400/80">ON AIR</p>
                      <p className="mt-2 text-sm font-bold text-white/90"><TypewriterText text={message} speed={30} /></p>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-white/40">Searching...</p>
                  )}
                </div>
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{ opacity: staticOpacity }}
                >
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-px w-full bg-white/10"
                      style={{
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.8,
                      }}
                    />
                  ))}
                </div>
              </div>
              {!tuned && (
                <div className="flex gap-4">
                  <button onClick={tuneDown} className="ghost-button">
                    ← Tune down
                  </button>
                  <button onClick={tuneUp} className="ghost-button">
                    Tune up →
                  </button>
                </div>
              )}
              {tuned && (
                <div className="w-full animate-section-fade rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center">
                  <p className="text-xs font-bold text-emerald-300/80">Signal locked</p>
                  <p className="mt-1 text-sm font-bold text-white/90"><TypewriterText text={message} speed={40} /></p>
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
