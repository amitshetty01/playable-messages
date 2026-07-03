"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Template } from "@/lib/types";

/* ─── Visual registry ─── */
const VISUALS: Record<string, { emoji: string; gradient: string; pattern: string }> = {
  "the-final-button":          { emoji: "🎯", gradient: "from-rose-600 via-pink-500 to-red-700",           pattern: "dots" },
  "love-chase":                { emoji: "💖", gradient: "from-violet-600 via-purple-500 to-fuchsia-700",   pattern: "grid" },
  "love-contract":             { emoji: "📜", gradient: "from-amber-500 via-orange-400 to-rose-500",        pattern: "stars" },
  "birthday-surprise-journey": { emoji: "🎂", gradient: "from-sky-500 via-indigo-400 to-violet-600",       pattern: "stars" },
  "come-closer":               { emoji: "👻", gradient: "from-pink-500 via-rose-400 to-rose-600",          pattern: "diamonds" },
  "our-memories":              { emoji: "📖", gradient: "from-teal-500 via-emerald-400 to-cyan-500",       pattern: "waves" },
  "escape-me":                 { emoji: "🧩", gradient: "from-purple-600 via-violet-500 to-indigo-700",    pattern: "grid" },
  "kitty-apology":             { emoji: "🐱", gradient: "from-pink-400 via-rose-300 to-orange-400",        pattern: "dots" },
  "memory-maze":               { emoji: "💜", gradient: "from-indigo-700 via-purple-600 to-fuchsia-700",   pattern: "stars" },
  "sorry-maze":                { emoji: "💛", gradient: "from-yellow-500 via-amber-400 to-orange-500",     pattern: "diamonds" },
  "birthday-journey":          { emoji: "🎈", gradient: "from-sky-400 via-blue-500 to-indigo-600",        pattern: "waves" },
};

const SVG_PATTERNS: Record<string, string> = {
  dots:     `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.10)'/%3E%3C/svg%3E")`,
  grid:     `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 24 0 L 0 0 0 24' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='0.5'/%3E%3C/svg%3E")`,
  waves:    `url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q10 0 20 10 Q30 20 40 10' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3C/svg%3E")`,
  stars:    `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='15,2 18,11 28,11 20,17 23,26 15,21 7,26 10,17 2,11 12,11' fill='rgba(255,255,255,0.06)'/%3E%3C/svg%3E")`,
  diamonds: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8' y='8' width='8' height='8' transform='rotate(45 12 12)' fill='rgba(255,255,255,0.06)'/%3E%3C/svg%3E")`,
};

interface CardRect { top: number; left: number; width: number; height: number; }

