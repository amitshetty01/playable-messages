"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FinalScreen } from "@/components/FinalScreen";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

const BTN = "inline-flex min-h-[48px] items-center rounded-full border border-white/20 bg-white/10 px-8 text-sm font-extrabold text-white/80 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95";
const BTN_BRIGHT = "inline-flex min-h-[48px] items-center rounded-full border border-amber-300/40 bg-amber-200/30 px-8 text-sm font-extrabold text-amber-900 backdrop-blur-md transition-all hover:bg-amber-300/40 active:scale-95";

function playBirthdayMelody(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.1, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 10);
  master.connect(ctx.destination);
  const melody = [
    { f: 523, t: 0, d: 0.25 }, { f: 587, t: 0.3, d: 0.25 },
    { f: 659, t: 0.6, d: 0.25 }, { f: 698, t: 0.9, d: 0.25 },
    { f: 784, t: 1.2, d: 0.4 }, { f: 784, t: 1.7, d: 0.2 },
    { f: 698, t: 2.0, d: 0.25 }, { f: 659, t: 2.3, d: 0.25 },
    { f: 587, t: 2.6, d: 0.3 }, { f: 523, t: 3.0, d: 0.3 },
    { f: 784, t: 3.4, d: 0.4 }, { f: 659, t: 3.9, d: 0.3 },
    { f: 587, t: 4.3, d: 0.25 }, { f: 523, t: 4.6, d: 0.25 },
    { f: 1047, t: 5.0, d: 0.5 }, { f: 784, t: 5.6, d: 0.3 },
    { f: 659, t: 6.0, d: 0.25 }, { f: 784, t: 6.3, d: 0.25 },
    { f: 1047, t: 6.7, d: 0.6 }, { f: 880, t: 7.4, d: 0.3 },
    { f: 784, t: 7.8, d: 0.25 }, { f: 659, t: 8.1, d: 0.25 },
    { f: 784, t: 8.4, d: 0.25 }, { f: 1047, t: 8.8, d: 0.8 },
  ];
  const chord = [523, 659, 784];
  melody.forEach(({ f, t, d }) => {
    const o = ctx.createOscillator();
    o.type = t < 5.0 ? "triangle" : "sine";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime + t);
    g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + d);
    o.connect(g);
    g.connect(master);
    o.start(ctx.currentTime + t);
    o.stop(ctx.currentTime + t + d + 0.1);
  });
  [0, 2.0, 4.0, 6.0, 8.0].forEach((ct) => {
    chord.forEach((f, ci) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * 0.5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.02, ctx.currentTime + ct);
      g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + ct + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ct + 1.5);
      o.connect(g);
      g.connect(master);
      o.start(ctx.currentTime + ct);
      o.stop(ctx.currentTime + ct + 1.6);
    });
  });
  return master;
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

