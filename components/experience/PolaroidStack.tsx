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

interface Photo { id: number; caption: string; angle: number; lifted: boolean; }

const POLAROID_COLORS = ["#fdf6e3", "#f5e6d3", "#f0e0c8", "#e8d5b8", "#faf0e6"];

function HandwritingPath({ text }: { text: string }) {
  const lineHeight = 28;
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const test = current ? current + " " + word : word;
    if (test.length > 25) { lines.push(current); current = word; }
    else { current = test; }
  }
  if (current) lines.push(current);
  const paths: string[] = [];
  lines.forEach((line, li) => {
    let x = 20;
    const y = 30 + li * lineHeight;
    for (let ci = 0; ci < line.length; ci++) {
      const char = line[ci];
      const width = char === " " ? 8 : char === "i" ? 4 : char === "l" ? 4 : char === "t" ? 5 : char === "f" ? 5 : char === "r" ? 5 : char === "s" ? 5 : 7;
      if (char === " ") { x += width; continue; }
      const wiggle = Math.sin(ci * 0.8 + li) * 2;
      const nextX = x + width;
      const nextY = y + wiggle;
      if (ci === 0 || line[ci - 1] === " ") {
        paths.push(`M${x},${y + 4} Q${x + width * 0.3},${y - 3} ${nextX},${nextY}`);
      } else {
        paths.push(`M${x},${y + 4 + wiggle * 0.3} Q${x + width * 0.4},${y - 2 + wiggle * 0.5} ${nextX},${nextY}`);
      }
      x = nextX + 1;
    }
  });
  return (
    <svg className="w-full" viewBox="0 0 260 160" preserveAspectRatio="xMidYMid meet">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#2c1810" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="500" strokeDashoffset="500" style={{ animation: `drawPath 0.6s ease-out ${i * 0.08}s forwards` }} />
      ))}
      <style>{`@keyframes drawPath { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

export function PolaroidStack({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const receiverName = experience.receiverName;
  const creatorName = experience.creatorName;
  const greeting = receiverName ? `Hey ${receiverName}` : "Hey you";
  const t = (base: number) => getAnimationDuration(tone, base);
  const longT = (base: number) => getAnimationDuration(tone, base * 1.5);

  const [screen, setScreen] = useState<"intro" | "framing" | "suspense" | "choose" | "stack" | "holdReveal" | "final">("intro");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [liftedId, setLiftedId] = useState<number | null>(null);
  const [lifting, setLifting] = useState(false);
  const [developProgress, setDevelopProgress] = useState(0);
  const [showHandwriting, setShowHandwriting] = useState(false);
  const [pickOrder, setPickOrder] = useState<number[]>([]);
  const [musicStarted, setMusicStarted] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [holdUnlocked, setHoldUnlocked] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const dragStartY = useRef(0);
  const dragDelta = useRef(0);
  const photoRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const userImages = experience.images?.filter(Boolean) ?? [];
  const steps = experience.customMessages.steps;
  const photos: Photo[] = steps.slice(0, 4).map((text, i) => ({
    id: i,
    caption: text.slice(0, 60),
    angle: (i - 1.5) * 3 + (Math.random() - 0.5) * 2,
    lifted: false,
  }));
  while (photos.length < 3) {
    photos.push({ id: photos.length, caption: "A moment we shared", angle: (Math.random() - 0.5) * 6, lifted: false });
  }

  const totalSteps = 6;
  const maxPhotos = photos.length;
  const visiblePhotos = pickOrder.length > 0 ? pickOrder.map((idx) => photos[idx]) : photos;

  function cleanupHold() {
    if (holdRef.current) { clearInterval(holdRef.current); holdRef.current = null; }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (lifting || photoIndex >= maxPhotos) return;
    dragStartY.current = e.clientY;
    dragDelta.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragStartY.current || lifting) return;
    const delta = dragStartY.current - e.clientY;
    dragDelta.current = delta;
    if (delta > 0 && photoRef.current) {
      const lift = Math.min(delta / 200, 1);
      photoRef.current.style.transform = `translateY(-${lift * 180}px) rotate(${lift * 8}deg) scale(${1 + lift * 0.05})`;
      photoRef.current.style.opacity = `${1 - lift * 0.3}`;
    }
  }

  function handlePointerUp() {
    if (!dragStartY.current) return;
    const delta = dragDelta.current;
    dragStartY.current = 0;
    dragDelta.current = 0;
    if (delta > 80 && !lifting && photoIndex < maxPhotos) {
      setLifting(true);
      playToneSound("whoosh", tone);
      hapticTone("tap", tone);
      const currentId = visiblePhotos[photoIndex]?.id ?? -1;
      setLiftedId(currentId);
      setTimeout(() => {
        setLiftedId(null);
        setPhotoIndex((p) => {
          const next = p + 1;
          if (next >= maxPhotos) {
            setTimeout(() => {
              playToneSound("ding", tone);
              hapticTone("ding", tone);
              setShowHandwriting(true);
              setTimeout(() => {
                setScreen("holdReveal");
              }, longT(2200));
            }, longT(400));
          }
          return next;
        });
        setLifting(false);
      }, t(400));
    } else if (photoRef.current) {
      photoRef.current.style.transform = "";
      photoRef.current.style.opacity = "";
    }
  }

  const handleBegin = useCallback(() => {
    playToneSound("whoosh", tone);
    setScreen("framing");
  }, [tone]);

  const handleFramingResponse = useCallback(() => {
    playSound("click");
    setScreen("suspense");
    setDevelopProgress(0);
    if (!musicStarted) {
      playMusic(experience.theme);
      setMusicStarted(true);
    }
    let p = 0;
    const di = setInterval(() => {
      p += 0.05;
      setDevelopProgress(Math.min(p, 1));
      if (p >= 1) {
        clearInterval(di);
        playSound("click");
        setTimeout(() => setScreen("choose"), t(300));
      }
    }, t(60));
  }, [tone, musicStarted, experience.theme, t]);

  const handleChoosePhoto = useCallback((idx: number) => {
    playSound("click");
    hapticTone("tap", tone);
    setPickOrder((prev) => [...prev, idx]);
  }, [tone]);

  const handlePickDone = useCallback(() => {
    const remaining = photos.filter((_, i) => !pickOrder.includes(i));
    const rest = remaining.map((r) => r.id);
    setPickOrder((prev) => [...prev, ...rest]);
    playToneSound("whoosh", tone);
    setTimeout(() => setScreen("stack"), t(300));
  }, [pickOrder, photos, tone, t]);

  function handleHoldStart() {
    if (holdUnlocked) return;
    setHolding(true);
    setHoldProgress(0);
    let p = 0;
    holdRef.current = setInterval(() => {
      p += 0.025;
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
    }, t(30));
  }

  function handleHoldEnd() {
    cleanupHold();
    setHolding(false);
    if (!holdUnlocked) setHoldProgress(0);
  }

  useEffect(() => { return () => { cleanupHold(); stopMusic(); }; }, []);

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
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">A stack of moments</h2>
            <p className="mt-5 text-white/75"><TypewriterText text="Lift each photo to uncover what was underneath all along." /></p>
            <button className="premium-button mt-8" type="button" onClick={() => { playSound("click"); setScreen("framing"); }}>Begin</button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "framing" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={2} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Photos are waiting</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">{greeting}.</h2>
            <p className="mt-5 text-white/75">
              <TypewriterText text={getRelationshipIntro(experience.relationshipTag, experience.showCreatorName ? creatorName : "", receiverName)} />
            </p>
            <p className="mt-3 text-sm italic text-white/50">
              Each one holds a memory. Ready to lift them?
            </p>
            <button className="premium-button mt-8" type="button" onClick={handleFramingResponse}>
              Yes, show me
            </button>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "suspense" ? (
        <StepTransition step={2}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("framing")} disabled={mode === "demo"} />
            <ProgressBar current={3} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Developing photos...</p>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div
                className="relative h-40 w-40 rounded-sm"
                style={{
                  background: `linear-gradient(135deg, #fdf6e3 ${developProgress * 100}%, #d4c5a9 100%)`,
                  transition: "background 0.1s",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: developProgress > 0.5 ? (developProgress - 0.5) * 2 : 0, transition: "opacity 0.3s" }}>
                  <span className="text-3xl">📸</span>
                </div>
              </div>
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-stone-400 transition-all duration-200" style={{ width: `${developProgress * 100}%` }} />
              </div>
              <p className="text-sm text-white/60 animate-pulse">
                {developProgress < 0.5 ? "Chemicals reacting..." : "Almost developed..."}
              </p>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "choose" ? (
        <StepTransition step={3}>
          <PlayerCard>
            <BackButton onBack={() => { setPickOrder([]); setScreen("suspense"); }} disabled={mode === "demo"} />
            <ProgressBar current={4} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Choose your first memory</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Which moment first?</h2>
            <p className="mt-5 text-white/75">Tap the photos in the order you want to see them. You&apos;ll see them all.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {photos.map((photo, i) => {
                const isPicked = pickOrder.includes(i);
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => !isPicked && handleChoosePhoto(i)}
                    disabled={isPicked}
                    className={`w-36 transition-all duration-200 ${isPicked ? "scale-95 opacity-40" : "hover:scale-105"}`}
                  >
                    <div className="rounded-sm p-2 pb-5 shadow-lg" style={{ backgroundColor: POLAROID_COLORS[photo.id % POLAROID_COLORS.length] }}>
                      <div className="aspect-square w-full rounded-sm bg-gradient-to-br from-white/90 to-stone-200 flex items-center justify-center overflow-hidden">
                        {userImages[photo.id] ? (
                          <img src={userImages[photo.id]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-2xl">📷</span>
                        )}
                      </div>
                      <p className="mt-1 text-center text-[9px] font-bold tracking-wider text-stone-500 uppercase truncate">{photo.caption}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {pickOrder.length > 0 ? (
              <div className="mt-6 flex justify-center">
                <button className="premium-button" type="button" onClick={handlePickDone}>
                  {pickOrder.length >= maxPhotos ? "Start revealing" : `Pick more (${pickOrder.length}/${maxPhotos})`}
                </button>
              </div>
            ) : null}
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "stack" ? (
        <StepTransition step={4}>
          <PlayerCard>
            <BackButton onBack={() => { setPhotoIndex(0); setPickOrder([]); setShowHandwriting(false); setScreen("choose"); }} disabled={mode === "demo"} />
            <ProgressBar current={5} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">
              {photoIndex >= maxPhotos ? "All memories revealed" : `Photo ${photoIndex + 1} of ${maxPhotos}`}
            </p>
            <div className="mt-8 flex flex-col items-center">
              {photoIndex < maxPhotos ? (
                <div ref={photoRef} className="relative touch-none select-none" style={{ touchAction: "none" }}
                  onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
                  {visiblePhotos.slice(photoIndex).map((photo, i) => {
                    const isTop = i === 0;
                    const wasLifted = liftedId === photo.id;
                    return (
                      <div key={photo.id} className="absolute left-1/2 transition-all duration-300" style={{
                        transform: `translateX(-50%) translateY(${i * 12}px) rotate(${photo.angle}deg)`,
                        zIndex: maxPhotos - i,
                        opacity: wasLifted ? 0 : isTop || !lifting ? 1 : 0.3,
                        pointerEvents: isTop ? "auto" : "none",
                      }}>
                        <div className="w-52 rounded-sm p-3 pb-8 shadow-xl sm:w-60" style={{ backgroundColor: POLAROID_COLORS[photo.id % POLAROID_COLORS.length] }}>
                          <div className="aspect-square w-full rounded-sm bg-gradient-to-br from-white/90 to-stone-200 flex items-center justify-center overflow-hidden">
                            {userImages[photo.id] ? (
                              <img src={userImages[photo.id]} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${["#fce4ec","#f3e5f5","#e8eaf6","#e0f2f1","#fff3e0"][photo.id % 5]} 0%, transparent 100%)` }} />
                            )}
                          </div>
                          <p className="mt-2 text-center text-[10px] font-bold tracking-wider text-stone-500 uppercase">{photo.caption}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : showHandwriting ? (
                <div className="animate-[section-in_500ms_cubic-bezier(.22,1,.36,1)_both] w-full max-w-xs">
                  <div className="rounded-sm bg-[#fdf6e3] p-4 shadow-xl">
                    <p className="mb-2 text-center text-[10px] font-bold tracking-wider text-stone-400 uppercase">The back of the last photo</p>
                    <HandwritingPath text={experience.finalMessage} />
                    {experience.showCreatorName && creatorName ? <p className="mt-2 text-center text-[10px] italic text-stone-400">— {creatorName}</p> : null}
                  </div>
                </div>
              ) : null}
              <div className="mt-72 text-center">
                {photoIndex < maxPhotos && !lifting ? <p className="text-sm text-white/60">Drag the photo upward to lift it</p> : null}
                {lifting ? <p className="text-sm text-white/60 animate-pulse">Lifting...</p> : null}
                {photoIndex >= maxPhotos && !showHandwriting ? <p className="text-sm text-white/60 animate-pulse">Reading the back...</p> : null}
              </div>
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}

      {screen === "holdReveal" ? (
        <StepTransition step={5}>
          <PlayerCard>
            <ProgressBar current={6} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{holdUnlocked ? "Unlocked" : "One last thing"}</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Hold to keep this memory</h2>
            <p className="mt-5 text-white/75">Some moments are worth holding onto.</p>
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="relative mx-auto grid h-36 w-36 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f5e6d3" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${holdProgress * 264} 264`} style={{ transition: holdUnlocked ? "stroke-dasharray 0.3s" : undefined }} />
                </svg>
                <span className={`text-4xl transition-all duration-300 ${holdUnlocked ? "scale-125" : ""}`}>
                  {holdUnlocked ? "📸" : "🤲"}
                </span>
              </div>
              <button type="button"
                onPointerDown={handleHoldStart} onPointerUp={handleHoldEnd} onPointerLeave={handleHoldEnd}
                className={`w-full max-w-xs rounded-2xl border py-4 text-lg font-extrabold transition-all duration-200 ${
                  holdUnlocked ? "border-amber-400/40 bg-amber-400/20 text-amber-300" : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15 active:scale-95"
                }`} style={{ touchAction: "none" }}>
                {holdUnlocked ? "Saved!" : holding ? `${Math.round(holdProgress * 100)}%` : "Hold to save"}
              </button>
            </div>
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
    const { getMyExperiences } = await import("@/lib/my-experiences");
    const list = getMyExperiences();
    const idx = list.findIndex((e) => e.id === experienceId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], reaction };
      localStorage.setItem("cym_my_experiences", JSON.stringify(list));
    }
  } catch {}
}
