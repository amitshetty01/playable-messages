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
import { stopMusic } from "@/lib/music";
import { getAnimationDuration } from "@/lib/pacing";
import { useAutoAdvance } from "@/lib/useAutoAdvance";
import { useEasterEgg } from "@/lib/useEasterEgg";
import type { ExperienceRecord, Template, Tone } from "@/lib/types";
import { getRelationshipIntro } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

const MAZE: (0 | 1)[][] = [
  [0, 1, 1, 1, 1],
  [0, 0, 0, 1, 1],
  [1, 1, 0, 0, 1],
  [1, 1, 1, 0, 0],
  [1, 1, 1, 1, 0],
];

const CELL_SIZE = 56;
const MAX_ATTEMPTS = 3;

type CellPos = { row: number; col: number };

function isWall(row: number, col: number): boolean {
  if (row < 0 || row >= 5 || col < 0 || col >= 5) return true;
  return MAZE[row][col] === 1;
}

export function TiltMaze({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);

  const [screen, setScreen] = useState<"intro" | "framing" | "maze" | "holdReveal" | "reveal" | "final">("intro");
  const [ballPos, setBallPos] = useState<CellPos>({ row: 0, col: 0 });
  const [attempts, setAttempts] = useState(0);
  const [reachedGoal, setReachedGoal] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSteps = 6;

  const GOAL: CellPos = { row: 4, col: 4 };

  function resetMaze() {
    setBallPos({ row: 0, col: 0 });
    setReachedGoal(false);
  }

  function moveBall(dRow: number, dCol: number) {
    if (reachedGoal) return;
    const newPos = { row: ballPos.row + dRow, col: ballPos.col + dCol };
    if (isWall(newPos.row, newPos.col)) {
      playToneSound("tap", tone);
      hapticTone("tap", tone);
      return;
    }
    setBallPos(newPos);
    if (newPos.row === GOAL.row && newPos.col === GOAL.col) {
      setReachedGoal(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      timeoutRef.current = setTimeout(() => {
        setScreen("holdReveal");
      }, t(600));
    } else {
      playSound("click");
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragStartRef.current || reachedGoal) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = null;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx < 10 && absDy < 10) return;
    if (absDx > absDy) {
      moveBall(0, dx > 0 ? 1 : -1);
    } else {
      moveBall(dy > 0 ? 1 : -1, 0);
    }
  }

  function handleFail() {
    const next = attempts + 1;
    setAttempts(next);
    if (next >= MAX_ATTEMPTS) {
      playToneSound("whoosh", tone);
      setScreen("holdReveal");
    } else {
      resetMaze();
    }
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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Tilt Maze</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Guide the ball through the maze to reach the hidden message." /></p>
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
              Navigate through the maze to find the hidden message.
            </p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("maze"); }}>
              Enter the maze
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "maze" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {reachedGoal ? "Goal reached!" : `Attempt ${attempts + 1}/${MAX_ATTEMPTS}`}
            </p>
            <div className="mt-6 flex flex-col items-center gap-6">
              <div
                className="select-none rounded-2xl border border-white/15 bg-white/5 p-2"
                style={{ touchAction: "none" }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <div className="relative" style={{ width: CELL_SIZE * 5, height: CELL_SIZE * 5 }}>
                  {MAZE.map((row, ri) =>
                    row.map((cell, ci) => (
                      <div
                        key={`${ri}-${ci}`}
                        className="absolute flex items-center justify-center rounded-lg transition-colors duration-200"
                        style={{
                          left: ci * CELL_SIZE,
                          top: ri * CELL_SIZE,
                          width: CELL_SIZE - 2,
                          height: CELL_SIZE - 2,
                          margin: 1,
                          background: cell === 1
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {ri === GOAL.row && ci === GOAL.col ? (
                          <span className="text-lg">🏁</span>
                        ) : null}
                      </div>
                    ))
                  )}
                  {!reachedGoal ? (
                    <div
                      className="absolute flex items-center justify-center transition-all duration-200"
                      style={{
                        left: ballPos.col * CELL_SIZE + CELL_SIZE / 2 - 10,
                        top: ballPos.row * CELL_SIZE + CELL_SIZE / 2 - 10,
                        width: 20,
                        height: 20,
                      }}
                    >
                      <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
                    </div>
                  ) : null}
                </div>
              </div>
              {!reachedGoal ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => moveBall(-1, 0)}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/15"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBall(0, -1)}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/15"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBall(0, 1)}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/15"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBall(1, 0)}
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/15"
                  >
                    ↓
                  </button>
                </div>
              ) : null}
              {!reachedGoal ? (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleFail}
                    className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-400/20"
                  >
                    Give up ({MAX_ATTEMPTS - attempts - 1} left)
                  </button>
                </div>
              ) : null}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { resetMaze(); setAttempts(0); setScreen("maze"); }} disabled={mode === "demo"} />
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
                    stroke="#7c5cff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "🏆" : "🔒"}
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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Maze conquered · Message delivered</p>
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
