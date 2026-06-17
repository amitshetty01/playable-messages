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

function getMeltRadius(tone: Tone, base: number): number {
  if (tone === "Sorry" || tone === "Emotional") return Math.round(base * 0.6);
  if (tone === "Funny") return Math.round(base * 1.3);
  return base;
}

export function DissolveWall({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);

  const [screen, setScreen] = useState<"intro" | "framing" | "dissolve" | "holdReveal" | "reveal" | "final">("intro");
  const [melted, setMelted] = useState(0);
  const [complete, setComplete] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMeltingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalSteps = 6;

  const meltRadius = getMeltRadius(tone, 40);

  function drawFrostTexture(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random();
      data[i]     = 100 + noise * 60;
      data[i + 1] = 140 + noise * 50;
      data[i + 2] = 80 + Math.random() * 100;
      data[i + 3] = Math.floor(noise * 0.35 * 255);
    }
    ctx.putImageData(imageData, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "rgba(180,220,255,0.15)");
    grad.addColorStop(0.5, "rgba(140,180,240,0.08)");
    grad.addColorStop(1, "rgba(100,160,220,0.15)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;
    drawFrostTexture(ctx, canvas.width, canvas.height);
  }, []);

  function getPointerPos(e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function meltAt(x: number, y: number) {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, meltRadius);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.8)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, meltRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function computeMeltedPercentage(): number {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    const total = canvas.width * canvas.height;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }
    return (transparent / total) * 100;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (complete) return;
    isMeltingRef.current = true;
    const pos = getPointerPos(e);
    meltAt(pos.x, pos.y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isMeltingRef.current || complete) return;
    const pos = getPointerPos(e);
    meltAt(pos.x, pos.y);
  }

  function handlePointerUp() {
    if (!isMeltingRef.current) return;
    isMeltingRef.current = false;
    const pct = computeMeltedPercentage();
    setMelted(pct);
    if (pct >= 99 && !complete) {
      setComplete(true);
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      timeoutRef.current = setTimeout(() => {
        setScreen("holdReveal");
      }, t(500));
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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Dissolve the wall</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="A frozen wall stands between you and the message. Melt through it with your touch." /></p>
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
              Press through the cold. Your words are waiting on the other side.
            </p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("dissolve"); }}>
              Start melting
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "dissolve" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {complete ? "Wall dissolved" : `Melting away... ${Math.min(Math.round(melted), 100)}%`}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative mx-auto" style={{ width: 320, height: 220 }}>
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 text-center text-lg font-bold leading-snug text-white/80"
                  style={{ pointerEvents: "none" }}
                >
                  {experience.finalMessage}
                </div>
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={220}
                  className="absolute inset-0 cursor-crosshair rounded-xl"
                  style={{ touchAction: "none" }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                />
              </div>
              {!complete ? (
                <p className="text-sm text-white/50">Drag your finger across the ice to melt it away</p>
              ) : null}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { setComplete(false); setMelted(0); setScreen("dissolve"); }} disabled={mode === "demo"} />
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
                    stroke="#6bc5f7"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "💧" : "❄️"}
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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Wall dissolved · Message delivered</p>
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
