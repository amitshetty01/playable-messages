"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Script from "next/script";
import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import { getVariant } from "@/lib/ab-testing";
import { QuickFlow } from "@/components/QuickFlow";
import { GuidedFlow } from "@/components/GuidedFlow";
import { BrowseFlow } from "@/components/BrowseFlow";
import { TrendingTemplates } from "@/components/TrendingTemplates";
import { ConfettiEffect } from "@/components/scenes/ConfettiEffect";
import { DailyPrompt } from "@/components/DailyPrompt";
import { getTemplate, templates } from "@/lib/data";
import { createDemoExperience } from "@/lib/demo";

const TemplatePreviewOverlay = dynamic(() => import("@/components/TemplatePreviewOverlay").then((m) => m.TemplatePreviewOverlay), { ssr: false });
const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel").then((m) => m.TestimonialCarousel),
  { ssr: false }
);
const ExperiencePlayer = dynamic(
  () => import("@/components/ExperiencePlayer").then((m) => ({ default: m.ExperiencePlayer })),
  { ssr: false }
);
const FloatingEnvelope = dynamic(
  () => import("@/components/FloatingEnvelope").then((m) => ({ default: m.default })),
  { ssr: false }
);

const REACTIONS = [
  { emoji: "😭", text: "She cried at the last reveal", author: "— Riya" },
  { emoji: "😂", text: "He chased the button for 40 seconds", author: "— Aarav" },
  { emoji: "❤️", text: "My girlfriend replayed it 5 times", author: "— Karan" },
  { emoji: "🥹", text: "I wasn't ready for that ending", author: "— Neha" },
  { emoji: "😍", text: "Best birthday surprise ever", author: "— Priya" },
  { emoji: "🤯", text: "He thought it was spam at first", author: "— Ananya" },
];

const OCCASIONS = [
  { label: "Anniversary", icon: "💍", slug: "love" },
  { label: "Birthday", icon: "🎂", slug: "birthday" },
  { label: "Proposal", icon: "💎", slug: "love" },
  { label: "Sorry", icon: "💔", slug: "sorry" },
  { label: "Love", icon: "💖", slug: "love" },
  { label: "Friendship", icon: "🤝", slug: "memory" },
  { label: "Roast", icon: "🏆", slug: "roast" },
  { label: "Long Distance", icon: "🌍", slug: "love" },
];

const ACTIVITIES = [
  { emoji: "❤️", text: "Someone just created Love Contract", delay: 0 },
  { emoji: "😂", text: "A Moving Button was shared", delay: 2000 },
  { emoji: "🎂", text: "Birthday Reveal completed", delay: 4000 },
  { emoji: "💔", text: "Kitty Apology sent to patch things up", delay: 6000 },
  { emoji: "🧩", text: "Escape Me was solved in 28 seconds", delay: 8000 },
  { emoji: "💜", text: "Heart Vault unlocked by someone special", delay: 10000 },
];

const HOW_IT_WORKS = [
  {
    word: "Pick",
    anim: (
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-10 rounded-xl border-2 border-white/25 bg-gradient-to-br from-white/[0.08] to-white/[0.02] animate-card-flip" />
        <span className="absolute text-lg" style={{ animation: "card-flip-emoji 2s ease-in-out infinite" }}>🎴</span>
      </div>
    ),
  },
  {
    word: "Write",
    anim: (
      <div className="relative flex items-center justify-center">
        <span className="text-2xl animate-cursor-type" style={{ fontFamily: "monospace" }}>|</span>
      </div>
    ),
  },
  {
    word: "Send",
    anim: (
      <div className="relative flex items-center justify-center">
        <span className="text-2xl animate-plane-glide">✈️</span>
      </div>
    ),
  },
];

const STATS = [
  { value: "50K", suffix: "+", label: "Messages created" },
  { value: "42", suffix: "K+", label: "Happy recipients" },
  { value: "20", suffix: "+", label: "Interactive templates" },
  { value: "7", suffix: "", label: "Mood categories" },
];