/* ─── Particles ─── */
function Particles() {
  const items = useMemo(() => [
    { x: "15%", y: "20%", delay: 0, size: 6, opacity: 0.15 },
    { x: "75%", y: "30%", delay: 1.2, size: 4, opacity: 0.1 },
    { x: "25%", y: "70%", delay: 0.6, size: 5, opacity: 0.12 },
    { x: "60%", y: "15%", delay: 2.0, size: 3, opacity: 0.08 },
    { x: "80%", y: "65%", delay: 0.3, size: 7, opacity: 0.1 },
    { x: "40%", y: "55%", delay: 1.5, size: 4, opacity: 0.12 },
    { x: "10%", y: "45%", delay: 0.9, size: 5, opacity: 0.08 },
    { x: "90%", y: "80%", delay: 1.8, size: 3, opacity: 0.1 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: [0, p.opacity, p.opacity, 0], scale: [0, 1, 1, 0], y: [0, -40, -80, -120] }}
          transition={{ duration: 6, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Card Face ─── */
function CardFace({ emoji, gradient, pattern }: { emoji: string; gradient: string; pattern: string }) {
  return (
    <div className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden relative`}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: SVG_PATTERNS[pattern] || SVG_PATTERNS.dots, backgroundSize: pattern === "waves" ? "40px 20px" : pattern === "grid" ? "24px 24px" : "20px 20px" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      <span className="relative text-5xl drop-shadow-2xl">{emoji}</span>
    </div>
  );
}

/* ─── Phone ─── */
function PhoneFrame({ onIframe }: { onIframe: (el: HTMLIFrameElement | null) => void }) {
  return (
    <div className="h-full w-full overflow-hidden" style={{ borderRadius: "36px" }}>
      <div className="h-full w-full bg-gradient-to-b from-zinc-500 via-zinc-400 to-zinc-600 p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.10)]">
        <div className="relative h-full w-full overflow-hidden bg-black" style={{ borderRadius: "33px" }}>
          <div className="pointer-events-none absolute inset-0 z-30" style={{ borderRadius: "33px" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
            <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          </div>
          <div className="absolute left-1/2 top-0 z-20 h-[4px] w-20 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
          <div className="absolute right-5 top-3 z-20">
            <div className="h-[7px] w-[7px] rounded-full bg-zinc-900 shadow-inner">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
            </div>
          </div>
          <div className="h-full w-full relative bg-zinc-950" style={{ borderRadius: "33px" }}>
            <iframe
              ref={onIframe}
              src="about:blank"
              className="absolute inset-0 h-full w-full"
              title="Preview"
              scrolling="no"
            />
          </div>
          <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-28 -translate-x-1/2 rounded-full bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export function TemplatePreviewOverlay({
  template,
  cardRect,
  onClose,
}: {
  template: Template;
  cardRect: CardRect;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const morphTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const v = VISUALS[template.id] || VISUALS["the-final-button"]!;

  // Lock scroll + cleanup timeouts on unmount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (morphTimeoutRef.current) clearTimeout(morphTimeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, []);

  // Sequence: enter → show (morph)
  useEffect(() => {
    const a = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("show"));
    });
    return () => cancelAnimationFrame(a);
  }, []);

  // Show iframe element after morph completes
  useEffect(() => {
    if (phase === "show" && !showIframe) {
      morphTimeoutRef.current = setTimeout(() => setShowIframe(true), 750);
    }
    return () => { if (morphTimeoutRef.current) clearTimeout(morphTimeoutRef.current); };
  }, [phase, showIframe]);

  // Load real template src after iframe element exists in DOM
  useEffect(() => {
    if (showIframe && iframeRef.current) {
      iframeRef.current.src = `/demo/${template.id}`;
    }
  }, [showIframe, template.id]);

  /* ─── Handlers ─── */
  const restart = useCallback(() => {
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = "about:blank";
      requestAnimationFrame(() => { iframeRef.current!.src = src; });
    }
  }, []);

  const handleBack = useCallback(() => {
    // Kill iframe instantly
    if (iframeRef.current) iframeRef.current.src = "about:blank";
    setShowIframe(false);
    setPhase("exit");
    exitTimeoutRef.current = setTimeout(() => onClose(), 800);
  }, [onClose]);

  const handleBg = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && phase === "show") handleBack();
  }, [handleBack, phase]);

  const storeIframe = useCallback((el: HTMLIFrameElement | null) => {
    iframeRef.current = el;
  }, []);

  /* ─── Layout ─── */
  const [vp, setVp] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    setVp({ w: window.innerWidth, h: window.innerHeight });
    const o = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", o);
    return () => window.removeEventListener("resize", o);
  }, []);

  if (!vp) return null;
  const isMobile = vp.w < 1024;
  const pw = Math.min(360, vp.w * 0.65);
  const ph = pw * (16 / 9);
  const panelW = 280;
  const totalW = panelW + pw;
  const leftPanel = Math.max(40, (vp.w - totalW) / 2);
  const leftPhone = leftPanel + panelW;
  const topPhone = Math.max(32, (vp.h - ph) / 2);
  const mLeftPhone = (vp.w - pw) / 2;
  const mTopPhone = Math.max(16, (vp.h - ph) / 2 - 40);
  const mPanelTop = mTopPhone + ph + 20;

  const isEnter = phase === "enter";
  const isExit = phase === "exit";
  const phoneLeft = isEnter || isExit ? cardRect.left : (isMobile ? mLeftPhone : leftPhone);
  const phoneTop = isEnter || isExit ? cardRect.top : (isMobile ? mTopPhone : topPhone);
  const phoneW = isEnter || isExit ? cardRect.width : pw;
  const phoneH = isEnter || isExit ? cardRect.height : ph;

  const spring = { type: "spring" as const, stiffness: 70, damping: 14, mass: 0.9 };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isExit ? 0 : 0.85 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-black"
        onClick={handleBg}
      />

      {/* Gradient orb */}
      <AnimatePresence>
        {!isEnter && !isExit && showIframe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute pointer-events-none"
            style={{
              width: pw * 1.8, height: pw * 1.8,
              left: isMobile ? mLeftPhone - pw * 0.4 : leftPhone - pw * 0.4,
              top: isMobile ? mTopPhone - pw * 0.4 : topPhone - pw * 0.4,
              background: `radial-gradient(circle at center, rgba(184,165,255,0.15), rgba(255,107,157,0.05), transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Particles */}
      {!isExit && <Particles />}

      {/* Phone / Card morph */}
      <motion.div
        className="absolute z-10"
        initial={false}
        animate={{
          top: phoneTop, left: phoneLeft,
          width: phoneW, height: phoneH,
          borderRadius: isEnter || isExit ? "1.4rem" : "36px",
        }}
        transition={spring}
        style={{ willChange: "top, left, width, height, border-radius" }}
      >
        {/* Card face — always underneath */}
        <div className="absolute inset-0">
          <CardFace emoji={v.emoji} gradient={v.gradient} pattern={v.pattern} />
        </div>

        {/* Phone frame — only during active preview */}
        {showIframe && !isExit && (
          <div className="absolute inset-0">
            <PhoneFrame onIframe={storeIframe} />
          </div>
        )}
      </motion.div>

      {/* Floating glow on phone */}
      <AnimatePresence>
        {showIframe && !isExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-10 pointer-events-none"
            style={{
              width: pw, height: ph,
              left: isMobile ? mLeftPhone : leftPhone,
              top: isMobile ? mTopPhone : topPhone,
              borderRadius: "36px",
              boxShadow: "inset 0 0 30px rgba(184,165,255,0.10), 0 0 40px rgba(184,165,255,0.06)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Info panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: showIframe && !isExit ? 1 : 0,
          x: showIframe && !isExit ? 0 : -20,
        }}
        transition={{
          type: "spring", stiffness: 100, damping: 22,
          delay: showIframe ? 0.35 : 0,
        }}
        className="fixed z-20"
        style={{
          top: isMobile ? mPanelTop : topPhone,
          left: isMobile ? "50%" : leftPanel,
          transform: isMobile ? "translateX(-50%)" : "none",
          width: isMobile ? "min(320px, calc(100vw - 32px))" : panelW,
        }}
      >
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-blush/10 via-violet/10 to-transparent blur-2xl opacity-60" />
          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-3xl ring-1 ring-white/[0.08] shadow-lg">{v.emoji}</span>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">{template.title}</h3>
                <p className="text-xs font-bold text-white/40 mt-0.5">{template.length}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/65">{template.hook}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[10px] font-bold text-white/50 tracking-wider uppercase">{template.bestFor.split(",")[0]}</span>
              <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[10px] font-bold text-white/50 tracking-wider uppercase">{template.length}</span>
            </div>
            <div className="mt-6 space-y-2.5">
              <Link href={template.id === "our-memories" ? "/our-memories?edit=true" : `/create/${template.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blush via-violet to-violet py-3 text-sm font-extrabold text-white shadow-lg shadow-blush/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                ✨ Create Yours
              </Link>
              <button type="button" onClick={restart}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-bold text-white/60 transition-all hover:bg-white/[0.08] hover:text-white/80 active:scale-[0.98]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Play Again
              </button>
              <button type="button" onClick={handleBack}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.04] py-2.5 text-xs font-bold text-white/40 transition-all hover:text-white/60 active:scale-[0.98]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
