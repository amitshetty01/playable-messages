"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

const BUTTON_CLASS = "inline-flex min-h-[48px] items-center rounded-full border border-white/20 bg-white/10 px-8 text-sm font-extrabold text-white/80 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95";

function playBirthdayMelody(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.08, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 8);
  master.connect(ctx.destination);

  const notes = [523, 587, 659, 784, 659, 784, 1047, 784, 659, 587, 523, 659, 587, 523, 659, 784, 1047, 784, 659, 587, 523, 659, 784, 1047];
  const times = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 4.0, 4.3, 4.6, 4.9, 5.2, 5.5, 5.8, 6.1, 6.4, 6.7, 7.0];

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + times[i]);
    g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + times[i] + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + times[i] + 0.4);
    osc.connect(g);
    g.connect(master);
    osc.start(ctx.currentTime + times[i]);
    osc.stop(ctx.currentTime + times[i] + 0.5);
  });

  return master;
}

function playCheerSound(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.06, ctx.currentTime);
  master.connect(ctx.destination);
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.12 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
    osc.connect(g);
    g.connect(master);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.4);
  });
}

function playSparkle(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 1200 + Math.random() * 400;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.04, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

export function BirthdaySurpriseGame({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showYesNo, setShowYesNo] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [decorated, setDecorated] = useState(false);
  const [balloonsShown, setBalloonsShown] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [knifePos, setKnifePos] = useState({ x: 50, y: 50 });
  const [showLetter, setShowLetter] = useState(false);
  const [ribbons, setRibbons] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);
  const [balloons, setBalloons] = useState<{ id: number; x: number; color: string; delay: number }[]>([]);
  const [showCakeBtn, setShowCakeBtn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);

  const message = experience.finalMessage;

  const getOrCreateCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  // Lines appear one by one
  useEffect(() => {
    if (step === 0) {
      const t1 = setTimeout(() => setShowLine2(true), 4500);
      const t2 = setTimeout(() => setShowLine3(true), 9000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [step]);

  // Auto-advance from lines to special note after all lines shown + gap
  useEffect(() => {
    if (step === 0 && showLine3) {
      const t = setTimeout(() => setStep(1), 4000);
      return () => clearTimeout(t);
    }
  }, [step, showLine3]);

  // Auto-advance from special note to made-this
  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => setStep(2), 4000);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Show Yes/No after "I made this"
  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setShowYesNo(true), 2500);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Reset decorations when step changes
  useEffect(() => {
    if (step === 5) { setLightOn(false); }
    if (step === 6) { setMusicPlaying(false); }
    if (step === 7) { setDecorated(false); setRibbons([]); }
    if (step === 8) { setBalloonsShown(false); setBalloons([]); }
  }, [step]);

  const handleYes = useCallback(() => {
    try { playSparkle(getOrCreateCtx()); } catch {}
    setStep(3);
  }, [getOrCreateCtx]);

  const handleLightOn = useCallback(() => {
    setLightOn(true);
    try { playCheerSound(getOrCreateCtx()); } catch {}
    setTimeout(() => setStep(4), 1500);
  }, [getOrCreateCtx]);

  const handlePlayMusic = useCallback(() => {
    if (musicPlaying) return;
    setMusicPlaying(true);
    try {
      const ctx = getOrCreateCtx();
      const g = playBirthdayMelody(ctx);
      musicGainRef.current = g;
    } catch {}
    setTimeout(() => {
      setStep(5);
    }, 5000);
  }, [musicPlaying, getOrCreateCtx]);

  const handleDecorate = useCallback(() => {
    setDecorated(true);
    const colors = ["#ff6b8a", "#ffd700", "#ff8a6b", "#c084fc", "#60a5fa", "#f472b6"];
    const newRibbons = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      color: colors[i % colors.length],
      delay: i * 0.12,
    }));
    setRibbons(newRibbons);
    try { playCheerSound(getOrCreateCtx()); } catch {}
    setStep(6);
  }, [getOrCreateCtx]);

  const handleAddBalloons = useCallback(() => {
    setBalloonsShown(true);
    const colors = ["#ff6b8a", "#60a5fa", "#fbbf24", "#34d399", "#c084fc", "#fb923c"];
    const newBalloons = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      color: colors[i % colors.length],
      delay: i * 0.2,
    }));
    setBalloons(newBalloons);
    try { playCheerSound(getOrCreateCtx()); } catch {}
    setTimeout(() => setShowCakeBtn(true), 1000);
  }, [getOrCreateCtx]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cakeRef.current || cakeCut) return;
    const rect = cakeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setKnifePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(5, Math.min(95, y)) });
  }, [cakeCut]);

  const handleCutCake = useCallback(() => {
    if (cakeCut) return;
    setCakeCut(true);
    try { playCheerSound(getOrCreateCtx()); } catch {}
    setTimeout(() => {
      setShowLetter(true);
      setStep(8);
    }, 1500);
  }, [cakeCut, getOrCreateCtx]);

  const renderLines = () => (
    <div className="relative z-10 mx-auto max-w-2xl px-6 text-center" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      <p className="font-display font-bold leading-relaxed text-white/90" style={{ fontSize: "clamp(1.1rem, 4vw, 1.8rem)", animation: "cgFadeUp 0.8s ease-out both" }}>
        Today is a reminder that amazing people exist...
      </p>
      {showLine2 && (
        <p className="mt-6 font-display font-bold leading-relaxed text-white/80" style={{ fontSize: "clamp(1.1rem, 4vw, 1.8rem)", animation: "cgFadeUp 0.8s ease-out both" }}>
          ...and the best part about knowing you?{" "}
          <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">It is just knowing you.</span>
        </p>
      )}
      {showLine3 && (
        <p className="mt-6 font-display font-bold leading-relaxed text-white/90" style={{ fontSize: "clamp(1.1rem, 4vw, 1.8rem)", animation: "cgFadeUp 0.8s ease-out both" }}>
          The universe truly did something right when it brought you into this world.
        </p>
      )}
      {!showLine2 && (
        <div className="mt-8 flex items-center justify-center gap-1.5" style={{ animation: "cgFadePulse 2s ease-in-out infinite" }}>
          <span className="inline-block h-2 w-2 rounded-full bg-white/20" />
          <span className="inline-block h-2 w-2 rounded-full bg-white/30" />
          <span className="inline-block h-2 w-2 rounded-full bg-white/20" />
        </div>
      )}
    </div>
  );

  const renderSpecialNote = () => (
    <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      <p className="font-display font-bold leading-relaxed text-white/80" style={{ fontSize: "clamp(1.1rem, 4vw, 1.6rem)", animation: "cgFadeUp 0.8s ease-out both" }}>
        To make something special for you instead of just typing{" "}
        <span className="bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-transparent">"Happy Birthday"</span>
      </p>
    </div>
  );

  const renderMadeThis = () => (
    <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      <p className="font-display font-bold leading-relaxed text-white/90" style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)", animation: "cgFadeUp 0.8s ease-out both" }}>
        I made this
      </p>
      {showYesNo && (
        <div className="mt-10 flex flex-col items-center gap-4" style={{ animation: "cgFadeUp 0.6s ease-out both" }}>
          <p className="font-display font-bold text-white/60" style={{ fontSize: "clamp(1rem, 4vw, 1.3rem)" }}>
            Want to see it?
          </p>
          <div className="flex gap-4">
            <button onClick={handleYes} className="inline-flex min-h-[48px] min-w-[100px] items-center justify-center rounded-full bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 border border-emerald-400/30 px-8 text-sm font-extrabold text-emerald-300 backdrop-blur-md transition-all hover:bg-emerald-400/30 active:scale-95">
              Yes
            </button>
            <button onClick={handleYes} className="inline-flex min-h-[48px] min-w-[100px] items-center justify-center rounded-full bg-gradient-to-r from-rose-400/20 to-rose-500/10 border border-rose-400/30 px-8 text-sm font-extrabold text-rose-300 backdrop-blur-md transition-all hover:bg-rose-400/30 active:scale-95">
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDarkRoom = () => (
    <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgFadeIn 1s ease-out both" }}>
      {!lightOn ? (
        <>
          <p className="font-display font-bold leading-relaxed text-white/40 mb-10" style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.2rem)" }}>
            There is something in the dark...
          </p>
          <button onClick={handleLightOn} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-amber-400/30 to-yellow-400/20 border border-amber-400/40 px-10 text-base font-extrabold text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.15)] backdrop-blur-md transition-all hover:bg-amber-400/40 hover:shadow-[0_0_50px_rgba(251,191,36,0.25)] active:scale-95">
            <span className="mr-2 text-xl">💡</span> Turn on the light
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4" style={{ animation: "cgFadeIn 0.6s ease-out both" }}>
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-200/40 via-yellow-200/30 to-white/20 shadow-[0_0_80px_rgba(251,191,36,0.3),0_0_160px_rgba(251,191,36,0.15)]" style={{ animation: "cgPulse 3s ease-in-out infinite" }} />
          </div>
          <p className="font-display font-bold text-white/70 mt-2" style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.2rem)" }}>
            Light is on!
          </p>
        </div>
      )}
    </div>
  );

  const renderMusic = () => (
    <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      <div className="flex flex-col items-center gap-6">
        {!musicPlaying ? (
          <>
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-300/20 to-purple-300/20 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(255,100,150,0.1)]">
              <span className="text-4xl">🎵</span>
            </div>
            <button onClick={handlePlayMusic} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-rose-400/30 to-purple-400/20 border border-rose-400/40 px-10 text-base font-extrabold text-rose-300 backdrop-blur-md transition-all hover:bg-rose-400/40 active:scale-95">
              Play music
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-400/30 to-purple-400/20 flex items-center justify-center" style={{ animation: "cgPulse 1.5s ease-in-out infinite" }}>
              <span className="text-4xl">🎵</span>
            </div>
            <p className="font-display text-sm text-white/50">Playing...</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-6 w-1.5 rounded-full bg-rose-300/60" style={{ animation: `cgMusicBar 0.6s ease-in-out ${i * 0.1}s infinite`, height: `${12 + Math.random() * 20}px` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDecorate = () => (
    <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      {!decorated ? (
        <button onClick={handleDecorate} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-pink-400/30 to-amber-400/20 border border-pink-400/40 px-10 text-base font-extrabold text-pink-300 backdrop-blur-md transition-all hover:bg-pink-400/40 active:scale-95">
          <span className="mr-2 text-xl">🎀</span> Decorate
        </button>
      ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="font-display font-bold text-white/70 text-lg">Beautiful!</p>
          </div>
      )}
    </div>
  );

  const renderBalloons = () => (
    <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      {!balloonsShown ? (
        <button onClick={handleAddBalloons} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-sky-400/30 to-emerald-400/20 border border-sky-400/40 px-10 text-base font-extrabold text-sky-300 backdrop-blur-md transition-all hover:bg-sky-400/40 active:scale-95">
          <span className="mr-2 text-xl">🎈</span> Add balloons
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="font-display font-bold text-white/70 text-lg">So colorful!</p>
          {showCakeBtn && (
            <button onClick={() => setStep(7)} className={BUTTON_CLASS}>
              <span className="mr-2 text-xl">🎂</span> Let's cut the cake
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderCake = () => (
    <div className="relative z-10 mx-auto w-full max-w-lg px-6 text-center" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      <p className="font-display font-bold text-white/70 mb-6" style={{ fontSize: "clamp(1rem, 4vw, 1.4rem)" }}>
        Time to cut the cake!
      </p>
      <div
        ref={cakeRef}
        className="relative mx-auto h-64 w-full max-w-sm cursor-crosshair rounded-2xl border-2 border-amber-400/20 overflow-hidden sm:h-72"
        style={{ background: "linear-gradient(180deg, rgba(251,191,36,0.08) 0%, rgba(251,191,36,0.03) 100%)" }}
        onMouseMove={handleMouseMove}
        onClick={handleCutCake}
      >
        {/* Plate */}
        <div className="absolute bottom-0 left-1/2 h-4 w-5/6 -translate-x-1/2 rounded-full bg-white/10 border border-white/10" />

        {/* Cake body */}
        <div className="absolute bottom-4 left-1/2 h-36 w-4/5 -translate-x-1/2 rounded-t-[2rem]" style={{
          background: "linear-gradient(180deg, rgba(251,191,36,0.25) 0%, rgba(217,119,6,0.2) 50%, rgba(180,83,9,0.15) 100%)",
          border: "1px solid rgba(251,191,36,0.2)",
        }}>
          {/* Frosting layers */}
          <div className="absolute top-0 left-0 right-0 h-4 rounded-t-[2rem] bg-gradient-to-b from-white/25 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-amber-300/20 via-rose-300/20 to-amber-300/20" />
          {/* Cherry on top */}
          <div className="absolute -top-5 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg" />
          {/* Candle */}
          <div className="absolute -top-12 left-1/2 h-8 w-3 -translate-x-1/2 rounded-full bg-gradient-to-t from-rose-300/40 to-rose-200/20 border border-rose-300/20">
            <div className="absolute -top-3 left-1/2 h-4 w-2 -translate-x-1/2 rounded-full bg-gradient-to-t from-amber-400 via-yellow-300 to-white" style={{ animation: "cgFlicker 0.6s ease-in-out infinite" }} />
          </div>
          {/* Cake split */}
          {cakeCut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-0.5 bg-white/30" style={{ animation: "cgFadeIn 0.5s ease-out both" }} />
            </div>
          )}
        </div>

        {/* Knife */}
        {!cakeCut && (
          <div className="absolute z-10 pointer-events-none transition-all duration-75" style={{
            left: `${knifePos.x}%`,
            top: `${knifePos.y}%`,
            transform: "translate(-50%, -50%) rotate(15deg)",
          }}>
            <svg viewBox="0 0 20 60" className="h-24 w-8 drop-shadow-lg">
              <rect x="6" y="0" width="8" height="35" rx="1" fill="rgba(200,200,200,0.5)" />
              <polygon points="10,35 0,58 20,58" fill="rgba(180,180,180,0.4)" />
              <rect x="4" y="0" width="12" height="10" rx="2" fill="rgba(150,150,150,0.3)" />
            </svg>
          </div>
        )}

        {/* Click hint */}
        {!cakeCut && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1 text-xs font-bold text-white/60 backdrop-blur-sm" style={{ animation: "cgFadePulse 2s ease-in-out infinite" }}>
            Move the knife and click to cut
          </div>
        )}
      </div>
    </div>
  );

  const renderLetter = () => (
    <div className="relative z-10 mx-auto w-full max-w-2xl px-4" style={{ animation: "cgFadeIn 0.8s ease-out both" }}>
      <div className="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-50/95 via-white/95 to-amber-100/95 p-6 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.3)] max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        {/* Decorative header */}
        <div className="text-center mb-6">
          <span className="text-4xl">🎂</span>
          <p className="mt-2 text-xs font-bold tracking-widest text-amber-400/60 uppercase">A special message for you</p>
        </div>

        <div className="border-t border-amber-200/40 pt-6">
          <p className="font-serif text-base leading-relaxed text-amber-900/90 sm:text-lg" style={{ whiteSpace: "pre-wrap" }}>
            {message || "Happy Birthday! Today is all about you — the person who makes the world a little brighter, a little warmer, and a whole lot more beautiful. May your day be filled with laughter, love, and everything that makes you smile. You deserve it all and more. Cheers to you!"}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-amber-200/40 pt-5 text-center">
          <p className="font-serif text-sm text-amber-600/70 italic">
            Create like this for someone else
          </p>
          <button onClick={() => {}} className={`mt-5 ${BUTTON_CLASS} border-amber-300/30 bg-amber-100/20 text-amber-700 hover:bg-amber-100/40`}>
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onClick={step === 1 ? () => setStep(2) : step === 0 && showLine3 ? () => { /* wait for auto */ } : undefined}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        fontFamily: "'Nunito Sans', system-ui, sans-serif",
        touchAction: "manipulation",
        background: step >= 3 && step <= 7 && !lightOn ? "#0a0a0a" : "#0d0d12",
      }}
    >
      {/* Subtle grain */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      {/* Ribbons decoration */}
      {ribbons.map((r) => (
        <div key={r.id} className="absolute pointer-events-none" style={{
          left: `${r.x}%`,
          top: `${r.y}%`,
          animation: `cgRibbonIn 0.6s ease-out ${r.delay}s both`,
        }}>
          <svg viewBox="0 0 40 60" className="h-16 w-12 drop-shadow-md" style={{ transform: `rotate(${r.id * 27}deg)` }}>
            <path d="M20 0 Q5 20 10 45 Q20 55 20 60 Q20 55 30 45 Q35 20 20 0Z" fill={r.color} opacity="0.6" />
          </svg>
        </div>
      ))}

      {/* Balloons decoration */}
      {balloons.map((b) => (
        <div key={b.id} className="absolute pointer-events-none" style={{
          left: `${b.x}%`,
          bottom: "-20%",
          animation: `cgBalloonRise 2s ease-out ${b.delay}s both`,
        }}>
          <svg viewBox="0 0 30 50" className="h-20 w-14 drop-shadow-md">
            <ellipse cx="15" cy="20" rx="12" ry="18" fill={b.color} opacity="0.7" />
            <polygon points="15,38 10,45 20,45" fill={b.color} opacity="0.5" />
            <line x1="15" y1="45" x2="15" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </svg>
        </div>
      ))}

      {/* Step rendering */}
      {step === 0 && renderLines()}
      {step === 1 && renderSpecialNote()}
      {step === 2 && renderMadeThis()}
      {step === 3 && renderDarkRoom()}
      {step === 4 && renderMusic()}
      {step === 5 && renderDecorate()}
      {step === 6 && renderBalloons()}
      {step === 7 && renderCake()}
      {step === 8 && renderLetter()}

      <style>{`
        @keyframes cgFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cgFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cgFadePulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        @keyframes cgPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes cgFlicker { 0%, 100% { opacity: 1; transform: scaleY(1); } 25% { opacity: 0.7; transform: scaleY(0.85); } 50% { opacity: 0.9; transform: scaleY(1.1); } 75% { opacity: 0.6; transform: scaleY(0.8); } }
        @keyframes cgMusicBar { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }
        @keyframes cgRibbonIn { from { opacity: 0; transform: scale(0) rotate(0deg); } to { opacity: 1; transform: scale(1) rotate(var(--r, 27deg)); } }
        @keyframes cgBalloonRise { from { opacity: 0; transform: translateY(100px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
