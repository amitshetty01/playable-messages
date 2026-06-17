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

export function EchoChamber({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);

  const [screen, setScreen] = useState<"intro" | "framing" | "echoChamber" | "holdReveal" | "reveal" | "final">("intro");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [input, setInput] = useState("");
  const [echoes, setEchoes] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  const [echosCompleted, setEchosCompleted] = useState(0);
  const [inputBlocked, setInputBlocked] = useState(false);
  const [allEchoed, setAllEchoed] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 6;

  const words = experience.finalMessage.split(/\s+/).filter(Boolean);

  function handleSubmit() {
    if (inputBlocked || allEchoed) return;
    const trimmed = input.trim().toLowerCase();
    const target = words[currentWordIdx]?.toLowerCase();
    if (!target) return;
    if (trimmed !== target) {
      setShaking(true);
      playSound("error");
      hapticTone("tap", tone);
      timeoutRef.current = setTimeout(() => { setShaking(false); setInput(""); }, t(400));
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setInputBlocked(true);
    playSound("ding");
    hapticTone("ding", tone);
    setEchoes((prev) => [...prev, words[currentWordIdx]]);
    setEchosCompleted((p) => p + 1);
    timeoutRef.current = setTimeout(() => {
      const next = currentWordIdx + 1;
      if (next >= words.length) {
        setAllEchoed(true);
        timeoutRef.current = setTimeout(() => setScreen("holdReveal"), t(800));
      } else {
        setCurrentWordIdx(next);
        setInput("");
        setInputBlocked(false);
        if (inputRef.current) inputRef.current.focus();
      }
    }, t(1000));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Echo chamber</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Every word deserves to be heard. Type each one back to me." /></p>
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
            <p className="mt-3 text-sm italic text-white/50">Every word deserves to echo. Type each one back to me.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("echoChamber"); }}>
              Begin echoing
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "echoChamber" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {allEchoed ? "All words echoed" : `Echoed ${echosCompleted}/${words.length} words`}
            </p>
            <div className="mt-6 flex flex-col items-center gap-6">
              {!allEchoed ? (
                <div className="text-center">
                  <p className="text-sm text-white/50 mb-2">Type this word:</p>
                  <p className="text-2xl font-extrabold text-white/90 tracking-wide">{words[currentWordIdx]}</p>
                </div>
              ) : (
                <p className="text-lg font-bold text-green-400 text-center">All words echoed!</p>
              )}
              <div className="relative flex w-full max-w-xs items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={inputBlocked || allEchoed}
                  autoFocus
                  className={`w-full rounded-xl border bg-white/10 px-4 py-3 text-center text-lg font-bold text-white/90 outline-none transition-all duration-200 placeholder:text-white/30 focus:border-white/40 ${
                    shaking ? "animate-[shake_300ms_ease-in-out]" : "border-white/20"
                  } ${inputBlocked || allEchoed ? "opacity-50" : ""}`}
                  placeholder="Type the word..."
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={inputBlocked || allEchoed || !input.trim()}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white/80 transition-all duration-200 hover:bg-white/15 disabled:opacity-40"
                >
                  Echo
                </button>
              </div>
              {echosCompleted > 0 ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {echoes.map((word, i) => (
                    <span
                      key={i}
                      className="inline-block animate-[echo-fade_1s_cubic-bezier(.22,1,.36,1)_both] rounded-lg bg-white/10 px-3 py-1 text-lg font-bold text-white/70"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        transform: "scale(1)",
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <style>{`
              @keyframes echo-fade {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(3); opacity: 0.6; }
                100% { transform: scale(1); opacity: 0.7; }
              }
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-4px); }
                80% { transform: translateX(4px); }
              }
            `}</style>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { setCurrentWordIdx(0); setEchosCompleted(0); setEchoes([]); setAllEchoed(false); setInput(""); setInputBlocked(false); setScreen("echoChamber"); }} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{holdUnlocked ? "Unlocked" : "Hold to unlock"}</p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="relative mx-auto grid h-40 w-40 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`}
                    style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }}
                  />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "🔊" : "🔇"}
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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Words echoed · Message delivered</p>
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
