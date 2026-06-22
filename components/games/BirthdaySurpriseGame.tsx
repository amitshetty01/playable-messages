"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FinalScreen } from "@/components/FinalScreen";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

const BTN = "inline-flex min-h-[48px] items-center rounded-full border border-white/20 bg-white/10 px-8 text-sm font-extrabold text-white/80 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95";
const BTN_BRIGHT = "inline-flex min-h-[48px] items-center rounded-full border border-amber-300/40 bg-amber-200/30 px-8 text-sm font-extrabold text-amber-900 backdrop-blur-md transition-all hover:bg-amber-300/40 active:scale-95";

const DEFAULT_MESSAGE = `Happy Birthday to someone who deserves all the love, laughter, and joy the world has to offer.

Today isn't just another day on the calendar — it's a celebration of you and everything that makes you extraordinary. The way you light up every room you walk into, the warmth you bring to every conversation, and the kindness you show to everyone around you — these are the things that make you truly one of a kind.

I hope this year brings you closer to your dreams, fills your days with unexpected moments of happiness, and surrounds you with people who see you for the incredible person you are.

You've accomplished so much, and yet the best is still ahead. Keep shining, keep believing, and never forget that you are capable of amazing things.

With all my heart, happy birthday. 🎂`;

function playCheer(ctx: AudioContext) {
  const m = ctx.createGain();
  m.gain.setValueAtTime(0.06, ctx.currentTime);
  m.connect(ctx.destination);
  [523, 659, 784, 1047].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = "sine"; o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.12 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
    o.connect(g); g.connect(m);
    o.start(ctx.currentTime + i * 0.12);
    o.stop(ctx.currentTime + i * 0.12 + 0.4);
  });
}

function playSparkle(ctx: AudioContext) {
  const o = ctx.createOscillator();
  o.type = "sine"; o.frequency.value = 1200 + Math.random() * 400;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.04, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  o.connect(g); g.connect(ctx.destination);
  o.start(); o.stop(ctx.currentTime + 0.5);
}

type NoteDef = [freq: number, durMs: number];

const MELODY: NoteDef[] = [
  [523, 600], [659, 500], [784, 700], [659, 500],
  [784, 600], [1047, 800], [880, 500], [784, 600],
  [659, 500], [784, 600], [1047, 800], [988, 600],
  [880, 500], [784, 700], [659, 600], [523, 700],

  [587, 600], [659, 500], [784, 700], [880, 600],
  [784, 500], [659, 700], [784, 600], [880, 500],
  [1047, 800], [988, 600], [880, 500], [784, 700],
  [659, 600], [784, 500], [587, 700], [659, 600],

  [784, 500], [1047, 700], [880, 600], [1047, 500],
  [1175, 800], [1047, 600], [880, 500], [784, 700],
  [1047, 600], [988, 500], [880, 700], [784, 600],
  [659, 500], [784, 600], [1047, 800], [988, 700],

  [880, 600], [784, 500], [659, 700], [587, 600],
  [523, 500], [659, 600], [784, 800], [659, 700],
  [523, 600], [587, 500], [659, 700], [784, 600],
  [659, 500], [523, 700], [392, 600], [523, 900],
];

const HARMONY: NoteDef[] = [
  [262, 600], [330, 500], [392, 700], [330, 500],
  [392, 600], [523, 800], [440, 500], [392, 600],
  [330, 500], [392, 600], [523, 800], [494, 600],
  [440, 500], [392, 700], [330, 600], [262, 700],

  [294, 600], [330, 500], [392, 700], [440, 600],
  [392, 500], [330, 700], [392, 600], [440, 500],
  [523, 800], [494, 600], [440, 500], [392, 700],
  [330, 600], [392, 500], [294, 700], [330, 600],

  [392, 500], [523, 700], [440, 600], [523, 500],
  [587, 800], [523, 600], [440, 500], [392, 700],
  [523, 600], [494, 500], [440, 700], [392, 600],
  [330, 500], [392, 600], [523, 800], [494, 700],

  [440, 600], [392, 500], [330, 700], [294, 600],
  [262, 500], [330, 600], [392, 800], [330, 700],
  [262, 600], [294, 500], [330, 700], [392, 600],
  [330, 500], [262, 700], [196, 600], [262, 900],
];

const BASS: NoteDef[] = [
  [131, 6000], [131, 5000], [131, 6000], [131, 5000],
  [98, 6000], [98, 5000], [98, 6000], [98, 5000],
  [131, 6000], [131, 5000], [98, 6000], [98, 5000],
  [131, 6000], [131, 5000], [98, 6000], [98, 5000],
];

