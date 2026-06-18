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

const FILLERS = ["You will eat a snack today.", "An old friend will text you."];

export function FortuneCookieGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const fillerLines = experience.customMessages.steps.slice(0, 2);
  while (fillerLines.length < 2) fillerLines.push(FILLERS[fillerLines.length]);

  const [cookies, setCookies] = useState([false, false, false]);
  const [revealedFortunes, setRevealedFortunes] = useState<string[]>([]);
  const [showFinal, setShowFinal] = useState(false);

  function crackCookie(index: number) {
    if (cookies[index]) return;
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    const updated = [...cookies];
    updated[index] = true;
    setCookies(updated);
    const fortune = index === 2 ? message : fillerLines[index];
    setRevealedFortunes((prev) => [...prev, fortune]);
    if (index === 2) {
      setTimeout(() => setShowFinal(true), 1200);
    }
  }

  const allCookies = cookies.every(Boolean);
  const totalSteps = 4;
  const step = cookies.filter(Boolean).length;

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Crack open a cookie</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Your fortune awaits</h2>
            <p className="mt-5 text-white/75">Each cookie holds a fortune. The last one holds the real message.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {cookies.map((cracked, i) => (
                <button
                  key={i}
                  onClick={() => crackCookie(i)}
                  disabled={cracked}
                  className={`relative flex h-28 w-28 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 sm:h-32 sm:w-32 ${
                    cracked
                      ? "border-amber-400/30 bg-amber-400/10 opacity-60"
                      : "border-amber-300/40 bg-amber-300/20 hover:scale-105 hover:border-amber-300/60 hover:bg-amber-300/30"
                  }`}
                >
                  {cracked ? (
                    <span className="text-3xl">🥠</span>
                  ) : (
                    <>
                      <span className="text-3xl">🥟</span>
                      <span className="mt-1 text-[10px] font-bold text-amber-200/70">Cookie {i + 1}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
            {revealedFortunes.length > 0 && (
              <div className="mt-6 space-y-3">
                {revealedFortunes.map((fortune, i) => (
                  <div key={i} className="animate-section-fade rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xs font-bold text-white/40">Fortune {i + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-white/80"><TypewriterText text={fortune} speed={30} /></p>
                  </div>
                ))}
              </div>
            )}
          </PlayerCard>
        </StepTransition>
      ) : final}
      <Watermark />
    </ExperienceLayout>
  );
}