const TEMPLATE_ICONS: Record<string, string> = {
  "the-final-button": "🎯",
  "love-chase": "💖",
  "love-contract": "📜",
  "birthday-surprise-journey": "🎂",
  "come-closer": "👻",
  "our-memories": "📖",
  "escape-me": "🧩",
  "kitty-apology": "🐱",
  "memory-maze": "💜",
  "sorry-maze": "💛",
  "birthday-journey": "🎈",
};

const TEMPLATE_GRADIENTS: Record<string, string> = {
  "the-final-button": "from-rose/30 via-blush/20 to-transparent",
  "love-chase": "from-blush/30 via-violet/20 to-transparent",
  "love-contract": "from-violet/30 via-neon/20 to-transparent",
  "birthday-surprise-journey": "from-sky-500/20 via-violet/20 to-transparent",
};

const fullTemplates = templates.filter((t) => t.status === "full");

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function StatNumber({ value, suffix }: { value: string; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [displayed, setDisplayed] = useState("0");
  const num = parseInt(value.replace(/\D/g, ""), 10);

  useEffect(() => {
    if (!isInView || !num) { if (isInView) setDisplayed(value); return; }
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(num / 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= num) {
        setDisplayed(value);
        clearInterval(interval);
      } else {
        setDisplayed(String(start));
      }
    }, duration / 30);
    return () => clearInterval(interval);
  }, [isInView, num, value]);

  return (
    <span ref={ref} className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
      <span>{displayed}</span>{suffix}
    </span>
  );
}