function scheduleNotes(ctx: OfflineAudioContext | AudioContext, notes: NoteDef[], volume: number, type: OscillatorType, gap = 50) {
  let offset = 0;
  notes.forEach(([freq, dur]) => {
    const o = ctx.createOscillator();
    o.type = type; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + offset / 1000);
    g.gain.linearRampToValueAtTime(volume, ctx.currentTime + offset / 1000 + 0.02);
    g.gain.setValueAtTime(volume, ctx.currentTime + (offset + dur - 20) / 1000);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (offset + dur + gap) / 1000);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + offset / 1000);
    o.stop(ctx.currentTime + (offset + dur) / 1000 + 0.1);
    offset += dur + gap;
  });
}

async function renderBirthdayBuffer(): Promise<AudioBuffer | null> {
  try {
    const sampleRate = 44100;
    const totalMs = 50000;
    const durationSec = Math.ceil(totalMs / 1000) + 1;
    const length = Math.ceil(sampleRate * durationSec);
    const ctx = new OfflineAudioContext(2, length, sampleRate);
    scheduleNotes(ctx, MELODY, 0.12, "sine");
    scheduleNotes(ctx, HARMONY, 0.06, "sine");
    return await ctx.startRendering();
  } catch {
    return null;
  }
}

function PhotoGrid({ images }: { images: string[] }) {
  const n = images.length;
  if (n === 0) return (
    <div className="flex items-center justify-center h-40 text-amber-300/50 text-sm font-bold">No memories yet</div>
  );
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-lg mx-auto">
      {images.slice(0, 4).map((src, i) => (
        <div key={i} className="overflow-hidden rounded-2xl shadow-xl aspect-[4/3] bg-amber-800/30"
          style={{ animation: `cgUp 0.6s ease-out ${i * 0.15}s both` }}>
          <img src={src} alt="" className="h-full w-full object-cover hover:scale-110 transition-transform duration-500" />
        </div>
      ))}
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
    </svg>
  );
}

