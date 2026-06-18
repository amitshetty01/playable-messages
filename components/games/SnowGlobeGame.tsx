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

export function SnowGlobeGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const [shaking, setShaking] = useState(false);
  const [settled, setSettled] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [particleOffset] = useState(() => Array.from({ length: 40 }, () => ({ x: 20 + Math.random() * 60, y: 10 + Math.random() * 40 })));

  const doShake = useCallback(() => {
    if (shaking || settled) return;
    setShaking(true);
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    setTimeout(() => {
      setShaking(false);
      setSettled(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 2000);
    }, 2000);
  }, [shaking, settled, tone]);

  useShakeDetection(doShake);

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
        <StepTransition step={settled ? 2 : shaking ? 1 : 0}>
          <PlayerCard>
            <ProgressBar current={settled ? 100 : shaking ? 60 : 1} total={100} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Snow Globe</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {shaking ? "Shaking..." : settled ? "The snow settles" : "Shake the globe"}
            </h2>
            <p className="mt-5 text-white/75">
              {shaking ? "Watch the snow swirl..." : settled ? "The message appears in the glass." : "Shake your device or tap the globe to see what's inside."}
            </p>
            <div className="mt-10 flex flex-col items-center">
              <div
                className={`relative h-56 w-56 rounded-full border-2 border-white/20 bg-gradient-to-br from-sky-400/20 via-blue-500/10 to-indigo-600/20 transition-all duration-500 cursor-pointer select-none ${shaking ? "animate-shake" : settled ? "" : "hover:scale-105 hover:border-white/40"}`}
                onClick={shaking || settled ? undefined : doShake}
              >
                <div className="absolute inset-4 flex items-center justify-center overflow-hidden rounded-full">
                  <div className={`text-center transition-all duration-1000 ${settled ? "opacity-100" : "opacity-30"}`}>
                    <p className={`px-4 text-sm font-bold leading-snug text-white/90 transition-all duration-1000 ${settled ? "" : "blur-sm"}`}>
                      {settled ? <TypewriterText text={message} speed={30} /> : message}
                    </p>
                  </div>
                  {particleOffset.map((p, i) => (
                    <div
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full bg-white"
                      style={{
                        left: `${p.x}%`,
                        top: shaking ? `${10 + Math.random() * 60}%` : settled ? `${p.y}%` : `${p.y}%`,
                        opacity: shaking ? 0.9 : settled ? 0 : 0.6,
                        animation: shaking ? `snow-swirl-${i % 3} 1.5s ease-in-out ${Math.random() * 200}ms` : "none",
                        transition: "all 1.5s ease-in-out",
                      }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              </div>
              {!shaking && !settled && (
                <p className="mt-4 text-xs text-white/30">Shake your device or tap the globe</p>
              )}
              {settled && (
                <div className="mt-8 w-full animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Etched in glass</p>
                  <p className="mt-1 text-base font-bold text-white/90"><TypewriterText text={message} speed={40} /></p>
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
