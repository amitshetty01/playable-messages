"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { BackButton } from "@/components/BackButton";
import { playSound, playToneSound } from "@/lib/flowSounds";
import { haptic, hapticTone } from "@/lib/haptic";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

export function TrustScale({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const [screen, setScreen] = useState<"intro" | "sliding" | "final">("intro");
  const [value, setValue] = useState(0);
  const [revealPct, setRevealPct] = useState(0);
  const [holding, setHolding] = useState(false);
  const creepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const target = experience.finalMessage;
  const charsToReveal = Math.floor((revealPct / 100) * target.length);

  function stopCreep() {
    if (creepRef.current) { clearInterval(creepRef.current); creepRef.current = null; }
  }

  function startCreep() {
    stopCreep();
    creepRef.current = setInterval(() => {
      setRevealPct((prev) => Math.max(0, prev - 1.5));
    }, 150);
  }

  function handlePointerDown() {
    setHolding(true);
    stopCreep();
  }

  function handlePointerUp() {
    setHolding(false);
    playToneSound("tap", tone);
    setRevealPct(value);
    if (value < 100) startCreep();
    else {
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setScreen("final"), 600);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setValue(v);
    setRevealPct(v);
    if (v >= 100) {
      stopCreep();
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setScreen("final"), 600);
    }
  }

  useEffect(() => {
    return () => stopCreep();
  }, []);

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">The Trust Scale</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">How much do you trust this?</h2>
            <p className="mt-5 text-white/75">Drag the slider to reveal the message. The higher you go, the more you see. But the slider creeps back down when you let go.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playToneSound("whoosh", tone); setScreen("sliding"); }}>Begin</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "sliding" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={Math.round(revealPct)} total={100} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Trust level: {Math.round(revealPct)}%</p>
            <div className="mt-6 min-h-32 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-2xl font-extrabold leading-relaxed break-all sm:text-3xl">
                {target.split("").map((ch, i) => (
                  <span key={i} className={`transition-all duration-300 ${i < charsToReveal ? "text-white" : "text-white/10 blur-[3px]"}`}>
                    {i < charsToReveal ? ch : ch.replace(/./g, "_")}
                  </span>
                ))}
              </p>
            </div>
            <div className="mt-8">
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={handleChange}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-2 appearance-none rounded-full bg-white/15 accent-neon cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon [&::-webkit-slider-thumb]:shadow-lg"
              />
            </div>
            <p className="mt-3 text-xs text-white/50">
              {holding ? "Hold to keep it open" : "Let go and it fades..."}
            </p>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <Watermark />
    </ExperienceLayout>
  );
}
