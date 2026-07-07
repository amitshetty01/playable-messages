"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/TypewriterText";
import { ConfettiEffect } from "@/components/scenes/ConfettiEffect";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function useMicrophone() {
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number>(0);
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");
  const onVolumeRef = useRef<(vol: number) => void>(() => {});

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        const ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        dataRef.current = data;
        analyserRef.current = analyser;
        ctxRef.current = ctx;
        setStatus("granted");

        function tick() {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          onVolumeRef.current(Math.sqrt(sum / data.length));
          rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) setStatus("denied");
      }
    }
    init();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      ctxRef.current?.close();
    };
  }, []);

  return { status, onVolumeRef };
}

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

export function BlowOutCandlesGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const candleCount = 5;

  const [lit, setLit] = useState(Array(candleCount).fill(true));
  const [cakeCut, setCakeCut] = useState(false);
  const [showIcing, setShowIcing] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cakeSquish, setCakeSquish] = useState({ rotate: 0, x: 0 });
  const [smokeParticles, setSmokeParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [crumbParticles, setCrumbParticles] = useState<Array<{ id: number; dx: number; dy: number; color: string }>>([]);
  const [icingExpanded, setIcingExpanded] = useState(false);
  const [showWish, setShowWish] = useState(true);
  const cakeRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);
  const knifeRef = useRef<HTMLDivElement>(null);
  const swipeStartRef = useRef<{ x: number } | null>(null);
  const relightCooldownRef = useRef<{ index: number; time: number } | null>(null);
  const litRef = useRef(lit);
  litRef.current = lit;
  const cakeCutRef = useRef(cakeCut);
  cakeCutRef.current = cakeCut;

  const mic = useMicrophone();

  useEffect(() => {
    if (!showWish) return;
    const t = setTimeout(() => setShowWish(false), 1500);
    return () => clearTimeout(t);
  }, [showWish]);

  function blowCandle(index: number, clientX?: number) {
    if (cakeCut) return;

    // Relight: if candle is already out, relight it
    if (!lit[index]) {
      const now = Date.now();
      if (relightCooldownRef.current && relightCooldownRef.current.index === index && now - relightCooldownRef.current.time < 300) return;
      relightCooldownRef.current = { index, time: now };
      const updated = [...lit];
      updated[index] = true;
      setLit(updated);
      playToneSound("tap", tone);
      hapticTone("tap", tone);
      return;
    }

    playToneSound("tap", tone);
    hapticTone("tap", tone);
    const updated = [...lit];
    updated[index] = false;
    setLit(updated);

    // Cake squish
    if (cakeRef.current && clientX !== undefined) {
      const rect = cakeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dir = clientX < centerX ? 1 : -1;
      setCakeSquish({ rotate: dir * 2, x: dir * 3 });
      setTimeout(() => setCakeSquish({ rotate: 0, x: 0 }), 200);
    }

    // Smoke particles
    const candleEl = document.getElementById(`candle-${index}`);
    if (candleEl) {
      const r = candleEl.getBoundingClientRect();
      const cakeRect = cakeRef.current?.getBoundingClientRect();
      if (cakeRect) {
        const x = ((r.left + r.width / 2 - cakeRect.left) / cakeRect.width) * 100;
        const y = ((r.top - cakeRect.top) / cakeRect.height) * 100;
        setSmokeParticles(prev => [...prev, { id: Date.now() + index, x, y }]);
        setTimeout(() => setSmokeParticles(prev => prev.filter(p => p.id !== Date.now() + index)), 1200);
      }
    }

    if (updated.every((l) => !l)) {
      playToneSound("ding", tone);
    }
  }

  // Mic auto-blow
  useEffect(() => {
    if (mic.status !== "granted") return;
    mic.onVolumeRef.current = (vol) => {
      if (vol > 0.4 && !cakeCutRef.current) {
        const idx = litRef.current.findIndex(l => l);
        if (idx !== -1) blowCandle(idx);
      }
    };
  }, [mic.status]);

  function handleMouseMove(e: React.MouseEvent | React.TouchEvent) {
    if (!cakeRef.current || cakeCut) return;
    const rect = cakeRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    if (knifeRef.current) {
      knifeRef.current.style.left = `${Math.max(0, Math.min(100, x))}%`;
      knifeRef.current.style.top = `${Math.max(0, Math.min(100, y))}%`;
    }
  }

  function cutCake() {
    if (cakeCut) return;
    const allBlown = lit.every((l) => !l);
    if (!allBlown) return;
    setCakeCut(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    const crumbColors = ["#c0844a", "#a1622b", "#d4a157", "#92400e", "#b45309"];
    const crumbs = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      dx: (Math.random() - 0.5) * 120,
      dy: (Math.random() - 0.5) * 60 + 30,
      color: crumbColors[i % crumbColors.length],
    }));
    setCrumbParticles(crumbs);
    setTimeout(() => setCrumbParticles([]), 1500);
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    setTimeout(() => {
      setShowIcing(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
    }, 800);
  }

  function handlePointerDown(e: React.PointerEvent) {
    swipeStartRef.current = { x: e.clientX };
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!swipeStartRef.current || cakeCut) return;
    const dx = Math.abs(e.clientX - swipeStartRef.current.x);
    swipeStartRef.current = null;
    if (dx > 50) {
      cutCake();
    }
  }

  const blownCount = lit.filter((l) => !l).length;
  const allBlown = lit.every((l) => !l);
  const totalSteps = candleCount + 2;
  const step = cakeCut ? candleCount + 1 : blownCount;

  // Screen reader announcements
  useEffect(() => {
    if (!announceRef.current) return;
    if (cakeCut) {
      announceRef.current.textContent = "Cake is cut. Reading your message now.";
    } else if (allBlown) {
      announceRef.current.textContent = "All candles out. Swipe or press the cut button to cut the cake.";
    } else {
      announceRef.current.textContent = `Blow out candle ${blownCount + 1} of ${candleCount}.`;
    }
  }, [cakeCut, allBlown, blownCount]);

  const final = (
    <FinalScreen
      ctaMessage={experience.customMessages.ctaMessage}
      experienceId={mode === "generated" ? experience.id : undefined}
      finalMessage={experience.finalMessage}
      shareUrl={shareUrl}
      templateId={template.id}
      templateTitle={template.title}
    />
  );

  return (
    <ExperienceLayout kicker="Happy Birthday" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {showWish ? (
        <motion.div
          className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 py-24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.6 }}
          onTap={() => setShowWish(false)}
          onClick={() => setShowWish(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowWish(false); } }}
          aria-label="Make a wish"
        >
          <motion.span
            className="text-6xl"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⭐
          </motion.span>
          <p className="text-center text-2xl font-bold tracking-wide text-white/80 drop-shadow-lg">
            Make a wish...
          </p>
        </motion.div>
      ) : !showFinal ? (
        <StepTransition step={step}>
          <motion.div
            animate={{
              boxShadow: `inset 0 0 ${80 - (blownCount / candleCount) * 80}px rgba(0,0,0,${(blownCount / candleCount) * 0.5})`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
          <PlayerCard>
            <ProgressBar current={step + 1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Blow Out the Candles</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {cakeCut ? "Cake is cut!" : allBlown ? "Cut the cake!" : mic.status === "granted" ? "Blow out the candles!" : `Blow out candle ${blownCount + 1}`}
              <div ref={announceRef} className="sr-only" aria-live="polite" aria-atomic="true" />
            </h2>
            <p className="mt-5 text-white/75">
              {cakeCut ? "The message appears in icing..." : allBlown ? "All candles out! Swipe across the cake to cut it." : mic.status === "granted" ? "Blow into your mic to extinguish the flames!" : "Tap each candle to blow it out."}
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              {/* Cake area with candles + knife */}
              <motion.div
                ref={cakeRef}
                className="relative h-64 w-full max-w-sm rounded-2xl bg-gradient-to-b from-amber-100/20 via-amber-200/10 to-amber-300/5 border-2 border-amber-400/20 overflow-hidden sm:h-72"
                animate={{ rotate: cakeSquish.rotate, x: cakeSquish.x }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onPointerDown={allBlown ? handlePointerDown : undefined}
                onPointerUp={allBlown ? handlePointerUp : undefined}
                onKeyDown={allBlown && !cakeCut ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cutCake(); } } : undefined}
                tabIndex={allBlown && !cakeCut ? 0 : undefined}
                aria-label={allBlown && !cakeCut ? "Swipe or press Enter to cut the cake" : undefined}
              >
                {/* Back cake layer (3D depth) */}
                <div className="absolute bottom-0 left-1/2 h-28 w-[85%] -translate-x-1/2 rounded-t-[3rem] bg-amber-700/20 border-2 border-amber-800/10" />
                {/* Middle cake layer (3D depth) */}
                <div className="absolute bottom-0 left-1/2 h-30 w-[82%] -translate-x-1/2 rounded-t-[3rem] bg-amber-600/25 border-2 border-amber-700/15" />
                {/* Main cake body */}
                <div className="absolute bottom-0 left-1/2 h-32 w-4/5 -translate-x-1/2 rounded-t-[3rem] bg-gradient-to-t from-amber-600/30 to-amber-400/20 border-2 border-amber-400/20">
                  {/* Dripping frosting */}
                  <div className="absolute -top-2 left-[8%] h-4 w-2.5 rounded-b-full bg-white/20" />
                  <div className="absolute -top-2 left-[30%] h-5 w-2 rounded-b-full bg-white/20" />
                  <div className="absolute -top-2 right-[30%] h-4 w-3 rounded-b-full bg-white/20" />
                  <div className="absolute -top-2 right-[8%] h-5 w-2 rounded-b-full bg-white/20" />
                  {/* Icing layer */}
                  <div className="absolute -top-3 left-0 right-0 h-6 rounded-t-[3rem] bg-gradient-to-b from-white/30 to-transparent" />
                  {/* Cake split line */}
                  {cakeCut && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-0.5 bg-white/30 animate-section-fade" />
                    </div>
                  )}
                </div>

                {/* Mic indicator */}
                {mic.status === "granted" && !cakeCut && (
                  <div className="absolute top-2 right-2 z-30 flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-300 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                    </span>
                    MIC
                  </div>
                )}
                {mic.status === "denied" && !cakeCut && (
                  <div className="absolute top-2 right-2 z-30 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/40 backdrop-blur-sm">
                    TAP
                  </div>
                )}

                {/* Candles */}
                <div className="absolute bottom-32 left-1/2 flex -translate-x-1/2 gap-3">
                  {lit.map((isLit, i) => (
                    <button
                      key={i}
                      id={`candle-${i}`}
                      onClick={(e) => { e.stopPropagation(); blowCandle(i, e.clientX); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); blowCandle(i); } }}
                      disabled={cakeCut}
                      aria-label={isLit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out. Click to relight.`}
                      className={`p-3 -m-3 flex flex-col items-center transition-all duration-300 ${isLit && !cakeCut ? "cursor-pointer hover:scale-110" : ""} ${!isLit ? "opacity-30" : ""}`}
                    >
                      {isLit ? (
                        <div className="mb-1">
                          <div className="h-6 w-2 animate-flicker rounded-full bg-gradient-to-t from-amber-400 via-yellow-300 to-white" style={{ animationDelay: `${i * 0.2}s` }} />
                        </div>
                      ) : (
                        <div className="mb-1 relative">
                          <div className="h-6 w-2 rounded-full bg-gray-500/30" />
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm animate-smoke">💨</span>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-red-400/80 animate-ember" />
                        </div>
                      )}
                      <div className="h-10 w-4 rounded-full bg-gradient-to-t from-rose-300/40 via-rose-200/30 to-rose-100/20 sm:h-12 sm:w-5" />
                    </button>
                  ))}
                </div>

                {/* Smoke particles */}
                {smokeParticles.map(p => (
                  <motion.div
                    key={p.id}
                    className="absolute z-20 h-6 w-6 rounded-full bg-white/10 backdrop-blur-sm"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    initial={{ opacity: 0.6, scale: 0.3, y: 0 }}
                    animate={{ opacity: 0, scale: 1.5, y: -30 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                ))}

                {/* Crumb particles */}
                {crumbParticles.map(p => (
                  <motion.div
                    key={p.id}
                    className="absolute z-20 rounded-sm"
                    style={{ left: "50%", top: "50%", width: 4, height: 4, background: p.color }}
                    initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                    animate={{ x: p.dx, y: p.dy, opacity: 0, rotate: 360 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                ))}

                {/* Knife (follows cursor via direct DOM ref) */}
                {allBlown && !cakeCut && (
                  <div
                    ref={knifeRef}
                    className="absolute z-10 pointer-events-none"
                    style={{ left: '50%', top: '50%', transform: "translate(-50%, -50%) rotate(15deg)" }}
                  >
                    <svg viewBox="0 0 20 60" className="h-20 w-8 drop-shadow-lg">
                      <rect x="6" y="0" width="8" height="30" rx="1" fill="rgba(200,200,200,0.6)" />
                      <polygon points="10,30 0,55 20,55" fill="rgba(180,180,180,0.5)" />
                      <rect x="4" y="0" width="12" height="8" rx="2" fill="rgba(150,150,150,0.4)" />
                    </svg>
                  </div>
                )}

                {/* Swipe cue */}
                {allBlown && !cakeCut && (
                  <>
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-amber-300/50 animate-pulse" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1 text-xs font-bold text-white/60 backdrop-blur-sm animate-pulse">
                      Swipe to cut
                    </div>
                  </>
                )}

                {/* Icing text piped onto cake face */}
                {showIcing && (
                  <div
                    className="absolute bottom-6 left-0 right-0 z-20 text-center animate-section-fade cursor-pointer"
                    onClick={() => setIcingExpanded(!icingExpanded)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIcingExpanded(!icingExpanded); } }}
                    aria-label={icingExpanded ? "Collapse message" : "Expand message"}
                  >
                    <div className={`relative mx-auto w-[90%] ${icingExpanded ? 'max-h-40 overflow-y-auto' : 'max-h-20 overflow-hidden'}`}>
                      <p className="px-2 text-xl font-['Caveat, cursive'] leading-relaxed text-amber-100 drop-shadow-lg sm:text-2xl">
                        <TypewriterText text={message} speed={35} />
                      </p>
                      {!icingExpanded && (
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-800/50 to-transparent" />
                      )}
                    </div>
                    {!icingExpanded && (
                      <span className="mt-1 inline-block text-[10px] font-bold tracking-wider text-amber-300/70">Tap to expand</span>
                    )}
                  </div>
                )}
              </motion.div>

              {showIcing && (
                <button
                  onClick={() => setShowFinal(true)}
                  className="rounded-full bg-gradient-to-r from-pink-400 to-amber-400 px-6 py-2 text-sm font-bold text-white shadow-lg hover:scale-105 transition-transform"
                >
                  See full message →
                </button>
              )}
            </div>
          </PlayerCard>
          </motion.div>
        </StepTransition>
      ) : final}
      <ConfettiEffect active={showConfetti} duration={3000} />
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          25% { opacity: 0.8; transform: scaleY(0.9); }
          50% { opacity: 0.95; transform: scaleY(1.05); }
          75% { opacity: 0.7; transform: scaleY(0.85); }
        }
        @keyframes smoke-rise {
          0% { opacity: 0.8; transform: translate(-50%, 0) scale(0.5); }
          50% { opacity: 0.4; transform: translate(-50%, -12px) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -24px) scale(1.8); }
        }
        @keyframes ember-fade {
          0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          60% { opacity: 0.6; transform: translate(-50%, 0) scale(0.7); }
          100% { opacity: 0; transform: translate(-50%, 0) scale(0.3); }
        }
        .animate-flicker { animation: flicker 0.8s ease-in-out infinite; }
        .animate-smoke { animation: smoke-rise 1s ease-out forwards; }
        .animate-ember { animation: ember-fade 1.2s ease-out forwards; }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
