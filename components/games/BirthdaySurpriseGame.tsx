"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FinalScreen } from "@/components/FinalScreen";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

const BTN = "inline-flex min-h-[48px] items-center rounded-full border border-white/20 bg-white/10 px-8 text-sm font-extrabold text-white/80 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95";
const BTN_BRIGHT = "inline-flex min-h-[48px] items-center rounded-full border border-amber-300/40 bg-amber-200/30 px-8 text-sm font-extrabold text-amber-900 backdrop-blur-md transition-all hover:bg-amber-300/40 active:scale-95";

function playBirthdayMelody(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.12, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 12);
  master.connect(ctx.destination);

  const notes: [number, number, number][] = [
    [523, 0, 0.3], [587, 0.35, 0.3], [659, 0.7, 0.3],
    [784, 1.1, 0.5], [784, 1.7, 0.2], [698, 2.0, 0.25],
    [659, 2.3, 0.25], [587, 2.6, 0.3], [523, 3.0, 0.4],
    [784, 3.5, 0.5], [659, 4.1, 0.3], [587, 4.5, 0.25],
    [523, 4.8, 0.25], [1047, 5.2, 0.6], [784, 5.9, 0.3],
    [880, 6.3, 0.3], [784, 6.7, 0.25], [659, 7.0, 0.25],
    [784, 7.3, 0.3], [1047, 7.7, 0.8],
  ];

  notes.forEach(([freq, time, dur]) => {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + time);
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + time + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);
    o.connect(g);
    g.connect(master);
    o.start(ctx.currentTime + time);
    o.stop(ctx.currentTime + time + dur + 0.1);
  });
}

function playCheer(ctx: AudioContext) {
  const m = ctx.createGain();
  m.gain.setValueAtTime(0.06, ctx.currentTime);
  m.connect(ctx.destination);
  [523, 659, 784, 1047].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.12 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
    o.connect(g);
    g.connect(m);
    o.start(ctx.currentTime + i * 0.12);
    o.stop(ctx.currentTime + i * 0.12 + 0.4);
  });
}

function playSparkle(ctx: AudioContext) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = 1200 + Math.random() * 400;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.04, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.5);
}

const DEFAULT_MESSAGE = `Happy Birthday to someone who deserves all the love, laughter, and joy the world has to offer.

Today isn't just another day on the calendar — it's a celebration of you and everything that makes you extraordinary. The way you light up every room you walk into, the warmth you bring to every conversation, and the kindness you show to everyone around you — these are the things that make you truly one of a kind.

I hope this year brings you closer to your dreams, fills your days with unexpected moments of happiness, and surrounds you with people who see you for the incredible person you are.

You've accomplished so much, and yet the best is still ahead. Keep shining, keep believing, and never forget that you are capable of amazing things.

With all my heart, happy birthday. 🎂`;

function PhotoGrid({ images }: { images: string[] }) {
  const n = images.length;
  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-2xl mx-auto px-4" style={{ gridAutoRows: "minmax(100px,auto)" }}>
      {images.slice(0, 10).map((src, i) => {
        let cls = "col-span-1 row-span-1";
        if (n === 2) cls = "col-span-2 row-span-2";
        else if (n === 3) cls = i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1";
        else if (n <= 6) cls = "col-span-1 row-span-1";
        else if (i < 2) cls = "col-span-2 row-span-2";
        return (
          <div key={i} className={`${cls} overflow-hidden rounded-xl shadow-lg`}
            style={{ animation: `cgUp 0.6s ease-out ${i * 0.12}s both`, transform: `rotate(${(i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : 0) * (0.5 + Math.random() * 0.5)}deg)` }}>
            <img src={src} alt={`Memory ${i + 1}`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
          </div>
        );
      })}
    </div>
  );
}

