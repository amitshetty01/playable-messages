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

const TOTAL_BEATS = 5;
const PETALS = [
  { label: "Rose", emoji: "🌹", color: "#ff5fb7" },
  { label: "Lily", emoji: "🌸", color: "#ff9fbb" },
  { label: "Daisy", emoji: "🌼", color: "#ffd166" },
];

function HeartIcon({ beat, synced, pulse, petalColor }: { beat: boolean; synced: boolean; pulse: number; petalColor: string }) {
  return (
    <div className="relative mx-auto grid h-48 w-48 place-items-center sm:h-56 sm:w-56">
      <div
        className="absolute inset-0 rounded-full transition-all duration-700"
        style={{
          background: synced
            ? `radial-gradient(circle, ${petalColor}44 0%, transparent 70%)`
            : "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          transform: `scale(${synced ? 1 + pulse * 0.15 : 1})`,
          opacity: synced ? 0.6 + pulse * 0.4 : 0.3,
        }}
      />
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * 360 + (pulse * 15);
        return (
          <div
            key={i}
            className="absolute h-8 w-8 rounded-full transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${petalColor}33, transparent)`,
              transform: `rotate(${angle}deg) translateY(${synced ? -70 + pulse * 8 : -50}px)`,
              opacity: synced ? 0.6 : 0,
            }}
          />
        );
      })}
      <svg
        viewBox="0 0 100 92"
        className="relative z-10 h-28 w-28 sm:h-32 sm:w-32 drop-shadow-xl"
        style={{
          transform: beat ? "scale(1.18)" : "scale(1)",
          transition: "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: synced ? `drop-shadow(0 0 24px ${petalColor}99)` : undefined,
        }}
      >
        <path
          d="M50 88.5C24 68 4 48.5 4 28.5 4 14 14 4 28.5 4c8 0 15.5 3.5 21.5 9.5C56 7.5 63.5 4 71.5 4 86 4 96 14 96 28.5c0 20-20 39.5-46 60z"
          fill={synced ? petalColor : "rgba(255,255,255,0.15)"}
          stroke={synced ? petalColor : "rgba(255,255,255,0.3)"}
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

