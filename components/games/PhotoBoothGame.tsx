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
import { splitMessage } from "@/lib/splitMessage";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

export function PhotoBoothGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const fragments = splitMessage(message, 4);
  const userImages = experience.images?.filter(Boolean) ?? [];
  const hasImages = userImages.length > 0;
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFinal, setShowFinal] = useState(false);

  function takePhoto() {
    if (slots.length >= 4) return;
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setFlash(true);
        playToneSound("ding", tone);
        hapticTone("ding", tone);
        setTimeout(() => {
          setFlash(false);
          const nextSlots = [...slots, fragments[slots.length]];
          setSlots(nextSlots);
          if (nextSlots.length >= 4) {
            setTimeout(() => setShowFinal(true), 1500);
          }
        }, 300);
      }
    }, 1000);
  }

  const step = slots.length;
  const totalSteps = 5;

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Photo Booth</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {!started ? "Step into the booth" : slots.length >= 4 ? "Strip complete" : `Photo ${slots.length + 1} of 4`}
            </h2>
            <p className="mt-5 text-white/75">
              {!started ? "Four photos. Four flashes. Your message appears strip by strip." : null}
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="relative w-56 rounded-2xl border-2 border-white/15 bg-black/40 p-4 sm:w-64">
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`relative flex h-14 items-center justify-center rounded-lg border border-dashed text-sm font-bold transition-all duration-500 overflow-hidden ${
                      i < slots.length
                        ? "border-white/30 bg-white/10 text-white/90"
                        : i === slots.length && slots.length < 4
                          ? "border-amber-400/40 text-white/30"
                          : "border-white/10 text-white/20"
                    }`}>
                      {i < slots.length ? (
                        hasImages && userImages[i] ? (
                          <>
                            <img src={userImages[i]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
                            <span className="relative z-10"><TypewriterText text={slots[i]} speed={15} /></span>
                          </>
                        ) : (
                          <TypewriterText text={slots[i]} speed={15} />
                        )
                      ) : (
                        <span>Photo {i + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {flash && <div className="fixed inset-0 z-50 bg-white animate-flash-fade pointer-events-none" />}
              {countdown !== null && (
                <div className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl font-extrabold text-white animate-ping-slow">
                  {countdown}
                </div>
              )}
              {slots.length < 4 && (
                <button
                  onClick={started ? takePhoto : () => { setStarted(true); takePhoto(); }}
                  disabled={countdown !== null}
                  className="premium-button"
                >
                  {!started ? "Start" : countdown !== null ? "Flash!" : "Snap photo"}
                </button>
              )}
              {slots.length >= 4 && (
                <div className="animate-section-fade rounded-xl border border-white/15 bg-white/10 p-4 text-center">
                  <p className="text-xs font-bold text-white/40">Strip complete — slide out</p>
                  <p className="mt-1 text-sm text-white/80"><TypewriterText text={message} speed={40} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <style jsx>{`
        @keyframes flash-fade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
