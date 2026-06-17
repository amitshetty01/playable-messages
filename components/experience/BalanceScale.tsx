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
import { playSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import { stopMusic } from "@/lib/music";
import { getAnimationDuration } from "@/lib/pacing";
import { useAutoAdvance } from "@/lib/useAutoAdvance";
import { useEasterEgg } from "@/lib/useEasterEgg";
import type { ExperienceRecord, Template } from "@/lib/types";
import { getRelationshipIntro } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

interface WordToken {
  id: number;
  text: string;
  weight: number;
}

function canSumTo(weights: number[], target: number): boolean {
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const w of weights) {
    for (let i = target; i >= w; i--) {
      if (dp[i - w]) dp[i] = true;
    }
  }
  return dp[target];
}

function makeTokens(message: string): WordToken[] {
  const words = message.split(/\s+/).filter(Boolean);
  const r = () => Math.max(1, Math.min(3, Math.floor(Math.random() * 3) - 1));
  if (words.length <= 6) return words.map((w, i) => ({ id: i, text: w, weight: Math.max(1, Math.min(3, Math.ceil(w.length / 3) + r())) }));
  const size = Math.ceil(words.length / 5);
  const tokens: WordToken[] = [];
  let id = 0;
  for (let i = 0; i < words.length; i += size) {
    const chunk = words.slice(i, i + size).join(" ");
    tokens.push({ id: id++, text: chunk, weight: Math.max(1, Math.min(3, Math.ceil(chunk.length / 4) + r())) });
  }
  return tokens;
}

