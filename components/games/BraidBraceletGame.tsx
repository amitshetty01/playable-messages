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

const COLORS = ["#ff5fb7", "#23d3ee", "#ffd166"];

export function BraidBraceletGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const fragments = splitMessage(message, 3);

  const [weaves, setWeaves] = useState(0);
  const [revealedFragments, setRevealedFragments] = useState<string[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [strandOrder, setStrandOrder] = useState([0, 1, 2]);

  function weave(move: "left" | "right") {
    if (weaves >= 6) return;
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    const newOrder = [...strandOrder];
    if (move === "left") {
      const temp = newOrder[0];
      newOrder[0] = newOrder[1];
      newOrder[1] = temp;
    } else {
      const temp = newOrder[2];
      newOrder[2] = newOrder[1];
      newOrder[1] = temp;
    }
    setStrandOrder(newOrder);
    const newWeaves = weaves + 1;
    setWeaves(newWeaves);
    if (newWeaves % 2 === 0) {
      const fragIndex = Math.floor(newWeaves / 2) - 1;
      if (fragIndex < fragments.length) {
        setRevealedFragments((prev) => [...prev, fragments[fragIndex]]);
      }
    }
    if (newWeaves >= 6) {
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 1500);
    }
  }

  const totalSteps = 7;
  const step = weaves;

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Braid a Bracelet</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {weaves >= 6 ? "Bracelet complete!" : `Weave the strands (${weaves}/6)`}
            </h2>
            <p className="mt-5 text-white/75">
              {weaves >= 6 ? "The charm reveals your message." : "Weave the three strands together. Every 2 weaves reveals a fragment."}
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  {strandOrder.map((colorIdx, pos) => (
                    <path
                      key={pos}
                      d={`M${30 + pos * 20} 10 Q${40 + pos * 10 + (weaves % 2) * 5} 30 ${30 + pos * 20} 50 Q${40 + pos * 10 + (weaves % 2) * 5} 70 ${30 + pos * 20} 90`}
                      fill="none"
                      stroke={COLORS[colorIdx]}
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.7"
                      className="transition-all duration-300"
                    />
                  ))}
                  <rect x="20" y="5" width="60" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
                  <rect x="20" y="87" width="60" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
                  {weaves >= 6 && (
                    <circle cx="50" cy="50" r="8" fill="#ffd166" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="animate-pulse" />
                  )}
                </svg>
              </div>
              {weaves < 6 && (
                <div className="flex gap-4">
                  <button onClick={() => weave("left")} className="ghost-button">
                    ← Left over center
                  </button>
                  <button onClick={() => weave("right")} className="ghost-button">
                    Right over center →
                  </button>
                </div>
              )}
              {revealedFragments.length > 0 && (
                <div className="w-full space-y-2">
                  {revealedFragments.map((f, i) => (
                    <div key={i} className="animate-section-fade rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                      <p className="text-xs font-bold text-white/40">Fragment {i + 1}</p>
                      <p className="mt-0.5 text-sm font-semibold text-white/80"><TypewriterText text={f} speed={25} /></p>
                    </div>
                  ))}
                </div>
              )}
              {weaves >= 6 && (
                <div className="w-full animate-section-fade rounded-xl border border-amber-400/20 bg-amber-400/10 p-5 text-center">
                  <p className="text-xs font-bold text-amber-300/80">Charm revealed</p>
                  <p className="mt-1 text-base font-bold text-white/90"><TypewriterText text={message} speed={35} /></p>
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
