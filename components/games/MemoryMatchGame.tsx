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
import { splitMessage } from "@/lib/splitMessage";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

const PHOTO_COLORS = [
  "from-rose-400/20 to-rose-600/10",
  "from-amber-400/20 to-amber-600/10",
  "from-sky-400/20 to-sky-600/10",
  "from-emerald-400/20 to-emerald-600/10",
  "from-purple-400/20 to-purple-600/10",
];

const PHOTO_ICONS = ["📸", "📷", "🎞️", "🖼️", "📽️"];

export function MemoryMatchGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;

  const memories = useMemo(() => {
    const lines = splitMessage(message, 5);
    return lines.filter(Boolean);
  }, [message]);

  const [revealedCount, setRevealedCount] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  function revealNext() {
    if (revealedCount >= memories.length) return;
    const next = revealedCount + 1;
    setRevealedCount(next);
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    if (next >= memories.length) {
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 2000);
    }
  }

  const totalSteps = memories.length + 1;
  const step = revealedCount;

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Memory Match</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {revealedCount >= memories.length ? "All memories unlocked" : `Memory ${revealedCount + 1} of ${memories.length}`}
            </h2>
            <p className="mt-5 text-white/75">
              {revealedCount >= memories.length ? "Every memory tells the full story." : "Tap to flip each photo and reveal a memory. Each one brings you closer to the full message."}
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
                {memories.map((memory, i) => {
                  const revealed = i < revealedCount;
                  return (
                    <button
                      key={i}
                      onClick={() => !revealed && revealNext()}
                      disabled={revealed}
                      className={`group relative h-36 w-36 overflow-hidden rounded-2xl border-2 transition-all duration-500 sm:h-40 sm:w-40 ${
                        revealed
                          ? "border-white/30 bg-gradient-to-br shadow-lg scale-100"
                          : i === revealedCount
                            ? "border-amber-400/50 bg-white/10 hover:scale-105 hover:border-amber-300/70 cursor-pointer animate-pulse-border"
                            : "border-white/10 bg-white/5 opacity-30"
                      } ${revealed ? PHOTO_COLORS[i % PHOTO_COLORS.length] : ""}`}
                    >
                      {revealed ? (
                        <div className="flex h-full flex-col items-center justify-center p-4 animate-section-fade">
                          <span className="text-3xl">{PHOTO_ICONS[i % PHOTO_ICONS.length]}</span>
                          <p className="mt-2 text-center text-[10px] font-bold leading-snug text-white/90 sm:text-xs">
                            {memory}
                          </p>
                          <p className="mt-1 text-[8px] text-white/40">Memory {i + 1}</p>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          {i === revealedCount ? (
                            <span className="text-4xl opacity-60 group-hover:scale-110 transition-transform">💫</span>
                          ) : (
                            <span className="text-3xl opacity-20">❓</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {revealedCount > 0 && revealedCount < memories.length && (
                <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold text-white/40">Memories so far</p>
                  <p className="mt-1 text-sm font-bold leading-relaxed text-white/80">
                    {memories.slice(0, revealedCount).join(" · ")}
                  </p>
                </div>
              )}
              {revealedCount >= memories.length && (
                <div className="w-full animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Full memory</p>
                  <p className="mt-1 text-lg font-bold text-white/90"><TypewriterText text={message} speed={40} /></p>
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