export function BalanceScale({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);

  const [screen, setScreen] = useState<"intro" | "framing" | "balanceScale" | "holdReveal" | "reveal" | "final">("intro");
  const [tokens, setTokens] = useState<WordToken[]>([]);
  const [placed, setPlaced] = useState<WordToken[]>([]);
  const [balanced, setBalanced] = useState(false);
  const [dragToken, setDragToken] = useState<WordToken | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const totalSteps = 6;

  const leftWeight = 5;
  const rightWeight = placed.reduce((s, t) => s + t.weight, 0);
  const diff = rightWeight - leftWeight;
  const beamAngle = Math.max(-30, Math.min(30, diff * -6));
  const isBalanced = !balanced && Math.abs(diff) < 0.5;

  useEffect(() => {
    if (screen === "balanceScale") {
      let attempt = 0;
      let tokens: WordToken[];
      do {
        tokens = makeTokens(experience.finalMessage);
        attempt++;
        if (attempt >= 10) {
          const force = [1, 2, 2];
          tokens = tokens.map((t, i) => ({ ...t, weight: i < force.length ? force[i] : 1 }));
          break;
        }
      } while (!canSumTo(tokens.map(t => t.weight), leftWeight));
      setTokens(tokens);
      setPlaced([]);
      setBalanced(false);
    }
  }, [screen]);

  useEffect(() => {
    if (isBalanced && !balanced) {
      setBalanced(true);
      playSound("ding");
      hapticTone("ding", tone);
      timeoutRef.current = setTimeout(() => setScreen("holdReveal"), t(600));
    }
  }, [isBalanced, balanced]);

  function handleTokenPointerDown(e: React.PointerEvent, token: WordToken) {
    if (balanced) return;
    setDragToken(token);
    setTokens((prev) => prev.filter((t) => t.id !== token.id));
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handleTokenPointerUp(e: React.PointerEvent) {
    if (!dragToken) return;
    const pan = panRef.current;
    if (pan) {
      const panRect = pan.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x >= panRect.left && x <= panRect.right && y >= panRect.top && y <= panRect.bottom) {
        setPlaced((prev) => [...prev, dragToken]);
        setDragToken(null);
        return;
      }
    }
    setTokens((prev) => [...prev, dragToken]);
    setDragToken(null);
  }

  function removeFromPan(id: number) {
    if (balanced) return;
    const token = placed.find((t) => t.id === id);
    if (!token) return;
    setPlaced((prev) => prev.filter((t) => t.id !== id));
    setTokens((prev) => [...prev, token]);
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
        playSound("ding");
        hapticTone("ding", tone);
        timeoutRef.current = setTimeout(() => setScreen("reveal"), t(300));
      }
    }, t(20));
  }

  function handleHoldEnd() {
    cleanupHold();
    setHolding(false);
    if (!holdUnlocked) setHoldProgress(0);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cleanupHold();
      stopMusic();
    };
  }, []);

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

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "intro" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Balance the scale</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Some things need balance. Place the right words to unlock the message." /></p>
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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{greeting}.</h2>
            <p className="mt-5 text-white/75">
              <TypewriterText text={getRelationshipIntro(experience.relationshipTag, experience.showCreatorName ? creatorName : "", receiverName)} />
            </p>
            <p className="mt-3 text-sm italic text-white/50">Some things need balance. Place the right words to unlock the message.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("balanceScale"); }}>
              Step on the scale
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "balanceScale" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {balanced ? "Balanced!" : `Balance: ${Math.abs(diff).toFixed(1)} off`}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative flex w-full items-end justify-center gap-8" style={{ height: 160 }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl">❤️</div>
                  <p className="text-xs text-white/50">Weight: {leftWeight}</p>
                </div>
                <div
                  className="absolute top-0 left-1/2 h-1 w-48 -translate-x-1/2 rounded-full bg-white/30 transition-all duration-500"
                  style={{ transform: `translateX(-50%) rotate(${beamAngle}deg)`, transformOrigin: "center bottom" }}
                />
                <div className="flex h-10 w-4 items-center justify-center rounded-full bg-white/20" style={{ marginTop: 2 }}>
                  <div className="h-6 w-1 rounded-full bg-white/40" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div
                    ref={panRef}
                    className="flex min-h-16 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-2 transition-all duration-300"
                    style={{ borderColor: balanced ? "#4ade80" : "rgba(255,255,255,0.2)" }}
                  >
                    {placed.length === 0 ? (
                      <span className="text-xs text-white/30">Drop here</span>
                    ) : (
                      placed.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => removeFromPan(t.id)}
                          className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-bold text-white/80 transition-all hover:bg-white/20"
                        >
                          {t.text} ({t.weight})
                        </button>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-white/50">Weight: {rightWeight}</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {tokens.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onPointerDown={(e) => handleTokenPointerDown(e, t)}
                    onPointerUp={handleTokenPointerUp}
                    className="cursor-grab rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white/80 shadow-glow backdrop-blur-sm transition-all duration-200 hover:bg-white/15 active:cursor-grabbing active:scale-95"
                    style={{ touchAction: "none" }}
                  >
                    {t.text} <span className="text-xs text-white/40">({t.weight})</span>
                  </button>
                ))}
              </div>
              {balanced ? (
                <p className="text-sm font-bold text-green-400">Scale balanced! Unlocking message...</p>
              ) : (
                <p className="text-xs text-white/50">Drag word-weights onto the right pan to balance the scale</p>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { setBalanced(false); setPlaced([]); setTokens(makeTokens(experience.finalMessage)); setScreen("balanceScale"); }} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{holdUnlocked ? "Unlocked" : "Hold to unlock"}</p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="relative mx-auto grid h-40 w-40 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "⚖️" : "🏋️"}
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
              {!holdUnlocked ? <p className="text-sm text-white/50">Hold your finger down to unlock the message</p> : null}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "reveal" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Scale balanced · Message delivered</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{experience.finalMessage}</h2>
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
    const { saveExperience, getMyExperiences } = await import("@/lib/my-experiences");
    const list = getMyExperiences();
    const idx = list.findIndex((e) => e.id === experienceId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], reaction };
      localStorage.setItem("cym_my_experiences", JSON.stringify(list));
    }
  } catch {}
}
