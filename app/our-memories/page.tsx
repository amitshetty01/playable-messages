"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const PINK = "#d4899e";
const CREAM = "#faf5f0";
const BROWN = "#3d2c2c";
const MUTED = "#8c7a7a";
const HEART = "#e8a0bf";
const GOLD = "#c9a87c";

/* ─── Utilities ─── */

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/* ─── Paper grain overlay ─── */
function PaperTexture() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "256px 256px",
    }} />
  );
}

/* ─── Page edge shadow (book-like) ─── */
function PageEdgeShadow() {
  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-[2] h-full w-8" style={{ background: `linear-gradient(to right, ${BROWN}08, transparent)` }} />
      <div className="pointer-events-none fixed right-0 top-0 z-[2] h-full w-8" style={{ background: `linear-gradient(to left, ${BROWN}08, transparent)` }} />
    </>
  );
}

/* ─── Floating hearts ─── */
function Hearts() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="absolute animate-float-up" style={{
          left: `${Math.random() * 100}%`,
          bottom: "-10%",
          width: 10 + Math.random() * 28,
          height: 10 + Math.random() * 28,
          opacity: 0.25 + Math.random() * 0.45,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${16 + Math.random() * 20}s`,
        }}>
          <svg viewBox="0 0 24 24" fill={HEART} className="h-full w-full" style={{ filter: `drop-shadow(0 0 6px ${HEART}44)` }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── Twinkle stars ─── */
function Stars() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} className="absolute rounded-full animate-twinkle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: 2 + Math.random() * 4,
          height: 2 + Math.random() * 4,
          background: i % 3 === 0 ? GOLD : PINK,
          opacity: 0,
          boxShadow: `0 0 ${4 + Math.random() * 6}px ${i % 2 === 0 ? GOLD : PINK}`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${2.5 + Math.random() * 4}s`,
        }} />
      ))}
    </div>
  );
}

/* ─── Section divider ─── */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="h-px w-8" style={{ background: `linear-gradient(to right, transparent, ${PINK}33)` }} />
      <span className="text-xs" style={{ color: GOLD }}>✿</span>
      <div className="h-px w-8" style={{ background: `linear-gradient(to left, transparent, ${PINK}33)` }} />
    </div>
  );
}

/* ─── Scroll reveal ─── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); o.unobserve(el); } },
      { threshold: 0.1 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${vis ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-[0.97] opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Parallax ─── */
function Parallax({ children, speed = 0.3, elRef }: { children: React.ReactNode; speed?: number; elRef?: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = elRef?.current || ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    setOffset((center - viewCenter - scrollY + window.innerHeight) * speed * 0.1);
  }, [scrollY, speed, elRef]);
  return <div ref={ref} style={{ transform: `translateY(${Math.max(-60, Math.min(60, offset))}px)` }}>{children}</div>;
}

/* ─── Staggered word reveal ─── */
function StaggerText({ text, className = "", style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); o.unobserve(el); } },
      { threshold: 0.3 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <div ref={ref} className={`flex flex-wrap justify-center gap-x-[0.3em] ${className}`} style={style}>
      {words.map((w, i) => (
        <span key={i} className="transition-all duration-500 ease-out" style={{
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(12px)",
          transitionDelay: `${i * 60}ms`,
        }}>
          {w}
        </span>
      ))}
    </div>
  );
}