function PhotoGrid({ images }: { images: string[] }) {
  const n = images.length;
  const layout = useMemo(() => {
    if (n === 1) return [{ c: "col-span-2 row-span-2", w: 0 }];
    if (n === 2) return images.map((_, i) => ({ c: "col-span-1 row-span-2", w: i }));
    if (n === 3) return images.map((_, i) => ({ c: i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1", w: i }));
    if (n <= 6) return images.map((_, i) => ({ c: "col-span-1 row-span-1", w: i }));
    return images.map((_, i) => ({ c: i < 2 ? "col-span-2 row-span-2" : "col-span-1 row-span-1", w: i }));
  }, [images]);

  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-2xl mx-auto px-4" style={{ gridAutoRows: "minmax(100px,auto)" }}>
      {images.slice(0, 10).map((src, i) => (
        <div
          key={i}
          className={`${layout[i]?.c || "col-span-1 row-span-1"} overflow-hidden rounded-xl shadow-lg`}
          style={{
            animation: `cgUp 0.6s ease-out ${i * 0.12}s both`,
            transform: `rotate(${(i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : 0) * (0.5 + Math.random() * 0.5)}deg)`,
          }}
        >
          <img
            src={src}
            alt={`Memory ${i + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

function LightBulb({ id, x, y, delay }: { id: number; x: number; y: number; delay: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `cgIn 0.5s ease-out ${delay}s both`,
      }}
    >
      <svg viewBox="0 0 40 60" className="h-16 w-12 drop-shadow-2xl" style={{ animation: `cgSwing 3s ease-in-out ${delay}s infinite` }}>
        <defs>
          <radialGradient id={`bg-${id}`} cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </radialGradient>
        </defs>
        <ellipse cx="20" cy="22" rx="13" ry="16" fill={`url(#bg-${id})`} />
        <rect x="16" y="40" width="8" height="6" rx="1" fill="#a16207" />
        <path d="M12 46 Q20 56 28 46" fill="none" stroke="#a16207" strokeWidth="2" />
        <ellipse cx="16" cy="16" rx="4" ry="5" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="20" cy="22" rx="16" ry="20" fill="rgba(250,204,21,0.12)" style={{ animation: "cgPulse 2s ease-in-out infinite" }} />
      </svg>
    </div>
  );
}

function BalloonSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 64" className="h-28 w-20 drop-shadow-xl">
      <defs>
        <radialGradient id={`bl-${color.slice(1)}`} cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="40%" stopColor={color} />
          <stop offset="100%" stopColor={`${color}99`} />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="24" rx="16" ry="22" fill={`url(#bl-${color.slice(1)})`} />
      <polygon points="20,46 14,54 26,54" fill={color} opacity="0.7" />
      <path d="M20 54 Q18 60 20 64 Q22 60 20 54" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <ellipse cx="14" cy="16" rx="4" ry="6" fill="rgba(255,255,255,0.35)" />
      <path d="M10 28 Q6 32 8 36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path d="M30 28 Q34 32 32 36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
}

function KnifeSVG() {
  return (
    <svg viewBox="0 0 30 80" className="h-32 w-14 drop-shadow-xl">
      <defs>
        <linearGradient id="knife-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4d4d4" />
          <stop offset="30%" stopColor="#f5f5f5" />
          <stop offset="60%" stopColor="#e5e5e5" />
          <stop offset="100%" stopColor="#a3a3a3" />
        </linearGradient>
        <linearGradient id="knife-handle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5c4033" />
          <stop offset="50%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#5c4033" />
        </linearGradient>
      </defs>
      <path d="M12 2 L8 42 L22 42 L18 2 Z" fill="url(#knife-blade)" stroke="#a3a3a3" strokeWidth="0.5" />
      <path d="M12 2 Q15 0 18 2" fill="none" stroke="#a3a3a3" strokeWidth="0.5" />
      <polygon points="6,42 2,56 14,56 10,44" fill="url(#knife-handle)" stroke="#3e2723" strokeWidth="0.5" />
      <polygon points="20,42 16,56 28,56 24,44" fill="url(#knife-handle)" stroke="#3e2723" strokeWidth="0.5" />
      <circle cx="15" cy="50" r="2" fill="#a16207" opacity="0.5" />
      <rect x="10" y="56" width="10" height="2" rx="1" fill="#3e2723" />
      <line x1="9" y1="44" x2="7" y2="54" stroke="#a16207" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

export function BirthdaySurpriseGame({ template, experience, mode, shareUrl }: Props) {
  const [step, setStep] = useState(0);
  const [s2, setS2] = useState(false);
  const [s3, setS3] = useState(false);
  const [showYesNo, setShowYesNo] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [decorated, setDecorated] = useState(false);
  const [balloonsShown, setBalloonsShown] = useState(false);
  const [cutCount, setCutCount] = useState(0);
  const [knifePos, setKnifePos] = useState({ x: 50, y: 50 });
  const [showLetter, setShowLetter] = useState(false);
  const [ribbons, setRibbons] = useState<{ id: number; x: number; y: number; c: string; d: number }[]>([]);
  const [balloons, setBalloons] = useState<{ id: number; x: number; c: string; d: number }[]>([]);
  const [showCakeBtn, setShowCakeBtn] = useState(false);
  const [showBalloonBtn, setShowBalloonBtn] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showMemories, setShowMemories] = useState(false);
  const [cutLines, setCutLines] = useState<number[]>([]);
  const [cutDone, setCutDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const message = experience.finalMessage;
  const isBright = lightOn || step >= 4;
  const images = experience.images || [];
  const MIN_SLICES = 2;

  const ctx = useCallback(() => {
    if (!audioRef.current) audioRef.current = new AudioContext();
    if (audioRef.current.state === "suspended") audioRef.current.resume();
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

  const hYes = useCallback(() => {
    try { playSparkle(ctx()); } catch {}
    setStep(3);
  }, [ctx]);

  const hLight = useCallback(() => {
    setLightOn(true);
    try { playCheer(ctx()); } catch {}
    setTimeout(() => setStep(4), 2200);
  }, [ctx]);

  const hMusic = useCallback(() => {
    if (musicPlaying) return;
    setMusicPlaying(true);
    try { playBirthdayMelody(ctx()); } catch {}
    setTimeout(() => setStep(5), 5000);
  }, [musicPlaying, ctx]);

  const hDecorate = useCallback(() => {
    setDecorated(true);
    const cs = ["#ff6b8a","#ffd700","#ff8a6b","#c084fc","#60a5fa","#f472b6"];
    setRibbons(Array.from({length:16},(_,i)=>({id:i,x:Math.random()*90+5,y:Math.random()*90+5,c:cs[i%cs.length],d:i*0.1})));
    try { playCheer(ctx()); } catch {}
    setTimeout(() => { setShowBalloonBtn(true); }, 1200);
  }, [ctx]);

  const hBalloons = useCallback(() => {
    setBalloonsShown(true);
    const cs = ["#ff6b8a","#60a5fa","#fbbf24","#34d399","#c084fc","#fb923c"];
    setBalloons(Array.from({length:14},(_,i)=>({id:i,x:Math.random()*80+10,c:cs[i%cs.length],d:i*0.12})));
    try { playCheer(ctx()); } catch {}
    setTimeout(() => setShowCakeBtn(true), 1200);
  }, [ctx]);

  const hMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!cakeRef.current || cutDone) return;
    const r = cakeRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setKnifePos({ x: Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)), y: Math.max(5, Math.min(95, ((clientY - r.top) / r.height) * 100)) });
  }, [cutDone]);

  const hCut = useCallback(() => {
    if (cutDone) return;
    const maxCuts = 7;
    if (cutCount >= maxCuts) return;
    const newLines = [...cutLines, knifePos.x];
    newLines.sort((a, b) => a - b);
    setCutLines(newLines);
    const next = cutCount + 1;
    setCutCount(next);
    try { playSparkle(ctx()); } catch {}
    if (next >= MIN_SLICES) {
      setCutDone(true);
      setTimeout(() => {
        setShowLetter(true);
        setStep(8);
      }, 1000);
    }
  }, [cutCount, cutLines, knifePos.x, cutDone, ctx]);

  const slices = cutLines.length + 1;

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

      {/* Light bulbs */}
      {lightOn && step === 3 && (
        <>
          {[
            { x: 12, y: 8, d: 0 }, { x: 88, y: 8, d: 0.15 },
            { x: 25, y: 3, d: 0.3 }, { x: 75, y: 3, d: 0.45 },
            { x: 50, y: 1, d: 0.6 },
          ].map((b, i) => (
            <LightBulb key={i} id={i} x={b.x} y={b.y} delay={b.d} />
          ))}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 0%, rgba(250,204,21,0.12) 0%, transparent 60%)",
            animation: "cgIn 0.8s ease-out both",
          }} />
        </>
      )}

      {/* Ribbons */}
      {ribbons.map(r => (
        <div key={r.id} className="absolute pointer-events-none" style={{ left: `${r.x}%`, top: `${r.y}%`, animation: `cgRibbon 0.7s ease-out ${r.d}s both` }}>
          <svg viewBox="0 0 40 60" className="h-20 w-14 drop-shadow-lg" style={{ transform: `rotate(${r.id * 25}deg)` }}>
            <path d="M20 0 Q5 20 10 45 Q20 58 20 60 Q20 58 30 45 Q35 20 20 0Z" fill={r.c} opacity="0.7" />
          </svg>
        </div>
      ))}

      {/* Balloons */}
      {balloons.map((b, i) => (
        <div key={b.id} className="absolute pointer-events-none" style={{
          left: `${b.x}%`,
          bottom: "-15%",
          animation: `cgBalloonRise ${3 + i * 0.15}s ease-out ${b.d}s both`,
        }}>
          <div style={{ animation: "cgSway 2.5s ease-in-out infinite" }}>
            <BalloonSVG color={b.c} />
          </div>
        </div>
      ))}

      {/* Step 0 — Three connected lines */}
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

      {/* Step 1 — Special note */}
      {step === 1 && (
        <div className="relative z-10 mx-auto max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1.1rem,4vw,1.6rem)", animation: "cgUp 0.8s ease-out both" }} className="font-display font-bold leading-relaxed text-white/80">
            To make something special for you instead of just typing{" "}
            <span className="bg-gradient-to-r from-pink-300 to-amber-300 bg-clip-text text-transparent">&ldquo;Happy Birthday&rdquo;</span>
          </p>
        </div>
      )}

      {/* Step 2 — I made this + Yes/No */}
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

      {/* Step 3 — Dark room / Light on */}
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

      {/* Step 7 — Cake */}
      {step === 7 && (
        <div className="relative z-10 mx-auto w-full max-w-lg px-6 text-center" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <p style={{ fontSize: "clamp(1rem,4vw,1.4rem)" }} className="font-display font-bold text-amber-900 mb-6">
            {cutCount === 0 ? "Click on the cake to slice it!" : `${slices} slice${slices > 1 ? "s" : ""}! Keep clicking to cut more`}
          </p>
          <div ref={cakeRef}
            className="relative mx-auto h-72 w-full max-w-sm cursor-crosshair rounded-2xl overflow-hidden sm:h-80 touch-none"
            style={{ background: "linear-gradient(180deg, rgba(251,191,36,0.1) 0%, rgba(217,119,6,0.05) 100%)" }}
            onMouseMove={hMove}
            onTouchMove={hMove}
            onClick={hCut}
            onTouchEnd={(e) => { e.preventDefault(); hCut(); }}
          >
            {/* Plate */}
            <div className="absolute bottom-1 left-1/2 h-5 w-11/12 -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-white/20 to-white/5 border border-white/10 shadow-lg" />

            {/* Bottom tier */}
            <div className="absolute bottom-6 left-1/2 h-28 w-4/5 -translate-x-1/2 rounded-t-[2.5rem]" style={{
              background: "linear-gradient(160deg, #fde68a 0%, #fbbf24 40%, #d97706 70%, #b45309 100%)",
              border: "1px solid rgba(251,191,36,0.3)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}>
              <div className="absolute -top-3 left-0 right-0 h-6 rounded-t-[2.5rem]" style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
                boxShadow: "0 2px 8px rgba(255,255,255,0.3)",
              }} />
              <div className="absolute -bottom-1 left-[10%] h-3 w-3 rounded-full bg-white/40" />
              <div className="absolute -bottom-1 left-[30%] h-4 w-2.5 rounded-full bg-white/35" />
              <div className="absolute -bottom-1 left-[55%] h-3.5 w-3 rounded-full bg-white/40" />
              <div className="absolute -bottom-1 left-[75%] h-2.5 w-2.5 rounded-full bg-white/35" />
              {[15,35,50,65,85].map(x => (
                <div key={x} className="absolute top-4 w-1.5 h-1.5 rounded-full" style={{ left: `${x}%`, background: ["#ff6b8a","#60a5fa","#34d399","#fbbf24","#c084fc"][Math.floor(x/15)%5] }} />
              ))}
            </div>

            {/* Middle tier */}
            <div className="absolute bottom-[7.5rem] left-1/2 h-20 w-3/5 -translate-x-1/2 rounded-t-[2rem]" style={{
              background: "linear-gradient(160deg, #fef3c7 0%, #fde68a 35%, #fbbf24 70%, #d97706 100%)",
              border: "1px solid rgba(251,191,36,0.3)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}>
              <div className="absolute -top-2.5 left-0 right-0 h-5 rounded-t-[2rem]" style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
              }} />
              <div className="absolute -bottom-1 left-[20%] h-2.5 w-2 rounded-full bg-white/35" />
              <div className="absolute -bottom-1 left-[50%] h-3 w-2.5 rounded-full bg-white/40" />
              <div className="absolute -bottom-1 left-[75%] h-2 w-2 rounded-full bg-white/35" />
            </div>

            {/* Top tier */}
            <div className="absolute bottom-[11rem] left-1/2 h-16 w-2/5 -translate-x-1/2 rounded-t-[1.5rem]" style={{
              background: "linear-gradient(160deg, #fef3c7 0%, #fde68a 30%, #fbbf24 65%, #d97706 100%)",
              border: "1px solid rgba(251,191,36,0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}>
              <div className="absolute -top-2 left-0 right-0 h-4 rounded-t-[1.5rem]" style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 100%)",
              }} />
            </div>

            {/* Cherry */}
            <div className="absolute bottom-[12.5rem] left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg z-10" />
            <div className="absolute bottom-[13.3rem] left-1/2 h-4 w-1 -translate-x-1/2 bg-green-700/40 rounded-full z-10" style={{ transform: "translateX(-50%) rotate(-15deg)" }} />

            {/* Candle with improved flame */}
            <div className="absolute bottom-[13.8rem] left-1/2 h-10 w-3 -translate-x-1/2" style={{
              background: "linear-gradient(180deg, #fcd34d, #f59e0b, #d97706)",
              borderRadius: "2px",
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

            {/* Cut lines */}
            {cutLines.map((pos, i) => (
              <div key={i} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[15%] bottom-[8%] w-0.5 bg-white/50" style={{
                  left: `${pos}%`,
                  transform: "translateX(-50%)",
                  boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                  animation: "cgIn 0.3s ease-out both",
                }} />
              </div>
            ))}

            {/* Slice count indicator */}
            {cutCount > 0 && (
              <div className="absolute top-4 right-4 rounded-full bg-white/30 backdrop-blur-sm px-3 py-1 text-xs font-bold text-amber-900/80 z-30">
                {slices} slice{slices > 1 ? "s" : ""}
              </div>
            )}

            {/* Knife */}
            {!cutDone && (
              <div className="absolute z-20 pointer-events-none transition-all duration-75" style={{ left: `${knifePos.x}%`, top: `${knifePos.y}%`, transform: "translate(-50%,-50%) rotate(12deg)" }}>
                <KnifeSVG />
              </div>
            )}

            {/* Hint */}
            {!cutDone && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-amber-900/70 backdrop-blur-sm" style={{ animation: "cgPulse 2s ease-in-out infinite" }}>
                {cutCount === 0 ? "Tap to cut a slice" : "Tap for another slice"}
              </div>
            )}
            {cutDone && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-amber-900/70 backdrop-blur-sm">
                {slices} perfect slices! 🎉
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 8 — Letter */}
      {step === 8 && !showFinal && !showMemories && (
        <div className="relative z-10 mx-auto w-full max-w-2xl px-4" style={{ animation: "cgIn 0.8s ease-out both" }}>
          <div className="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-50/95 via-white/95 to-amber-100/95 p-6 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.3)] max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            <div className="text-center mb-6">
              <span className="text-5xl">🎂</span>
              <p className="mt-3 text-xs font-bold tracking-widest text-amber-400/60 uppercase">A special message for you</p>
            </div>
            <div className="border-t border-amber-200/40 pt-6">
              <p className="font-serif text-base leading-relaxed text-amber-900/90 sm:text-lg" style={{ whiteSpace: "pre-wrap" }}>
                {message || "Happy Birthday! Today is all about you — the person who makes the world a little brighter, a little warmer, and a whole lot more beautiful. May your day be filled with laughter, love, and everything that makes you smile. You deserve it all and more. Cheers to you!"}
              </p>
            </div>
            <div className="mt-8 border-t border-amber-200/40 pt-5 flex flex-col items-center gap-3">
              <p className="font-serif text-sm text-amber-600/70 italic">Create like this for someone else</p>
              <div className="flex gap-3 flex-wrap justify-center">
                {images.length >= 2 && (
                  <button onClick={() => setShowMemories(true)} className="rounded-full bg-gradient-to-r from-rose-400/30 to-amber-400/20 border border-rose-400/40 px-8 py-3 text-sm font-extrabold text-rose-800 backdrop-blur-md transition-all hover:bg-rose-400/40 active:scale-95">
                    <span className="mr-2">📸</span> Our Memories
                  </button>
                )}
                <button onClick={() => setShowFinal(true)} className="rounded-full border border-amber-300/50 bg-amber-400/20 px-8 py-3 text-sm font-extrabold text-amber-800 backdrop-blur-md transition-all hover:bg-amber-400/30 active:scale-95">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 9 — Memories Gallery */}
      {showMemories && !showFinal && (
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 overflow-y-auto" style={{ animation: "cgIn 0.8s ease-out both", maxHeight: "90vh" }}>
          <div className="rounded-2xl border border-rose-200/30 bg-gradient-to-br from-rose-50/95 via-white/95 to-amber-50/95 p-6 sm:p-10 shadow-[0_8px_60px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-8">
              <p className="text-xs font-bold tracking-[0.15em] text-rose-400/70 uppercase">A walk down memory lane</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400 bg-clip-text text-transparent">
                Happiest Moment
              </h2>
              <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-rose-300 to-amber-300" />
            </div>
            <PhotoGrid images={images} />
            <div className="mt-8 text-center border-t border-rose-200/40 pt-6">
              <button onClick={() => setShowFinal(true)} className="rounded-full bg-gradient-to-r from-rose-400/30 to-amber-400/20 border border-rose-400/40 px-10 py-3 text-base font-extrabold text-rose-800 backdrop-blur-md transition-all hover:bg-rose-400/40 active:scale-95">
                Done
              </button>
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
        @keyframes cgBalloonRise { 0% { opacity: 0; transform: translateY(0) scale(0.4); } 15% { opacity: 0.6; transform: translateY(-20vh) scale(0.7); } 40% { opacity: 1; transform: translateY(-50vh) scale(1); } 70% { opacity: 0.8; transform: translateY(-80vh) scale(0.95); } 100% { opacity: 0; transform: translateY(-110vh) scale(0.8); } }
        @keyframes cgSway { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(6px); } 75% { transform: translateX(-6px); } }
        @keyframes cgSwing { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(2deg); } 75% { transform: rotate(-2deg); } }
      `}</style>
    </div>
  );
}