function LightBulb({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%`, animation: `cgIn 0.5s ease-out ${delay}s both` }}>
      <svg viewBox="0 0 40 60" className="h-14 w-11 drop-shadow-2xl" style={{ animation: "cgSwing 3s ease-in-out infinite" }}>
        <defs>
          <radialGradient id={`bl-${x}-${y}`} cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#fef08a" /><stop offset="60%" stopColor="#facc15" /><stop offset="100%" stopColor="#eab308" />
          </radialGradient>
        </defs>
        <ellipse cx="20" cy="22" rx="13" ry="16" fill={`url(#bl-${x}-${y})`} />
        <rect x="16" y="40" width="8" height="6" rx="1" fill="#a16207" />
        <path d="M12 46 Q20 56 28 46" fill="none" stroke="#a16207" strokeWidth="2" />
        <ellipse cx="16" cy="16" rx="4" ry="5" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="20" cy="22" rx="16" ry="20" fill="rgba(250,204,21,0.12)" style={{ animation: "cgPulse 2s ease-in-out infinite" }} />
      </svg>
    </div>
  );
}

function BalloonSVG({ color, size = 1 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 40 64" className="drop-shadow-xl" style={{ width: `${20 * size}px`, height: `${32 * size}px` }}>
      <defs>
        <radialGradient id={`bg-${color.slice(1)}`} cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="40%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}99`} />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="24" rx="16" ry="22" fill={`url(#bg-${color.slice(1)})`} />
      <polygon points="20,46 14,54 26,54" fill={color} opacity="0.7" />
      <path d="M20 54 Q18 60 20 64 Q22 60 20 54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <ellipse cx="14" cy="16" rx="4" ry="6" fill="rgba(255,255,255,0.35)" />
      <path d="M10 28 Q6 32 8 36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M30 28 Q34 32 32 36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
}

function KnifeSVG() {
  return (
    <svg viewBox="0 0 120 50" className="h-16 w-40 drop-shadow-2xl">
      <defs>
        <linearGradient id="ks-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="30%" stopColor="#e5e5e5" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#d4d4d4" />
          <stop offset="100%" stopColor="#a3a3a3" />
        </linearGradient>
        <linearGradient id="ks-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d4d4d4" />
        </linearGradient>
        <linearGradient id="ks-handle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3e2723" />
          <stop offset="15%" stopColor="#5c4033" />
          <stop offset="40%" stopColor="#8b6914" />
          <stop offset="60%" stopColor="#6b4c3b" />
          <stop offset="85%" stopColor="#5c4033" />
          <stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
        <linearGradient id="ks-bolster" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3a3a3" />
          <stop offset="50%" stopColor="#d4d4d4" />
          <stop offset="100%" stopColor="#737373" />
        </linearGradient>
      </defs>
      <path d="M5 16 L55 10 L60 14 L60 36 L55 40 L5 34 Z" fill="url(#ks-blade)" stroke="#a3a3a3" strokeWidth="0.5" />
      <path d="M5 16 L30 12 L60 14" fill="url(#ks-edge)" opacity="0.4" />
      <path d="M5 34 L30 38 L60 36" fill="none" stroke="#8a8a8a" strokeWidth="0.5" opacity="0.5" />
      <line x1="5" y1="16" x2="5" y2="34" stroke="#d4d4d4" strokeWidth="1" opacity="0.6" />
      <rect x="58" y="10" width="5" height="30" rx="1" fill="url(#ks-bolster)" stroke="#737373" strokeWidth="0.5" />
      <rect x="63" y="8" width="52" height="34" rx="4" fill="url(#ks-handle)" stroke="#3e2723" strokeWidth="0.8" />
      <circle cx="75" cy="25" r="2.5" fill="#a3a3a3" stroke="#8a8a8a" strokeWidth="0.3" />
      <circle cx="89" cy="25" r="2.5" fill="#a3a3a3" stroke="#8a8a8a" strokeWidth="0.3" />
      <circle cx="103" cy="25" r="2.5" fill="#a3a3a3" stroke="#8a8a8a" strokeWidth="0.3" />
      <path d="M63 8 Q89 6 115 8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <path d="M63 42 Q89 44 115 42" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    </svg>
  );
}

type FloatBalloon = { id: number; x: number; color: string; startTime: number; size: number };

export function BirthdaySurpriseGame({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const [s2, setS2] = useState(false);
  const [s3, setS3] = useState(false);
  const [showYesNo, setShowYesNo] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [decorated, setDecorated] = useState(false);
  const [balloonsShown, setBalloonsShown] = useState(false);
  const [floatBalloons, setFloatBalloons] = useState<FloatBalloon[]>([]);
  const [cutCount, setCutCount] = useState(0);
  const [knifePos, setKnifePos] = useState({ x: 50, y: 50 });
  const [ribbons, setRibbons] = useState<{ id: number; x: number; y: number; c: string; d: number }[]>([]);
  const [showCakeBtn, setShowCakeBtn] = useState(false);
  const [showBalloonBtn, setShowBalloonBtn] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [cutLines, setCutLines] = useState<number[]>([]);
  const [cutDone, setCutDone] = useState(false);
  const [cakeAnim, setCakeAnim] = useState(0);
  const [afterCutChoice, setAfterCutChoice] = useState<"memories" | "letter" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const message = experience.finalMessage;
  const isBright = lightOn || step >= 4;
  const images = experience.images || [];
  const MIN_SLICES = 2;
  const balloonColors = ["#ff6b8a","#60a5fa","#fbbf24","#34d399","#c084fc","#fb923c","#f472b6","#38bdf8"];

  const ensureAudio = useCallback(async () => {
    if (!audioRef.current) {
      try {
        audioRef.current = new AudioContext();
      } catch (e) {
        console.error("AudioContext creation failed:", e);
        return null;
      }
    }
    if (audioRef.current.state === "suspended") {
      try { await audioRef.current.resume(); } catch (e) { console.error("AudioContext resume failed:", e); }
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    if (step === 0) {
      const t1 = setTimeout(() => setS2(true), 4500);
      const t2 = setTimeout(() => setS3(true), 9000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [step]);

  useEffect(() => {
    if (step === 0 && s3) { const t = setTimeout(() => setStep(1), 4000); return () => clearTimeout(t); }
  }, [step, s3]);

  useEffect(() => {
    if (step === 1) { const t = setTimeout(() => setStep(2), 4000); return () => clearTimeout(t); }
  }, [step]);

  useEffect(() => {
    if (step === 2) { const t = setTimeout(() => setShowYesNo(true), 2500); return () => clearTimeout(t); }
  }, [step]);

  useEffect(() => {
    if (step === 7 && cakeAnim < 4) {
      const t = setTimeout(() => setCakeAnim((p) => p + 1), 700);
      return () => clearTimeout(t);
    }
  }, [step, cakeAnim]);

  useEffect(() => {
    if (!balloonsShown || step < 6) return;
    const interval = setInterval(() => {
      setFloatBalloons((prev) => {
        const now = Date.now();
        const fresh = prev.filter((b) => now - b.startTime < 12000);
        if (fresh.length >= 20) return fresh;
        return [...fresh, {
          id: now + Math.random(),
          x: Math.random() * 90 + 5,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          startTime: now,
          size: 0.7 + Math.random() * 0.5,
        }];
      });
    }, 900);
    return () => clearInterval(interval);
  }, [balloonsShown, step]);

  const playSound = useCallback(async (fn: (ctx: AudioContext) => void) => {
    const ctx = await ensureAudio();
    if (ctx) { try { fn(ctx); } catch (e) { console.error("Sound error:", e); } }
  }, [ensureAudio]);

  const hYes = useCallback(async () => {
    await playSound(playSparkle);
    setStep(3);
  }, [playSound]);

  const hLight = useCallback(async () => {
    setLightOn(true);
    await playSound(playCheer);
    setTimeout(() => setStep(4), 2200);
  }, [playSound]);

  const hMusic = useCallback(async () => {
    if (musicPlaying) return;
    setMusicPlaying(true);
    await playSound(playBirthdayMelody);
    setTimeout(() => setStep(5), 5500);
  }, [musicPlaying, playSound]);

  const hDecorate = useCallback(async () => {
    setDecorated(true);
    const cs = ["#ff6b8a","#ffd700","#ff8a6b","#c084fc","#60a5fa","#f472b6"];
    setRibbons(Array.from({length:16},(_,i)=>({id:i,x:Math.random()*90+5,y:Math.random()*90+5,c:cs[i%cs.length],d:i*0.1})));
    await playSound(playCheer);
    setTimeout(() => { setShowBalloonBtn(true); }, 1200);
  }, [playSound]);

  const hBalloons = useCallback(async () => {
    setBalloonsShown(true);
    await playSound(playCheer);
    setTimeout(() => setShowCakeBtn(true), 1200);
  }, [playSound]);

  const hMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!cakeRef.current || cutDone) return;
    const r = cakeRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setKnifePos({ x: Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)), y: Math.max(5, Math.min(95, ((clientY - r.top) / r.height) * 100)) });
  }, [cutDone]);

  const hCut = useCallback(async () => {
    if (cutDone) return;
    if (cutCount >= 7) return;
    const newLines = [...cutLines, knifePos.x];
    newLines.sort((a, b) => a - b);
    setCutLines(newLines);
    const next = cutCount + 1;
    setCutCount(next);
    await playSound(playSparkle);
    if (next >= MIN_SLICES) {
      setCutDone(true);
      setTimeout(() => {
        setStep(8);
      }, 1000);
    }
  }, [cutCount, cutLines, knifePos.x, cutDone, playSound]);

  const slices = cutLines.length + 1;

  const handleMemoriesChoice = () => {
    setAfterCutChoice("memories");
    setShowMemories(true);
  };

  const handleLetterChoice = () => {
    setAfterCutChoice("letter");
    setShowLetter(true);
  };

  return (
    <div ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none transition-all duration-700"
      style={{
        fontFamily: "'Nunito Sans', system-ui, sans-serif",
        touchAction: "manipulation",
        background: isBright ? "linear-gradient(135deg, #fef9c3 0%, #fde68a 30%, #fef3c7 60%, #fce7f3 100%)" : "#0a0a0a",
        color: isBright ? "#1c1917" : "#fff",
      }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      {/* Continuous floating balloons */}
      {(balloonsShown || step >= 6) && floatBalloons.map((b) => {
        const elapsed = (Date.now() - b.startTime) / 1000;
        const duration = 10;
        const progress = (elapsed % duration) / duration;
        const bottom = ((1 - progress) * 110 - 10);
        const opacity = progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1;
        return (
          <div key={b.id} className="absolute pointer-events-none z-0" style={{
            left: `${b.x}%`,
            bottom: `${bottom}%`,
            opacity,
            transition: "none",
          }}>
            <div style={{ animation: `cgSway 4s ease-in-out ${b.id % 3}s infinite` }}>
              <BalloonSVG color={b.color} size={b.size} />
            </div>
          </div>
        );
      })}

      {/* Ribbons */}
      {ribbons.map(r => (
        <div key={r.id} className="absolute pointer-events-none" style={{ left: `${r.x}%`, top: `${r.y}%`, animation: `cgRibbon 0.7s ease-out ${r.d}s both` }}>
          <svg viewBox="0 0 40 60" className="h-20 w-14 drop-shadow-lg" style={{ transform: `rotate(${r.id * 25}deg)` }}>
            <path d="M20 0 Q5 20 10 45 Q20 58 20 60 Q20 58 30 45 Q35 20 20 0Z" fill={r.c} opacity="0.7" />
          </svg>
        </div>
      ))}

      {/* Light bulbs */}
      {lightOn && step === 3 && (
        <>
          {[
            { x: 12, y: 8, d: 0 }, { x: 88, y: 8, d: 0.15 },
            { x: 25, y: 3, d: 0.3 }, { x: 75, y: 3, d: 0.45 },
            { x: 50, y: 1, d: 0.6 }, { x: 5, y: 12, d: 0.2 }, { x: 95, y: 12, d: 0.35 },
          ].map((b, i) => (
            <LightBulb key={i} x={b.x} y={b.y} delay={b.d} />
          ))}
          <div className="absolute inset-0 pointer-events-none z-0" style={{
            background: "radial-gradient(circle at 50% 0%, rgba(250,204,21,0.12) 0%, transparent 60%)",
            animation: "cgIn 0.8s ease-out both",
          }} />
        </>
      )}

      {/* Step 0 */}
      {step === 0 && (
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", animation: "cgUp 0.8s ease-out both" }} className="font-display font-bold leading-relaxed text-white/90">
            Today is a reminder that amazing people exist...
          </p>
          {s2 && <p style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", animation: "cgUp 0.8s ease-out both" }} className="mt-6 font-display font-bold leading-relaxed text-white/80">
            ...and the best part about knowing you?{" "}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">It is just knowing you.</span>
          </p>}
          {s3 && <p style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", animation: "cgUp 0.8s ease-out both" }} className="mt-6 font-display font-bold leading-relaxed text-white/90">
            The universe truly did something right when it brought you into this world.
          </p>}
          {!s2 && <div className="mt-8 flex items-center justify-center gap-1.5" style={{ animation: "cgPulse 2s ease-in-out infinite" }}>
            {[0,1,2].map(i => <span key={i} className="inline-block h-2 w-2 rounded-full bg-white/20" style={i===1?{background:"rgba(255,255,255,0.3)"}:{}} />)}
          </div>}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1.1rem,4vw,1.6rem)", animation: "cgUp 0.8s ease-out both" }} className="font-display font-bold leading-relaxed text-white/80">
            To make something special for you instead of just typing{" "}
            <span className="bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-transparent">&ldquo;Happy Birthday&rdquo;</span>
          </p>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1.5rem,6vw,2.5rem)", animation: "cgUp 0.8s ease-out both" }} className="font-display font-bold leading-relaxed text-white/90">
            I made this
          </p>
          {showYesNo && <div className="mt-10 flex flex-col items-center gap-4" style={{ animation: "cgUp 0.6s ease-out both" }}>
            <p style={{ fontSize: "clamp(1rem,4vw,1.3rem)" }} className="font-display font-bold text-white/60">Want to see it?</p>
            <div className="flex gap-4">
              <button onClick={hYes} className="inline-flex min-h-[48px] min-w-[100px] items-center justify-center rounded-full bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 border border-emerald-400/30 px-8 text-sm font-extrabold text-emerald-300 backdrop-blur-md transition-all hover:bg-emerald-400/30 active:scale-95">Yes</button>
              <button onClick={hYes} className="inline-flex min-h-[48px] min-w-[100px] items-center justify-center rounded-full bg-gradient-to-r from-rose-400/20 to-rose-500/10 border border-rose-400/30 px-8 text-sm font-extrabold text-rose-300 backdrop-blur-md transition-all hover:bg-rose-400/30 active:scale-95">No</button>
            </div>
          </div>}
        </div>
      )}

      {/* Step 3 — Dark / Light */}
      {step === 3 && (
        <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgIn 1s ease-out both" }}>
          {!lightOn ? (
            <>
              <p style={{ fontSize: "clamp(0.9rem,3.5vw,1.2rem)" }} className="font-display font-bold leading-relaxed text-white/40 mb-10">
                There is something in the dark...
              </p>
              <button onClick={hLight} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-amber-400/30 to-yellow-400/20 border border-amber-400/40 px-10 text-base font-extrabold text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.15)] backdrop-blur-md transition-all hover:bg-amber-400/40 hover:shadow-[0_0_50px_rgba(251,191,36,0.25)] active:scale-95">
                <span className="mr-2 text-xl">💡</span> Turn on the light
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4" style={{ animation: "cgIn 0.6s ease-out both" }}>
              <div className="relative">
                <div className="h-40 w-40 rounded-full bg-gradient-to-br from-amber-200/60 via-yellow-200/40 to-white/30 shadow-[0_0_120px_rgba(251,191,36,0.5),0_0_240px_rgba(251,191,36,0.2)]" style={{ animation: "cgPulse 3s ease-in-out infinite" }} />
              </div>
              <p style={{ fontSize: "clamp(0.9rem,3.5vw,1.2rem)" }} className="font-display font-bold text-amber-800 mt-2">Light is on!</p>
            </div>
          )}
        </div>
      )}

      {/* Step 4 — Music */}
      {step === 4 && (
        <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <div className="flex flex-col items-center gap-6">
            {!musicPlaying ? (
              <>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-300/30 to-purple-300/20 border border-rose-300/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,100,150,0.15)]">
                  <span className="text-4xl">🎵</span>
                </div>
                <button onClick={hMusic} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-rose-400/30 to-purple-400/20 border border-rose-400/40 px-10 text-base font-extrabold text-rose-700 backdrop-blur-md transition-all hover:bg-rose-400/40 active:scale-95">
                  Play music
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-400/30 to-purple-400/20 flex items-center justify-center" style={{ animation: "cgPulse 1.5s ease-in-out infinite" }}>
                  <span className="text-4xl">🎵</span>
                </div>
                <p className="font-display text-sm text-amber-700/60">Playing...</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1.5 rounded-full bg-rose-400/60" style={{ animation: `cgBar 0.6s ease-in-out ${i*0.1}s infinite`, height: `${14+Math.random()*20}px` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 5 — Decorate */}
      {step === 5 && (
        <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          {!decorated ? (
            <button onClick={hDecorate} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-pink-400/30 to-amber-400/20 border border-pink-400/40 px-10 text-base font-extrabold text-pink-700 backdrop-blur-md transition-all hover:bg-pink-400/40 active:scale-95">
              <span className="mr-2 text-xl">🎀</span> Decorate
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p style={{ fontSize: "clamp(1.1rem,4vw,1.5rem)" }} className="font-display font-bold text-amber-800">Beautiful!</p>
              {showBalloonBtn && (
                <button onClick={() => setStep(6)} className={isBright ? BTN_BRIGHT : BTN}>
                  <span className="mr-2 text-xl">🎈</span> Add balloons
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 6 — Balloons */}
      {step === 6 && (
        <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          {!balloonsShown ? (
            <button onClick={hBalloons} className="inline-flex min-h-[52px] items-center rounded-full bg-gradient-to-r from-sky-400/30 to-emerald-400/20 border border-sky-400/40 px-10 text-base font-extrabold text-sky-700 backdrop-blur-md transition-all hover:bg-sky-400/40 active:scale-95">
              <span className="mr-2 text-xl">🎈</span> Add balloons
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p style={{ fontSize: "clamp(1.1rem,4vw,1.5rem)" }} className="font-display font-bold text-amber-800">So colorful!</p>
              {showCakeBtn && (
                <button onClick={() => setStep(7)} className={isBright ? BTN_BRIGHT : BTN}>
                  <span className="mr-2 text-xl">🎂</span> Let's cut the cake
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 7 — Animated Cake Assembly + Cutting */}
      {step === 7 && (
        <div className="relative z-10 mx-auto w-full max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1rem,4vw,1.4rem)" }} className="font-display font-bold text-amber-900 mb-6">
            {cakeAnim < 4 ? "Building your cake..." : cutCount === 0 ? "Tap the cake to slice it!" : `${slices} slice${slices > 1 ? "s" : ""}!`}
          </p>
          <div ref={cakeRef}
            className="relative mx-auto h-72 w-full max-w-sm rounded-2xl overflow-hidden sm:h-80 touch-none"
            style={{ background: cakeAnim >= 4 ? "linear-gradient(180deg, rgba(251,191,36,0.1) 0%, rgba(217,119,6,0.05) 100%)" : "transparent" }}
            onMouseMove={cakeAnim >= 4 && !cutDone ? hMove : undefined}
            onTouchMove={cakeAnim >= 4 && !cutDone ? hMove : undefined}
            onClick={cakeAnim >= 4 && !cutDone ? hCut : undefined}
            onTouchEnd={cakeAnim >= 4 && !cutDone ? (e) => { e.preventDefault(); hCut(); } : undefined}
          >
            {/* Plate */}
            {cakeAnim >= 1 && (
              <div className="absolute bottom-1 left-1/2 h-5 w-[92%] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-white/20 to-white/5 border border-white/10 shadow-lg"
                style={{ animation: "cgDropIn 0.5s ease-out both" }} />
            )}

            {/* Bottom tier */}
            {cakeAnim >= 1 && (
              <div className="absolute bottom-6 left-1/2 h-28 w-[85%] -translate-x-1/2 rounded-t-[2.5rem]"
                style={{
                  background: "linear-gradient(160deg, #fde68a 0%, #fbbf24 40%, #d97706 70%, #b45309 100%)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  animation: "cgDropIn 0.6s ease-out both",
                }}>
                <div className="absolute -top-3 left-0 right-0 h-6 rounded-t-[2.5rem]" style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
                  boxShadow: "0 2px 8px rgba(255,255,255,0.3)",
                }} />
                <div className="absolute -bottom-1 left-[10%] h-3 w-3 rounded-full bg-white/40" />
                <div className="absolute -bottom-1 left-[30%] h-4 w-2.5 rounded-full bg-white/35" />
                <div className="absolute -bottom-1 left-[55%] h-3.5 w-3 rounded-full bg-white/40" />
                <div className="absolute -bottom-1 left-[75%] h-2.5 w-2.5 rounded-full bg-white/35" />
                <div className="absolute -bottom-1 left-[90%] h-3 w-2.5 rounded-full bg-white/35" />
                {[10,25,40,55,70,85].map(x => (
                  <div key={x} className="absolute top-4 w-1.5 h-1.5 rounded-full" style={{ left: `${x}%`, background: ["#ff6b8a","#60a5fa","#34d399","#fbbf24","#c084fc","#fb923c"][Math.floor(x/15)%6] }} />
                ))}
              </div>
            )}

            {/* Middle tier */}
            {cakeAnim >= 2 && (
              <div className="absolute bottom-[7.5rem] left-1/2 h-20 w-[65%] -translate-x-1/2 rounded-t-[2rem]"
                style={{
                  background: "linear-gradient(160deg, #fef3c7 0%, #fde68a 35%, #fbbf24 70%, #d97706 100%)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  animation: "cgDropIn 0.6s ease-out both",
                }}>
                <div className="absolute -top-2.5 left-0 right-0 h-5 rounded-t-[2rem]" style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
                }} />
                <div className="absolute -bottom-1 left-[20%] h-2.5 w-2 rounded-full bg-white/35" />
                <div className="absolute -bottom-1 left-[50%] h-3 w-2.5 rounded-full bg-white/40" />
                <div className="absolute -bottom-1 left-[75%] h-2 w-2 rounded-full bg-white/35" />
              </div>
            )}

            {/* Top tier */}
            {cakeAnim >= 3 && (
              <div className="absolute bottom-[11rem] left-1/2 h-16 w-[45%] -translate-x-1/2 rounded-t-[1.5rem]"
                style={{
                  background: "linear-gradient(160deg, #fef3c7 0%, #fde68a 30%, #fbbf24 65%, #d97706 100%)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  animation: "cgDropIn 0.6s ease-out both",
                }}>
                <div className="absolute -top-2 left-0 right-0 h-4 rounded-t-[1.5rem]" style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
                }} />
                {[30,60].map(x => (
                  <div key={x} className="absolute top-2 w-1.5 h-1.5 rounded-full" style={{ left: `${x}%`, background: ["#ff6b8a","#60a5fa"][Math.floor(x/30)%2] }} />
                ))}
              </div>
            )}

            {/* Cream falling */}
            {cakeAnim >= 2 && cakeAnim < 4 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ animation: "cgIn 0.3s ease-out both" }}>
                {Array.from({length:20},(_,i)=>(
                  <div key={i} className="absolute rounded-full bg-white/40" style={{
                    width: `${4 + Math.random() * 8}px`,
                    height: `${4 + Math.random() * 8}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${-5 - Math.random() * 10}%`,
                    animation: `cgCreamFall ${1 + Math.random()}s ease-in ${i * 0.08}s both`,
                  }} />
                ))}
              </div>
            )}

            {/* Cherry */}
            {cakeAnim >= 3 && (
              <>
                <div className="absolute bottom-[12.5rem] left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg z-10"
                  style={{ animation: "cgDropIn 0.5s ease-out 0.6s both" }} />
                <div className="absolute bottom-[13.3rem] left-1/2 h-4 w-1 -translate-x-1/2 bg-green-700/40 rounded-full z-10"
                  style={{ transform: "translateX(-50%) rotate(-15deg)", animation: "cgIn 0.3s ease-out 0.8s both" }} />
              </>
            )}

            {/* Candle + flame */}
            {cakeAnim >= 4 && (
              <div className="absolute bottom-[13.8rem] left-1/2 -translate-x-1/2" style={{ animation: "cgDropIn 0.5s ease-out both" }}>
                <div className="h-10 w-3 rounded-sm" style={{
                  background: "linear-gradient(180deg, #fcd34d, #f59e0b, #d97706)",
                  border: "1px solid rgba(251,191,36,0.3)",
                }}>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="h-6 w-3" style={{
                      background: "linear-gradient(180deg, #fff7ed 0%, #fef08a 30%, #facc15 60%, #eab308 100%)",
                      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                      animation: "cgFlicker 0.4s ease-in-out infinite",
                      boxShadow: "0 0 6px rgba(250,204,21,0.6), 0 0 12px rgba(250,204,21,0.3)",
                    }} />
                    <div className="h-1 w-1 rounded-full bg-amber-300/30" style={{
                      animation: "cgPulse 1s ease-in-out infinite",
                      boxShadow: "0 0 20px rgba(250,204,21,0.4), 0 0 40px rgba(250,204,21,0.15)",
                    }} />
                  </div>
                </div>
              </div>
            )}

            {/* Sparkles fall during assembly */}
            {cakeAnim >= 1 && cakeAnim < 5 && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({length:12},(_,i)=>(
                  <div key={i} className="absolute text-lg" style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${-5 - Math.random() * 10}%`,
                    animation: `cgSparkleFall ${1.5 + Math.random()}s ease-in ${i * 0.15}s both`,
                  }}>✨</div>
                ))}
              </div>
            )}

            {/* Cut lines */}
            {cakeAnim >= 4 && cutLines.map((pos, i) => (
              <div key={i} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[12%] bottom-[8%] w-0.5 bg-white/50" style={{
                  left: `${pos}%`,
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                  animation: "cgIn 0.3s ease-out both",
                }} />
              </div>
            ))}

            {/* Slice count */}
            {cakeAnim >= 4 && cutCount > 0 && (
              <div className="absolute top-4 right-4 rounded-full bg-white/30 backdrop-blur-sm px-3 py-1 text-xs font-bold text-amber-900/80 z-30">
                {slices} slice{slices > 1 ? "s" : ""}
              </div>
            )}

            {/* Knife */}
            {cakeAnim >= 4 && !cutDone && (
              <div className="absolute z-20 pointer-events-none transition-all duration-75" style={{ left: `${knifePos.x}%`, top: `${knifePos.y}%`, transform: "translate(-50%,-50%) rotate(12deg)" }}>
                <KnifeSVG />
              </div>
            )}

            {/* Hint */}
            {cakeAnim >= 4 && !cutDone && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-amber-900/70 backdrop-blur-sm" style={{ animation: "cgPulse 2s ease-in-out infinite" }}>
                {cutCount === 0 ? "Tap to slice" : "Tap for another slice"}
              </div>
            )}
            {cakeAnim >= 4 && cutDone && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-amber-900/70 backdrop-blur-sm">
                {slices} perfect slices! 🎉
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 8 — Post-cut choice */}
      {step === 8 && !showLetter && !showMemories && !showFinal && (
        <div className="relative z-10 mx-auto w-full max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <div className="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-50/95 via-white/95 to-amber-100/95 p-8 sm:p-12 shadow-[0_8px_60px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <span className="text-5xl">🎉</span>
              <p className="mt-4 text-xs font-bold tracking-widest text-amber-400/60 uppercase">The cake is sliced!</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-amber-900">What would you like to see?</h2>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              {images.length >= 2 && (
                <button onClick={handleMemoriesChoice}
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-rose-300/40 bg-rose-50/60 px-8 py-6 transition-all hover:bg-rose-100/80 hover:border-rose-400/60 active:scale-95">
                  <span className="text-3xl">📸</span>
                  <span className="text-sm font-extrabold text-rose-800">Our Memories</span>
                </button>
              )}
              <button onClick={handleLetterChoice}
                className="flex flex-col items-center gap-2 rounded-2xl border-2 border-amber-300/40 bg-amber-50/60 px-8 py-6 transition-all hover:bg-amber-100/80 hover:border-amber-400/60 active:scale-95">
                <span className="text-3xl">💌</span>
                <span className="text-sm font-extrabold text-amber-800">Special Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Letter */}
      {showLetter && !showFinal && (
        <div className="relative z-10 mx-auto w-full max-w-2xl px-4" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <div className="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-50/95 via-white/95 to-amber-100/95 p-6 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.3)] max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            <div className="text-center mb-6">
              <span className="text-5xl">💌</span>
              <p className="mt-3 text-xs font-bold tracking-widest text-amber-400/60 uppercase">A special message for you</p>
            </div>
            <div className="border-t border-amber-200/40 pt-6">
              <p className="font-serif text-base leading-relaxed text-amber-900/90 sm:text-lg whitespace-pre-line">
                {message || DEFAULT_MESSAGE}
              </p>
            </div>
            <div className="mt-8 text-center border-t border-amber-200/40 pt-5">
              <p className="font-serif text-sm text-amber-600/70 italic">Create like this for someone else</p>
              <button onClick={() => setShowFinal(true)} className="mt-5 rounded-full border border-amber-300/50 bg-amber-400/20 px-10 py-3 text-sm font-extrabold text-amber-800 backdrop-blur-md transition-all hover:bg-amber-400/30 active:scale-95">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Memories Gallery */}
      {showMemories && !showFinal && (
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 overflow-y-auto" style={{ animation: "cgIn 0.8s ease-out both", maxHeight: "90vh" }}>
          <div className="rounded-2xl border border-rose-200/30 bg-gradient-to-br from-rose-50/95 via-white/95 to-amber-50/95 p-6 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-8">
              <p className="text-xs font-bold tracking-[0.15em] text-rose-400/70 uppercase">A walk down memory lane</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400 bg-clip-text text-transparent">Happiest Moment</h2>
              <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-rose-300 to-amber-300" />
            </div>
            <PhotoGrid images={images} />
            <div className="mt-8 text-center border-t border-rose-200/40 pt-6">
              <button onClick={() => setShowFinal(true)} className="rounded-full bg-gradient-to-r from-rose-400/30 to-amber-400/20 border border-rose-400/40 px-10 py-3 text-base font-extrabold text-rose-800 backdrop-blur-md transition-all hover:bg-rose-400/40 active:scale-95">Done</button>
            </div>
          </div>
        </div>
      )}

      {showFinal && (
        <div className="relative z-10 mx-auto w-full max-w-lg px-4" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <FinalScreen
            ctaMessage={experience.customMessages.ctaMessage}
            experienceId={mode === "generated" ? experience.id : undefined}
            finalMessage={experience.finalMessage}
            shareUrl={shareUrl}
            templateId={template.id}
            templateTitle={template.title}
          />
        </div>
      )}

      <style>{`
        @keyframes cgIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cgUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cgPulse { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } }
        @keyframes cgFlicker { 0%, 100% { opacity: 1; transform: scaleY(1) scaleX(1); } 25% { opacity: 0.6; transform: scaleY(0.8) scaleX(1.1); } 50% { opacity: 0.9; transform: scaleY(1.1) scaleX(0.9); } 75% { opacity: 0.5; transform: scaleY(0.75) scaleX(1.05); } }
        @keyframes cgBar { 0%, 100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
        @keyframes cgRibbon { from { opacity: 0; transform: scale(0) rotate(0deg); } to { opacity: 1; transform: scale(1) rotate(var(--r,25deg)); } }
        @keyframes cgSway { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(4px); } 75% { transform: translateX(-4px); } }
        @keyframes cgSwing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(2deg); } 75% { transform: rotate(-2deg); } }
        @keyframes cgDropIn { 0% { opacity: 0; transform: translateY(-200px) scale(0.5); } 60% { opacity: 1; transform: translateY(8px) scale(1.02); } 80% { transform: translateY(-4px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cgCreamFall { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 20% { opacity: 0.8; } 100% { opacity: 0; transform: translateY(500px) rotate(360deg); } }
        @keyframes cgSparkleFall { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 30% { opacity: 1; transform: translateY(100px) rotate(180deg); } 100% { opacity: 0; transform: translateY(500px) rotate(360deg); } }
      `}</style>
    </div>
  );
}
