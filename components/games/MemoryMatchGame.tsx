"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Watermark } from "@/components/Watermark";
import { playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import { splitMessage } from "@/lib/splitMessage";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

type Phase = "heart" | "knock" | "password" | "blackout" | "memories";

const PICSUM_BASE = "https://picsum.photos/seed";
const PICSUM_SIZE = "/500/500";

const MEMORY_TITLES = [
  "Where it all began",
  "Chasing sunsets together",
  "Under the same stars",
  "When forever started feeling close",
  "The moment my heart knew",
  "Our corner of the world",
  "A day we etched in time",
  "Wrapped in the same dream",
];

const PHOTO_SEEDS = [
  "memory_sunrise",
  "memory_ocean",
  "memory_forest",
  "memory_stars",
  "memory_road",
  "memory_city",
  "memory_mountains",
  "memory_garden",
];

function computeTimeSince(dateStr: string) {
  const start = new Date(dateStr);
  const now = new Date();
  if (isNaN(start.getTime())) return null;
  let diff = Math.max(0, now.getTime() - start.getTime());
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days - years * 365 - months * 30;
  return { years, months, days: remainingDays, hours, minutes, seconds };
}

function createAmbientMusic() {
  let ctx: AudioContext | null = null;
  let stopCleanup: (() => void) | null = null;

  function start() {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.2, ctx.currentTime);
      master.connect(ctx.destination);

      const padFreqs = [261.63, 329.63, 392.0, 523.25];
      const pads = padFreqs.map((freq) => {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq + Math.random() * 0.5, ctx!.currentTime);
        gain.gain.setValueAtTime(0, ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx!.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(master);
        osc.start();
        return { osc, gain };
      });

      let noteIndex = 0;
      const melody = [261.63, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0,
                      329.63, 440.0, 523.25, 659.25, 587.33, 523.25, 392.0, 329.63];
      let melodyTimer: ReturnType<typeof setTimeout> | null = null;
      let running = true;

      function playNext() {
        if (!running || !ctx) return;
        const freq = melody[noteIndex % melody.length];
        noteIndex++;
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.3);
          gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
          osc.connect(gain);
          gain.connect(master);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 4);
        } catch {}
        melodyTimer = setTimeout(playNext, 3000 + Math.random() * 1500);
      }
      playNext();

      stopCleanup = () => {
        running = false;
        if (melodyTimer) clearTimeout(melodyTimer);
        pads.forEach(({ osc, gain }) => {
          try { gain.gain.linearRampToValueAtTime(0, ctx!.currentTime + 0.3); } catch {}
          setTimeout(() => { try { osc.stop(); } catch {} }, 400);
        });
        try { master.gain.linearRampToValueAtTime(0, ctx!.currentTime + 0.5); } catch {}
        setTimeout(() => { try { if (ctx && ctx.state !== "closed") ctx.close(); } catch {} }, 800);
        ctx = null;
      };
    } catch { /* audio not available */ }
  }

  function stop() {
    if (stopCleanup) stopCleanup();
  }

  return { start, stop };
}

function useAudioContext() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);
}

function playHeartbeat(ctx: AudioContext, time: number) {
  const osc1 = ctx.createOscillator(); const gain1 = ctx.createGain();
  osc1.connect(gain1); gain1.connect(ctx.destination);
  osc1.type = "sine"; osc1.frequency.setValueAtTime(80, time);
  osc1.frequency.exponentialRampToValueAtTime(50, time + 0.12);
  gain1.gain.setValueAtTime(0.15, time);
  gain1.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
  osc1.start(time); osc1.stop(time + 0.14);

  const noise = ctx.createOscillator(); const ng = ctx.createGain();
  noise.connect(ng); ng.connect(ctx.destination);
  noise.type = "sawtooth"; noise.frequency.setValueAtTime(200, time);
  ng.gain.setValueAtTime(0.04, time);
  ng.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
  noise.start(time); noise.stop(time + 0.04);

  const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
  osc2.connect(gain2); gain2.connect(ctx.destination);
  osc2.type = "sine"; osc2.frequency.setValueAtTime(60, time + 0.2);
  osc2.frequency.exponentialRampToValueAtTime(40, time + 0.3);
  gain2.gain.setValueAtTime(0.12, time + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.34);
  osc2.start(time + 0.2); osc2.stop(time + 0.34);

  const noise2 = ctx.createOscillator(); const ng2 = ctx.createGain();
  noise2.connect(ng2); ng2.connect(ctx.destination);
  noise2.type = "sawtooth"; noise2.frequency.setValueAtTime(180, time + 0.2);
  ng2.gain.setValueAtTime(0.03, time + 0.2);
  ng2.gain.exponentialRampToValueAtTime(0.001, time + 0.24);
  noise2.start(time + 0.2); noise2.stop(time + 0.24);
}

