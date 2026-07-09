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
import type { ExperienceRecord, Template } from "@/lib/types";
import { getRelationshipIntro, getRelationshipCloser } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

const CANDLE_COLORS = ["#ff6b8a", "#ffd166", "#23d3ee", "#a070ff", "#ff5fb7", "#7c5cff", "#ff9f43", "#54a0ff"];
const WISHES = [
  { label: "Health", emoji: "💪", description: "Wishing you strength" },
  { label: "Happiness", emoji: "😊", description: "Wishing you joy" },
  { label: "Adventure", emoji: "🚀", description: "Wishing you wonder" },
  { label: "Love", emoji: "💖", description: "Wishing you warmth" },
];

function CakeLayer({ index }: { index: number }) {
  const colors = ["#f7d9aa", "#f0c88a", "#e8b870", "#dfa85a"];
  return (
    <div className="relative mx-auto rounded-full" style={{
      width: `${80 - index * 10}%`, height: `${16 + index * 2}px`,
      background: `linear-gradient(to bottom, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`,
      borderRadius: index === 3 ? "50% 50% 4px 4px" : "4px 4px 8px 8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginTop: index === 0 ? "0" : "-4px",
      zIndex: 10 - index, position: "relative",
    }}>
      {index === 3 ? (
        <div className="absolute left-1/2 -top-3 -translate-x-1/2" style={{ width: "90%", height: "8px", background: "linear-gradient(to bottom, #fff5e6, #f7d9aa)", borderRadius: "50%" }} />
      ) : null}
    </div>
  );
}

function Flame({ blown, color }: { blown: boolean; color: string }) {
  return (
    <span className="inline-block transition-all duration-300" style={{
      width: "8px", height: blown ? "0" : "16px",
      background: blown ? "transparent" : `linear-gradient(to top, ${color}, #ffd700, #fff8dc)`,
      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
      boxShadow: blown ? "none" : `${color}99 0 0 6px, rgba(255,200,0,0.4) 0 0 12px, rgba(255,200,0,0.2) 0 0 24px`,
      transformOrigin: "bottom center",
      animation: blown ? "none" : "flicker 0.5s ease-in-out infinite alternate",
    }} />
  );
}

function ConfettiBurst() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i, color: CANDLE_COLORS[i % CANDLE_COLORS.length],
    x: Math.random() * 100, delay: Math.random() * 0.5,
    size: 4 + Math.random() * 10, rotation: Math.random() * 360,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-sm" style={{
          left: `${p.x}%`, top: "-10px", width: `${p.size}px`, height: `${p.size * 0.6}px`,
          backgroundColor: p.color, animation: `confetti-fall-${p.id % 3} 3s ease-out ${p.delay}s forwards`,
          transform: `rotate(${p.rotation}deg)`, opacity: 0,
        }} />
      ))}
      <style>{`
        @keyframes confetti-fall-0 { 0% { transform: translateY(0) rotate(0deg) scale(0); opacity: 1; } 20% { opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg) scale(1); opacity: 0; } }
        @keyframes confetti-fall-1 { 0% { transform: translateY(0) rotate(0deg) scale(0); opacity: 1; } 20% { opacity: 1; } 100% { transform: translateY(100vh) rotate(-540deg) scale(1); opacity: 0; } }
        @keyframes confetti-fall-2 { 0% { transform: translateY(0) rotate(0deg) scale(0); opacity: 1; } 20% { opacity: 1; } 100% { transform: translateY(100vh) rotate(900deg) scale(1); opacity: 0; } }
      `}</style>
    </div>
  );
}

