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

const MAX_FLIPS = 3;

function fragmentMessage(text: string): string[] {
  const words = text.split(/\s+/);
  if (words.length <= 6) return words;
  const size = Math.ceil(words.length / 5);
  const frags: string[] = [];
  for (let i = 0; i < words.length; i += size) {
    frags.push(words.slice(i, i + size).join(" "));
  }
  return frags.slice(0, 6);
}

interface WordPos {
  id: number;
  text: string;
  x: number;
  y: number;
  rot: number;
  landed: boolean;
}

function randomPositions(count: number, containerW: number, containerH: number): WordPos[] {
  const items: WordPos[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      text: "",
      x: 10 + Math.random() * (containerW - 120),
      y: 10 + Math.random() * (containerH - 80),
      rot: -20 + Math.random() * 40,
      landed: false,
    });
  }
  return items;
}

export function GravityFlip({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);

  const [screen, setScreen] = useState<"intro" | "framing" | "gravityFlip" | "holdReveal" | "reveal" | "final">("intro");
  const [flips, setFlips] = useState(0);
  const [allLanded, setAllLanded] = useState(false);
  const [flash, setFlash] = useState(false);
  const [positions, setPositions] = useState<WordPos[]>([]);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSteps = 6;

  const frags = fragmentMessage(experience.finalMessage);

  useEffect(() => {
    if (screen === "gravityFlip") {
      setAllLanded(false);
      setFlips(0);
      const cw = containerRef.current?.clientWidth ?? 320;
      const ch = containerRef.current?.clientHeight ?? 240;
      const base = randomPositions(frags.length, cw, ch);
      setPositions(base.map((p, i) => ({ ...p, text: frags[i] })));
    }
  }, [screen]);

  function handleFlip() {
    if (allLanded) return;
    const nextFlips = flips + 1;
    setFlips(nextFlips);
    playSound("whoosh");
    hapticTone("whoosh", tone);
    setFlash(true);
    timeoutRef.current = setTimeout(() => setFlash(false), t(400));

    const cw = containerRef.current?.clientWidth ?? 320;
    const ch = containerRef.current?.clientHeight ?? 240;
    const rowH = 40;
    const totalH = frags.length * rowH;
    const startY = ch - totalH - 10;
    const landed = positions.map((p, i) => ({
      ...p,
      x: Math.max(10, Math.min(cw - 120, (cw / frags.length) * i + 10)),
      y: startY + i * rowH,
      rot: 0,
      landed: true,
    }));
    setPositions(landed);
    setAllLanded(true);

    if (nextFlips >= MAX_FLIPS) {
      timeoutRef.current = setTimeout(() => setScreen("holdReveal"), t(800));
    } else {
      timeoutRef.current = setTimeout(() => {
        setAllLanded(false);
        const cw2 = containerRef.current?.clientWidth ?? 320;
        const ch2 = containerRef.current?.clientHeight ?? 240;
        const base = randomPositions(frags.length, cw2, ch2);
        setPositions(base.map((p, i) => ({ ...p, text: frags[i] })));
      }, t(1200));
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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Gravity flip</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Words are scattered. Flip gravity to bring them back into place." /></p>
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
            <p className="mt-3 text-sm italic text-white/50">Words are floating in zero gravity. Bring them back down.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("gravityFlip"); }}>
              Enter zero G
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "gravityFlip" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Flip {Math.min(flips + 1, MAX_FLIPS)}/{MAX_FLIPS}</p>
            <div
              ref={containerRef}
              className="relative mx-auto mt-6 h-56 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:h-64"
              style={{ perspective: "800px" }}
            >
              {positions.map((p) => (
                <div
                  key={p.id}
                  className="absolute select-none whitespace-nowrap rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white/90 shadow-lg backdrop-blur-md transition-all duration-700"
                  style={{
                    left: p.x,
                    top: p.y,
                    transform: `rotate(${p.rot}deg)`,
                    "--rot": `${p.rot}deg`,
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    animation: p.landed ? "none" : "float-bob 3s ease-in-out infinite",
                  } as React.CSSProperties}
                >
                  {p.text}
                </div>
              ))}
              {flash ? (
                <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/10" />
              ) : null}
              <style>{`
                @keyframes float-bob {
                  0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
                  50% { transform: translateY(-8px) rotate(var(--rot, 0deg)); }
                }
              `}</style>
            </div>
            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleFlip}
                disabled={allLanded && flips >= MAX_FLIPS}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-2xl font-extrabold text-white/90 shadow-glow transition-all duration-200 hover:scale-110 hover:border-white/50 active:scale-95 disabled:opacity-40"
              >
                ↕
              </button>
              <p className="text-xs text-white/50">
                {allLanded && flips < MAX_FLIPS ? "Resetting..." : allLanded ? "All words landed!" : "Tap to flip gravity"}
              </p>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { setAllLanded(false); setFlips(0); setScreen("gravityFlip"); }} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{holdUnlocked ? "Unlocked" : "Hold to unlock"}</p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="relative mx-auto grid h-40 w-40 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "🌌" : "🪐"}
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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Gravity restored · Message delivered</p>
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
