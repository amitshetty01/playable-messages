"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

const DEFAULT_RULES = [
  "Good morning texts are mandatory every single day.",
  "Stealing fries from each other's plate is always allowed.",
  "Silent treatment lasting over 30 minutes is strictly illegal.",
  "Random hugs are compulsory — no warning required.",
  "Going to sleep angry is a violation of this contract.",
  "The last slice of pizza belongs to whoever says 'dibs' first.",
];

const DEFAULT_PROMISES = [
  "I promise to support your dreams, no matter how wild they get.",
  "I promise to annoy you forever and never run out of material.",
  "I promise to protect your smile like it's the most important thing in the world.",
  "I promise to choose you every single day, even the hard ones.",
  "I promise to be your peace when the world gets too loud.",
];

const DEFAULT_PENALTIES = [
  "Buy their favorite chocolate — no excuses.",
  "Plan a surprise pizza date within 48 hours.",
  "Mandatory movie night with their pick of the film.",
  "Unlimited cuddles for a full evening.",
  "Write a handwritten love letter and read it aloud.",
];

const SECRET_CLAUSE = "Even when life gets difficult, this contract renews every day as long as we choose each other.";

function WaxSealSVG({ size = 80, broken = false }: { size?: number; broken?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className="drop-shadow-xl">
      {broken && <motion.circle initial={{ r: 0 }} animate={{ r: 46 }} transition={{ duration: 0.5 }} cx="50" cy="50" r="46" fill="url(#sealGrad)" stroke="#b8860b" strokeWidth="3" />}
      {!broken && <circle cx="50" cy="50" r="46" fill="url(#sealGrad)" stroke="#b8860b" strokeWidth="3" />}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M50 20 L55 38 L74 38 L58 49 L64 68 L50 55 L36 68 L42 49 L26 38 L45 38 Z" fill="#d4af37" opacity="0.8" />
      <text x="50" y="64" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="serif">LOVE</text>
      <circle cx="50" cy="50" r="44" fill="none" stroke="#d4af37" strokeWidth="0.8" />
      {broken && (
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          d="M30 30 L45 45 M45 30 L30 45"
          stroke="#fff" strokeWidth="2" strokeLinecap="round"
        />
      )}
      <defs>
        <radialGradient id="sealGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c0392b" />
          <stop offset="70%" stopColor="#922b21" />
          <stop offset="100%" stopColor="#641e16" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M2 2 L38 2 M2 2 L2 38" stroke="#b8860b" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M2 2 L10 2 M2 2 L2 10" stroke="#d4af37" strokeWidth="2" strokeOpacity="0.6" />
    </svg>
  );
}

function SectionDivider() {
  return (
    <div className="my-8 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      <span className="text-[#d4af37]/40">✦</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
    </div>
  );
}

function playNote(ctx: AudioContext, freq: number, start: number, dur: number, vol = 0.04) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(start);
  o.stop(start + dur);
}

function playFanfare(ctx: AudioContext) {
  const notes = [523, 659, 784, 1047, 784, 1047, 1319];
  const dur = [0.15, 0.15, 0.15, 0.25, 0.12, 0.12, 0.4];
  let t = ctx.currentTime + 0.05;
  notes.forEach((f, i) => { playNote(ctx, f, t, dur[i]); t += dur[i] + 0.05; });
}

function playStamp(ctx: AudioContext) {
  playNote(ctx, 200, ctx.currentTime, 0.08, 0.08);
  playNote(ctx, 150, ctx.currentTime + 0.03, 0.12, 0.06);
}

function ConfettiRain() {
  const colors = ["#ff5fb7", "#d4af37", "#ff6b8a", "#ffd166", "#ff4d6d"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const size = 4 + Math.random() * 6;
        const drift = (Math.random() - 0.5) * 150;
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
            animate={{ y: "110vh", x: drift, rotate: Math.random() * 720, opacity: 0 }}
            transition={{ duration: 2 + Math.random() * 2, delay, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: 0,
              width: size,
              height: size * 1.2,
              background: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        );
      })}
    </div>
  );
}

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#b8860b]/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#b8860b] to-[#d4af37]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="font-serif text-[10px] text-[#3a1a0a]/40 whitespace-nowrap">
        {current}/{total} {label}
      </span>
    </div>
  );
}