function MedicalHeartSVG({ beating }: { beating: boolean }) {
  return (
    <svg viewBox="-20 -20 340 340" className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
      <defs>
        <style>{`
          @keyframes heartPump {
            0%, 100% { transform: scale(1); }
            14% { transform: scale(1.08); }
            28% { transform: scale(1); }
            42% { transform: scale(1.04); }
            56% { transform: scale(1); }
          }
          @keyframes heartGlow {
            0%, 100% { opacity: 0.4; }
            14% { opacity: 0.7; }
            28% { opacity: 0.4; }
            42% { opacity: 0.55; }
            56% { opacity: 0.4; }
          }
        `}</style>
        <radialGradient id="myoBase" cx="42%" cy="44%" r="54%">
          <stop offset="0%" stopColor="#ef4a60" />
          <stop offset="15%" stopColor="#dc2644" />
          <stop offset="40%" stopColor="#b01830" />
          <stop offset="70%" stopColor="#7a0e20" />
          <stop offset="100%" stopColor="#3a0410" />
        </radialGradient>
        <radialGradient id="myoHighlight" cx="32%" cy="28%" r="38%">
          <stop offset="0%" stopColor="rgba(255,180,200,0.35)" />
          <stop offset="60%" stopColor="rgba(240,100,120,0.1)" />
          <stop offset="100%" stopColor="rgba(240,100,120,0)" />
        </radialGradient>
        <radialGradient id="heartGlowDeep" cx="42%" cy="44%" r="50%">
          <stop offset="0%" stopColor="rgba(255,60,80,0.5)" />
          <stop offset="40%" stopColor="rgba(200,30,50,0.15)" />
          <stop offset="100%" stopColor="rgba(200,30,50,0)" />
        </radialGradient>
        <linearGradient id="aortaShade" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#e0304a" />
          <stop offset="40%" stopColor="#b81e34" />
          <stop offset="100%" stopColor="#5a0a18" />
        </linearGradient>
        <linearGradient id="pulmonaryShade" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#c8243c" />
          <stop offset="100%" stopColor="#6a0e1c" />
        </linearGradient>
        <radialGradient id="fatTissue" cx="45%" cy="58%" r="28%">
          <stop offset="0%" stopColor="rgba(220,195,150,0.12)" />
          <stop offset="100%" stopColor="rgba(220,195,150,0)" />
        </radialGradient>
        <filter id="tissueNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="n" />
          <feColorMatrix type="saturate" values="0" in="n" result="g" />
          <feComponentTransfer in="g" result="d">
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="d" mode="multiply" />
        </filter>
        <filter id="innerShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
          <feOffset dx="2" dy="4" result="offsetBlur" />
          <feFlood floodColor="#1a0208" floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="outerGlow">
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#innerShadow)">
        <g style={beating ? { animation: "heartGlow 1.2s ease-in-out infinite", transformOrigin: "150px 150px" } : {}} filter="url(#outerGlow)">
          <ellipse cx="150" cy="140" rx="90" ry="76" fill="url(#heartGlowDeep)" />
        </g>

        <g style={beating ? { animation: "heartPump 1.2s ease-in-out infinite", transformOrigin: "150px 150px" } : {}}>
          <g opacity="0.2">
            <path d="M 146 24 C 168 14, 196 20, 204 40 C 212 58, 204 72, 190 76" fill="none" stroke="#b81e34" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 100 26 C 84 16, 64 22, 58 38 C 52 54, 60 66, 72 70" fill="none" stroke="#8a1224" strokeWidth="4" strokeLinecap="round" />
          </g>

          <path d="M 144 26 C 146 8, 158 2, 170 4 C 186 8, 200 16, 210 30 C 220 44, 224 58, 218 72" fill="none" stroke="url(#aortaShade)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 210 30 C 216 22, 222 18, 230 20" fill="none" stroke="#7a0e20" strokeWidth="6" strokeLinecap="round" opacity="0.5" />

          <path d="M 146 26 C 140 12, 130 5, 118 8 C 102 12, 88 24, 82 40 C 80 50, 82 62, 90 72" fill="none" stroke="url(#pulmonaryShade)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 90 72 L 80 82" fill="none" stroke="#7a0e20" strokeWidth="5" strokeLinecap="round" opacity="0.4" />

          <path d="M 124 28 C 116 14, 104 8, 92 12 C 80 16, 70 26, 64 38" fill="none" stroke="#b81e34" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

          <path
            d="M 136 54 C 144 42, 162 42, 176 48 C 200 56, 222 72, 230 94 C 238 114, 236 138, 220 160 C 204 182, 174 200, 154 208 C 144 212, 134 215, 122 212 C 104 204, 80 184, 64 160 C 48 138, 40 112, 44 90 C 48 66, 62 48, 84 40 C 100 34, 120 38, 136 54 Z"
            fill="url(#myoBase)"
            filter="url(#tissueNoise)"
          />

          <ellipse cx="186" cy="106" rx="46" ry="34" fill="url(#fatTissue)" />
          <ellipse cx="136" cy="130" rx="58" ry="42" fill="url(#fatTissue)" />
          <ellipse cx="102" cy="86" rx="34" ry="22" fill="url(#myoHighlight)" />

          {beating && (
            <ellipse cx="140" cy="110" rx="72" ry="56" fill="url(#heartGlowDeep)" style={{ animation: "heartGlow 1.2s ease-in-out infinite", transformOrigin: "150px 150px" }} />
          )}

          <path d="M 216 86 C 230 100, 236 118, 228 138 C 220 156, 204 174, 182 188" fill="none" stroke="#5a0815" strokeWidth="3.5" opacity="0.45" strokeLinecap="round" />
          <path d="M 216 86 C 202 78, 186 70, 172 68" fill="none" stroke="#5a0815" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
          <path d="M 216 86 C 208 82, 200 80, 192 80" fill="none" stroke="#5a0815" strokeWidth="2" opacity="0.2" strokeLinecap="round" />

          <path d="M 126 54 C 136 64, 152 76, 164 92 C 174 106, 172 128, 158 146" fill="none" stroke="#4a0614" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          <path d="M 108 56 C 94 72, 80 94, 78 114 C 76 134, 84 156, 98 172" fill="none" stroke="#4a0614" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />
          <path d="M 120 60 C 126 76, 138 94, 140 112" fill="none" stroke="#3a0310" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />

          <path d="M 154 64 C 160 78, 170 90, 166 104" fill="none" stroke="#3a0310" strokeWidth="1" opacity="0.2" strokeLinecap="round" />

          <path d="M 122 192 C 130 200, 138 208, 146 210" fill="none" stroke="#3a0310" strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
          <path d="M 96 176 C 88 184, 86 194, 90 202" fill="none" stroke="#3a0310" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />

          <path d="M 148 52 L 148 66" fill="none" stroke="#4a0614" strokeWidth="3" opacity="0.4" />
          <path d="M 128 58 C 134 72, 140 84, 136 98" fill="none" stroke="#4a0614" strokeWidth="1.2" opacity="0.3" />

          <circle cx="162" cy="76" r="3.5" fill="#6a0a1c" opacity="0.4" />
          <circle cx="118" cy="84" r="3" fill="#6a0a1c" opacity="0.4" />
          <circle cx="156" cy="110" r="3.2" fill="#6a0a1c" opacity="0.35" />
          <circle cx="106" cy="104" r="2.5" fill="#6a0a1c" opacity="0.35" />
          <circle cx="134" cy="132" r="2" fill="#6a0a1c" opacity="0.3" />
          <circle cx="170" cy="94" r="2.2" fill="#6a0a1c" opacity="0.35" />
          <circle cx="98" cy="130" r="1.8" fill="#6a0a1c" opacity="0.25" />
        </g>
      </g>
    </svg>
  );
}

