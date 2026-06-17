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

const TRACK_W = 300;
const SNAP_R = 8;
const TOTAL = 3;

function generateSpots(): number[] {
  const spots: number[] = [];
  const gap = TRACK_W / TOTAL;
  for (let i = 0; i < TOTAL; i++) {
    const lo = i * gap + 12;
    const hi = (i + 1) * gap - 12;
    spots.push(Math.floor(Math.random() * (hi - lo) + lo));
  }
  return spots.sort((a, b) => a - b);
}

export function LockPick({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);

  const [screen, setScreen] = useState<"intro" | "framing" | "lockPick" | "holdReveal" | "reveal" | "final">("intro");
  const [spots, setSpots] = useState<number[]>([]);
  const [found, setFound] = useState<boolean[]>([false, false, false]);
  const [knob, setKnob] = useState(TRACK_W / 2);
  const [drag, setDrag] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const totalSteps = 6;

  useEffect(() => {
    if (screen === "lockPick") {
      const newSpots = generateSpots();
      setSpots(newSpots);
      setFound([false, false, false]);
      setKnob(TRACK_W / 2);
      const initialKnob = TRACK_W / 2;
      for (let i = 0; i < newSpots.length; i++) {
        if (Math.abs(initialKnob - newSpots[i]) <= SNAP_R) {
          playSound("click");
          hapticTone("tap", tone);
          const next = [false, false, false];
          next[i] = true;
          setFound(next);
          if (next.every(Boolean)) {
            timeoutRef.current = setTimeout(() => setScreen("holdReveal"), t(600));
          }
          break;
        }
      }
    }
  }, [screen]);

  useEffect(() => {
    if (!drag || found.every(Boolean)) return;
    for (let i = 0; i < spots.length; i++) {
      if (!found[i] && Math.abs(knob - spots[i]) <= SNAP_R) {
        playSound("click");
        hapticTone("tap", tone);
        const next = [...found];
        next[i] = true;
        setFound(next);
        if (next.every(Boolean)) {
          timeoutRef.current = setTimeout(() => setScreen("holdReveal"), t(600));
        }
        break;
      }
    }
  }, [knob, drag, spots, found, tone]);

  function onDown(e: React.PointerEvent) {
    setDrag(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onMove(e: React.PointerEvent) {
    if (!drag || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    setKnob(Math.max(0, Math.min(TRACK_W, e.clientX - rect.left)));
  }

  function onUp() { setDrag(false); }

  const minDist = spots.length > 0 ? Math.min(...spots.map((s) => Math.abs(knob - s))) : Infinity;
  const tensionColor = minDist <= SNAP_R ? "text-green-400" : minDist <= 30 ? "text-yellow-400" : "text-red-400";
  const tensionLabel = minDist <= SNAP_R ? "Sweet spot!" : minDist <= 30 ? "Close" : "Far";

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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Three locks</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="A message sealed tight. Only you can pick the locks." /></p>
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
            <p className="mt-3 text-sm italic text-white/50">Three locks. One message. Find the sweet spot in each.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("lockPick"); }}>
              Start picking
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "lockPick" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Pick the locks</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Find the sweet spots</h2>
            <p className="mt-5 text-white/75">Drag the pick left and right. Each sweet spot unlocks one lock.</p>
            <div className="mt-8 flex justify-center gap-4">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div
                  key={i}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl transition-all duration-300 ${
                    found[i] ? "scale-110 border-green-400 bg-green-400/20" : "border-white/20 bg-white/5"
                  }`}
                >
                  {found[i] ? "🔓" : "🔒"}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
              <div ref={trackRef} className="relative h-3 w-[300px] rounded-full bg-white/10" style={{ touchAction: "none" }}>
                <div
                  className="absolute top-1/2 h-full -translate-y-1/2 rounded-full transition-all duration-75"
                  style={{
                    left: 0,
                    width: `${(knob / TRACK_W) * 100}%`,
                    background: "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                  }}
                />
                {spots.map((s, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300"
                    style={{
                      left: `${(s / TRACK_W) * 100}%`,
                      borderColor: found[i] ? "#4ade80" : "rgba(255,255,255,0.2)",
                      backgroundColor: found[i] ? "rgba(74,222,128,0.2)" : "transparent",
                    }}
                  />
                ))}
                <div
                  className={`absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 transition-all duration-100 ${
                    drag ? "scale-110 border-white/60 bg-white/20" : "border-white/30 bg-white/10"
                  }`}
                  style={{ left: `${(knob / TRACK_W) * 100}%`, touchAction: "none" }}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                />
              </div>
              <p className={`text-sm font-bold ${tensionColor}`}>{tensionLabel}</p>
              <p className="text-xs text-white/50">{found.filter(Boolean).length}/{TOTAL} locks picked</p>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { setFound([false, false, false]); setKnob(TRACK_W / 2); setScreen("lockPick"); }} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{holdUnlocked ? "Unlocked" : "Hold to unlock"}</p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="relative mx-auto grid h-40 w-40 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "🔓" : "🔐"}
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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Locks picked · Message delivered</p>
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