export function CandleCountdown({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);
  const longT = (base: number) => getAnimationDuration(tone, base * 1.5);

  const [screen, setScreen] = useState<"intro" | "framing" | "wish" | "cake" | "holdReveal" | "final">("intro");
  const [candles, setCandles] = useState<boolean[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealedWords, setRevealedWords] = useState<string[]>([]);
  const [candleLightUp, setCandleLightUp] = useState(0);
  const [selectedWish, setSelectedWish] = useState<string | null>(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const words = experience.finalMessage.split(" ");
  const candleCount = Math.min(words.length, 8);
  const totalSteps = 6;

  function cleanupHold() {
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null; }
  }

  function initCandles() {
    setCandles(Array.from({ length: candleCount }, () => false));
    setRevealedWords([]);
    setShowConfetti(false);
    setShowSparkle(false);
  }

  function blowCandle(index: number) {
    if (candles[index]) return;
    const updated = [...candles];
    updated[index] = true;
    setCandles(updated);
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    const word = words[index] || "";
    setRevealedWords((prev) => {
      const next = [...prev];
      next[index] = word;
      return next;
    });
    const allBlown = updated.every((c) => c);
    if (allBlown) {
      setShowSparkle(true);
      setTimeout(() => {
        playToneSound("ding", tone);
        hapticTone("ding", tone);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowSparkle(false);
          setScreen("holdReveal");
        }, longT(2800));
      }, longT(500));
    }
  }

  const handleBegin = useCallback(() => {
    playSound("click");
    setScreen("framing");
  }, []);

  const handleFramingResponse = useCallback(() => {
    playToneSound("whoosh", tone);
    if (!musicStarted) {
      playMusic(experience.theme);
      setMusicStarted(true);
    }
    initCandles();
    setCandleLightUp(0);
    setScreen("wish");
  }, [tone, musicStarted, experience.theme]);

  const handleWish = useCallback((wish: string) => {
    setSelectedWish(wish);
    playSound("ding");
    hapticTone("ding", tone);
    setTimeout(() => {
      playToneSound("whoosh", tone);
      setScreen("cake");
    }, t(500));
  }, [tone, t]);

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
          setShowReaction(true);
          setScreen("final");
        }, t(300));
      }
    }, t(25));
  }

  function handleHoldEnd() {
    cleanupHold();
    setHolding(false);
    if (!holdUnlocked) setHoldProgress(0);
  }

  useEffect(() => { return () => { cleanupHold(); stopMusic(); }; }, []);

  useEffect(() => {
    if (screen !== "wish" || candleLightUp >= 1) return;
    const li = setInterval(() => {
      setCandleLightUp(prev => {
        const next = Math.min(prev + 0.08, 1);
        if (next >= 1) clearInterval(li);
        return next;
      });
    }, 80);
    return () => clearInterval(li);
  }, [screen, candleLightUp]);

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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Blow out the candles</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Each candle holds a word of your message. Blow them all out to read it." /></p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("framing"); }}>Begin</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "framing" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">A celebration awaits</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{greeting}.</h2>
            <p className="mt-5 text-white/75">
              <TypewriterText text={getRelationshipIntro(experience.relationshipTag, experience.showCreatorName ? creatorName : "", receiverName)} />
            </p>
            <p className="mt-3 text-sm italic text-white-50">
              There are candles to blow and words to discover. Ready?
            </p>
            <button className="premium-button mt-8" type="button" onClick={handleFramingResponse}>
              Yes, let&apos;s go
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "wish" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
              <div className="flex items-end justify-center gap-2 pt-4">
                {Array.from({ length: candleCount }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center transition-all duration-500" style={{
                    opacity: i / candleCount < candleLightUp ? 0.25 : 0,
                    transform: `translateY(${i / candleCount < candleLightUp ? 0 : 12}px)`,
                  }}>
                    <Flame blown={false} color={CANDLE_COLORS[i % CANDLE_COLORS.length]} />
                    <div className="h-8 w-1 rounded-full" style={{ background: "linear-gradient(to right, #f5e6cc, #fff5e6, #f5e6cc)" }} />
                  </div>
                ))}
              </div>
            </div>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Make a wish</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">What do you wish for?</h2>
            <p className="mt-5 text-white/75">{receiverName ? `${receiverName}, ` : ""}before you blow out the candles, pick a wish. The candles will reveal your message.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {WISHES.map((w) => (
                <button key={w.label} type="button" onClick={() => handleWish(w.label)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-5 transition-all duration-200 hover:scale-105 ${
                    selectedWish === w.label ? "border-amber-400/50 bg-amber-400/20" : "border-white/15 bg-white/10"
                  }`}>
                  <span className="text-3xl">{w.emoji}</span>
                  <span className="text-sm font-bold text-white/80">{w.label}</span>
                  <span className="text-[10px] text-white/50">{w.description}</span>
                </button>
              ))}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "cake" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <BackButton onBack={() => { setSelectedWish(null); setScreen("wish"); }} disabled={mode === "demo"} />
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {candles.filter(Boolean).length}/{candleCount} candles blown{selectedWish ? ` · Wish: ${selectedWish}` : ""}
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="relative w-full max-w-xs">
                <div className="flex items-end justify-center gap-2.5 px-4">
                  {Array.from({ length: candleCount }).map((_, i) => (
                    <button key={i} type="button" onClick={() => blowCandle(i)} disabled={candles[i]}
                      className="flex flex-col items-center gap-0.5 transition-all duration-200 hover:scale-110 disabled:scale-100 disabled:opacity-60">
                      {candles[i] ? <span className="text-sm leading-none">✨</span> : <Flame blown={false} color={CANDLE_COLORS[i % CANDLE_COLORS.length]} />}
                      <div className="h-14 w-1.5 rounded-full" style={{ background: "linear-gradient(to right, #f5e6cc, #fff5e6, #f5e6cc)" }} />
                    </button>
                  ))}
                </div>
                <div className="mt-0 flex flex-col items-center">
                  {Array.from({ length: 4 }).map((_, i) => (<CakeLayer key={i} index={i} />))}
                </div>
                <div className="mt-2 text-center text-xs font-bold tracking-wider text-white/60">Happy Birthday</div>
              </div>
              {candles.filter(Boolean).length > 0 ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {revealedWords.filter(Boolean).map((w, i) => (
                    <span key={i} className="animate-icing-squish rounded-full px-3 py-1 text-sm font-extrabold" style={{
                      color: "#f5e6c8",
                      WebkitTextStroke: "1px #d4a373",
                      textShadow: "0 2px 0px #c68642",
                      fontFamily: "'Georgia', serif",
                      background: "rgba(255,255,255,0.06)",
                      letterSpacing: "0.02em",
                    }}>{w}</span>
                  ))}
                  {revealedWords.filter(Boolean).length < candleCount ? <span className="inline-block h-5 w-2 animate-pulse rounded-full bg-amber-400/60" /> : null}
                </div>
              ) : (
                <p className="text-sm text-white/50">Pop the flames to reveal your message</p>
              )}
              {showSparkle ? <p className="text-lg font-bold text-amber-300 animate-pulse">✨ All candles out! ✨</p> : null}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={5}>
          <PlayerCard>
            <ProgressBar current={6} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{holdUnlocked ? "Wish granted" : "One last moment"}</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Hold to make it count</h2>
            <p className="mt-5 text-white-75">Your wish is made. Now hold to seal it.</p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="relative mx-auto grid h-36 w-36 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ffd166" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`} />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "🎉" : "🎂"}
                </span>
              </div>
              <button type="button"
                onPointerDown={handleHoldStart} onPointerUp={handleHoldEnd} onPointerLeave={handleHoldEnd}
                className={`w-full max-w-xs rounded-2xl border py-4 text-lg font-extrabold transition-all duration-200 ${
                  holdUnlocked ? "border-amber-400/40 bg-amber-400/20 text-amber-300" : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15 active:scale-95"
                }`} style={{ touchAction: "none" }}>
                {holdUnlocked ? "Done!" : holding ? `${Math.round(holdProgress * 100)}%` : "Hold to seal"}
              </button>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "final" ? final : null}
      {showConfetti ? <ConfettiBurst /> : null}
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
    const { getMyExperiences } = await import("@/lib/my-experiences");
    const list = getMyExperiences();
    const idx = list.findIndex((e) => e.id === experienceId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], reaction };
      localStorage.setItem("cym_my_experiences", JSON.stringify(list));
    }
  } catch {}
}
