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

export function DominoChainGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;

  const chunks = useMemo(() => {
    const words = message.split(/\s+/).filter(Boolean);
    if (words.length <= 10) return words;
    const perChunk = Math.ceil(words.length / 10);
    const result: string[] = [];
    for (let i = 0; i < words.length; i += perChunk) {
      result.push(words.slice(i, i + perChunk).join(" "));
      if (result.length >= 10) break;
    }
    return result;
  }, [message]);

  const [started, setStarted] = useState(false);
  const [fallen, setFallen] = useState<number[]>([]);
  const [showFinal, setShowFinal] = useState(false);

  function tip() {
    if (started) return;
    setStarted(true);
    playToneSound("whoosh", tone);
    chunks.forEach((_, i) => {
      setTimeout(() => {
        setFallen((prev) => [...prev, i]);
        if (i === chunks.length - 1) {
          setTimeout(() => {
            playToneSound("ding", tone);
            hapticTone("ding", tone);
            setShowFinal(true);
          }, 500);
        }
      }, i * 150);
    });
  }

  const totalSteps = chunks.length + 1;
  const step = fallen.length;

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Domino Chain</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {started ? "Chain reaction" : "Tip the first domino"}
            </h2>
            <p className="mt-5 text-white/75">
              {started ? "Watch the chain topple..." : "Click to start the chain reaction. Each fallen piece reveals a word."}
            </p>
            <div className="mt-8 flex flex-col items-center">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {chunks.map((chunk, i) => (
                  <div
                    key={i}
                    className={`flex h-10 items-center justify-center rounded-md border px-2 text-[10px] font-bold leading-tight transition-all duration-200 sm:h-12 sm:px-3 sm:text-xs ${
                      fallen.includes(i)
                        ? "border-white/30 bg-white/15 text-white opacity-90 [transform:rotate(85deg)] origin-bottom"
                        : "border-white/10 bg-white/5 text-white/40"
                    }`}
                    style={{
                      transitionDelay: fallen.includes(i) ? "0ms" : `${i * 150}ms`,
                    }}
                  >
                    {fallen.includes(i) ? chunk : ""}
                  </div>
                ))}
              </div>
              {!started && (
                <button onClick={tip} className="premium-button mt-8">
                  Tip the first one
                </button>
              )}
              {fallen.length > 0 && (
                <div className="mt-8 w-full animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Message revealed</p>
                  <p className="mt-1 text-sm font-bold text-white/90">
                    {fallen.map((i) => chunks[i]).join(" ")}
                  </p>
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