export function LoveContractGame({ template, experience, mode }: Props) {
  const [partner1, setPartner1] = useState(experience.creatorName !== "Someone kind" ? experience.creatorName : "Alex");
  const [partner2, setPartner2] = useState(experience.receiverName !== "You" ? experience.receiverName : "Jordan");
  const [nickname1, setNickname1] = useState("");
  const [nickname2, setNickname2] = useState("");
  const [relDate, setRelDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear() - 2}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [rules] = useState<string[]>([...DEFAULT_RULES]);
  const [promises] = useState<string[]>([...DEFAULT_PROMISES]);
  const [penalties] = useState<string[]>([...DEFAULT_PENALTIES]);
  const [tickedRules, setTickedRules] = useState<Set<number>>(new Set());
  const [tickedPromises, setTickedPromises] = useState<Set<number>>(new Set());
  const [tickedPenalties, setTickedPenalties] = useState<Set<number>>(new Set());
  const [sealBroken, setSealBroken] = useState(false);
  const [recipientSignature, setRecipientSignature] = useState<string | null>(null);
  const [showSealed, setShowSealed] = useState(false);
  const [formMode, setFormMode] = useState(false);
  const [shakeSection, setShakeSection] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const isDrawing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rulesSectionRef = useRef<HTMLDivElement>(null);
  const promisesSectionRef = useRef<HTMLDivElement>(null);
  const penaltiesSectionRef = useRef<HTMLDivElement>(null);
  const secretSectionRef = useRef<HTMLDivElement>(null);
  const signSectionRef = useRef<HTMLDivElement>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new AudioContext();
    return audioRef.current;
  }, []);

  useEffect(() => { return () => { audioRef.current?.close(); }; }, []);

  const allTicked = tickedRules.size === rules.length && tickedPromises.size === promises.length && tickedPenalties.size === penalties.length;

  const toggleTick = (set: React.Dispatch<React.SetStateAction<Set<number>>>, idx: number) => {
    set(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  // Fix canvas coordinate mapping: match canvas internal size to rendered size
  useEffect(() => {
    if (!formMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = "#1a1527";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left,
        y: ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top,
      };
    };

    const startDraw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      isDrawing.current = true;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawing.current) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const endDraw = () => {
      isDrawing.current = false;
      setRecipientSignature(canvas.toDataURL());
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", endDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);
      window.removeEventListener("resize", resize);
    };
  }, [formMode]);

  const scrollToFirstIncomplete = () => {
    const missing: { ref: React.RefObject<HTMLDivElement | null>; id: string }[] = [];
    if (tickedRules.size < rules.length) missing.push({ ref: rulesSectionRef, id: "rules" });
    if (tickedPromises.size < promises.length) missing.push({ ref: promisesSectionRef, id: "promises" });
    if (tickedPenalties.size < penalties.length) missing.push({ ref: penaltiesSectionRef, id: "penalties" });
    if (!sealBroken) missing.push({ ref: secretSectionRef, id: "secret" });
    if (!recipientSignature) missing.push({ ref: signSectionRef, id: "signatures" });

    if (missing.length > 0) {
      const { ref, id } = missing[0];
      setShakeSection(id);
      setTimeout(() => setShakeSection(null), 800);
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSeal = () => {
    if (!allTicked || !recipientSignature) {
      scrollToFirstIncomplete();
      playStamp(getAudio());
      return;
    }
    playFanfare(getAudio());
    setShowSealed(true);
    setTimeout(() => {
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const formattedDate = relDate ? new Date(relDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  const totalAcks = rules.length + promises.length + penalties.length;
  const currentAcks = tickedRules.size + tickedPromises.size + tickedPenalties.size;

  if (!formMode) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "radial-gradient(ellipse at center, #1a0a1e 0%, #0d0a14 50%, #050308 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <motion.div
          initial={{ scale: 0.85, opacity: 0, rotateX: -10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative perspective-1000"
          style={{ perspective: "1000px" }}
        >
          <div className="mx-4 max-w-lg" style={{ transformStyle: "preserve-3d" }}>
            <div className="rounded-[2.5rem] border-2 border-amber-600/40 bg-gradient-to-b from-[#f5e6c8] via-[#ede0b8] to-[#e8d5a3] p-[3px] shadow-[0_0_60px_rgba(212,175,55,0.15)]">
              <div className="rounded-[2.3rem] bg-gradient-to-b from-[#fdf5e6] via-[#f5e6c8] to-[#ede0b8] p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23b8860b' fill-rule='evenodd' opacity='1'/%3E%3C/svg%3E\")" }} />
                <div className="relative text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }} className="mb-6 flex justify-center">
                    <WaxSealSVG size={100} />
                  </motion.div>
                  <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#3a1a0a]">
                    Relationship
                    <br />
                    <span className="text-[#b8860b]">Agreement</span>
                  </motion.h1>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9 }} className="mx-auto my-6 h-px w-3/4 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent" />
                  <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }} className="font-serif text-sm italic text-[#3a1a0a]/70">
                    "A legally unofficial contract written by two hearts."
                  </motion.p>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4 }}>
                    <div className="mt-6 space-y-3">
                      <input
                        value={partner1}
                        onChange={e => setPartner1(e.target.value)}
                        placeholder="Your name"
                        className="w-full max-w-xs rounded-xl border border-[#b8860b]/30 bg-white/80 px-4 py-2.5 font-serif text-sm text-[#3a1a0a] placeholder:text-[#3a1a0a]/30 outline-none focus:border-[#b8860b]"
                      />
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-serif text-xs text-[#3a1a0a]/50">&</span>
                        <input
                          value={partner2}
                          onChange={e => setPartner2(e.target.value)}
                          placeholder="Their name"
                          className="w-full max-w-xs rounded-xl border border-[#b8860b]/30 bg-white/80 px-4 py-2.5 font-serif text-sm text-[#3a1a0a] placeholder:text-[#3a1a0a]/30 outline-none focus:border-[#b8860b]"
                        />
                      </div>
                      <input type="date" value={relDate} onChange={e => setRelDate(e.target.value)} className="w-full max-w-xs rounded-xl border border-[#b8860b]/30 bg-white/80 px-4 py-2.5 font-serif text-sm text-[#3a1a0a] outline-none focus:border-[#b8860b]" />
                    </div>
                  </motion.div>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.7 }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { playFanfare(getAudio()); setFormMode(true); }}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#b8860b] bg-gradient-to-r from-[#b8860b] to-[#d4af37] px-8 py-3 font-serif text-sm font-bold text-white shadow-lg transition-all hover:shadow-[#d4af37]/30"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    Open Contract
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0" style={{ background: "radial-gradient(ellipse at center, #1a0a1e 0%, #0d0a14 50%, #050308 100%)" }}>
      {showSealed && <ConfettiRain />}

      {/* Sticky progress indicator */}
      {!showSealed && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 rounded-full border border-[#d4af37]/20 bg-[#1a0a1e]/80 backdrop-blur-xl px-4 py-1.5 shadow-lg">
          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${tickedRules.size === rules.length ? "bg-emerald-400" : "bg-[#b8860b]/40"}`} />
              <span className="font-serif text-white/50">Rules</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${tickedPromises.size === promises.length ? "bg-rose-400" : "bg-[#b8860b]/40"}`} />
              <span className="font-serif text-white/50">Promises</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${tickedPenalties.size === penalties.length ? "bg-amber-400" : "bg-[#b8860b]/40"}`} />
              <span className="font-serif text-white/50">Penalties</span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <span className="font-serif text-white/60">{currentAcks}/{totalAcks}</span>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center py-6 sm:py-10 px-3 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full"
          >
            <div className="relative rounded-[2rem] border-2 border-amber-600/40 bg-gradient-to-b from-[#f5e6c8] via-[#ede0b8] to-[#e8d5a3] p-[3px] shadow-[0_0_50px_rgba(212,175,55,0.12)]">
              <div className="relative rounded-[1.9rem] bg-gradient-to-b from-[#fdf5e6] via-[#f8eed0] to-[#f0dbb5] p-6 sm:p-10 md:p-14 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8860b' fill-opacity='1'%3E%3Cpath d='M50 10c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10zM10 30c0-5.523-4.477-10-10-10S0 24.477 0 30s4.477 10 10 10 10-4.477 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

                <CornerOrnament className="absolute top-4 left-4 sm:top-6 sm:left-6" />
                <CornerOrnament className="absolute top-4 right-4 sm:top-6 sm:right-6 scale-x-[-1]" />
                <CornerOrnament className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 scale-y-[-1]" />
                <CornerOrnament className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 scale-[-1]" />

                <div className="relative">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      <WaxSealSVG size={70} />
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3a1a0a] tracking-tight">
                      RELATIONSHIP
                      <br />
                      <span className="text-[#b8860b] text-2xl sm:text-3xl">AGREEMENT</span>
                    </h1>
                    <p className="mt-2 font-serif text-[11px] uppercase tracking-[0.2em] text-[#3a1a0a]/40">
                      A legally unofficial document
                    </p>
                  </div>

                  <SectionDivider />

                  {/* Section 1: Parties */}
                  <section className="mb-8">
                    <h2 className="font-serif text-lg font-bold text-[#3a1a0a] mb-4 flex items-center gap-2">
                      <span className="text-[#b8860b]">§1.</span> Parties
                    </h2>
                    <div className="rounded-xl border border-[#b8860b]/15 bg-white/60 p-4 sm:p-6 font-serif text-sm leading-relaxed text-[#3a1a0a]/80 space-y-3">
                      <p>
                        This Agreement is made and entered into on this{" "}
                        <span className="font-bold text-[#3a1a0a]">{new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>,
                        by and between:
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-[#b8860b]/20 bg-white/70 p-3 text-center">
                          <p className="text-xs text-[#3a1a0a]/50">Party 1</p>
                          <p className="font-bold text-[#3a1a0a] text-lg">{partner1}</p>
                          {nickname1 && <p className="text-xs text-[#b8860b]">aka "{nickname1}"</p>}
                        </div>
                        <div className="rounded-lg border border-[#b8860b]/20 bg-white/70 p-3 text-center">
                          <p className="text-xs text-[#3a1a0a]/50">Party 2</p>
                          <p className="font-bold text-[#3a1a0a] text-lg">{partner2}</p>
                          {nickname2 && <p className="text-xs text-[#b8860b]">aka "{nickname2}"</p>}
                        </div>
                      </div>
                      <p className="text-center text-xs italic text-[#3a1a0a]/50">
                        Effective from: <span className="font-bold text-[#3a1a0a]/70">{formattedDate || "the day two hearts met"}</span>
                      </p>
                    </div>
                  </section>

                  {/* Section 2: Recitals */}
                  <section className="mb-8">
                    <h2 className="font-serif text-lg font-bold text-[#3a1a0a] mb-4 flex items-center gap-2">
                      <span className="text-[#b8860b]">§2.</span> Recitals
                    </h2>
                    <div className="rounded-xl border border-[#b8860b]/15 bg-white/60 p-4 sm:p-6 font-serif text-sm leading-relaxed text-[#3a1a0a]/80 space-y-2">
                      <p>WHEREAS, the Parties have chosen each other voluntarily and with sound mind;</p>
                      <p>WHEREAS, the Parties wish to formalize their understanding through this binding (but fun) agreement;</p>
                      <p>WHEREAS, this contract shall supersede all prior arguments about who ate the last snack;</p>
                      <p className="text-right text-xs italic text-[#3a1a0a]/50 mt-2">— NOW, THEREFORE, the Parties agree as follows —</p>
                    </div>
                  </section>

                  {/* Section 3: Rules */}
                  <section ref={rulesSectionRef} className="mb-8 scroll-mt-24">
                    <h2 className="font-serif text-lg font-bold text-[#3a1a0a] mb-4 flex items-center gap-2">
                      <span className="text-[#b8860b]">§3.</span> Rules & Regulations
                      {tickedRules.size === rules.length && <span className="text-emerald-600 text-xs">✓</span>}
                    </h2>
                    <p className="font-serif text-xs text-[#3a1a0a]/50 mb-3 italic pl-1">Acknowledge each rule by ticking the box:</p>
                    <motion.div
                      className="space-y-2"
                      animate={shakeSection === "rules" ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {rules.map((rule, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleTick(setTickedRules, idx)}
                          className={`group flex items-start gap-3 rounded-xl border p-3 sm:p-4 transition-all cursor-pointer ${
                            tickedRules.has(idx)
                              ? "border-[#b8860b]/40 bg-[#b8860b]/10"
                              : "border-[#b8860b]/15 bg-white/50 hover:border-[#b8860b]/30 hover:bg-white/70"
                          }`}
                        >
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                            tickedRules.has(idx)
                              ? "border-[#b8860b] bg-[#b8860b]"
                              : "border-[#b8860b]/30 bg-white/80 group-hover:border-[#b8860b]/50"
                          }`}>
                            {tickedRules.has(idx) && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`font-serif text-sm transition-all ${
                            tickedRules.has(idx) ? "text-[#3a1a0a] font-bold" : "text-[#3a1a0a]/70"
                          }`}>
                            {rule}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                    <ProgressBar current={tickedRules.size} total={rules.length} label="acknowledged" />
                  </section>

                  <SectionDivider />

                  {/* Section 4: Promises */}
                  <section ref={promisesSectionRef} className="mb-8 scroll-mt-24">
                    <h2 className="font-serif text-lg font-bold text-[#3a1a0a] mb-4 flex items-center gap-2">
                      <span className="text-[#b8860b]">§4.</span> Covenants & Promises
                      {tickedPromises.size === promises.length && <span className="text-rose-500 text-xs">❤️</span>}
                    </h2>
                    <p className="font-serif text-xs text-[#3a1a0a]/50 mb-3 italic pl-1">Affirm each promise by ticking the box:</p>
                    <motion.div
                      className="space-y-2"
                      animate={shakeSection === "promises" ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {promises.map((promise, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleTick(setTickedPromises, idx)}
                          className={`group flex items-start gap-3 rounded-xl border p-3 sm:p-4 transition-all cursor-pointer ${
                            tickedPromises.has(idx)
                              ? "border-rose-300/60 bg-rose-50/80"
                              : "border-rose-200/25 bg-white/50 hover:border-rose-300/40 hover:bg-rose-50/50"
                          }`}
                        >
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            tickedPromises.has(idx)
                              ? "border-rose-400 bg-rose-400"
                              : "border-rose-300/30 bg-white/80 group-hover:border-rose-300/50"
                          }`}>
                            {tickedPromises.has(idx) && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="mt-0.5 text-sm">❤️</span>
                            <span className={`font-serif text-sm transition-all ${
                              tickedPromises.has(idx) ? "text-[#3a1a0a] font-bold" : "text-[#3a1a0a]/70"
                            }`}>
                              {promise}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                    <ProgressBar current={tickedPromises.size} total={promises.length} label="affirmed" />
                  </section>

                  <SectionDivider />

                  {/* Section 5: Penalties */}
                  <section ref={penaltiesSectionRef} className="mb-8 scroll-mt-24">
                    <h2 className="font-serif text-lg font-bold text-[#3a1a0a] mb-4 flex items-center gap-2">
                      <span className="text-[#b8860b]">§5.</span> Penalties for Breach
                      {tickedPenalties.size === penalties.length && <span className="text-amber-600 text-xs">✓</span>}
                    </h2>
                    <p className="font-serif text-xs text-[#3a1a0a]/50 mb-3 italic pl-1">Accept the penalties by ticking each:</p>
                    <motion.div
                      className="space-y-2"
                      animate={shakeSection === "penalties" ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {penalties.map((penalty, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleTick(setTickedPenalties, idx)}
                          className={`group flex items-start gap-3 rounded-xl border p-3 sm:p-4 transition-all cursor-pointer ${
                            tickedPenalties.has(idx)
                              ? "border-amber-300/60 bg-amber-50/80"
                              : "border-amber-200/25 bg-white/50 hover:border-amber-300/40 hover:bg-amber-50/50"
                          }`}
                        >
                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                            tickedPenalties.has(idx)
                              ? "border-amber-500 bg-amber-500"
                              : "border-amber-300/30 bg-white/80 group-hover:border-amber-300/50"
                          }`}>
                            {tickedPenalties.has(idx) && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`font-serif text-sm transition-all ${
                            tickedPenalties.has(idx) ? "text-[#3a1a0a] font-bold" : "text-[#3a1a0a]/70"
                          }`}>
                            {penalty}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                    <ProgressBar current={tickedPenalties.size} total={penalties.length} label="accepted" />
                  </section>

                  <SectionDivider />

                  {/* Section 6: Secret Clause */}
                  <section ref={secretSectionRef} className="mb-8 scroll-mt-24">
                    <h2 className="font-serif text-lg font-bold text-[#3a1a0a] mb-4 flex items-center gap-2">
                      <span className="text-[#b8860b]">§6.</span> Secret Clause
                      {sealBroken && <span className="text-rose-500 text-xs">🔓</span>}
                    </h2>
                    <motion.div
                      animate={shakeSection === "secret" ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <div
                        onClick={() => { if (!sealBroken) { setSealBroken(true); playStamp(getAudio()); } }}
                        className="relative overflow-hidden rounded-xl border border-rose-300/30 bg-white/60 p-4 sm:p-6 text-center cursor-pointer group"
                      >
                        {!sealBroken ? (
                          <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-3 py-4">
                            <p className="font-serif text-sm italic text-[#3a1a0a]/50">
                              Tap the seal to reveal the secret clause
                            </p>
                            <WaxSealSVG size={80} />
                            <p className="font-serif text-[10px] text-rose-500 uppercase tracking-wider group-hover:text-rose-600 transition-colors">
                              Break seal
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 py-2">
                            <div className="flex justify-center">
                              <WaxSealSVG size={50} broken />
                            </div>
                            <div className="rounded-xl border border-rose-300/50 bg-gradient-to-br from-rose-100 to-rose-50 p-4 sm:p-6 shadow-inner">
                              <p className="font-serif text-base leading-relaxed text-rose-950 font-semibold italic">
                                "{SECRET_CLAUSE}"
                              </p>
                            </div>
                            <p className="font-serif text-sm text-rose-600 font-medium italic">
                              ❤️ This clause is self-renewing and perpetual.
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </section>

                  <SectionDivider />

                  {/* Section 7: Signatures */}
                  <section ref={signSectionRef} className="mb-6 scroll-mt-24">
                    <h2 className="font-serif text-lg font-bold text-[#3a1a0a] mb-4 flex items-center gap-2">
                      <span className="text-[#b8860b]">§7.</span> Signatures
                      {recipientSignature && <span className="text-emerald-600 text-xs">✓</span>}
                    </h2>
                    <p className="font-serif text-xs text-[#3a1a0a]/50 mb-4 italic pl-1">
                      This agreement shall be effective upon the signatures of both Parties.
                    </p>

                    <motion.div
                      animate={shakeSection === "signatures" ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      {/* Creator signature pre-filled */}
                      <div className="rounded-xl border border-[#b8860b]/20 bg-white/70 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-[#3a1a0a]">{partner1}</span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-serif text-[9px] font-bold text-emerald-700">Pre-signed</span>
                        </div>
                        <div className="rounded-lg border border-[#b8860b]/15 bg-white p-3 flex items-center justify-center h-16">
                          <svg viewBox="0 0 200 50" className="h-full w-full">
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.5, delay: 0.3 }}
                              d="M10 35 Q30 10 50 30 Q70 50 90 20 Q110 -5 130 30 Q150 55 170 25 Q185 5 195 30"
                              fill="none" stroke="#1a1527" strokeWidth="2" strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <p className="mt-1 text-right font-serif text-[9px] text-[#3a1a0a]/40">Signed electronically</p>
                      </div>

                      {/* Recipient signature */}
                      <div className="rounded-xl border border-[#b8860b]/20 bg-white/70 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-[#3a1a0a]">{partner2}</span>
                          {recipientSignature && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-serif text-[9px] font-bold text-amber-700">Signed ✓</span>
                          )}
                        </div>
                        <div className="rounded-lg border border-[#b8860b]/15 bg-white overflow-hidden" style={{ touchAction: "none" }}>
                          <canvas
                            ref={canvasRef}
                            className="h-[80px] w-full touch-none"
                            style={{ cursor: "crosshair" }}
                          />
                        </div>
                        {recipientSignature && (
                          <button
                            onClick={() => {
                              const canvas = canvasRef.current;
                              if (!canvas) return;
                              const ctx = canvas.getContext("2d");
                              if (!ctx) return;
                              const dpr = window.devicePixelRatio || 1;
                              ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
                              setRecipientSignature(null);
                            }}
                            className="mt-1 font-serif text-[9px] text-rose-500 underline hover:text-rose-700"
                          >
                            Clear & re-sign
                          </button>
                        )}
                        {!recipientSignature && (
                          <p className="mt-1 font-serif text-[9px] text-[#3a1a0a]/40">Sign above by dragging your finger or mouse</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Photo */}
                    {photo && (
                      <div className="mt-4 flex justify-center">
                        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#b8860b]/30">
                          <img src={photo} alt="couple" className="h-full w-full object-cover" />
                        </div>
                      </div>
                    )}

                    {/* Seal button */}
                    {!showSealed && (
                      <div className="mt-6 text-center">
                        <div className="mb-2 flex items-center justify-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${allTicked && recipientSignature ? "bg-green-500" : "bg-amber-400"}`} />
                          <span className="font-serif text-[10px] text-[#3a1a0a]/50">
                            {!allTicked
                              ? `${totalAcks - currentAcks} item${totalAcks - currentAcks !== 1 ? "s" : ""} remaining — click to jump to section`
                              : !recipientSignature
                                ? "Sign above to complete the contract"
                                : "All conditions met — ready to seal!"
                            }
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleSeal}
                          className="inline-flex items-center gap-3 rounded-full border-2 border-[#b8860b] bg-gradient-to-r from-[#b8860b] to-[#d4af37] px-8 py-3.5 font-serif text-sm font-bold text-white shadow-lg transition-all hover:shadow-[#d4af37]/30 cursor-pointer"
                        >
                          <WaxSealSVG size={24} />
                          {allTicked && recipientSignature ? "Seal & Accept the Contract ❤️" : "Review & Complete Contract"}
                        </motion.button>
                      </div>
                    )}
                  </section>

                  {/* Sealed state */}
                  {showSealed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="mt-6 text-center"
                    >
                      <div className="rounded-2xl border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#fdf5e6] to-[#f0dbb5] p-6 sm:p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
                          className="flex justify-center mb-4"
                        >
                          <WaxSealSVG size={90} />
                        </motion.div>
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.9 }}
                          className="font-serif text-3xl font-bold text-[#3a1a0a]"
                        >
                          Contract Accepted ❤️
                        </motion.h2>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1.2 }}
                          className="mx-auto my-4 h-px w-1/2 bg-gradient-to-r from-transparent via-[#b8860b] to-transparent"
                        />
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.4 }}
                          className="font-serif text-sm italic text-[#3a1a0a]/70"
                        >
                          Signed and sealed by <span className="font-bold text-[#b8860b]">{partner1}</span> & <span className="font-bold text-[#b8860b]">{partner2}</span>
                        </motion.p>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 1.6 }}
                          className="mt-4 flex items-center justify-center gap-4"
                        >
                          {partner1 && (
                            <div className="text-center">
                              <p className="font-serif text-[10px] text-[#3a1a0a]/50">{partner1}</p>
                              <svg viewBox="0 0 100 25" className="h-6 w-24">
                                <path d="M5 18 Q15 5 30 15 Q45 25 60 10 Q75 -5 85 18" fill="none" stroke="#1a1527" strokeWidth="1.5" />
                              </svg>
                            </div>
                          )}
                          {recipientSignature && (
                            <div className="text-center">
                              <p className="font-serif text-[10px] text-[#3a1a0a]/50">{partner2}</p>
                              <img src={recipientSignature} alt="signature" className="h-6" />
                            </div>
                          )}
                        </motion.div>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 2 }}
                          className="mt-6 flex flex-wrap items-center justify-center gap-4"
                        >
                          <button
                            onClick={() => window.print()}
                            className="rounded-full border border-[#b8860b]/30 bg-white/80 px-5 py-2 font-serif text-xs font-bold text-[#3a1a0a]/80 transition-all hover:bg-white hover:shadow-md"
                          >
                            🖨️ Print / Save PDF
                          </button>
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: "Our Love Contract",
                                  text: `${partner1} & ${partner2} just signed a Love Contract ❤️`,
                                  url: window.location.href,
                                });
                              } else {
                                navigator.clipboard.writeText(window.location.href);
                              }
                            }}
                            className="rounded-full bg-gradient-to-r from-[#b8860b] to-[#d4af37] px-5 py-2 font-serif text-xs font-bold text-white shadow-lg transition-all hover:shadow-[#d4af37]/30"
                          >
                            💌 Share
                          </button>
                        </motion.div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.5 }}
                          className="mt-8 font-serif text-[10px] text-[#3a1a0a]/30 italic"
                        >
                          "This contract is valid until forever, renewable every morning with a kiss."
                        </motion.p>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer */}
                  <div className="mt-10 mb-2 text-center">
                    <p className="font-serif text-[9px] uppercase tracking-[0.3em] text-[#3a1a0a]/30">
                      Made with ❤️ on <span className="text-[#b8860b]">Craft Your Message</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