function KnifeSVG() {
  return (
    <svg viewBox="0 0 120 36" className="h-12 w-40 drop-shadow-2xl">
      <defs>
        <linearGradient id="ks-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fafafa" /><stop offset="30%" stopColor="#e5e5e5" />
          <stop offset="50%" stopColor="#ffffff" /><stop offset="70%" stopColor="#d4d4d4" /><stop offset="100%" stopColor="#a3a3a3" />
        </linearGradient>
        <linearGradient id="ks-handle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3e2723" /><stop offset="15%" stopColor="#5c4033" />
          <stop offset="40%" stopColor="#8b6914" /><stop offset="60%" stopColor="#6b4c3b" />
          <stop offset="85%" stopColor="#5c4033" /><stop offset="100%" stopColor="#3e2723" />
        </linearGradient>
        <linearGradient id="ks-bolster" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3a3a3" /><stop offset="50%" stopColor="#d4d4d4" /><stop offset="100%" stopColor="#737373" />
        </linearGradient>
      </defs>
      <path d="M2 17 L50 13 L55 14 L55 22 L50 24 Q25 27 2 17 Z" fill="url(#ks-blade)" stroke="#a3a3a3" strokeWidth="0.5" />
      <path d="M2 17 L30 15 L55 14" fill="rgba(255,255,255,0.4)" />
      <rect x="57" y="12" width="4" height="12" rx="1" fill="url(#ks-bolster)" stroke="#737373" strokeWidth="0.5" />
      <rect x="61" y="10" width="52" height="16" rx="3" fill="url(#ks-handle)" stroke="#3e2723" strokeWidth="0.8" />
      <circle cx="72" cy="18" r="1.8" fill="#a3a3a3" stroke="#8a8a8a" strokeWidth="0.3" />
      <circle cx="84" cy="18" r="1.8" fill="#a3a3a3" stroke="#8a8a8a" strokeWidth="0.3" />
      <circle cx="96" cy="18" r="1.8" fill="#a3a3a3" stroke="#8a8a8a" strokeWidth="0.3" />
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
  const [showMusicContinue, setShowMusicContinue] = useState(false);
  const [decorated, setDecorated] = useState(false);
  const [floatBalloons, setFloatBalloons] = useState<FloatBalloon[]>([]);
  const [cutCount, setCutCount] = useState(0);
  const [knifePos, setKnifePos] = useState({ x: 50, y: 50 });
  const [ribbons, setRibbons] = useState<{ id: number; x: number; y: number; c: string; d: number }[]>([]);
  const [showCakeBtn, setShowCakeBtn] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [memoriesOpened, setMemoriesOpened] = useState(false);
  const [cutLines, setCutLines] = useState<number[]>([]);
  const [cutDone, setCutDone] = useState(false);
  const [cakeAnim, setCakeAnim] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const musicBufferRef = useRef<AudioBuffer | null>(null);
  const musicRenderPromise = useRef<Promise<AudioBuffer | null> | null>(null);
  const message = experience.finalMessage;
  const isBright = lightOn || step >= 4;
  const slideBg = showLetter
    ? "linear-gradient(135deg, #0c0a09 0%, #1c1917 30%, #451a03 60%, #0c0a09 100%)"
    : showMemories
    ? "linear-gradient(135deg, #0c0a09 0%, #1c1917 30%, #4c0519 60%, #0c0a09 100%)"
    : isBright
    ? "linear-gradient(135deg, #fef9c3 0%, #fde68a 30%, #fef3c7 60%, #fce7f3 100%)"
    : "#0a0a0a";
  const slideColor = showLetter ? "#fef3c7" : showMemories ? "#fecdd3" : isBright ? "#1c1917" : "#fff";
  const DEMO_IMAGES = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&q=80",
  ];
  const images = mode === "demo" || !experience.images || experience.images.length < 2 ? DEMO_IMAGES : experience.images;
  const MIN_SLICES = 2;
  const balloonColors = ["#ff6b8a","#60a5fa","#fbbf24","#34d399","#c084fc","#fb923c","#f472b6","#38bdf8"];

  const initAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      const ac = new AC();
      audioRef.current = ac;
      if (ac.state === "suspended") ac.resume();
      if (!musicRenderPromise.current) {
        musicRenderPromise.current = renderBirthdayBuffer().then(buf => {
          musicBufferRef.current = buf;
          return buf;
        });
      }
      return audioRef.current;
    } catch { return null; }
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
    if (step < 6) return;
    const now = Date.now();
    setFloatBalloons((prev) => {
      const fresh = prev.filter((b) => now - b.startTime < 15000);
      if (fresh.length >= 10) return fresh;
      return [...fresh, ...Array.from({length: 4}, (_, i) => ({
        id: now + i,
        x: 10 + Math.random() * 80,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        startTime: now - i * 300,
        size: 0.6 + Math.random() * 0.6,
      }))];
    });
    const interval = setInterval(() => {
      setFloatBalloons((prev) => {
        const n = Date.now();
        const f = prev.filter((b) => n - b.startTime < 15000);
        if (f.length >= 20) return f;
        return [...f, {
          id: n + Math.random(),
          x: Math.random() * 100,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          startTime: n,
          size: 0.6 + Math.random() * 0.6,
        }];
      });
    }, 800);
    return () => clearInterval(interval);
  }, [step]);

  const hYes = useCallback(() => {
    initAudio();
    const ctx = audioRef.current;
    if (ctx) { try { playSparkle(ctx); } catch {} }
    setStep(3);
  }, [initAudio]);

  const hLight = useCallback(() => {
    setLightOn(true);
    const ctx = audioRef.current || initAudio();
    if (ctx) { try { playCheer(ctx); } catch {} }
    setTimeout(() => setStep(4), 2200);
  }, [initAudio]);

  const hMusic = useCallback(() => {
    if (musicPlaying) return;
    setMusicPlaying(true);
    const ctx = audioRef.current || initAudio();
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume();
      const buf = musicBufferRef.current;
      if (buf) {
        try {
          const source = ctx.createBufferSource();
          source.buffer = buf;
          source.connect(ctx.destination);
          source.start();
        } catch {
        setTimeout(() => { try { scheduleNotes(ctx, MELODY, 0.12, "sine"); } catch {} }, 100);
      }
    } else {
      setTimeout(() => { try { scheduleNotes(ctx, MELODY, 0.12, "sine"); } catch {} }, 100);
      }
    }
    setTimeout(() => setShowMusicContinue(true), 3000);
  }, [musicPlaying, initAudio]);

  const hDecorate = useCallback(() => {
    setDecorated(true);
    const cs = ["#ff6b8a","#ffd700","#ff8a6b","#c084fc","#60a5fa","#f472b6"];
    setRibbons(Array.from({length:16},(_,i)=>({id:i,x:Math.random()*90+5,y:Math.random()*90+5,c:cs[i%cs.length],d:i*0.1})));
    const ctx = audioRef.current;
    if (ctx) { try { playCheer(ctx); } catch {} }
    setTimeout(() => setShowCakeBtn(true), 1200);
  }, []);

  const hHeartTrail = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    if (Math.random() > 0.35) return;
    const r = containerRef.current.getBoundingClientRect();
    const h = document.createElement("div");
    h.className = "absolute pointer-events-none z-50";
    h.style.left = (e.clientX - r.left) + "px";
    h.style.top = (e.clientY - r.top) + "px";
    h.style.animation = "cgHeartFloat 1.5s ease-out both";
    h.innerHTML = '<svg viewBox="0 0 20 20" class="h-4 w-4" style="animation:cgHeartWobble 1.5s ease-in-out infinite"><path d="M10 18Q3 12 3 7Q3 3 7 3Q10 3 10 7Q10 3 13 3Q17 3 17 7Q17 12 10 18Z" fill="#ff6b8a" opacity="0.7"/></svg>';
    containerRef.current.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }, []);

  const hMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!cakeRef.current || cutDone) return;
    const r = cakeRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setKnifePos({ x: Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)), y: Math.max(5, Math.min(95, ((clientY - r.top) / r.height) * 100)) });
  }, [cutDone]);

  const hCut = useCallback(() => {
    if (cutDone || cutCount >= 7) return;
    const newLines = [...cutLines, knifePos.x];
    newLines.sort((a, b) => a - b);
    setCutLines(newLines);
    const next = cutCount + 1;
    setCutCount(next);
    const ctx = audioRef.current;
    if (ctx) { try { playSparkle(ctx); } catch {} }
    if (next >= MIN_SLICES) {
      setCutDone(true);
      setTimeout(() => { setStep(8); }, 1000);
    }
  }, [cutCount, cutLines, knifePos.x, cutDone]);

  const slices = cutLines.length + 1;

  return (
    <div ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none transition-all duration-1000"
      style={{
        fontFamily: "'Nunito Sans', system-ui, sans-serif",
        touchAction: "manipulation",
        background: slideBg,
        color: slideColor,
      }}
      onMouseMove={hHeartTrail}
    >
      {/* Balloons */}
      {step >= 6 && !showLetter && !showMemories && floatBalloons.map((b) => (
        <div key={b.id} className="fixed pointer-events-none" style={{
          left: `${b.x}%`,
          bottom: "-40px",
          zIndex: 40,
          animation: `cgBalloonRise 14s ease-in-out both`,
        }}>
          <div style={{ animation: `cgSway 4s ease-in-out ${b.id % 3}s infinite` }}>
            <BalloonSVG color={b.color} size={b.size} />
          </div>
        </div>
      ))}

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
          {[{x:12,y:8,d:0},{x:88,y:8,d:0.15},{x:25,y:3,d:0.3},{x:75,y:3,d:0.45},{x:50,y:1,d:0.6},{x:5,y:12,d:0.2},{x:95,y:12,d:0.35}].map((b,i) => (
            <div key={i} className="absolute pointer-events-none" style={{ left: `${b.x}%`, top: `${b.y}%`, animation: `cgIn 0.5s ease-out ${b.d}s both` }}>
              <svg viewBox="0 0 40 60" className="h-14 w-11 drop-shadow-2xl" style={{ animation: "cgSwing 3s ease-in-out infinite" }}>
                <ellipse cx="20" cy="22" rx="13" ry="16" fill="url(#bl)" />
                <rect x="16" y="40" width="8" height="6" rx="1" fill="#a16207" />
                <path d="M12 46 Q20 56 28 46" fill="none" stroke="#a16207" strokeWidth="2" />
                <defs><radialGradient id="bl" cx="50%" cy="30%" r="50%"><stop offset="0%" stopColor="#fef08a" /><stop offset="60%" stopColor="#facc15" /><stop offset="100%" stopColor="#eab308" /></radialGradient></defs>
              </svg>
            </div>
          ))}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 0%, rgba(250,204,21,0.12) 0%, transparent 60%)",
            animation: "cgIn 0.8s ease-out both",
          }} />
        </>
      )}

      {/* Step 0 */}
      {step === 0 && (
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", animation: "cgUp 0.8s ease-out both" }} className="font-display font-bold leading-relaxed text-white/90">Today is a reminder that amazing people exist...</p>
          {s2 && <p style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", animation: "cgUp 0.8s ease-out both" }} className="mt-6 font-display font-bold leading-relaxed text-white/90">...and the best part about knowing you? <span className="text-amber-200" style={{ textShadow: "0 0 12px rgba(251,191,36,0.6), 0 0 30px rgba(251,191,36,0.25)" }}>It is just knowing you.</span></p>}
          {s3 && <p style={{ fontSize: "clamp(1.1rem,4vw,1.8rem)", animation: "cgUp 0.8s ease-out both" }} className="mt-6 font-display font-bold leading-relaxed text-white/90">The universe truly did something right when it brought you into this world.</p>}
          {!s2 && <div className="mt-8 flex items-center justify-center gap-1.5" style={{ animation: "cgPulse 2s ease-in-out infinite" }}>
            {[0,1,2].map(i => <span key={i} className="inline-block h-2 w-2 rounded-full bg-white/20" style={i===1?{background:"rgba(255,255,255,0.3)"}:{}} />)}
          </div>}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1.1rem,4vw,1.6rem)", animation: "cgUp 0.8s ease-out both" }} className="font-display font-bold leading-relaxed text-white/80">
            To make something special for you instead of just typing <span className="bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-transparent">&ldquo;Happy Birthday&rdquo;</span>
          </p>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1.5rem,6vw,2.5rem)", animation: "cgUp 0.8s ease-out both" }} className="font-display font-bold leading-relaxed text-white/90">I made this</p>
          {showYesNo && <div className="mt-10 flex flex-col items-center gap-4" style={{ animation: "cgUp 0.6s ease-out both" }}>
            <p style={{ fontSize: "clamp(1rem,4vw,1.3rem)" }} className="font-display font-bold text-white/60">Want to see it?</p>
            <div className="flex gap-4">
              <button onClick={hYes} className="inline-flex min-h-[48px] min-w-[100px] items-center justify-center rounded-full bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 border border-emerald-400/30 px-8 text-sm font-extrabold text-emerald-300 backdrop-blur-md transition-all hover:bg-emerald-400/30 active:scale-95">Yes</button>
              <button onClick={hYes} className="inline-flex min-h-[48px] min-w-[100px] items-center justify-center rounded-full bg-gradient-to-r from-rose-400/20 to-rose-500/10 border border-rose-400/30 px-8 text-sm font-extrabold text-rose-300 backdrop-blur-md transition-all hover:bg-rose-400/30 active:scale-95">No</button>
            </div>
          </div>}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="relative z-10 mx-auto px-6 text-center" style={{ animation: "cgIn 1s ease-out both" }}>
          {!lightOn ? (
            <>
              <p style={{ fontSize: "clamp(0.9rem,3.5vw,1.2rem)" }} className="font-display font-bold leading-relaxed text-white/40 mb-10">There is something in the dark...</p>
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
              <div className="flex flex-col items-center gap-4" style={{ animation: "cgIn 0.5s ease-out both" }}>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-rose-400/30 to-purple-400/20 flex items-center justify-center" style={{ animation: "cgPulse 1.5s ease-in-out infinite" }}>
                  <span className="text-4xl">🎵</span>
                </div>
                <p className="font-display text-sm text-amber-700/60">Music playing...</p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1.5 rounded-full bg-rose-400/60" style={{ animation: `cgBar 0.6s ease-in-out ${i*0.1}s infinite`, height: `${14+Math.random()*20}px` }} />
                  ))}
                </div>
                {showMusicContinue && (
                  <button onClick={() => setStep(5)} className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-gradient-to-r from-amber-400/30 to-rose-400/20 border border-amber-400/40 px-8 text-sm font-extrabold text-amber-800 backdrop-blur-md transition-all hover:bg-amber-400/40 active:scale-95" style={{ animation: "cgIn 0.5s ease-out both" }}>
                    Continue →
                  </button>
                )}
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
              {showCakeBtn && <button onClick={() => setStep(7)} className={isBright ? BTN_BRIGHT : BTN}><span className="mr-2 text-xl">🎂</span> Let's cut the cake</button>}
            </div>
          )}
        </div>
      )}

      {/* Step 7 — Cake */}
      {step === 7 && (
        <div className="relative z-10 mx-auto w-full max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1rem,4vw,1.4rem)" }} className="font-display font-bold text-amber-900 mb-4">
            {cakeAnim < 4 ? "Building your cake..." : cutCount === 0 ? "Tap the cake to slice it!" : `${slices} slice${slices > 1 ? "s" : ""}!`}
          </p>
          <div ref={cakeRef}
            className="relative mx-auto w-full max-w-sm touch-none overflow-visible"
            style={{ height: "400px" }}
            onMouseMove={cakeAnim >= 4 && !cutDone ? hMove : undefined}
            onTouchMove={cakeAnim >= 4 && !cutDone ? hMove : undefined}
            onClick={cakeAnim >= 4 && !cutDone ? hCut : undefined}
            onTouchEnd={cakeAnim >= 4 && !cutDone ? (e) => { e.preventDefault(); hCut(); } : undefined}
          >
            {cakeAnim >= 1 && (
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end" style={{ animation: "cgDropIn 0.5s ease-out both" }}>
                {/* Cake board */}
                <div className="w-[92%] h-3 rounded-full bg-gradient-to-b from-white/30 to-white/10 border border-white/15 shadow-lg" />
              </div>
            )}
            {cakeAnim >= 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center" style={{ animation: "cgDropIn 0.6s ease-out both" }}>
                <div className="w-[88%] h-[120px] rounded-t-[2.5rem] relative overflow-visible" style={{
                  background: "linear-gradient(170deg, #fef3c7 0%, #fde68a 30%, #fbbf24 60%, #d97706 85%, #b45309 100%)",
                  border: "2px solid rgba(251,191,36,0.15)", boxShadow: "0 6px 25px rgba(0,0,0,0.12), inset 0 2px 4px rgba(255,255,255,0.3)",
                }}>
                  <div className="absolute -top-2.5 left-[-2px] right-[-2px] h-6 rounded-t-[2.5rem]" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fef9c3 50%, #fde68a 100%)" }} />
                  {[15, 30, 48, 65, 82].map(x => (
                    <div key={x} className="absolute w-2 h-3.5 rounded-full" style={{ left: `${x}%`, top: "-1px", background: "#fef9c3", opacity: 0.8 }} />
                  ))}
                  <div className="absolute inset-x-[10%] bottom-2 h-1 rounded-full bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
                </div>
              </div>
            )}
            {cakeAnim >= 2 && (
              <div className="absolute bottom-[128px] left-0 right-0 flex flex-col items-center" style={{ animation: "cgDropIn 0.6s ease-out both" }}>
                <div className="w-[70%] h-[100px] rounded-t-[2rem] relative overflow-visible" style={{
                  background: "linear-gradient(170deg, #fdf2f8 0%, #fbcfe8 35%, #f9a8d4 65%, #db2777 100%)",
                  border: "2px solid rgba(244,114,182,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)",
                }}>
                  <div className="absolute -top-2 left-[-2px] right-[-2px] h-[18px] rounded-t-[2rem]" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fce7f3 50%, #fbcfe8 100%)" }} />
                  {[12, 30, 50, 70, 88].map(x => (
                    <div key={x} className="absolute w-1.5 h-3 rounded-full" style={{ left: `${x}%`, top: "-1px", background: "#fce7f3", opacity: 0.8 }} />
                  ))}
                </div>
              </div>
            )}
            {cakeAnim >= 3 && (
              <div className="absolute bottom-[233px] left-0 right-0 flex flex-col items-center" style={{ animation: "cgDropIn 0.6s ease-out both" }}>
                <div className="w-[50%] h-[85px] rounded-t-[1.6rem] relative overflow-visible" style={{
                  background: "linear-gradient(170deg, #fef3c7 0%, #d97706 35%, #92400e 70%, #78350f 100%)",
                  border: "2px solid rgba(146,64,14,0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)",
                }}>
                  <div className="absolute -top-1.5 left-[-2px] right-[-2px] h-3.5 rounded-t-[1.6rem]" style={{ background: "linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)" }} />
                  {[20, 50, 80].map(x => (
                    <div key={x} className="absolute w-1.5 h-2 rounded-full" style={{ left: `${x}%`, top: "-1px", background: "#fde68a", opacity: 0.7 }} />
                  ))}
                </div>
              </div>
            )}
            {cakeAnim >= 2 && cakeAnim < 4 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({length:10},(_,i)=>(
                  <div key={i} className="absolute rounded-full" style={{ width: `${3+Math.random()*5}px`, height: `${3+Math.random()*5}px`, left: `${Math.random()*100}%`, top: `${-5-Math.random()*8}%`, background: ["#fff","#fef3c7","#fce7f3"][i%3], animation: `cgCreamFall ${0.8+Math.random()*0.6}s ease-in ${i*0.12}s both` }} />
                ))}
              </div>
            )}
            {cakeAnim >= 3 && (
              <div className="absolute bottom-[323px] left-0 right-0 flex items-center justify-center" style={{ animation: "cgDropIn 0.5s ease-out 0.6s both" }}>
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-700 shadow-lg z-10" style={{ boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3)" }} />
              </div>
            )}
            {cakeAnim >= 4 && (
              <div className="absolute bottom-[343px] left-0 right-0 flex flex-col items-center" style={{ animation: "cgDropIn 0.5s ease-out both" }}>
                <div className="h-10 w-2.5 rounded-sm relative" style={{ background: "linear-gradient(180deg, #fcd34d 0%, #f59e0b 40%, #d97706 100%)", border: "1px solid rgba(251,191,36,0.3)" }}>
                  <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="h-[18px] w-3" style={{ background: "linear-gradient(180deg, #fff7ed 0%, #fef08a 20%, #facc15 50%, #eab308 80%)", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", animation: "cgFlicker 0.3s ease-in-out infinite", boxShadow: "0 0 8px rgba(250,204,21,0.7), 0 0 20px rgba(250,204,21,0.3)" }} />
            </div>
          </div>
        </div>
      )}
            {cakeAnim >= 4 && cutLines.map((pos, i) => (
              <div key={i} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[8%] bottom-[5%] w-[2px] bg-white/50" style={{ left: `${pos}%`, transform: "translateX(-50%)", boxShadow: "0 0 8px rgba(255,255,255,0.3)", animation: "cgIn 0.3s ease-out both" }} />
              </div>
            ))}
            {cakeAnim >= 4 && cutCount > 0 && (
              <div className="absolute top-2 right-2 rounded-full bg-white/30 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-amber-900/80 z-30">{slices} slice{slices > 1 ? "s" : ""}</div>
            )}
            {cakeAnim >= 4 && !cutDone && (
              <div className="absolute z-20 pointer-events-none transition-all duration-75" style={{ left: `${knifePos.x}%`, top: `${knifePos.y}%`, transform: "translate(-50%,-50%) rotate(12deg)" }}>
                <KnifeSVG />
              </div>
            )}
            {cakeAnim >= 4 && !cutDone && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1 text-xs font-bold text-amber-900/70 backdrop-blur-sm" style={{ animation: "cgPulse 2s ease-in-out infinite" }}>
                {cutCount === 0 ? "Tap to slice" : "Tap for another slice"}
              </div>
            )}
            {cakeAnim >= 4 && cutDone && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1 text-xs font-bold text-amber-900/70 backdrop-blur-sm">{slices} perfect slices!</div>
            )}
          </div>
        </div>
      )}

      {/* Step 8 — Gift boxes */}
      {step === 8 && !showLetter && !showMemories && !showFinal && (
        <div className="relative z-10 mx-auto w-full max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <div className="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-50/95 via-white/95 to-amber-100/95 p-8 sm:p-12 shadow-[0_8px_60px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <span className="text-5xl">🎉</span>
              <p className="mt-4 text-xs font-bold tracking-widest text-amber-400/60 uppercase">The cake is sliced!</p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-amber-900">
                {letterOpened && memoriesOpened ? "Both gifts opened!" : "Choose a gift to open"}
              </h2>
            </div>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:justify-center sm:gap-8">
              <button onClick={() => { if (!memoriesOpened) setShowMemories(true); }}
                className="group relative flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95"
                style={{ opacity: memoriesOpened ? 0.5 : 1 }}>
                <div className="h-28 w-28 sm:h-32 sm:w-32">
                  <svg viewBox="0 0 24 24" className="h-full w-full drop-shadow-xl" style={{ animation: memoriesOpened ? "none" : "cgFloat 3s ease-in-out infinite" }}>
                    <defs>
                      <radialGradient id="box-gift" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#fce7f3" /><stop offset="100%" stopColor={memoriesOpened ? "#f472b6" : "#e11d48"} />
                      </radialGradient>
                    </defs>
                    {memoriesOpened ? (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#box-gift)" opacity="0.4" />
                    ) : (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#box-gift)" />
                    )}
                  </svg>
                </div>
                <span className="text-sm font-extrabold text-rose-700 bg-rose-100/80 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  {memoriesOpened ? "Opened" : "📸 Our Memories"}
                </span>
              </button>
              <button onClick={() => { if (!letterOpened) setShowLetter(true); }}
                className="group relative flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95"
                style={{ opacity: letterOpened ? 0.5 : 1 }}>
                <div className="h-28 w-28 sm:h-32 sm:w-32">
                  <svg viewBox="0 0 24 24" className="h-full w-full drop-shadow-xl" style={{ animation: letterOpened ? "none" : "cgFloat 3s ease-in-out 1.5s infinite" }}>
                    <defs>
                      <radialGradient id="box-letter" cx="50%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#fef3c7" /><stop offset="100%" stopColor={letterOpened ? "#fbbf24" : "#d97706"} />
                      </radialGradient>
                    </defs>
                    {letterOpened ? (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#box-letter)" opacity="0.4" />
                    ) : (
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#box-letter)" />
                    )}
                  </svg>
                </div>
                <span className="text-sm font-extrabold text-amber-700 bg-amber-100/80 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  {letterOpened ? "Read" : "💌 Special Message"}
                </span>
              </button>
            </div>
            {letterOpened && memoriesOpened && (
              <div className="mt-8 text-center" style={{ animation: "cgIn 0.5s ease-out both" }}>
                <button onClick={() => setShowFinal(true)}
                  className="rounded-full bg-gradient-to-r from-rose-400 to-amber-400 px-10 py-3 text-base font-extrabold text-white shadow-lg transition-all hover:scale-105 active:scale-95">
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showLetter && !showFinal && (
        <div className="relative z-20 mx-auto w-full max-w-2xl px-4" style={{ animation: "cgLetterOpen 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both", transformOrigin: "center center" }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent" style={{ animation: "cgShimmer 4s ease-in-out 1s infinite" }} />
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl" style={{ animation: "cgGlowPulse 4s ease-in-out infinite" }} />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-amber-600/5 blur-3xl" style={{ animation: "cgGlowPulse 4s ease-in-out 2s infinite" }} />
          </div>
          <div className="relative rounded-2xl border border-amber-600/30 bg-gradient-to-br from-stone-950 via-amber-950 to-stone-950 p-6 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(251,191,36,0.08)_inset] max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4" style={{ animation: "cgUp 0.6s ease-out 0.3s both" }}>
                {images.slice(0, 3).map((src, i) => (
                  <div key={i} className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full border-2 border-amber-500/40 shadow-lg" style={{ animation: `cgPhotoDrop 0.5s ease-out ${0.4 + i * 0.12}s both` }}>
                    <img src={src} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" />
                  </div>
                ))}
              </div>
              <span className="text-5xl block" style={{ animation: "cgUp 0.6s ease-out 0.25s both" }}>💌</span>
              <p className="mt-3 text-xs font-bold tracking-widest text-amber-400/80 uppercase" style={{ animation: "cgUp 0.6s ease-out 0.35s both" }}>A special message for you</p>
            </div>
            <div className="border-t border-amber-700/40 pt-6" style={{ animation: "cgUp 0.6s ease-out 0.5s both" }}>
              <p className="font-serif text-base leading-relaxed text-amber-100/90 sm:text-lg whitespace-pre-line">{message || DEFAULT_MESSAGE}</p>
            </div>
            <div className="mt-8 text-center border-t border-amber-700/40 pt-5" style={{ animation: "cgUp 0.6s ease-out 0.7s both" }}>
              <button onClick={() => { setShowLetter(false); setLetterOpened(true); if (memoriesOpened) setShowFinal(true); }}
                className="rounded-full border border-amber-500/50 bg-amber-500/20 px-10 py-3 text-sm font-extrabold text-amber-200 backdrop-blur-md transition-all hover:bg-amber-500/30 active:scale-95">
                {memoriesOpened ? "Finish" : "Back to gifts"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showMemories && !showFinal && (
        <div className="relative z-20 mx-auto w-full max-w-4xl px-4" style={{ animation: "cgMemoriesReveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>
          <div className="overflow-y-auto" style={{ maxHeight: "90vh" }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/5 to-transparent" style={{ animation: "cgShimmer 4s ease-in-out 1s infinite" }} />
            <div className="absolute -top-20 left-1/3 h-40 w-40 rounded-full bg-rose-500/5 blur-3xl" style={{ animation: "cgGlowPulse 4s ease-in-out infinite" }} />
            <div className="absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-rose-600/5 blur-3xl" style={{ animation: "cgGlowPulse 4s ease-in-out 2s infinite" }} />
          </div>
          <div className="relative rounded-2xl border border-rose-600/30 bg-gradient-to-br from-stone-950 via-rose-950 to-stone-950 p-6 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(244,63,94,0.08)_inset]">
            <div className="text-center mb-8">
              <p className="text-xs font-bold tracking-[0.15em] text-rose-400/80 uppercase" style={{ animation: "cgUp 0.6s ease-out 0.15s both" }}>A walk down memory lane</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-rose-300 via-amber-300 to-rose-200 bg-clip-text text-transparent" style={{ animation: "cgUp 0.6s ease-out 0.3s both" }}>Happiest Moment</h2>
              <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-rose-500 to-amber-500" style={{ animation: "cgUp 0.6s ease-out 0.4s both" }} />
            </div>
            <PhotoGrid images={images} />
            <div className="mt-8 text-center border-t border-rose-700/40 pt-6" style={{ animation: "cgUp 0.6s ease-out 0.6s both" }}>
              <button onClick={() => { setShowMemories(false); setMemoriesOpened(true); if (letterOpened) setShowFinal(true); }}
                className="rounded-full bg-gradient-to-r from-rose-500/30 to-amber-500/20 border border-rose-500/40 px-10 py-3 text-base font-extrabold text-rose-200 backdrop-blur-md transition-all hover:bg-rose-500/30 active:scale-95">
                {letterOpened ? "Finish" : "Back to gifts"}
              </button>
            </div>
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
        @keyframes cgRibbon { from { opacity: 0; transform: scale(0) rotate(0deg); } to { opacity: 1; transform: scale(1) rotate(25deg); } }
        @keyframes cgBalloonRise { 0% { transform: translateY(0) scale(0.3); opacity: 0; } 6% { transform: translateY(-10vh) scale(0.7); opacity: 1; } 80% { transform: translateY(-115vh) scale(1); opacity: 1; } 95% { transform: translateY(-135vh) scale(0.85); opacity: 0.6; } 100% { transform: translateY(-150vh) scale(0.7); opacity: 0; } }
        @keyframes cgSway { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }
        @keyframes cgSwing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(2deg); } 75% { transform: rotate(-2deg); } }
        @keyframes cgFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes cgDropIn { 0% { opacity: 0; transform: translateY(-150px) scale(0.5); } 60% { opacity: 1; transform: translateY(6px) scale(1.02); } 80% { transform: translateY(-3px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cgCreamFall { 0% { opacity: 0; transform: translateY(0) rotate(0deg); } 20% { opacity: 0.8; } 100% { opacity: 0; transform: translateY(400px) rotate(360deg); } }
        @keyframes cgHeartFloat { 0% { opacity: 0.9; transform: translateY(0) scale(1); } 60% { opacity: 0.6; transform: translateY(-35px) scale(0.6); } 100% { opacity: 0; transform: translateY(-70px) scale(0.3); } }
        @keyframes cgHeartWobble { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(8deg); } 75% { transform: rotate(-8deg); } }
        @keyframes cgLetterOpen { 0% { opacity: 0; transform: translateY(80px) scale(0.7); } 60% { opacity: 1; transform: translateY(-10px) scale(1.04); } 80% { transform: translateY(3px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cgMemoriesReveal { 0% { opacity: 0; transform: scale(0.5) rotate(-5deg); } 60% { opacity: 1; transform: scale(1.05) rotate(1deg); } 80% { transform: scale(0.97) rotate(-0.5deg); } 100% { opacity: 1; transform: scale(1) rotate(0); } }
        @keyframes cgPhotoDrop { 0% { opacity: 0; transform: translateY(-50px) scale(0.3); } 50% { opacity: 1; transform: translateY(6px) scale(1.1); } 80% { transform: translateY(-3px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cgShimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(200%) skewX(-15deg); } }
        @keyframes cgGlowPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}
