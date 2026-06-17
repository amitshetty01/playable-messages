"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { StepTransition } from "@/components/StepTransition";
import { ProgressBar } from "@/components/ProgressBar";
import { FinalScreen } from "@/components/FinalScreen";
import { ReactionPicker } from "@/components/ReactionPicker";
import { BrandedClosingCard } from "@/components/BrandedClosingCard";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { BackButton } from "@/components/BackButton";
import { TypewriterText } from "@/components/TypewriterText";
import { playSound, playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import { playMusic, stopMusic } from "@/lib/music";
import { getAnimationDuration } from "@/lib/pacing";
import { useAutoAdvance } from "@/lib/useAutoAdvance";
import { useEasterEgg } from "@/lib/useEasterEgg";
import type { ExperienceRecord, Template, Tone } from "@/lib/types";
import { getRelationshipIntro, getRelationshipCloser } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

const TOTAL_ROUNDS = 3;

function generatePatterns(messageWords: string[]): string[] {
  const words = messageWords.length >= 3 ? messageWords : ["you", "are", "loved"];
  return words.slice(0, TOTAL_ROUNDS).map((word) => {
    return word
      .toLowerCase()
      .split("")
      .map((char) => {
        const n = char.charCodeAt(0) % 3;
        if (n === 0) return ".";
        if (n === 1) return "-";
        return ".";
      })
      .join("");
  });
}

function PatternDisplay({ pattern, input, round }: { pattern: string; input: string; round: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-bold tracking-[0.08em] text-white/50">Pattern {round}/{TOTAL_ROUNDS}</p>
      <div className="flex gap-2">
        {pattern.split("").map((ch, i) => {
          const matched = i < input.length;
          const isCurrent = i === input.length;
          return (
            <span
              key={i}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold transition-all duration-200 ${
                matched
                  ? "bg-green-400/20 text-green-300 border border-green-400/30"
                  : isCurrent
                  ? "bg-white/15 text-white border border-white/30 animate-pulse"
                  : "bg-white/5 text-white/40 border border-white/10"
              }`}
            >
              {ch === "." ? "•" : "−"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function MorseCode({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);

  const [screen, setScreen] = useState<"intro" | "framing" | "morse" | "holdReveal" | "reveal" | "final">("intro");
  const [patterns] = useState(() => generatePatterns(experience.finalMessage.split(" ")));
  const [round, setRound] = useState(0);
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = 6;

  function appendSymbol(symbol: "." | "-") {
    if (completed) return;
    const pattern = patterns[round];
    const next = input + symbol;
    if (!pattern.startsWith(next)) {
      setShake(true);
      playToneSound("tap", tone);
      hapticTone("tap", tone);
      timeoutRef.current = setTimeout(() => {
        setShake(false);
        setInput("");
      }, t(400));
      return;
    }
    setInput(next);
    setPulse(true);
    playSound("click");
    timeoutRef.current = setTimeout(() => setPulse(false), t(200));
    if (next === pattern) {
      if (round + 1 >= TOTAL_ROUNDS) {
        setCompleted(true);
        playToneSound("ding", tone);
        hapticTone("ding", tone);
        timeoutRef.current = setTimeout(() => {
          setScreen("holdReveal");
        }, t(600));
      } else {
        timeoutRef.current = setTimeout(() => {
          setRound((r) => r + 1);
          setInput("");
        }, t(500));
      }
    }
  }

  function handleDotPress() {
    appendSymbol(".");
  }

  function handleDashPress() {
    appendSymbol("-");
  }

  function cleanupHold() {
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }

  function handleHoldStart() {
    if (holdUnlocked) return;
    setHolding(true);
    setHoldProgress(0);
    let p = 0;
    holdRef.current = setInterval(() => {
      p += 0.03;
      const progress = Math.min(p, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        cleanupHold();
        setHoldUnlocked(true);
        setHolding(false);
        playToneSound("ding", tone);
        hapticTone("ding", tone);
        timeoutRef.current = setTimeout(() => {
          stopMusic();
          setScreen("reveal");
        }, t(300));
      }
    }, t(20));
  }

  function handleHoldEnd() {
    cleanupHold();
    setHolding(false);
    if (!holdUnlocked) setHoldProgress(0);
  }

  const handleGoFinal = useCallback(() => {
    playSound("ding");
    setShowReaction(true);
  }, []);

  useAutoAdvance({
    active: mode === "demo" && screen === "intro",
    onAdvance: () => { playSound("click"); setScreen("framing"); },
  });

  const final = (
    <>
      <FinalScreen
        ctaMessage={experience.customMessages.ctaMessage}
        experienceId={mode === "generated" ? experience.id : undefined}
        finalMessage={experience.finalMessage}
        shareUrl={shareUrl}
        templateId={template.id}
        templateTitle={template.title}
      />
      {showReaction ? <ReactionPicker tone={tone} onReact={(emoji) => { track(experience.id, "selected_mood_choice", template.id, `reaction:${emoji}`); saveReaction(experience.id, emoji); }} /> : null}
      <BrandedClosingCard templateId={template.id} creatorName={creatorName} />
      <Watermark />
    </>
  );

  const { message: eggMessage } = useEasterEgg(template.id);

  useEffect(() => {
    return () => { cleanupHold(); stopMusic(); };
  }, []);

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "intro" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Morse Code</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Tap the rhythm. Match the code. Unlock the words." /></p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("framing"); }}>Begin</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "framing" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">A message awaits</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {greeting}.
            </h2>
            <p className="mt-5 text-white/75">
              <TypewriterText text={getRelationshipIntro(experience.relationshipTag, experience.showCreatorName ? creatorName : "", receiverName)} />
            </p>
            <p className="mt-3 text-sm italic text-white/50">
              Tap the rhythm. Match the code. Unlock the words.
            </p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("morse"); }}>
              Start tapping
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "morse" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => { setRound(0); setInput(""); setCompleted(false); setScreen("framing"); }} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {completed ? "All patterns matched" : `Round ${round + 1}/${TOTAL_ROUNDS}`}
            </p>
            <div className="mt-8 flex flex-col items-center gap-8">
              <PatternDisplay pattern={patterns[round]} input={input} round={round + 1} />
              {!completed ? (
                <div className={`flex gap-6 transition-all duration-200 ${shake ? "animate-shake" : ""} ${pulse ? "scale-105" : ""}`}>
                  <button
                    type="button"
                    onClick={handleDotPress}
                    className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-3xl font-extrabold text-white transition-all duration-150 hover:bg-white/20 active:scale-90"
                    style={{ touchAction: "manipulation" }}
                  >
                    &bull;
                  </button>
                  <button
                    type="button"
                    onClick={handleDashPress}
                    className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-3xl font-extrabold text-white transition-all duration-150 hover:bg-white/20 active:scale-90"
                    style={{ touchAction: "manipulation" }}
                  >
                    &minus;
                  </button>
                </div>
              ) : (
                <p className="text-lg font-bold text-green-300">All codes matched!</p>
              )}
              {!completed ? (
                <div className="flex gap-2">
                  {input.split("").map((ch, i) => (
                    <span key={i} className="text-lg font-bold text-green-300">
                      {ch === "." ? "•" : "−"}
                    </span>
                  ))}
                  <span className="inline-block h-5 w-1.5 animate-pulse rounded-full bg-white/50" />
                </div>
              ) : null}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { setRound(0); setInput(""); setCompleted(false); setScreen("morse"); }} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {holdUnlocked ? "Unlocked" : "Hold to unlock"}
            </p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="relative mx-auto grid h-40 w-40 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#23d3ee"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "📨" : "🔒"}
                </span>
              </div>
              <button
                type="button"
                onPointerDown={handleHoldStart}
                onPointerUp={handleHoldEnd}
                onPointerLeave={handleHoldEnd}
                className={`w-full max-w-xs rounded-2xl border py-4 text-lg font-extrabold transition-all duration-200 ${
                  holdUnlocked
                    ? "border-green-400/40 bg-green-400/20 text-green-300"
                    : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15 active:scale-95"
                }`}
                style={{ touchAction: "none" }}
              >
                {holdUnlocked ? "Unlocked!" : holding ? `${Math.round(holdProgress * 100)}%` : "Hold to reveal"}
              </button>
              {!holdUnlocked ? (
                <p className="text-sm text-white/50">Hold your finger down to unlock the message</p>
              ) : null}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "reveal" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Code cracked · Message delivered</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {experience.finalMessage}
            </h2>
            {experience.showCreatorName && creatorName ? (
              <p className="mt-6 text-base italic text-white/60">— {creatorName}</p>
            ) : null}
            <button className="premium-button mt-8" type="button" onClick={handleGoFinal}>Continue</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "final" ? final : null}

      {eggMessage ? (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-neon/30 bg-black/80 px-6 py-3 text-sm font-bold text-neon shadow-lg backdrop-blur-xl animate-[section-in_400ms_cubic-bezier(.22,1,.36,1)_both]">
          {eggMessage}
        </div>
      ) : null}

      {screen !== "final" ? <Watermark /> : null}
    </ExperienceLayout>
  );
}

async function track(experienceId: string, eventType: string, templateId: string, choice?: string) {
  if (!experienceId || experienceId === "demo" || experienceId === "preview") return;
  await fetch(`/api/experiences/${experienceId}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, templateId, choice })
  }).catch(() => undefined);
}

async function saveReaction(experienceId: string, reaction: string) {
  if (!experienceId || experienceId === "demo" || experienceId === "preview") return;
  await fetch(`/api/experiences/${experienceId}/reaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reaction })
  }).catch(() => undefined);
  try {
    const { saveExperience } = await import("@/lib/my-experiences");
    const { getMyExperiences } = await import("@/lib/my-experiences");
    const list = getMyExperiences();
    const idx = list.findIndex((e) => e.id === experienceId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], reaction };
      localStorage.setItem("cym_my_experiences", JSON.stringify(list));
    }
  } catch {}
}