/* ─── Grand Finale ─── */
function GrandFinale() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { o.unobserve(el); setStage(1); setTimeout(() => setStage(2), 800); setTimeout(() => setStage(3), 2000); } },
      { threshold: 0.2 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  const COLORS = ["#d4899e", "#c9a87c", "#b56576", "#e8a0bf", "#f4c7d4", "#e8d5b7", "#a67c52", "#d4a0b4"];
  const burstParticles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    angle: (i / 60) * 360,
    distance: 30 + Math.random() * 70,
    size: 4 + Math.random() * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 3,
  }));
  const fallParticles = Array.from({ length: 40 }, (_, i) => ({
    id: i + 60,
    left: Math.random() * 100,
    delay: 0.5 + Math.random() * 3,
    duration: 4 + Math.random() * 5,
    size: 6 + Math.random() * 12,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    isHeart: Math.random() > 0.65,
  }));
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {stage >= 1 && burstParticles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;
        return (
          <div key={p.id} className="absolute" style={{
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: "50%",
            opacity: 0,
            animation: `grand-burst ${p.duration}s ease-out ${p.delay}s forwards`,
            "--tx": `${tx}vw`,
            "--ty": `${ty}vh`,
          } as React.CSSProperties} />
        );
      })}
      {stage >= 2 && fallParticles.map((p) =>
        p.isHeart ? (
          <div key={p.id} className="absolute" style={{
            left: `${p.left}%`,
            top: "-20px",
            width: p.size * 1.2,
            height: p.size * 1.2,
            opacity: 0,
            animation: `petal-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}>
            <svg viewBox="0 0 24 24" fill={p.color} className="h-full w-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ) : (
          <div key={p.id} className="absolute" style={{
            left: `${p.left}%`,
            top: "-12px",
            width: p.size * 0.5,
            height: p.size,
            background: p.color,
            borderRadius: "40% 0",
            opacity: 0,
            transform: `rotate(${p.rotation}deg)`,
            animation: `petal-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }} />
        )
      )}
      {stage >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center" style={{
          background: `radial-gradient(circle at 50% 50%, ${GOLD}18, transparent 60%)`,
          animation: "fade-in-glow 1.5s ease-out forwards",
        }} />
      )}
    </div>
  );
}

/* ─── Wax seal stamp ─── */
function WaxSeal({ color = PINK }: { color?: string }) {
  return (
    <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full shadow-lg" style={{
      background: `radial-gradient(circle at 35% 35%, ${color}, ${color}dd)`,
      boxShadow: `0 4px 16px ${color}44, inset 0 1px 0 ${color}88`,
    }}>
      <span className="text-xl">❤️</span>
    </div>
  );
}

/* ─── Pressed flower SVG ─── */
function PressedFlower({ className = "", color = PINK, size = 40 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity: 0.15 }}>
      <circle cx="20" cy="14" r="6" fill={color} />
      <circle cx="14" cy="20" r="6" fill={color} />
      <circle cx="26" cy="20" r="6" fill={color} />
      <circle cx="20" cy="26" r="6" fill={color} />
      <circle cx="20" cy="20" r="5" fill={color} />
    </svg>
  );
}

/* ─── Ambient sound (Web Audio API soft pad) ─── */
function useAmbientPad() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = useCallback(() => {
    if (playing) {
      nodesRef.current?.osc1.stop();
      nodesRef.current?.osc2.stop();
      nodesRef.current?.lfo.stop();
      ctxRef.current?.close();
      nodesRef.current = null;
      ctxRef.current = null;
      setPlaying(false);
    } else {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      osc1.type = "sine"; osc1.frequency.value = 196;
      osc2.type = "sine"; osc2.frequency.value = 293.66;
      osc2.detune.value = -5;
      gain.gain.value = 0.06;
      lfo.type = "sine"; lfo.frequency.value = 0.15;
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain); lfoGain.connect(gain.gain);
      osc1.connect(gain); osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start(); osc2.start(); lfo.start();
      nodesRef.current = { osc1, osc2, gain, lfo };
      setPlaying(true);
    }
  }, [playing]);
  useEffect(() => () => {
    nodesRef.current?.osc1.stop(); nodesRef.current?.osc2.stop(); nodesRef.current?.lfo.stop();
    ctxRef.current?.close();
  }, []);
  return { playing, toggle };
}

function SoundToggle() {
  const { playing, toggle } = useAmbientPad();
  return (
    <button onClick={toggle} className="fixed bottom-6 left-6 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition hover:scale-110" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(201,168,124,0.3)" }} title={playing ? "Pause music" : "Play music"}>
      <span className="text-sm">{playing ? "🔊" : "🔇"}</span>
    </button>
  );
}

/* ─── Scroll-driven vignette ─── */
function VignetteOverlay() {
  const scrollY = useScrollY();
  const intensity = Math.min(scrollY / 2000, 0.35);
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] transition-all duration-500" style={{
      boxShadow: `inset 0 0 ${80 + intensity * 200}px rgba(61,44,44,${intensity})`,
    }} />
  );
}