export function HeartbeatSync({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);
  const longT = (base: number) => getAnimationDuration(tone, base * 1.5);

  const [screen, setScreen] = useState<"intro" | "framing" | "choice" | "suspense" | "sync" | "holdReveal" | "reveal" | "final">("intro");
  const [petalColor, setPetalColor] = useState(PETALS[0].color);
  const [beats, setBeats] = useState(0);
  const [beat, setBeat] = useState(false);
  const [synced, setSynced] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [showWords, setShowWords] = useState(false);
  const [suspenseStep, setSuspenseStep] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const words = experience.finalMessage.split(" ");
  const messageBeats = [
    words.slice(0, Math.ceil(words.length / 3)).join(" "),
    words.slice(Math.ceil(words.length / 3), Math.ceil(2 * words.length / 3)).join(" "),
    words.slice(Math.ceil(2 * words.length / 3)).join(" "),
  ].filter(Boolean);
  const totalSteps = 7;

  function cleanupBeat() {
    if (beatTimerRef.current) { clearInterval(beatTimerRef.current); beatTimerRef.current = null; }
  }

  function cleanupHold() {
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null; }
  }

  function handleFramingResponse() {
    playSound("click");
    setScreen("choice");
  }

  function handlePickPetal(color: string) {
    setPetalColor(color);
    playSound("click");
    hapticTone("tap", tone);
    setScreen("suspense");
    setSuspenseStep(0);
    if (!musicStarted) {
      playMusic(experience.theme);
      setMusicStarted(true);
    }
    const si = setInterval(() => {
      setSuspenseStep((s) => {
        if (s >= 2) {
          clearInterval(si);
          setTimeout(() => {
            playToneSound("whoosh", tone);
            setScreen("sync");
          }, t(500));
          return s;
        }
        return s + 1;
      });
    }, t(700));
  }

  function handleTap() {
    if (synced) return;
    const next = beats + 1;
    setBeats(next);
    setBeat(true);
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    setTimeout(() => setBeat(false), t(100));

    if (next >= TOTAL_BEATS) {
      setSynced(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      cleanupBeat();
      let p = 0;
      const pulseInterval = setInterval(() => {
        p += 1;
        setPulse(p % 2 === 0 ? 0 : 1);
      }, t(900));
      beatTimerRef.current = pulseInterval;
      setTimeout(() => {
        cleanupBeat();
        setShowWords(true);
      }, longT(1200));
    }
  }

  useEffect(() => {
    if (showWords && wordIndex < messageBeats.length) {
      const delay = wordIndex === 0 ? t(300) : longT(1000);
      const timer = setTimeout(() => {
        setWordIndex((prev) => {
          const next = prev + 1;
          if (next >= messageBeats.length) {
            setTimeout(() => {
              playToneSound("ding", tone);
              hapticTone("ding", tone);
              cleanupBeat();
              setScreen("holdReveal");
            }, t(700));
            return next;
          }
          playToneSound("tap", tone);
          return next;
        });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [showWords, wordIndex, messageBeats.length, tone, t, longT]);

  useEffect(() => {
    return () => { cleanupBeat(); cleanupHold(); stopMusic(); };
  }, []);

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
        setTimeout(() => {
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

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {screen === "intro" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <ProgressBar current={1} total={totalSteps} theme={experience.theme} />
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Find my heartbeat</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Some feelings don't have words. But they do have a rhythm." /></p>
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
              You&apos;re about to feel it too. Are you ready?
            </p>
            <button className="premium-button mt-8" type="button" onClick={handleFramingResponse}>
              Yes, I&apos;m ready
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "choice" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Choose a feeling</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Pick a petal</h2>
            <p className="mt-5 text-white/75">{receiverName ? `${receiverName}, ` : ""}each color holds a different warmth. Pick the one that feels right.</p>
            <div className="mt-8 flex justify-center gap-4">
              {PETALS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePickPetal(p.color)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-5 transition-all duration-200 hover:scale-105 hover:border-white/30"
                >
                  <span className="text-4xl">{p.emoji}</span>
                  <span className="text-xs font-bold text-white/70">{p.label}</span>
                </button>
              ))}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "suspense" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { cleanupBeat(); setScreen("choice"); }} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Preparing your connection...</p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div
                className="h-24 w-24 rounded-full transition-all duration-500"
                style={{
                  background: `radial-gradient(circle, ${petalColor}44, transparent)`,
                  animation: "pulse-glow-3d 1.2s ease-in-out infinite",
                }}
              />
              <p className="text-sm font-bold text-white/60 animate-pulse">
                {["Listening for a rhythm...", "Almost there...", "Heartbeat detected."][Math.min(suspenseStep, 2)]}
              </p>
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: petalColor, opacity: suspenseStep >= i ? 1 : 0.2, transition: "opacity 0.3s" }}
                  />
                ))}
              </div>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "sync" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <BackButton onBack={() => { cleanupBeat(); setBeats(0); setSynced(false); setShowWords(false); setWordIndex(0); setScreen("suspense"); }} disabled={mode === "demo"} />
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {synced ? "Heartbeat locked" : `Tap the heart to sync ${beats}/${TOTAL_BEATS}`}
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              <button type="button" onClick={handleTap} disabled={synced} className="cursor-pointer disabled:cursor-default">
                <HeartIcon beat={beat} synced={synced} pulse={pulse} petalColor={petalColor} />
              </button>
              {!synced ? (
                <p className="text-sm text-white/60">Tap in rhythm with your heartbeat</p>
              ) : showWords ? (
                <div className="w-full text-center">
                  <p className="text-xs font-bold tracking-[0.08em] text-white/50 mb-4">Message arriving...</p>
                  <div className="space-y-3">
                    {messageBeats.slice(0, wordIndex).map((beatText, i) => (
                      <p key={i} className="animate-[section-in_500ms_cubic-bezier(.22,1,.36,1)_both] text-lg font-bold leading-relaxed text-white/90 sm:text-xl">
                        {beatText}
                      </p>
                    ))}
                    {wordIndex < messageBeats.length ? (
                      <span className="inline-block h-5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: petalColor }} />
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className="inline-block h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: petalColor, opacity: 0.6, animationDelay: `${i * 250}ms` }} />
                  ))}
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={5}>
          <PlayerCard>
            <BackButton onBack={() => { setWordIndex(0); setShowWords(false); setSynced(true); setScreen("sync"); }} disabled={mode === "demo"} />
            <ProgressBar current={6} total={totalSteps} theme={experience.theme} />
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
                    stroke={petalColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "💖" : "🤲"}
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
        <StepTransition step={6}>
          <PlayerCard>
            <ProgressBar current={7} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Heartbeat synced · Message delivered</p>
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

      {(screen === "sync" || screen === "holdReveal" || screen === "reveal") && petalColor ? (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                backgroundColor: petalColor,
                opacity: 0.12,
                animation: `drift-${i % 3} ${8 + Math.random() * 12}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes drift-0 { 0% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(20px,-30px) rotate(180deg); } 100% { transform: translate(-10px,-60px) rotate(360deg); } }
            @keyframes drift-1 { 0% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(-15px,-25px) rotate(-180deg); } 100% { transform: translate(10px,-50px) rotate(-360deg); } }
            @keyframes drift-2 { 0% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(10px,-35px) rotate(120deg); } 100% { transform: translate(-15px,-70px) rotate(240deg); } }
          `}</style>
        </div>
      ) : null}

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
