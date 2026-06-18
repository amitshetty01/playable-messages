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

const RISK_TAGS = ["Low risk", "Medium risk", "High risk"];
const CARD_COLORS = ["from-emerald-400/30 to-emerald-600/20", "from-amber-400/30 to-amber-600/20", "from-rose-400/30 to-rose-600/20"];

export function FateCardsGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const fragments = splitMessage(message, 3);
  const [flipped, setFlipped] = useState([false, false, false]);
  const [showFinal, setShowFinal] = useState(false);

  function flipCard(index: number) {
    if (flipped[index]) return;
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    const updated = [...flipped];
    updated[index] = true;
    setFlipped(updated);
    if (updated.every(Boolean)) {
      setTimeout(() => setShowFinal(true), 1200);
    }
  }

  const flippedCount = flipped.filter(Boolean).length;
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
        <StepTransition step={flippedCount}>
          <PlayerCard>
            <ProgressBar current={flippedCount + 1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Fate Cards</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Choose a card</h2>
            <p className="mt-5 text-white/75">Each flip reveals a fragment. The stakes get higher.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              {flipped.map((isFlipped, i) => (
                <button
                  key={i}
                  onClick={() => flipCard(i)}
                  disabled={isFlipped}
                  className={`group relative h-44 w-32 perspective-1000 sm:h-52 sm:w-40`}
                >
                  <div className={`relative h-full w-full transition-transform duration-[400ms] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`} style={{ transformStyle: "preserve-3d" }}>
                    <div className={`absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-br ${isFlipped ? CARD_COLORS[i] : "from-white/15 to-white/5"} ${!isFlipped ? "hover:border-white/40 hover:scale-105 cursor-pointer" : ""} transition-all`} style={{ backfaceVisibility: "hidden" }}>
                      {!isFlipped && (
                        <div className="text-center">
                          <span className="text-4xl">?</span>
                          <p className="mt-2 text-xs font-bold text-white/50">Card {i + 1}</p>
                        </div>
                      )}
                    </div>
                    {isFlipped && (
                      <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-white/20 bg-gradient-to-br ${CARD_COLORS[i]} p-4`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                        <span className="rounded-full bg-black/30 px-3 py-0.5 text-[10px] font-bold text-white/70">{RISK_TAGS[i]}</span>
                        <p className="mt-3 text-center text-sm font-bold leading-snug text-white/90"><TypewriterText text={fragments[i]} speed={20} /></p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            {flipped.every(Boolean) && (
              <div className="mt-8 animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                <p className="text-xs font-bold text-white/40">Full message</p>
                <p className="mt-1 text-base font-bold text-white/90"><TypewriterText text={message} speed={30} /></p>
              </div>
            )}
          </PlayerCard>
        </StepTransition>
      ) : final}
      <Watermark />
    </ExperienceLayout>
  );
}