/* ─── Photo lightbox ─── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", animation: "fade-in-glow 0.3s ease-out" }} onClick={onClose}>
      <img src={src} alt="" className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl" style={{ animation: "final-zoom-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both" }} onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition hover:bg-white/15 hover:text-white" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  );
}

/* ─── Days counter ─── */
function DaysCounter({ startDate }: { startDate: string }) {
  const [days, setDays] = useState<number | null>(null);
  const [formatted, setFormatted] = useState("");
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!startDate) { setDays(null); setFormatted(""); setDisplay(0); return; }
    const start = new Date(startDate);
    if (isNaN(start.getTime())) { setDays(null); setFormatted(""); setDisplay(0); return; }
    const now = new Date();
    const d = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    setDays(d);
    setFormatted(start.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    let count = 0;
    const step = Math.max(1, Math.floor(d / 40));
    const iv = setInterval(() => {
      count += step;
      if (count >= d) { count = d; clearInterval(iv); }
      setDisplay(count);
    }, 30);
    return () => clearInterval(iv);
  }, [startDate]);
  if (days === null) return (
    <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] italic tracking-wide" style={{ background: `${PINK}12`, color: `${MUTED}aa` }}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={PINK}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      Set your start date
    </span>
  );
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black tabular-nums tracking-tight" style={{
          color: GOLD,
          fontFamily: "'Fraunces', Georgia, serif",
          textShadow: `0 0 40px ${GOLD}44, 0 0 80px ${GOLD}22`,
          lineHeight: 1,
        }}>
          {display.toLocaleString()}
        </span>
        <span className="text-lg font-medium tracking-wide" style={{ color: PINK, fontFamily: "'Caveat', cursive" }}>
          days of us
        </span>
      </div>
      {formatted && (
        <div className="mt-1 flex items-center gap-2">
          <span className="h-px w-6" style={{ background: `linear-gradient(to right, transparent, ${GOLD}66)` }} />
          <span className="text-[10px] font-light tracking-[0.25em] uppercase" style={{ color: `${GOLD}aa` }}>
            Since {formatted}
          </span>
          <span className="h-px w-6" style={{ background: `linear-gradient(to right, ${GOLD}66, transparent)` }} />
        </div>
      )}
    </div>
  );
}

const DEFAULT = {
  heroHeading: "Hey Cutie \u2764\ufe0f",
  heroSubtitle: "I collected every heartbeat, every laugh, every quiet glance between us and tucked them somewhere safe. This is that place. This is us. Take your time\u2026 some feelings don't rush.",
  heroImage: "/models/assets/Cat%20kiss.gif",
  introText: "I could tell you about a thousand moments. But some feelings can only be felt, not explained. These are the ones that still make my heart beat faster.",
  pics: [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&h=800&fit=crop&auto=format",
  ],
  memories: [
    { title: "The First Time My World Stopped", caption: "I didn't just see you that day. I felt you. And something in me knew\u2014you were going to matter more than anyone ever had.", note: "Your smile didn't just make me happy. It made me believe in love at first sight. Because that's exactly what it was." },
    { title: "You, in the Silence", caption: "It was never about where we were. It was about the way your hand fit perfectly in mine, like it was always meant to be there.", note: "Nobody saw us in those quiet moments. And maybe that's why they're so beautiful. Just you, just me, just real." },
    { title: "The Memory I'd Live In Forever", caption: "If I could freeze one moment in time, it would be this one\u2014the exact second I realized I never wanted to love anyone but you.", note: "I don't just want to remember this moment. I want to feel it over and over again, until my last breath." },
  ],
  interludeQuotes: [
    "Some memories don't fade. They stay in your chest and breathe with you.",
    "Not every moment becomes a memory. But you\u2014you became my everything.",
    "Some feelings don't need words. They just need to be held.",
  ],
  quoteText: "I used to think the best part was remembering.<br />Then I realized\u2014the best part is that we're still writing our story.",
  promisesHeading: "I Swear On Every Beat Of My Heart \u2764\ufe0f",
  promises: [
    "I promise to love you not just when it's easy, but especially when it's hard.",
    "I promise to be the reason you smile, even on days when your heart feels heavy.",
    "I promise to protect your heart like it's the most precious thing I've ever held\u2014because it is.",
    "I promise to chase away your storms and stay in the rain with you until the sun comes back.",
    "I promise to never stop choosing you\u2014not just today, not just tomorrow, but every single day for the rest of my life.",
  ],
  finalLines: [
    "Thank you for being the best part of every single one of my days.",
    "I don't want to live in the past\u2014because the past isn't where you are.",
    "I want every sunrise, every sunset, every breath in between\u2014with you. Always you.",
  ],
  endingImage: "/models/assets/asset%2002.png",
  closingQuote: "Some people search their whole lives for what we found. I stopped searching the day I found you\u2014and I'll never need to look again.",
  signature: "From your one and only",
  startDate: "",
};
const MAX_IMAGES = 5;

