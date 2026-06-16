"use client";

import { useState, useMemo } from "react";
import { TypewriterText } from "@/components/TypewriterText";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { BackButton } from "@/components/BackButton";
import { ChoiceBadge } from "@/components/ChoiceBadge";
import { playSound, playToneSound } from "@/lib/flowSounds";
import { haptic, hapticTone } from "@/lib/haptic";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

const LIE_BG = ["bg-rose-500/20 hover:bg-rose-500/30 border-rose-400/30", "bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/30", "bg-sky-500/20 hover:bg-sky-500/30 border-sky-400/30"];

export function TwoLiesOneTruth({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const [screen, setScreen] = useState<"intro" | "choose" | "wrong" | "right" | "final">("intro");
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);

  const statements = experience.customMessages.steps.slice(0, 3);
  while (statements.length < 3) statements.push("Something true about you.");

  const truthIndex = useMemo(() => {
    if (mode === "generated" && experience.analytics?.selectedChoices?.truthIndex !== undefined) {
      return Number(experience.analytics.selectedChoices.truthIndex);
    }
    return 0;
  }, [mode, experience]);

  function handlePick(index: number) {
    if (index === truthIndex) {
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setScreen("right");
      setTimeout(() => setScreen("final"), 1200);
    } else {
      playToneSound("tap", tone);
      hapticTone("tap", tone);
      setWrongChoice(index);
      setTimeout(() => setWrongChoice(null), 600);
    }
  }

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
      {screen === "intro" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Two Lies, One Truth</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Which one is true?</h2>
            <p className="mt-5 text-white/75">Two are lies. One is the truth. Pick wisely.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playToneSound("whoosh", tone); setScreen("choose"); }}>Begin</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "choose" || screen === "wrong" || screen === "right" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={screen === "right" ? 100 : 50} total={100} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{screen === "right" ? "You found the truth" : "Tap the true statement"}</p>
            <div className="mt-6 grid gap-4">
              {statements.map((stmt, i) => (
                <button
                  key={i}
                  onClick={() => handlePick(i)}
                  disabled={screen === "right"}
                  className={`group relative w-full rounded-2xl border p-5 text-left text-lg font-bold leading-snug transition-all duration-300 sm:text-xl ${LIE_BG[i]} ${wrongChoice === i ? "animate-shake border-rose-300/60" : ""} ${screen === "right" && i === truthIndex ? "ring-2 ring-emerald-400" : ""} ${screen === "right" && i !== truthIndex ? "opacity-40" : ""}`}
                >
                  <span className="absolute right-4 top-4 text-2xl opacity-30 group-hover:opacity-60">{["A", "B", "C"][i]}</span>
                  <TypewriterText text={stmt} speed={20} />
                </button>
              ))}
            </div>
            <ChoiceBadge label={screen === "right" ? "Truth: Statement A" : null} />
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <Watermark />
    </ExperienceLayout>
  );
}