function SectionHeader({ eyebrow, title, lead, center = true }: { eyebrow?: string; title?: string; lead?: string; center?: boolean }) {
  return (
    <div className={`${center ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="text-xs font-bold tracking-[0.15em] text-white/50 uppercase">{eyebrow}</p>
      )}
      <div className={`mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40 ${center ? "" : "ml-0"}`} />
      {title && (
        <p className="mt-5 text-xl font-bold leading-snug text-white sm:text-2xl">{title}</p>
      )}
      {lead && (
        <p className={`mt-3 text-base leading-relaxed text-white/60 ${center ? "mx-auto max-w-xl" : ""}`}>{lead}</p>
      )}
    </div>
  );
}

export function HomePageContent() {
  const [showGuided, setShowGuided] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);
  const [preview, setPreview] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [demoKey, setDemoKey] = useState(0);
  const heroCtaText = getVariant('hero-cta-text') || "Create an Experience";

  const handlePreview = useCallback((id: string, rect?: DOMRect) => {
    const fallback = { top: 120, left: 0, width: 340, height: 280, x: 0, y: 120, bottom: 400, right: 340 };
    const r: DOMRect = rect || (fallback as DOMRect);
    setPreview({ id, rect: r });
  }, []);

  const closePreview = useCallback(() => {
    setPreview(null);
  }, []);

  const previewTemplate = preview ? getTemplate(preview.id) : null;

  const heroTemplate = useMemo(() => getTemplate("birthday-surprise-journey") ?? null, []);
  const heroDemoExperience = useMemo(() => {
    return heroTemplate ? createDemoExperience(heroTemplate) : null;
  }, [heroTemplate]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [teaserScratched, setTeaserScratched] = useState(false);
  const teaserCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleHeroCreate = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    document.getElementById("quick-create")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleLiveDemo = useCallback(() => {
    setDemoKey((k) => k + 1);
    window.open("/demo/phone/birthday-surprise-journey", "_blank");
  }, []);

  function TeaserScratch() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scratched, setScratched] = useState(false);
    const isDrawing = useRef(false);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = 180; const h = 50;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#c8d0d8"); grad.addColorStop(1, "#a0b0c0");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("✨ SCRATCH HERE ✨", w / 2, h / 2);
    }, []);

    function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
      const rect = canvasRef.current!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function scratch(x: number, y: number) {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext("2d"); if (!ctx) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
    }

    function checkRevealed() {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext("2d"); if (!ctx) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data; let cleared = 0; let total = 0;
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          if (pixels[(y * canvas.width + x) * 4 + 3] === 0) cleared++;
          total++;
        }
      }
      if (cleared / total > 0.35) { setScratched(true); setTeaserScratched(true); }
    }

    function handleDown(e: React.PointerEvent<HTMLCanvasElement>) {
      if (scratched) return; isDrawing.current = true;
      const pos = getPos(e); scratch(pos.x, pos.y); checkRevealed();
    }
    function handleMove(e: React.PointerEvent<HTMLCanvasElement>) {
      if (!isDrawing.current || scratched) return;
      const pos = getPos(e); scratch(pos.x, pos.y); checkRevealed();
    }
    function handleUp() { isDrawing.current = false; }

    return (
      <div className="relative inline-block overflow-hidden rounded-lg border border-white/15">
        <div className="flex items-center justify-center bg-white/5 px-4 py-2">
          <p className="text-xs font-bold text-white/70">{scratched ? "🎉 Make their heart skip a beat!" : "???"}</p>
        </div>
        {!scratched && (
          <canvas
            ref={canvasRef}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerLeave={handleUp}
            className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          />
        )}
      </div>
    );
  }

  function CursorFollower() {
    const cx = useMotionValue(-100);
    const cy = useMotionValue(-100);
    const springX = useSpring(cx, { stiffness: 200, damping: 30 });
    const springY = useSpring(cy, { stiffness: 200, damping: 30 });

    useEffect(() => {
      function move(e: PointerEvent) { cx.set(e.clientX); cy.set(e.clientY); }
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    }, [cx, cy]);

    return (
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[999] h-6 w-6 rounded-full border border-blush/40 bg-blush/10 backdrop-blur-sm"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      />
    );
  }

  function LiveToast() {
    const [toast, setToast] = useState({ emoji: "❤️", text: "Sarah from London just sent a Birthday Surprise 🎂" });
    const toasts = [
      { emoji: "❤️", text: "Sarah from London just sent a Birthday Surprise 🎂" },
      { emoji: "😂", text: "Someone in New York just played the Love Maze ♥" },
      { emoji: "🎂", text: "Priya from Mumbai created a Blow Out the Candles 🎉" },
      { emoji: "💔", text: "Alex used Kitty Apology to patch things up 🐱" },
      { emoji: "🧩", text: "Escape Me was solved in 28 seconds by someone 🔓" },
      { emoji: "💜", text: "A Heart Vault was unlocked by someone special 💕" },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setToast(toasts[Math.floor(Math.random() * toasts.length)]);
      }, 15000);
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-4 z-50 hidden max-w-[260px] rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 backdrop-blur-xl shadow-xl sm:block"
      >
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-sm shrink-0">{toast.emoji}</span>
          <div className="min-w-0">
            <p className="text-xs leading-relaxed text-white/70">{toast.text}</p>
            <p className="mt-0.5 text-[9px] font-bold text-white/30 tracking-wider uppercase">just now</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
    <ConfettiEffect active={showConfetti} duration={2000} />
    <CursorFollower />
    <LiveToast />
    <div className={`pb-24 ${preview ? "pointer-events-none select-none" : ""}`}>

      {/* ════════════════════════════════════════
          HERO
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        {/* Interactive 3D Floating Envelope */}
        <div className="pointer-events-none absolute right-4 top-4 z-20 h-[200px] w-[200px] opacity-60 lg:opacity-100">
          <FloatingEnvelope />
        </div>
        <motion.div
          animate={{ x: [0, 30, 0, -20, 0], scale: [1, 1.05, 0.98, 1.02, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-40 top-12 h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-[160px]"
        />
        <motion.div
          animate={{ x: [0, -25, 0, 35, 0], y: [0, 20, -10, 0, 0], scale: [1, 0.95, 1.05, 1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blush/15 blur-[150px]"
        />
        <motion.div
          animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute bottom-0 left-1/4 h-[350px] w-[700px] rounded-full bg-neon/10 blur-[140px]"
        />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[600px] bg-gradient-to-r from-violet/5 via-blush/5 to-neon/5 blur-[120px]" />

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="z-10 max-w-2xl text-center lg:text-left"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-xs font-bold tracking-widest text-violet">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet" />
              </span>
              BETTER THAN A GREETING CARD
            </div>

            <h1 className="display-title text-[clamp(2.2rem,7vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              Make{' '}
              <span className="bg-gradient-to-r from-neon via-blush to-violet bg-clip-text text-transparent">their heart</span>{' '}
              skip a beat.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55 sm:text-xl">
              Turn your words into a playful mini-game they will never forget. Better than a greeting card. Better than a text.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <button
                type="button"
                onClick={handleHeroCreate}
                className="premium-button min-w-[200px] text-base"
              >
                {heroCtaText}
              </button>
              <button
                type="button"
                onClick={handleLiveDemo}
                className="ghost-button min-w-[180px] text-base"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Watch Live Demo
              </button>
            </motion.div>

            <p className="mt-3 text-xs font-bold text-white/40">
              No sign-up required. Takes 30 seconds.
            </p>

            <div className="mt-4 flex justify-center lg:justify-start">
              <TeaserScratch />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="z-10 shrink-0"
          >
            <div className="relative mx-auto w-[280px] sm:w-[320px]">
              <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-b from-violet/20 via-blush/10 to-neon/10 blur-3xl opacity-60" />
              <div className="relative overflow-hidden rounded-[2.6rem] bg-gradient-to-b from-zinc-500 via-zinc-400 to-zinc-600 p-[3px] shadow-[0_0_80px_rgba(0,0,0,0.5),0_0_40px_rgba(184,165,255,0.08)]">
                <div className="relative overflow-hidden rounded-[2.4rem] bg-black">
                  <div className="pointer-events-none absolute inset-0 z-30 rounded-[2.4rem] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[2.4rem]">
                    <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                  </div>
                  <div className="absolute left-1/2 top-0 z-20 h-[4px] w-20 -translate-x-1/2 rounded-b-full bg-zinc-900" />
                  <div className="absolute right-4 top-3 z-20 h-[6px] w-[6px] rounded-full bg-zinc-900 shadow-inner">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-zinc-600 to-zinc-900" />
                  </div>
                  <div className="relative aspect-[9/19] w-full overflow-hidden bg-zinc-950" style={{ transform: "translateZ(0)" }}>
                    {heroTemplate && heroDemoExperience && (
                      <ExperiencePlayer
                        key={demoKey}
                        template={heroTemplate}
                        experience={heroDemoExperience}
                        mode="demo"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-28 -translate-x-1/2 rounded-full bg-zinc-900" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase">Blow Out the Candles · Live Demo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DAILY PROMPT
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-20 sm:mt-28 max-w-md px-4">
          <DailyPrompt />
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          QUICK CREATE
          ════════════════════════════════════════ */}
      <section id="quick-create" className="section-fade mt-20 sm:mt-28 scroll-mt-24">
        <QuickFlow />
      </section>

      {/* ════════════════════════════════════════
          TRENDING TEMPLATES
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-6xl px-4">
          <SectionHeader eyebrow="Trending now" title="Most-loved experiences" lead="These templates are being shared the most right now." />
          <div className="mt-10">
            <TrendingTemplates onDemo={handlePreview} />
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          HOW IT WORKS (3-step timeline)
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-4xl px-4">
          <SectionHeader eyebrow="How it works" title="See it in motion." />
          <div className="relative mt-10">
            <div className="flex flex-col gap-8 sm:flex-row sm:justify-center sm:gap-12">
              {HOW_IT_WORKS.map((item, i) => (
                <div key={item.word} className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                    {item.anim}
                  </div>
                  <span className="text-xs font-extrabold tracking-widest text-white/50 uppercase">{item.word}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          NOT JUST FOR LOVERS
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent p-8 sm:p-12 ring-1 ring-white/[0.06]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-400/5 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-rose-400/5 blur-[100px]" />
            <SectionHeader eyebrow="For every moment" title="Not just for lovers" lead="Friends, family, birthdays, apologies — every relationship deserves something special." center={false} />
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {[
                { icon: "🤝", title: "Best Friends", desc: "Inside jokes, memories, and friendship appreciation. Perfect for your ride-or-die.", accent: "from-sky-400/20 to-cyan-400/10", border: "border-sky-400/20" },
                { icon: "🎂", title: "Birthdays", desc: "Make their day unforgettable with a candle-blowing, confetti-popping surprise.", accent: "from-amber-400/20 to-orange-400/10", border: "border-amber-400/20" },
                { icon: "💔", title: "Apologies", desc: "Say sorry in a way that shows you truly care. Rebuild bridges creatively.", accent: "from-rose-400/20 to-pink-400/10", border: "border-rose-400/20" },
              ].map((item) => (
                <div key={item.title} className={`group relative overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.accent} p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl`}>
                  <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  <h3 className="mt-3 text-lg font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          MID-PAGE CTA BANNER
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet/15 via-blush/10 to-neon/10 p-8 text-center sm:p-12">
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet/20 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blush/15 blur-[100px]" />
            <div className="relative z-10">
              <p className="text-xs font-bold tracking-[0.15em] text-white/50 uppercase">Ready to create?</p>
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">Make them feel something they will not forget.</h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-white/60">50+ interactive templates. Zero design skills. Share anywhere with one link.</p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleHeroCreate}
                  className="premium-button min-w-[200px] text-base"
                >
                  Create Your Experience
                </button>
                <Link
                  href="/explore"
                  className="ghost-button min-w-[160px] text-base"
                >
                  Browse Templates
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          CHOOSE BY OCCASION
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-5xl px-4">
          <SectionHeader eyebrow="Choose by occasion" lead="Pick the moment and find the perfect experience." />
          <div className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {OCCASIONS.map((o) => (
              <Link
                key={o.label}
                href={`/mood/${o.slug}`}
                className="glass group flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(184,165,255,0.15)] active:scale-95"
              >
                <span className="text-xl transition-transform duration-300 ease-out group-hover:scale-125 group-active:scale-110" aria-hidden="true">{o.icon}</span>
                <span className="text-[10px] font-extrabold text-white/70 transition-colors duration-200 group-hover:text-white text-center leading-tight">{o.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          DISCOVER — PREMIUM TEMPLATE CARDS (Bento + Mobile Swipe)
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-6xl px-4">
          <SectionHeader eyebrow="Discover" title="Explore interactive templates" lead="Each one turns your message into something they will play and remember." />
          {/* Desktop: grid with glassmorphism depth stacking */}
          <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {fullTemplates.slice(0, 6).map((t, i) => {
              const gradient = TEMPLATE_GRADIENTS[t.id] || "from-white/10 to-transparent";
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  data-card
                  onClick={(e) => { const card = e.currentTarget.closest("[data-card]"); const rect = card?.getBoundingClientRect(); if (rect) handlePreview(t.id, rect); }}
                  className={`card-glow group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(184,165,255,0.12)] ${isLarge ? "lg:row-span-2" : ""} ${i === 2 ? "-ml-4 mt-4 z-10" : ""} ${i === 3 ? "ml-4 -mt-2 z-20" : ""}`}
                  style={i === 2 ? { marginTop: "-1.5rem" } : i === 3 ? { marginBottom: "-1.5rem" } : {}}
                >
                  <div className={`pointer-events-none absolute -inset-x-4 -inset-y-6 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-xl ring-1 ring-white/10">
                        {TEMPLATE_ICONS[t.id] || "✨"}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-white truncate">{t.title}</h4>
                        <p className="mt-0.5 text-[10px] font-medium text-white/40">{t.length}</p>
                      </div>
                    </motion.div>
                    <p className="mt-3 text-xs leading-relaxed text-white/50 line-clamp-2">{t.description || "An interactive experience to share your message."}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); const card = e.currentTarget.closest("[data-card]"); const rect = card?.getBoundingClientRect(); if (rect) handlePreview(t.id, rect); }}
                        className="flex-1 rounded-lg border border-white/15 bg-white/[0.06] py-2 text-[11px] font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                      >
                        Preview
                      </button>
                      <Link
                        href={t.id === "our-memories" ? "/our-memories?edit=true" : `/create/${t.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blush/80 to-violet/80 py-2 text-center text-[11px] font-extrabold text-white shadow transition-all hover:scale-[1.02] active:scale-95"
                      >
                        Create
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* Mobile: horizontal snap-scroll carousel */}
          <div className="mt-10 -mx-4 overflow-x-auto snap-x snap-mandatory scrollbar-none sm:hidden">
            <div className="flex gap-4 px-4 pb-4">
              {fullTemplates.slice(0, 6).map((t, i) => {
                const gradient = TEMPLATE_GRADIENTS[t.id] || "from-white/10 to-transparent";
                return (
                  <div
                    key={t.id}
                    data-card
                    onClick={(e) => { const card = e.currentTarget.closest("[data-card]"); const rect = card?.getBoundingClientRect(); if (rect) handlePreview(t.id, rect); }}
                    className="card-glow group relative w-[260px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 transition-all duration-500"
                  >
                    <div className={`pointer-events-none absolute -inset-x-4 -inset-y-6 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-xl ring-1 ring-white/10">
                          {TEMPLATE_ICONS[t.id] || "✨"}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-white truncate">{t.title}</h4>
                          <p className="mt-0.5 text-[10px] font-medium text-white/40">{t.length}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-white/50 line-clamp-2">{t.description || "An interactive experience to share your message."}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); const card = e.currentTarget.closest("[data-card]"); const rect = card?.getBoundingClientRect(); if (rect) handlePreview(t.id, rect); }}
                          className="flex-1 rounded-lg border border-white/15 bg-white/[0.06] py-2 text-[11px] font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                        >
                          Preview
                        </button>
                        <Link
                          href={t.id === "our-memories" ? "/our-memories?edit=true" : `/create/${t.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 rounded-lg bg-gradient-to-r from-blush/80 to-violet/80 py-2 text-center text-[11px] font-extrabold text-white shadow transition-all hover:scale-[1.02] active:scale-95"
                        >
                          Create
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {fullTemplates.slice(0, 6).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/20" />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          WHY USE IT
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-5xl px-4">
          <SectionHeader eyebrow="Why use it" lead="Plain texts get lost. Interactive messages get remembered." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: "🎯", title: "More than text", desc: "A link carries emotion, pacing, and surprise that a plain message cannot." },
              { emoji: "🔗", title: "Share anywhere", desc: "Works in WhatsApp, Instagram, SMS, email — anywhere you can paste a link." },
              { emoji: "🎨", title: "50+ templates", desc: "Choose from love, apology, birthday, funny, memory, and mystery experiences." },
              { emoji: "🔒", title: "Private by default", desc: "Each link is unique and unguessable. You control who sees it." },
            ].map((item) => (
              <div key={item.title} className="glass lift rounded-[1.6rem] p-5 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(184,165,255,0.12)]">
                <span className="text-2xl transition-transform duration-300 hover:scale-110" aria-hidden="true">{item.emoji}</span>
                <h3 className="mt-3 text-lg font-extrabold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          SOCIAL PROOF + STATS (combined)
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-5xl px-4">
          <SectionHeader eyebrow="Real reactions" lead="See what people are saying about their experiences." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REACTIONS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="glass group rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
              >
                <p className="flex items-start gap-2 text-base leading-relaxed text-white/85">
                  <span className="mt-0.5 text-xl">{r.emoji}</span>
                  <span>{r.text}</span>
                </p>
                <p className="mt-3 text-xs font-bold text-white/50">{r.author}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          STATS
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-4xl px-4">
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-8">
            <p className="text-center text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Trusted by thousands</p>
            <div className="mt-6 grid grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] ring-1 ring-white/10">
                    <svg className="h-5 w-5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {s.label === "Messages created" ? <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> :
                       s.label === "Happy recipients" ? <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> :
                       s.label === "Interactive templates" ? <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></> :
                       <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>}
                    </svg>
                  </div>
                  <StatNumber value={s.value} suffix={s.suffix} />
                  <p className="mt-1 text-[9px] font-semibold text-white/50 uppercase tracking-wider sm:text-[10px]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          TESTIMONIALS
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-3xl px-4">
          <SectionHeader eyebrow="What people create" />
          <div className="mt-8">
            <TestimonialCarousel />
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          RECENT ACTIVITY
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-3xl px-4">
          <SectionHeader eyebrow="Live activity" lead="Real creations happening right now." />
          <div className="mt-10 space-y-3">
            {ACTIVITIES.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass flex items-center gap-3 rounded-xl px-4 py-3"
              >
                <span className="text-lg">{a.emoji}</span>
                <p className="text-sm text-white/70">{a.text}</p>
                <span className="ml-auto text-[10px] text-white/25">just now</span>
              </motion.div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          FAQ
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-3xl px-4">
          <SectionHeader eyebrow="Questions" lead="Everything you need to know before creating your first message." />
          <div className="mt-10 space-y-4">
            <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/15">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80 transition-colors group-hover:text-white">
                <span>What can I create?</span>
                <span className="shrink-0 text-white/45 transition-transform duration-300 ease-out group-open:rotate-45 group-open:text-blush">+</span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Love confessions, birthday surprises, apology messages, anniversary notes, proposal questions, good morning texts, good night wishes, friendship appreciation, funny roasts, farewell messages, and more. Each one is interactive and shareable as a link.</p>
            </details>
            <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/15">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80 transition-colors group-hover:text-white">
                <span>Does the recipient need to sign up?</span>
                <span className="shrink-0 text-white/45 transition-transform duration-300 ease-out group-open:rotate-45 group-open:text-blush">+</span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">No. They just tap the link and the experience opens in their browser. No account, no app, no download.</p>
            </details>
            <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/15">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80 transition-colors group-hover:text-white">
                <span>Can I send it on WhatsApp?</span>
                <span className="shrink-0 text-white/45 transition-transform duration-300 ease-out group-open:rotate-45 group-open:text-blush">+</span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Yes. Copy your unique link and paste it into any WhatsApp chat. The recipient taps it and the experience opens instantly.</p>
            </details>
            <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/15">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80 transition-colors group-hover:text-white">
                <span>Is it really free?</span>
                <span className="shrink-0 text-white/45 transition-transform duration-300 ease-out group-open:rotate-45 group-open:text-blush">+</span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Yes. Every template, every generator, every AI tool is completely free. No hidden charges or subscriptions.</p>
            </details>
            <details className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/15">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-white/80 transition-colors group-hover:text-white">
                <span>Can I edit after sharing?</span>
                <span className="shrink-0 text-white/45 transition-transform duration-300 ease-out group-open:rotate-45 group-open:text-blush">+</span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-6 text-white/60">Yes. Every created message includes an edit link. You can update the text, change the template, or customize it even after the recipient has seen it.</p>
            </details>
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="text-sm font-bold text-white/60 underline underline-offset-4 transition-colors hover:text-white/70">
              See all FAQs →
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════ */}
      <ScrollReveal>
        <section className="mx-auto mt-24 sm:mt-32 max-w-3xl px-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-neon/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-violet/15 blur-[100px]" />
            <div className="relative z-10">
              <h2 className="display-title text-3xl font-extrabold text-white sm:text-4xl">Ready to make them smile?</h2>
              <p className="mx-auto mt-4 max-w-md text-base text-white/60">
                Join <span className="font-bold text-white/85">50,000+</span> messages already created. Your words deserve more than a text.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleHeroCreate}
                  className="premium-button min-w-[220px] text-base"
                >
                  Create Your Experience
                </button>
                <Link
                  href="/explore"
                  className="ghost-button min-w-[160px] text-base"
                >
                  Browse All
                </Link>
              </div>
              <p className="mt-4 text-xs text-white/40">Free to try · No sign-up required · Share with one link</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ════════════════════════════════════════
          AD
          ════════════════════════════════════════ */}
      <div className="mt-20 flex justify-center">
        <div className="relative w-full max-w-[728px] overflow-hidden" style={{ height: 90 }}>
          <Script id="ad-rect-config" strategy="lazyOnload">{`atOptions={"key":"4325688d299d71bc93ad520c92ef88c0","format":"iframe","height":90,"width":728,"params":{}}`}</Script>
          <Script src="https://www.highperformanceformat.com/4325688d299d71bc93ad520c92ef88c0/invoke.js" strategy="lazyOnload" />
        </div>
      </div>

      {/* ════════════════════════════════════════
          SEO TEXT
          ════════════════════════════════════════ */}
      <section className="mx-auto mt-20 max-w-4xl px-4">
        <div className="glass rounded-[2rem] p-6 sm:p-10">
          <h2 className="display-title text-2xl font-bold text-white sm:text-3xl">What is Craft Your Message?</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            Craft Your Message is a creative online platform that turns your words into interactive, shareable experiences. Instead of sending a plain text message, you create a unique link that opens a mini-game, animation, or reveal sequence. Your recipient plays through the experience and discovers your message at the end. It is a fun and memorable way to say something meaningful.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
            Whether you want to send an apology after a fight, confess your feelings to a crush, wish a friend a happy birthday, or roast your best friend in good humor, Craft Your Message makes every word count. Each template is designed with a specific emotion in mind, so your message lands the way you intend it to.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "🎮", title: "Playful", desc: "Every message is a mini game or animation they play through." },
              { icon: "🔗", title: "Shareable", desc: "One link. Works on any phone, any chat app, anywhere." },
              { icon: "💝", title: "Emotional", desc: "The format makes your words hit harder and feel deeper." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center rounded-xl bg-white/[0.04] p-4 text-center ring-1 ring-white/10">
                <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                <h3 className="mt-3 text-sm font-extrabold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ESCAPE HATCHES
          ════════════════════════════════════════ */}
      <div className="mt-16 flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          onClick={() => { setShowGuided(!showGuided); if (!showGuided) setShowBrowse(false); }}
          className="text-sm text-white/55 underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {showGuided ? "− Close guided mode" : "Not sure what to say? Let us guide you"}
        </button>
        <button
          type="button"
          onClick={() => { setShowBrowse(!showBrowse); if (!showBrowse) setShowGuided(false); }}
          className="text-sm text-white/55 underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {showBrowse ? "− Close" : "See what's coming soon →"}
        </button>
      </div>

      {showGuided && (
        <section className="section-fade mt-12">
          <GuidedFlow />
        </section>
      )}

      {showBrowse && (
        <section className="section-fade mt-12">
          <BrowseFlow />
        </section>
      )}

      {/* ════════════════════════════════════════
          FOOTER NAV LINKS
          ════════════════════════════════════════ */}
      <section className="mx-auto mt-16 max-w-2xl px-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8">
          <p className="text-center text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Navigate</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link
              href="/explore"
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/50 group-hover:text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <span className="text-xs font-bold text-white/60 group-hover:text-white/85">Explore</span>
            </Link>
            <Link
              href="/templates"
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/50 group-hover:text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
              <span className="text-xs font-bold text-white/60 group-hover:text-white/85">Templates</span>
            </Link>
            <Link
              href="/reminders"
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/50 group-hover:text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="text-xs font-bold text-white/60 group-hover:text-white/85">Reminders</span>
            </Link>
            <Link
              href="/messages"
              className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/50 group-hover:text-white/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <span className="text-xs font-bold text-white/60 group-hover:text-white/85">Messages</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/chat"
          className="group inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.65rem] font-bold text-white/50 transition-all hover:bg-white/5 hover:text-white/60"
        >
          <span className="transition-transform duration-300 group-hover:scale-110">🔒</span>
          <span>Secret space</span>
        </Link>
      </div>

    </div>

    {/* Sticky Mobile CTA */}
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-ink/80 backdrop-blur-xl px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="min-w-0">
          <p className="text-xs font-extrabold text-white truncate">Make their heart skip a beat</p>
          <p className="text-[10px] text-white/40">No sign-up. Takes 30s.</p>
        </div>
        <button
          type="button"
          onClick={() => document.getElementById("quick-create")?.scrollIntoView({ behavior: "smooth" })}
          className="shrink-0 rounded-full bg-gradient-to-r from-blush to-violet px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-violet/20 active:scale-95 transition-transform"
        >
          Create Free
        </button>
      </div>
    </div>

    {preview && previewTemplate && (
      <TemplatePreviewOverlay
        template={previewTemplate}
        cardRect={preview.rect}
        onClose={closePreview}
      />
    )}
    </>
  );
}