/* ─── Edit Drawer ─── */
function EditField({ label, value, onChange, type = "text", rows, hint }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number; hint?: string }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>{label}</span>
      {rows ? (
        <textarea className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2" style={{ borderColor: `${BROWN}22`, background: "#fff", color: BROWN, resize: "vertical", minHeight: 50 + rows * 10 }} value={value} onChange={e => onChange(e.target.value)} rows={rows} />
      ) : (
        <input type={type} className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2" style={{ borderColor: `${BROWN}22`, background: "#fff", color: BROWN }} value={value} onChange={e => onChange(e.target.value)} />
      )}
      {hint && <span className="mt-0.5 block text-[10px]" style={{ color: MUTED }}>{hint}</span>}
    </label>
  );
}

function EditDrawer({ d, setD, onClose }: { d: typeof DEFAULT; setD: React.Dispatch<React.SetStateAction<typeof DEFAULT>>; onClose: () => void }) {
  const customCount = [d.heroImage, ...d.pics, d.endingImage].filter(u => u && !u.startsWith("/models/assets/") && !u.startsWith("https://images.unsplash.com/")).length;
  const imagesRemaining = MAX_IMAGES - customCount;

  const update = (path: string, value: any) => setD(prev => {
    const copy = JSON.parse(JSON.stringify(prev));
    const keys = path.split(".");
    let o = copy;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
    o[keys[keys.length - 1]] = value;
    return copy;
  });

  const resetAll = () => {
    if (confirm("Reset all content to defaults?")) setD({ ...DEFAULT, pics: [...DEFAULT.pics], memories: DEFAULT.memories.map(m => ({ ...m })), interludeQuotes: [...DEFAULT.interludeQuotes], promises: [...DEFAULT.promises], finalLines: [...DEFAULT.finalLines] });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[200] w-full max-w-md overflow-y-auto shadow-2xl" style={{ background: CREAM, borderLeft: `1px solid ${GOLD}33` }}>
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4" style={{ background: CREAM, borderBottom: `1px solid ${GOLD}22` }}>
        <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif", color: BROWN }}>Customize</h2>
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={BROWN} strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>
      <div className="space-y-6 px-5 py-6">
        {/* ── Start Date ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Your Start Date</h3>
          <label className="mb-3 block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>Start Date (YYYY-MM-DD)</span>
            <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2" style={{ borderColor: `${BROWN}22`, background: "#fff", color: BROWN }} value={d.startDate} onChange={e => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
              let f = digits;
              if (digits.length > 4) f = digits.slice(0, 4) + "-" + digits.slice(4);
              if (digits.length > 6) f = f.slice(0, 7) + "-" + f.slice(7);
              update("startDate", f);
            }} placeholder="YYYY-MM-DD" />
            <span className="mt-0.5 block text-[10px]" style={{ color: MUTED }}>Used for the 'X days of us' counter</span>
          </label>
        </div>
        {/* ── Hero ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Hero</h3>
          <EditField label="Heading" value={d.heroHeading} onChange={v => update("heroHeading", v)} />
          <EditField label="Subtitle" value={d.heroSubtitle} onChange={v => update("heroSubtitle", v)} rows={3} />
          <EditField label="Image URL" value={d.heroImage} onChange={v => update("heroImage", v)} hint={`Remaining image slots: ${imagesRemaining}`} />
        </div>
        {/* ── Intro ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Intro</h3>
          <EditField label="Text" value={d.introText} onChange={v => update("introText", v)} rows={3} />
        </div>
        {/* ── Memories ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Memories</h3>
          {d.memories.map((m, i) => (
            <div key={i} className="mb-4 rounded-lg p-3" style={{ background: `${PINK}08`, border: `1px solid ${PINK}15` }}>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>Memory {i + 1}</p>
              <EditField label="Photo URL" value={d.pics[i]} onChange={v => update(`pics.${i}`, v)} hint={`Remaining: ${imagesRemaining}`} />
              <EditField label="Title" value={m.title} onChange={v => update(`memories.${i}.title`, v)} />
              <EditField label="Caption" value={m.caption} onChange={v => update(`memories.${i}.caption`, v)} rows={2} />
              <EditField label="Flip Note" value={m.note} onChange={v => update(`memories.${i}.note`, v)} rows={2} />
            </div>
          ))}
        </div>
        {/* ── Interlude Quotes ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Interlude Quotes</h3>
          {d.interludeQuotes.map((q, i) => (
            <EditField key={i} label={`Quote ${i + 1}`} value={q} onChange={v => update(`interludeQuotes.${i}`, v)} rows={2} />
          ))}
        </div>
        {/* ── Quote Section ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Quote Section</h3>
          <EditField label="Text (use &lt;br/&gt; for line break)" value={d.quoteText} onChange={v => update("quoteText", v)} rows={2} />
        </div>
        {/* ── Promises ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Promises</h3>
          <EditField label="Heading" value={d.promisesHeading} onChange={v => update("promisesHeading", v)} />
          {d.promises.map((p, i) => (
            <EditField key={i} label={`Promise ${i + 1}`} value={p} onChange={v => update(`promises.${i}`, v)} rows={2} />
          ))}
        </div>
        {/* ── Final Message ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Final Message</h3>
          {d.finalLines.map((l, i) => (
            <EditField key={i} label={`Line ${i + 1}`} value={l} onChange={v => update(`finalLines.${i}`, v)} rows={2} />
          ))}
          <EditField label="Ending Image URL" value={d.endingImage} onChange={v => update("endingImage", v)} hint={`Remaining: ${imagesRemaining}`} />
        </div>
        {/* ── Closing ── */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: PINK }}>Closing</h3>
          <EditField label="Quote" value={d.closingQuote} onChange={v => update("closingQuote", v)} rows={2} />
          <EditField label="Signature" value={d.signature} onChange={v => update("signature", v)} />
        </div>
        {/* ── Reset ── */}
        <button onClick={resetAll} className="w-full rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition hover:opacity-80" style={{ background: `${BROWN}0a`, color: MUTED, border: `1px solid ${BROWN}15` }}>
          Reset to defaults
        </button>
        <p className="text-center text-[10px]" style={{ color: MUTED }}>Changes save automatically</p>
      </div>
    </div>
  );
}