function useTilt(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let mounted = true;
    const onMove = (e: PointerEvent) => {
      if (!mounted) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.transform = `perspective(600px) rotateX(${(y - 0.5) * -12}deg) rotateY(${(x - 0.5) * 12}deg) scale(1.03)`;
    };
    const onLeave = () => { el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)"; };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { mounted = false; el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  }, [ref]);
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const c = canvas.getContext("2d")!;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 2.5 + 0.5, o: Math.random() * 0.3 + 0.1,
      });
    }
    let running = true;
    function frame() {
      if (!running) return;
      c.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fillStyle = `rgba(255, 200, 220, ${p.o})`;
        c.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { running = false; window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />;
}

function MemoryCard({ imgSrc, title, message, index }: {
  imgSrc: string; title: string; message: string; index: number;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);
  useTilt(tiltRef);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const obsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = obsRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); ob.unobserve(el); } },
      { threshold: 0.2 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={obsRef}
      className={`flex flex-col items-center gap-5 sm:flex-row ${index % 2 === 1 ? "sm:flex-row-reverse" : ""} transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"}`}
    >
      <div
        ref={tiltRef}
        className="relative h-56 w-full shrink-0 overflow-hidden rounded-2xl shadow-lg sm:h-72 sm:w-72"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 transition-opacity duration-500 ${imgLoaded ? "opacity-0" : "opacity-100"}`} />
        <img
          src={imgSrc} alt={title} loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-xs font-bold tracking-widest text-rose-300/70 uppercase">{title}</p>
        <p className="mt-2 text-base font-semibold leading-relaxed text-white/90 sm:text-lg">{message}</p>
      </div>
    </div>
  );
}

function TimeUnit({ value, label, reached }: { value: number; label: string; reached: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!reached) return;
    if (label === "sec") { setCount(value); return; }
    const step = Math.max(1, Math.ceil(value / 25));
    const timer = setInterval(() => {
      setCount((p) => { const n = p + step; if (n >= value) { clearInterval(timer); return value; } return n; });
    }, 40);
    return () => clearInterval(timer);
  }, [reached, value, label]);

  const [secTick, setSecTick] = useState(0);
  useEffect(() => {
    if (!reached || label !== "sec") return;
    const t = setInterval(() => setSecTick((p) => (p + 1) % 60), 1000);
    return () => clearInterval(t);
  }, [reached, label]);

  const display = label === "sec" ? secTick : count;
  return (
    <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
      <span className="tabular-nums text-2xl font-bold text-rose-300 sm:text-3xl">{String(display).padStart(2, "0")}</span>
      <span className="mt-0.5 text-[10px] font-bold tracking-widest text-white/40 uppercase sm:text-xs">{label}</span>
    </div>
  );
}

export function MemoryMatchGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;

  const [phase, setPhase] = useState<Phase>("heart");
  const [beating, setBeating] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [heartTapped, setHeartTapped] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeReached, setTimeReached] = useState(false);
  const [copied, setCopied] = useState(false);
  const memoriesRef = useRef<HTMLDivElement>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopMusicRef = useRef<(() => void) | null>(null);
  const getAudioCtx = useAudioContext();

  const isGenerated = mode === "generated";
  const isDemo = mode === "demo" || mode === "preview";
  const passwordQuestion = experience.passwordQuestion || "Only one person has the permission to go inside.";
  const expectedPassword = experience.passwordAnswer?.toLowerCase().trim() || experience.customPassword?.toLowerCase().trim() || experience.receiverName?.toLowerCase().trim() || experience.creatorName?.toLowerCase().trim() || "";
  const memories = splitMessage(message, 6).filter(Boolean);
  const timeTarget = experience.togetherSince ? computeTimeSince(experience.togetherSince) ?? { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 } : { years: 1, months: 2, days: 15, hours: 12, minutes: 34, seconds: 56 };

  useEffect(() => {
    try {
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") ctx.resume();
    } catch {}
  }, [getAudioCtx]);

  useEffect(() => {
    if (phase !== "heart" && phase !== "knock" && phase !== "password") { if (heartbeatIntervalRef.current) { clearInterval(heartbeatIntervalRef.current); heartbeatIntervalRef.current = null; } return; }
    if (phase === "heart" && !beating) return;
    if (heartbeatIntervalRef.current) return;
    const timer = setInterval(() => {
      try {
        const ctx = getAudioCtx();
        if (ctx.state !== "running") return;
        playHeartbeat(ctx, ctx.currentTime);
      } catch {}
    }, 870);
    heartbeatIntervalRef.current = timer;
    return () => { clearInterval(timer); heartbeatIntervalRef.current = null; };
  }, [phase, beating, getAudioCtx]);

  useEffect(() => { if (phase === "memories") setTimeReached(true); }, [phase]);

  useEffect(() => {
    if (phase !== "memories") return;
    const music = createAmbientMusic();
    music.start();
    stopMusicRef.current = music.stop;
    return () => { if (stopMusicRef.current) { stopMusicRef.current(); stopMusicRef.current = null; } };
  }, [phase]);

  useEffect(() => {
    if (phase !== "memories") return;
    const container = memoriesRef.current;
    if (!container) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setScrollProgress(scrollHeight > clientHeight ? Math.min(scrollTop / (scrollHeight - clientHeight), 1) : 0);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [phase]);

  useEffect(() => {
    if (phase !== "memories" || memories.length === 0) return;
    const container = memoriesRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-memory-card]");
    if (cards.length === 0) return;
    let unobserve: (() => void) | null = null;
    const timer = setTimeout(() => {
      const last = cards[cards.length - 1];
      const ob = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setShowCTA(true), 1000); ob.disconnect(); } },
        { threshold: 0.5 }
      );
      ob.observe(last);
      unobserve = () => ob.disconnect();
    }, 500);
    return () => { clearTimeout(timer); if (unobserve) unobserve(); };
  }, [phase, memories.length]);

  function transitionTo(newPhase: Phase) {
    setFadeIn(false);
    setTimeout(() => { setPhase(newPhase); setFadeIn(true); }, 350);
  }

  function handleHeartTap() {
    if (heartTapped) return;
    if (heartbeatIntervalRef.current) { clearInterval(heartbeatIntervalRef.current); heartbeatIntervalRef.current = null; }
    setBeating(false);
    setHeartTapped(true);
    try {
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "triangle"; osc.frequency.setValueAtTime(200 - i * 20, ctx.currentTime + i * 0.18);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.1);
        osc.start(ctx.currentTime + i * 0.18); osc.stop(ctx.currentTime + i * 0.18 + 0.1);
      }
    } catch {}
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    setTimeout(() => { setPhase("knock"); setFadeIn(true); }, 300);
  }

  function handleKnockTap() { transitionTo("password"); }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const valid = isDemo || (expectedPassword && password.toLowerCase().trim() === expectedPassword);
    if (valid) {
      if (heartbeatIntervalRef.current) { clearInterval(heartbeatIntervalRef.current); heartbeatIntervalRef.current = null; }
      playToneSound("ding", tone); hapticTone("ding", tone);
      transitionTo("blackout");
    } else {
      setPasswordError(true); playToneSound("whoosh", tone); hapticTone("tap", tone);
      setTimeout(() => setPasswordError(false), 600);
    }
  }

  const handleShare = useCallback(async () => {
    if (shareUrl) { try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} }
  }, [shareUrl]);

  useEffect(() => {
    if (phase !== "blackout") return;
    try {
      const ctx = getAudioCtx();
      const freqs = [262, 330, 392, 523];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine"; osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
        osc.start(ctx.currentTime + i * 0.1); osc.stop(ctx.currentTime + i * 0.1 + 0.4);
      });
    } catch {}
    const t = setTimeout(() => transitionTo("memories"), 300);
    return () => clearTimeout(t);
  }, [phase, getAudioCtx]);

  if (phase === "blackout") return <div className="absolute inset-0 bg-black z-50" />;

  if (phase === "memories") {
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-gradient-to-b from-gray-950 via-indigo-950 to-gray-950">
        <ParticleField />
        <div className="fixed left-0 right-0 top-0 z-40 h-1 bg-white/5">
          <div className="h-full bg-gradient-to-r from-rose-500 to-amber-300 transition-all duration-150" style={{ width: `${scrollProgress * 100}%` }} />
        </div>
        <div ref={memoriesRef} className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 py-12 sm:px-6 sm:py-16">
            <div className={`flex flex-col items-center text-center transition-all duration-700 ${fadeIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              <div className="mb-4 text-6xl sm:text-7xl">💫</div>
              <h2 className="display-title text-3xl font-bold leading-tight text-white sm:text-5xl">A world of memories</h2>
              <p className="mt-4 max-w-md text-lg text-white/60">Every moment with you has been a chapter worth keeping.</p>
              <div className="mt-8 w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-5 py-6 backdrop-blur-sm sm:px-8 sm:py-8">
                <p className="text-xs font-bold tracking-widest text-white/40 uppercase">Together for</p>
                <div className="mt-4 grid grid-cols-6 gap-2 sm:gap-3">
                  <TimeUnit value={timeTarget.years} label="yr" reached={timeReached} />
                  <TimeUnit value={timeTarget.months} label="mo" reached={timeReached} />
                  <TimeUnit value={timeTarget.days} label="days" reached={timeReached} />
                  <TimeUnit value={timeTarget.hours} label="hrs" reached={timeReached} />
                  <TimeUnit value={timeTarget.minutes} label="min" reached={timeReached} />
                  <TimeUnit value={timeTarget.seconds} label="sec" reached={timeReached} />
                </div>
              </div>
            </div>
            <div className={`mt-14 space-y-12 transition-all duration-700 delay-300 ${fadeIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              {memories.map((memory, i) => (
                <div key={i} data-memory-card>
                  <MemoryCard imgSrc={`${PICSUM_BASE}/${PHOTO_SEEDS[i % PHOTO_SEEDS.length]}${PICSUM_SIZE}`} title={MEMORY_TITLES[i % MEMORY_TITLES.length]} message={memory} index={i} />
                </div>
              ))}
            </div>
            <div className={`mt-16 mb-8 text-center transition-all duration-700 ${showCTA ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] px-6 py-8 backdrop-blur-sm sm:px-10">
                <p className="text-sm font-bold tracking-widest text-white/30 uppercase">Made with love</p>
                <p className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl">
                  {experience.receiverName ? `This was always meant for you, ${experience.receiverName}` : "This was always meant for you"}
                </p>
                {experience.creatorName && experience.showCreatorName && (
                  <p className="mt-2 text-sm text-white/40">— {experience.creatorName}</p>
                )}
              </div>
              <div className={`mt-6 flex flex-col items-center gap-4 transition-all duration-700 delay-300 ${showCTA ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href={isGenerated ? `/edit/${experience.id}` : `/create/${template.id}`} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    Edit this
                  </Link>
                  <button onClick={handleShare} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                    {copied ? "Copied!" : "Share"}
                  </button>
                </div>
                <Link href="/create" className="premium-button inline-flex items-center gap-2">
                  <span>Create for someone else</span>
                  <span className="text-lg">💝</span>
                </Link>
                <p className="mt-1 text-xs text-white/30">Share a memory that matters.</p>
              </div>
            </div>
          </div>
        </div>
        <Watermark />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-b from-rose-950 via-pink-950 to-rose-950">
      <div className={`relative flex w-full max-w-lg flex-col items-center gap-6 px-6 transition-all duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        {phase === "heart" && (
          <div onClick={handleHeartTap} className="cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]">
            <MedicalHeartSVG beating={beating} />
          </div>
        )}

        {phase === "knock" && (
          <>
            <MedicalHeartSVG beating={false} />

            <div className="flex w-full max-w-sm flex-col gap-3">
              <div className="self-end animate-section-fade">
                <div className="rounded-2xl rounded-br-md border border-white/15 bg-gradient-to-l from-rose-500/20 to-pink-500/10 px-4 py-2.5 backdrop-blur-sm">
                  <p className="text-xs font-bold tracking-wide text-rose-200/60">You</p>
                  <p className="mt-0.5 text-base font-bold text-white/90">knock knock</p>
                </div>
              </div>
              <div className="self-start animate-section-fade" style={{ animationDelay: "0.3s" }}>
                <div className="rounded-2xl rounded-bl-md border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <p className="text-xs font-bold tracking-wide text-white/40">Heart</p>
                  <p className="mt-0.5 text-base font-bold text-rose-300">Who?</p>
                </div>
              </div>
            </div>

            <button onClick={handleKnockTap} className="premium-button animate-section-fade" style={{ animationDelay: "0.6s" }}>
              Let me in
            </button>
          </>
        )}

        {phase === "password" && (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
              <MedicalHeartSVG beating={false} />
            </div>
            <form onSubmit={handlePasswordSubmit} className="relative z-10 w-full rounded-[2rem] border border-white/15 bg-black/40 p-6 shadow-glow backdrop-blur-xl sm:p-8">
              <div className="mb-2 text-center text-4xl">🔐</div>
              <p className="text-center text-base font-bold text-white/90">{passwordQuestion}</p>
              <div className="mt-6 space-y-3">
                <input
                  type="password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                  placeholder="Enter the password..."
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-center text-sm font-bold text-white outline-none transition-all placeholder:text-white/30 focus:ring-2 ${passwordError ? "border-rose-400/60 ring-2 ring-rose-400/30" : "border-white/15 focus:border-rose-300/50 focus:ring-rose-300/20"}`}
                  autoFocus
                />
                {passwordError && <p className="text-center text-xs font-bold text-rose-400">That&apos;s not the right key. Try again.</p>}
                <button type="submit" className="premium-button w-full">Unlock</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
