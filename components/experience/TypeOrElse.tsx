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

export function TypeOrElse({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const [screen, setScreen] = useState<"intro" | "typing" | "final">("intro");
  const [typed, setTyped] = useState("");
  const [revealedCount, setRevealedCount] = useState(0);
  const [idleTimer, setIdleTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [fadeCount, setFadeCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const target = experience.finalMessage;
  const totalChars = target.length;
  const pct = totalChars > 0 ? revealedCount / totalChars : 0;

  const clearIdle = useCallback(() => {
    if (idleTimer) { clearTimeout(idleTimer); setIdleTimer(null); }
  }, [idleTimer]);

  const startIdle = useCallback(() => {
    clearIdle();
    const t = setTimeout(() => {
      setFadeCount((prev) => Math.min(prev + 3, revealedCount));
      setRevealedCount((prev) => Math.max(0, prev - 3));
    }, 5000);
    setIdleTimer(t);
  }, [clearIdle, revealedCount]);

  useEffect(() => {
    return () => { if (idleTimer) clearTimeout(idleTimer); };
  }, [idleTimer]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTyped(val);

    let matchCount = 0;
    for (let i = 0; i < val.length && i < target.length; i++) {
      if (val[i].toLowerCase() === target[i].toLowerCase()) matchCount++;
      else break;
    }

    if (matchCount > revealedCount) {
      playToneSound("tap", tone);
      hapticTone("tap", tone);
    }
    setRevealedCount(matchCount);
    clearIdle();
    if (matchCount < totalChars) startIdle();
  }

  useEffect(() => {
    if (revealedCount >= totalChars && screen === "typing") {
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      const t = setTimeout(() => setScreen("final"), 800);
      return () => clearTimeout(t);
    }
  }, [revealedCount, totalChars, screen]);

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Type or Else</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Type the hidden message.</h2>
            <p className="mt-5 text-white/75">Every correct keystroke reveals one character. Stop typing for 5 seconds and it starts fading back.</p>
            <p className="mt-3 text-sm text-white/50">The message will only show itself if you earn it.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playToneSound("whoosh", tone); setScreen("typing"); setTimeout(() => inputRef.current?.focus(), 100); }}>Start typing</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "typing" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={revealedCount} total={totalChars} theme={experience.theme} />
            <div className="min-h-28 rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-2xl font-extrabold tracking-wider leading-relaxed break-all sm:text-3xl">
                {target.split("").map((ch, i) => {
                  const isFaded = i < fadeCount && i >= revealedCount;
                  const isRevealed = i < revealedCount;
                  return (
                    <span
                      key={i}
                      className={`transition-all duration-500 ${
                        isRevealed ? "text-white opacity-100" :
                        isFaded ? "text-white/10" :
                        "text-white/30"
                      }`}
                    >
                      {isRevealed ? ch : "_"}
                    </span>
                  );
                })}
              </p>
            </div>
            <input
              ref={inputRef}
              value={typed}
              onChange={handleChange}
              className="input mt-5 text-center text-lg font-bold tracking-widest"
              placeholder="Start typing the message..."
              autoComplete="off"
              autoFocus
            />
            <p className="mt-4 text-xs text-white/50">
              {revealedCount}/{totalChars} characters matched
              {fadeCount > 0 ? ` · ${fadeCount} faded` : ""}
            </p>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <Watermark />
    </ExperienceLayout>
  );
}