const DEFAULT_PREFIXES = ["/models/assets/", "https://images.unsplash.com/"];
function isCustomImage(url: string): boolean {
  return !DEFAULT_PREFIXES.some(p => url.startsWith(p));
}

export default function OurMemoriesPage() {
  const [mounted, setMounted] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [d, setD] = useState<typeof DEFAULT>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("our-memories-content");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return { ...DEFAULT, pics: [...DEFAULT.pics], memories: DEFAULT.memories.map(m => ({ ...m })), interludeQuotes: [...DEFAULT.interludeQuotes], promises: [...DEFAULT.promises], finalLines: [...DEFAULT.finalLines] };
  });

  useEffect(() => {
    setMounted(true);
    if (window.location.search.includes("edit=true")) setEditOpen(true);
  }, []);
  useEffect(() => { try { localStorage.setItem("our-memories-content", JSON.stringify(d)); } catch {} }, [d]);

  const handlePhotoClick = useCallback((src: string, index: number) => {
    if (!isCustomImage(src)) return;
    setFlippedIndex(index);
    setTimeout(() => {
      setFlippedIndex(null);
      setLightboxSrc(src);
    }, 900);
  }, []);

  const { pics, memories, interludeQuotes, promises, finalLines } = d;

  return (
    <div style={{ background: CREAM, color: BROWN, fontFamily: "'Nunito Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        body { background: ${CREAM} !important; }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.6); }
        }
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg) scale(0.3); opacity: 0; }
          8% { opacity: 0.8; }
          85% { opacity: 0.4; }
          100% { transform: translateY(-120vh) rotate(420deg) scale(1.1); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px ${PINK}22, 0 24px 80px ${PINK}22; }
          50% { box-shadow: 0 0 50px ${PINK}33, 0 24px 80px ${PINK}33; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.18); }
          28% { transform: scale(1); }
          42% { transform: scale(1.12); }
          56% { transform: scale(1); }
        }
        @keyframes slow-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes grand-burst {
          0% { opacity: 0; transform: translate(0, 0) scale(0.3); }
          20% { opacity: 1; transform: translate(calc(var(--tx) * 0.4), calc(var(--ty) * 0.4)) scale(1); }
          60% { opacity: 0.8; transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) * 0.8)) scale(0.8); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.2); }
        }
        @keyframes petal-fall {
          0% { transform: translateY(0) rotate(0deg) scale(0.6); opacity: 0; }
          8% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          100% { transform: translateY(110vh) rotate(360deg) scale(0.3); opacity: 0; }
        }
        @keyframes fade-in-glow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes final-zoom-in {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes flip-card {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
        @keyframes flip-card-back {
          0% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes light-leak {
          0% { transform: translateX(-120%) rotate(-20deg); opacity: 0; }
          15% { opacity: 0.4; }
          60% { opacity: 0.15; }
          100% { transform: translateX(200%) rotate(-20deg); opacity: 0; }
        }
        html { scroll-behavior: smooth; }
body::before, body::after { display: none !important; }
header, footer { display: none !important; }
[class*="min-h-[90px]"] { display: none !important; }
main#content ~ * { display: none !important; }
main#content { max-width: 100% !important; padding: 0 !important; margin: 0 !important; min-height: 100svh !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${CREAM}; }
        ::-webkit-scrollbar-thumb { background: ${PINK}55; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${PINK}88; }
      `}</style>

      <PaperTexture />
      <PageEdgeShadow />
      {mounted && <Hearts />}
      {mounted && <Stars />}
      <SoundToggle />
      <VignetteOverlay />
      <button onClick={() => setEditOpen(true)} className="fixed right-4 top-2 z-[300] flex items-center gap-2 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm transition hover:scale-105" style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(201,168,124,0.3)" }} title="Customize page">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke={BROWN} strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        <span className="text-xs font-bold" style={{ color: BROWN }}>Edit</span>
      </button>

      {/* ───── HERO ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Parallax speed={0.12}>
          <div className={`max-w-2xl transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
            <div className="mx-auto mb-10 h-72 w-72 overflow-hidden rounded-3xl ring-4 sm:h-80 sm:w-80" style={{ borderColor: "#f0e4d8", animation: "pulse-glow 4s ease-in-out infinite" }}>
              <img src={d.heroImage || "/models/assets/Cat%20kiss.gif"} alt="" className="h-full w-full object-cover" onClick={() => { const u = d.heroImage || "/models/assets/Cat%20kiss.gif"; if (isCustomImage(u)) setLightboxSrc(u); }} style={isCustomImage(d.heroImage || "") ? { cursor: "pointer" } : {}} />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: PINK }}>
              {d.heroHeading}
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed sm:text-lg" style={{ color: MUTED }}>
              {d.heroSubtitle}
            </p>
            <div className="mt-10">
              <div className="relative mx-auto inline-block rounded-2xl px-8 py-5" style={{
                background: `linear-gradient(135deg, ${PINK}08, ${GOLD}06)`,
                border: `1px solid ${GOLD}22`,
                boxShadow: `0 0 60px ${GOLD}15, inset 0 0 60px ${GOLD}08`,
              }}>
                <div className="pointer-events-none absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 rounded-tl" style={{ borderColor: GOLD }} />
                <div className="pointer-events-none absolute -right-2 -top-2 h-5 w-5 border-r-2 border-t-2 rounded-tr" style={{ borderColor: GOLD }} />
                <div className="pointer-events-none absolute -bottom-2 -left-2 h-5 w-5 border-b-2 border-l-2 rounded-bl" style={{ borderColor: GOLD }} />
                <div className="pointer-events-none absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 rounded-br" style={{ borderColor: GOLD }} />
                <p className="mb-3 text-[9px] tracking-[0.35em] uppercase" style={{ color: `${GOLD}aa`, fontFamily: "'Fraunces', Georgia, serif" }}>
                  We've been together for
                </p>
                <DaysCounter startDate={d.startDate} />
                <div className="mx-auto mt-3 flex items-center gap-2">
                  <span className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}44)` }} />
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill={GOLD}><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"/></svg>
                  <span className="h-px flex-1" style={{ background: `linear-gradient(to right, ${GOLD}44, transparent)` }} />
                </div>
              </div>
            </div>
            <div className="mt-14 flex flex-col items-center gap-3">
              <div className="h-12 w-px" style={{ background: `linear-gradient(to bottom, ${PINK}55, transparent)` }} />
              <span className="animate-pulse text-[10px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>Come closer</span>
            </div>
          </div>
        </Parallax>
      </section>

      {/* ───── INTRO ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Parallax speed={-0.08}>
            <StaggerText text={d.introText} className="mx-auto max-w-xl text-xl font-light leading-relaxed sm:text-2xl lg:text-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: MUTED }} />
            <div className="mt-4 flex justify-center gap-4">
              <PressedFlower color={PINK} size={28} />
              <PressedFlower color={GOLD} size={22} className="mt-2" />
              <PressedFlower color={PINK} size={28} />
            </div>
            <Divider />
          </Parallax>
        </Reveal>
      </section>

      {/* ───── OUR MEMORIES ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto w-full max-w-lg">
          {memories.map((m, i) => (
            <div key={i}>
              <Reveal delay={i * 120}>
                <Parallax speed={i === 0 ? 0.08 : i === 1 ? 0 : -0.08}>
                  <div className="group relative mx-auto w-full max-w-sm transition-all duration-700 hover:shadow-2xl" style={{
                    transform: `rotate(${((i % 5) - 2) * 2}deg)`,
                    borderRadius: 16,
                    background: "#fff",
                    border: "1px solid rgba(201,168,124,0.25)",
                    boxShadow: `0 12px 48px ${BROWN}0d`,
                  }}>
                    <div className="absolute -bottom-px -right-px z-10 h-8 w-8 overflow-hidden rounded-br-[16px]" style={{ background: CREAM }}>
                      <div className="absolute -bottom-2 -right-2 h-6 w-6 rotate-45 shadow-md" style={{ background: CREAM, boxShadow: `-2px -2px 8px ${BROWN}15` }} />
                    </div>
                    {/* ─── Film strip top ─── */}
                    <div className="flex items-center justify-center gap-[6px] px-3 pt-2" style={{ background: "#fff" }}>
                      {Array.from({ length: 28 }, (_, j) => (
                        <div key={j} className="h-[7px] w-[3px] shrink-0 rounded-sm" style={{ background: `${BROWN}18` }} />
                      ))}
                    </div>
                    {/* ─── Flip card ─── */}
                    <div onClick={() => handlePhotoClick(pics[i], i)} className="relative cursor-pointer" style={{ perspective: "1200px" }}>
                      <div className="relative transition-all duration-700" style={{
                        transform: flippedIndex === i ? "rotateY(180deg)" : "rotateY(0deg)",
                        transformStyle: "preserve-3d",
                      }}>
                        {/* Front: photo */}
                        <div className="relative overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                          <img src={pics[i]} alt={m.title} className="h-96 w-full object-cover transition-all duration-700 group-hover:scale-105 sm:h-[32rem]" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          {/* Light leak */}
                          <div className="pointer-events-none absolute inset-0" style={{
                            animation: `light-leak 2.5s ease-out ${0.5 + i * 0.8}s forwards`,
                          }}>
                            <div className="absolute -left-[10%] top-[-10%] h-[120%] w-[35%]" style={{
                              background: `linear-gradient(135deg, ${GOLD}30, ${PINK}20, transparent 60%)`,
                              transform: "rotate(-20deg)",
                            }} />
                          </div>
                          <div className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-white/60 rounded-tl" />
                          <div className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-white/60 rounded-tr" />
                          <div className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-white/60 rounded-bl" />
                          <div className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-white/60 rounded-br" />
                        </div>
                        {/* Back: handwritten note */}
                        <div className="absolute inset-0 flex items-center justify-center rounded-t-[16px] p-6" style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          background: CREAM,
                        }}>
                          <p className="text-center leading-relaxed" style={{
                            fontFamily: "'Caveat', cursive",
                            fontSize: "1.25rem",
                            color: BROWN,
                            transform: "rotate(-1.5deg)",
                          }}>
                            {m.note}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* ─── Film strip bottom ─── */}
                    <div className="flex items-center justify-center gap-[6px] px-3 pb-2" style={{ background: "#fff" }}>
                      {Array.from({ length: 28 }, (_, j) => (
                        <div key={j} className="h-[7px] w-[3px] shrink-0 rounded-sm" style={{ background: `${BROWN}18` }} />
                      ))}
                    </div>
                    <div className="space-y-1.5 px-5 py-5">
                      <h3 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif", color: BROWN }}>
                        {m.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem", color: MUTED }}>
                        {m.caption}
                      </p>
                    </div>
                  </div>
                </Parallax>
              </Reveal>
              {i < memories.length - 1 && (
                <Reveal delay={i * 120 + 100}>
                  <div className="my-16 text-center">
                    <p className="text-sm font-light italic tracking-wide" style={{ color: MUTED }}>
                      {interludeQuotes[i]}
                    </p>
                    <Divider />
                  </div>
                </Reveal>
              )}
            </div>
          ))}
          <Reveal delay={500}>
            <div className="mt-20 text-center">
              <Divider />
              <p className="text-2xl font-bold tracking-wide" style={{
                fontFamily: "'Caveat', cursive", color: PINK, fontSize: "1.6rem",
              }}>
                {d.signature}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── QUOTE ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Parallax speed={0.1}>
            <div className="relative mx-auto max-w-2xl rounded-3xl px-8 py-16 backdrop-blur-sm sm:px-12 sm:py-20" style={{
              background: `linear-gradient(135deg, ${PINK}06, ${PINK}12)`,
              border: `1px solid ${PINK}22`,
            }}>
              <PressedFlower color={PINK} size={32} className="absolute -left-3 -top-3" />
              <PressedFlower color={GOLD} size={24} className="absolute -right-2 -bottom-2" />
              <span className="text-3xl sm:text-4xl" style={{ color: PINK }}>&ldquo;</span>
              <p className="-mt-2 text-2xl font-light italic leading-relaxed sm:text-3xl lg:text-4xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: PINK }} dangerouslySetInnerHTML={{ __html: d.quoteText }} />
              <span className="mt-2 block text-right text-3xl sm:text-4xl" style={{ color: PINK }}>&rdquo;</span>
            </div>
          </Parallax>
        </Reveal>
      </section>

      {/* ───── PROMISES ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto w-full max-w-lg">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: PINK }}>
              {d.promisesHeading}
            </h2>
          </Reveal>
          <div className="space-y-4">
            {promises.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group rounded-2xl px-6 py-5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]" style={{
                  background: "#fff",
                  border: "1px solid rgba(201,168,124,0.2)",
                  boxShadow: `0 4px 20px ${BROWN}08`,
                }}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-lg transition-transform duration-300 group-hover:scale-125" style={{ color: PINK, animation: `heartbeat 2s ease-in-out ${i * 0.3}s infinite` }}>
                      ♥
                    </span>
                    <p className="text-base font-medium leading-relaxed sm:text-lg" style={{ color: BROWN }}>
                      {p}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL MESSAGE ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-xl">
          <Reveal delay={100}>
            <div className="mx-auto mb-12 h-56 w-56 overflow-hidden rounded-3xl shadow-xl ring-4 sm:h-64 sm:w-64" style={{ borderColor: GOLD, animation: "pulse-glow 4s ease-in-out infinite", boxShadow: `0 0 60px ${GOLD}33` }}>
              <img src={d.endingImage || "/models/assets/asset%2002.png"} alt="" className="h-full w-full animate-[slow-zoom_20s_ease-in-out_infinite] object-contain" onClick={() => { const u = d.endingImage || "/models/assets/asset%2002.png"; if (isCustomImage(u)) setLightboxSrc(u); }} style={isCustomImage(d.endingImage || "") ? { cursor: "pointer" } : {}} />
            </div>
          </Reveal>
          <div className="space-y-3">
            {finalLines.map((line, i) => (
              <Reveal key={i} delay={200 + i * 150}>
                <p className="text-xl font-light leading-relaxed sm:text-2xl" style={{ color: BROWN }}>{line}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={700}>
            <Divider />
          </Reveal>
          <Reveal delay={900}>
            <WaxSeal color={PINK} />
          </Reveal>
        </div>
      </section>

      {/* ───── CLOSING ───── */}
      <section className="relative z-10 px-6 pb-24 pt-4 text-center">
        <div className="mx-auto max-w-lg">
          <Reveal delay={200}>
            <div className="flex items-center justify-center gap-4 py-6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}44)` }} />
              <span className="text-lg" style={{ color: GOLD }}>✿</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}44)` }} />
            </div>
            <p className="text-base font-light italic leading-relaxed" style={{ color: MUTED, fontFamily: "'Caveat', cursive", fontSize: "1.3rem" }}>
              {d.closingQuote}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mx-auto mt-10 flex items-center gap-3 rounded-full px-10 py-4 text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 hover:shadow-2xl" style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD}bb)`,
              color: "#fff",
              boxShadow: `0 8px 40px ${GOLD}44, 0 0 0 1px ${GOLD}22`,
            }}>
              <span style={{ animation: "heartbeat 1.5s ease-in-out infinite", display: "inline-block" }}>♥</span>
              Read again
            </button>
          </Reveal>
        </div>
      </section>

      <GrandFinale />
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      {editOpen && (
        <>
          <div className="fixed inset-0 z-[199] bg-black/20 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <EditDrawer d={d} setD={setD} onClose={() => setEditOpen(false)} />
        </>
      )}
    </div>
  );
}
