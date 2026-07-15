"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, X, RotateCcw } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getAllTemplates } from "@/lib/data";
import { createDemoExperience } from "@/lib/demo";
import { ScaledPhonePreview } from "@/components/ScaledPhonePreview";
import type { Template } from "@/lib/types";

const ExperiencePlayer = dynamic(
  () => import("@/components/ExperiencePlayer").then((m) => m.ExperiencePlayer),
  { ssr: false },
);

type ThumbVisual = {
  gradient: string;
  mainIcon: string;
  floaters: { emoji: string; style: string }[];
  pattern: "dots" | "grid" | "waves" | "stars" | "diamonds";
};

const thumbVisuals: Record<string, ThumbVisual> = {
  "the-final-button": {
    gradient: "from-pink-600 via-rose-500 to-fuchsia-700",
    mainIcon: "🎯",
    floaters: [{ emoji: "💘", style: "top-2 left-3 text-xs" }, { emoji: "✨", style: "top-4 right-5 text-lg" }, { emoji: "💖", style: "bottom-4 left-5 text-sm" }],
    pattern: "stars",
  },
  "memory-maze": {
    gradient: "from-teal-600 via-emerald-500 to-cyan-700",
    mainIcon: "💜",
    floaters: [{ emoji: "🌀", style: "top-2 right-3 text-sm" }, { emoji: "🔮", style: "bottom-3 left-4 text-base" }, { emoji: "✨", style: "top-5 left-2 text-xs" }],
    pattern: "grid",
  },
  "birthday-surprise-journey": {
    gradient: "from-violet-600 via-purple-500 to-fuchsia-700",
    mainIcon: "🎂",
    floaters: [{ emoji: "🎈", style: "top-2 right-4 text-lg" }, { emoji: "🎉", style: "bottom-3 left-3 text-sm" }, { emoji: "⭐", style: "top-3 left-6 text-xs" }],
    pattern: "stars",
  },
  "love-chase": {
    gradient: "from-rose-600 via-pink-500 to-red-700",
    mainIcon: "💖",
    floaters: [{ emoji: "🏃", style: "top-3 right-3 text-lg" }, { emoji: "💕", style: "bottom-4 left-4 text-sm" }, { emoji: "🔥", style: "top-2 left-5 text-xs" }],
    pattern: "dots",
  },
  "kitty-apology": {
    gradient: "from-sky-600 via-indigo-500 to-slate-800",
    mainIcon: "🐱",
    floaters: [{ emoji: "💔", style: "top-2 right-4 text-sm" }, { emoji: "🧶", style: "bottom-3 left-3 text-base" }, { emoji: "🥺", style: "top-4 left-2 text-xs" }],
    pattern: "dots",
  },
  "come-closer": {
    gradient: "from-amber-600 via-orange-500 to-red-700",
    mainIcon: "👻",
    floaters: [{ emoji: "👀", style: "top-2 right-3 text-lg" }, { emoji: "🕯️", style: "bottom-3 left-4 text-base" }, { emoji: "💀", style: "top-4 left-5 text-xs" }],
    pattern: "waves",
  },
  "birthday-journey": {
    gradient: "from-indigo-600 via-violet-500 to-purple-800",
    mainIcon: "🎈",
    floaters: [{ emoji: "🎁", style: "top-2 right-4 text-lg" }, { emoji: "🕯️", style: "bottom-3 left-3 text-sm" }, { emoji: "✨", style: "top-3 left-6 text-xs" }],
    pattern: "stars",
  },
  "escape-me": {
    gradient: "from-fuchsia-600 via-purple-500 to-violet-800",
    mainIcon: "🧩",
    floaters: [{ emoji: "🔐", style: "top-2 right-3 text-lg" }, { emoji: "🗝️", style: "bottom-3 left-4 text-base" }, { emoji: "👁️", style: "top-4 left-2 text-xs" }],
    pattern: "grid",
  },
  "sorry-maze": {
    gradient: "from-amber-500 via-orange-400 to-yellow-600",
    mainIcon: "💛",
    floaters: [{ emoji: "🧭", style: "top-2 right-3 text-lg" }, { emoji: "💎", style: "bottom-3 left-4 text-base" }, { emoji: "⭐", style: "top-4 left-2 text-xs" }],
    pattern: "stars",
  },
  "our-memories": {
    gradient: "from-pink-300 via-rose-400 to-blush-500",
    mainIcon: "📖",
    floaters: [{ emoji: "💕", style: "top-2 right-3 text-sm" }, { emoji: "✨", style: "bottom-3 left-4 text-base" }, { emoji: "🌹", style: "top-4 left-2 text-xs" }],
    pattern: "stars",
  },
  "love-contract": {
    gradient: "from-amber-600 via-orange-500 to-rose-700",
    mainIcon: "📜",
    floaters: [{ emoji: "💍", style: "top-2 right-4 text-lg" }, { emoji: "✍️", style: "bottom-3 left-3 text-sm" }, { emoji: "🔥", style: "top-3 left-6 text-xs" }],
    pattern: "stars",
  },
};

const defaultVisual: ThumbVisual = {
  gradient: "from-blush/40 via-violet/40 to-neon/40",
  mainIcon: "✨",
  floaters: [{ emoji: "💫", style: "top-2 right-3 text-sm" }, { emoji: "⭐", style: "bottom-3 left-4 text-xs" }],
  pattern: "dots",
};

const patternSvgs: Record<string, string> = {
  dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")`,
  grid: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 24 0 L 0 0 0 24' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3C/svg%3E")`,
  waves: `url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q10 0 20 10 Q30 20 40 10' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3C/svg%3E")`,
  stars: `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='15,2 18,11 28,11 20,17 23,26 15,21 7,26 10,17 2,11 12,11' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
  diamonds: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8' y='8' width='8' height='8' transform='rotate(45 12 12)' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
};

const templateMeta: Record<string, { rating: string; shares: string; features: string[] }> = {
  "the-final-button": { rating: "4.8", shares: "2.4k", features: ["🔒 Password", "⏱ 30s"] },
  "memory-maze": { rating: "4.9", shares: "3.1k", features: ["📷 Photos", "🎵 Music", "🔒 Password", "⏱ 2 min"] },
  "birthday-surprise-journey": { rating: "4.7", shares: "1.8k", features: ["🕯️ Interactive", "🎂 Cake", "⏱ 2 min"] },
  "love-chase": { rating: "4.9", shares: "5.2k", features: ["🏃 Chase", "💖 Cute", "⏱ 1 min"] },
  "kitty-apology": { rating: "4.6", shares: "1.1k", features: ["🐱 Cute", "💌 Letter", "⏱ 30s"] },
  "come-closer": { rating: "4.5", shares: "3.7k", features: ["👻 Prank", "💥 Flash", "⏱ 15s"] },
  "birthday-journey": { rating: "4.7", shares: "1.4k", features: ["🎈 Balloons", "🕯️ Candles", "⏱ 45s"] },
  "escape-me": { rating: "4.6", shares: "890", features: ["🧩 Puzzle", "🔐 Unlock", "⏱ 30s"] },
  "sorry-maze": { rating: "4.4", shares: "720", features: ["🧭 Maze", "💎 Gems", "⏱ 30s"] },
  "our-memories": { rating: "4.9", shares: "4.3k", features: ["📷 Photos", "🎵 Music", "📖 Scrapbook", "⏱ 2 min"] },
  "love-contract": { rating: "4.8", shares: "2.9k", features: ["📜 Contract", "✍️ Sign", "🔒 Seal", "⏱ 5 min"] },
};

const ROTATING_TEMPLATES = [
  { id: "memory-maze", title: "Heart Vault" },
  { id: "love-contract", title: "Love Contract" },
  { id: "birthday-surprise-journey", title: "Blow Out the Candles" },
  { id: "love-chase", title: "Catch My Heart" },
  { id: "our-memories", title: "Our Memories" },
  { id: "escape-me", title: "Escape Me" },
];

type SectionDef = {
  id: string;
  emoji: string;
  label: string;
  filter: (t: Template, index: number, all: Template[]) => boolean;
};

const SECTIONS: SectionDef[] = [
  {
    id: "featured",
    emoji: "🔥",
    label: "Featured This Week",
    filter: (t) => ["our-memories", "love-contract", "memory-maze", "birthday-surprise-journey", "love-chase"].includes(t.id),
  },
  { id: "romantic", emoji: "❤️", label: "Romantic", filter: (t) => t.tone === "Romantic" },
  { id: "birthday", emoji: "🎂", label: "Birthday", filter: (t) => t.tone === "Birthday" },
  { id: "emotional", emoji: "😭", label: "Emotional", filter: (t) => t.tone === "Emotional" },
  { id: "funny", emoji: "😂", label: "Funny", filter: (t) => t.tone === "Funny" },
  {
    id: "new",
    emoji: "✨",
    label: "New Experiences",
    filter: (_t, _i, all) => {
      const newest = all.filter((x) => x.status === "full").slice(-5);
      return newest.includes(_t);
    },
  },
];

export default function CinematicHomepage() {
  const allTemplates = getAllTemplates();
  const [demoKey, setDemoKey] = useState(0);
  const [heroTemplateIdx, setHeroTemplateIdx] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    if (selectedTemplate) return;
    const interval = setInterval(() => {
      setDemoKey((prev) => prev + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedTemplate) return;
    const interval = setInterval(() => {
      setHeroTemplateIdx((prev) => (prev + 1) % ROTATING_TEMPLATES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedTemplate]);

  const templates = useMemo(() => allTemplates.filter((t) => t.status === "full"), [allTemplates]);

  const sections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        items: templates.filter((t, i) => section.filter(t, i, templates)),
      })).filter((s) => s.items.length > 0),
    [templates],
  );

  const currentHero = ROTATING_TEMPLATES[heroTemplateIdx];

  const handleSelectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setPreviewKey((prev) => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-[var(--text-primary)]"
    >

      {/* Ambient glow changes with selected template */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${
          selectedTemplate?.tone === "Romantic" ? "bg-pink-900/10" :
          selectedTemplate?.tone === "Birthday" ? "bg-amber-900/10" :
          selectedTemplate?.tone === "Funny" ? "bg-orange-900/10" :
          selectedTemplate?.tone === "Emotional" ? "bg-teal-900/10" :
          "bg-purple-900/10"
        }`} />
        <div className={`absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 ${
          selectedTemplate?.tone === "Romantic" ? "bg-rose-900/10" :
          selectedTemplate?.tone === "Birthday" ? "bg-violet-900/10" :
          selectedTemplate?.tone === "Funny" ? "bg-red-900/10" :
          selectedTemplate?.tone === "Emotional" ? "bg-cyan-900/10" :
          "bg-rose-900/10"
        }`} />
      </div>

      {/* ─── HERO ─── */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <HeroText
          selectedTemplate={selectedTemplate}
          onBack={handleBack}
        />

        <AnimatePresence mode="wait">
          {selectedTemplate ? (
            <motion.div
              key={selectedTemplate.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="relative flex-1 flex items-center justify-center w-full max-w-[420px] mx-auto"
            >
              <DemoPhoneDisplay
                key={`demo-${previewKey}`}
                template={selectedTemplate}
                onBack={handleBack}
              />
            </motion.div>
          ) : (
            <motion.div
              key="holographic"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="relative flex-1 flex flex-col items-center justify-center w-full"
            >
              <HolographicPhone demoKey={demoKey} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHero.id + "-badge"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 sm:mt-6 flex items-center gap-3 text-xs sm:text-sm text-white/50"
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shrink-0 shadow-[0_0_16px_var(--accent)]" />
                  <span>Now Playing: <span className="text-white/80 font-semibold">{currentHero.title}</span></span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── CATEGORY ROWS ─── */}
      {!selectedTemplate && (
        <div className="relative z-10 pb-24 sm:pb-32 space-y-8 sm:space-y-10">
          {sections.map((section) => (
            <TemplateSection
              key={section.id}
              section={section}
              onSelect={handleSelectTemplate}
            />
          ))}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium border border-[var(--border-subtle)] transition-all shadow-[var(--shadow-soft)]"
            >
              Browse All Experiences <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

    </main>
  );
}

// ──────────────────────────────────────────────
// Hero Text
// ──────────────────────────────────────────────

function HeroText({ selectedTemplate, onBack }: { selectedTemplate: Template | null; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex-1 max-w-lg text-center lg:text-left"
    >
      {selectedTemplate ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 justify-center lg:justify-start"
          >
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
              aria-label="Back to featured"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
              Featured
            </button>
          </motion.div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-2">
            {selectedTemplate.title}
          </h1>
          <p className="text-base sm:text-lg text-white/50 mb-3 italic">
            {selectedTemplate.hook}
          </p>
          <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">{selectedTemplate.length}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">Best for: {selectedTemplate.bestFor}</span>
          </div>
          <Link
            href={`/create/${selectedTemplate.slug}`}
            className="premium-button inline-flex items-center gap-2 !rounded-full !px-6 sm:!px-8 !py-3 sm:!py-4 text-sm sm:text-base font-medium"
          >
            Create This Experience <ArrowRight size={18} />
          </Link>
        </>
      ) : (
        <>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight tracking-tight mb-3 sm:mb-4">
            Explore Interactive Experiences
          </h1>
          <p className="font-serif text-xl sm:text-2xl md:text-3xl font-light italic text-white/60 mb-6 sm:mb-8">
            Send an experience. Not just a message.
          </p>
          <p className="text-sm sm:text-base text-white/40 mb-8 sm:mb-10 max-w-sm mx-auto lg:mx-0">
            Don&apos;t just send a text. Wrap your message in a cinematic, interactive experience they&apos;ll never forget.
          </p>
          <Link
            href="/templates"
            className="premium-button inline-flex items-center gap-2 !rounded-full !px-6 sm:!px-8 !py-3 sm:!py-4 text-sm sm:text-base font-medium"
            aria-label="Browse all interactive experiences"
          >
            Browse Experiences <ArrowRight size={18} />
          </Link>
        </>
      )}
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Template Section (Netflix-style horizontal row)
// ──────────────────────────────────────────────

function TemplateSection({
  section,
  onSelect,
}: {
  section: { id: string; emoji: string; label: string; items: Template[] };
  onSelect: (template: Template) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.75, el.scrollWidth - el.clientWidth);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [updateScrollButtons]);

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-white/90">
          {section.emoji} {section.label}
        </h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="relative group/row">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-8 sm:w-12 bg-gradient-to-r from-[#08080A] to-transparent flex items-center justify-start opacity-0 group-hover/row:opacity-100 transition-opacity max-sm:hidden"
            aria-label="Scroll left"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 4L6 8l4 4"/></svg>
            </div>
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scrollbar-none snap-x snap-mandatory -mx-4 sm:mx-0 px-4 sm:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {section.items.map((template) => (
            <div key={template.id} className="snap-start shrink-0 w-[200px] sm:w-[240px]">
              <ShowcaseCard template={template} onSelect={onSelect} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-8 sm:w-12 bg-gradient-to-l from-[#08080A] to-transparent flex items-center justify-end opacity-0 group-hover/row:opacity-100 transition-opacity max-sm:hidden"
            aria-label="Scroll right"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4"/></svg>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// Showcase Card
// ──────────────────────────────────────────────

function ShowcaseCard({ template, onSelect }: { template: Template; onSelect: (t: Template) => void }) {
  const v = thumbVisuals[template.id] || defaultVisual;
  const meta = templateMeta[template.id];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${template.title} — ${template.bestFor}`}
      className="relative cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] group/card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onSelect(template)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(template); } }}
    >
      <div className={`relative aspect-[3/4] w-full bg-gradient-to-br ${v.gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: patternSvgs[v.pattern], backgroundSize: v.pattern === "waves" ? "40px 20px" : v.pattern === "grid" ? "24px 24px" : "20px 20px" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        />

        {v.floaters.map((f, i) => (
          <motion.span
            key={i}
            className={`absolute select-none ${f.style}`}
            animate={isHovered ? { y: [0, -5, 0], scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            {f.emoji}
          </motion.span>
        ))}

        <div className="relative z-10">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 opacity-0 group-hover/card:opacity-60 transition-all duration-500" />
          <motion.span
            className="relative text-3xl sm:text-5xl drop-shadow-2xl block"
            animate={isHovered ? { scale: [1, 1.15, 1], rotate: [0, 5, -2, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            {v.mainIcon}
          </motion.span>
        </div>

        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white/80 backdrop-blur-sm ring-1 ring-white/10">
            {template.length}
          </span>
        </div>

        {meta && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-amber-300 backdrop-blur-sm ring-1 ring-white/10">
              ⭐ {meta.rating}
            </span>
          </div>
        )}

        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={isHovered ? { scale: 1 } : { scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
          </motion.div>
        </motion.div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-extrabold text-white/90 group-hover/card:text-white transition-colors leading-tight line-clamp-1">
          {template.title}
        </h3>

        <p className="mt-1 text-[11px] sm:text-xs text-white/50 line-clamp-2 leading-relaxed">
          {template.hook}
        </p>

        {meta && (
          <div className="mt-2 flex flex-wrap gap-1">
            {meta.features.slice(0, 3).map((feat) => (
              <span key={feat} className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold text-white/40 ring-1 ring-white/5">
                {feat}
              </span>
            ))}
          </div>
        )}

        <motion.div
          className="mt-2 sm:mt-3"
          initial={{ opacity: 0, y: 6 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
        >
          <span className="block w-full rounded-lg bg-gradient-to-r from-blush/80 to-violet/80 py-2 text-center text-[10px] sm:text-xs font-extrabold text-white shadow-lg">
            Live Demo
          </span>
        </motion.div>
      </div>

      <motion.div
        className="absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Demo Phone Display (inline demo player)
// ──────────────────────────────────────────────

function DemoPhoneDisplay({ template, onBack }: { template: Template; onBack: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const experience = useMemo(() => createDemoExperience(template), [template]);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="relative w-full flex items-center justify-center"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute -top-3 -right-2 sm:-top-4 sm:-right-3 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
        aria-label="Close demo"
      >
        <X size={14} className="text-white/70" />
      </button>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[280px] sm:w-[320px] bg-black rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-[#1a1a1a] overflow-hidden shadow-2xl"
      >
        {/* Glass glare */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent z-10 pointer-events-none rounded-[1.8rem]" />

        {/* Camera dot */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#1a1a1a] border-2 border-[#333] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#222]" />
        </div>

        {/* Demo content */}
        <div className="relative w-full pt-4 sm:pt-5 bg-zinc-950">
          <div className="aspect-[9/16] w-full max-h-[460px] sm:max-h-[520px]">
            <ScaledPhonePreview>
              <ExperiencePlayer
                template={template}
                experience={experience}
                mode="demo"
              />
            </ScaledPhonePreview>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-24 sm:w-28 h-[3px] sm:h-[4px] rounded-full bg-white/20" />

        {/* Ambient glow */}
        <div className="absolute -inset-4 bg-gradient-to-br from-white/5 to-transparent rounded-[2.8rem] -z-10 blur-2xl opacity-50" />
      </motion.div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────
// Holographic Phone (default hero)
// ──────────────────────────────────────────────

function HolographicPhone({ demoKey }: { demoKey: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUnlocking] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const cursorVariants = {
    initial: { x: -50, y: 300, opacity: 0, scale: 0.8 },
    moveToPassword: { x: 100, y: 240, opacity: 1, scale: 1, transition: { duration: 1, delay: 0.5 } },
    tapPassword: { scale: 0.7, transition: { duration: 0.2, delay: 1.5 } },
    releaseTap: { scale: 1, transition: { duration: 0.2, delay: 1.7 } },
    moveToUnlock: { x: 100, y: 320, opacity: 1, scale: 1, transition: { duration: 0.8, delay: 2.5 } },
    tapUnlock: { scale: 0.7, transition: { duration: 0.2, delay: 3.3 } },
    releaseUnlock: { scale: 1, transition: { duration: 0.2, delay: 3.5 } },
    moveOut: { x: 350, y: 400, opacity: 0, scale: 0.8, transition: { duration: 1, delay: 4 } },
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="relative w-full max-w-[360px] sm:max-w-[400px] flex items-center justify-center"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[260px] sm:w-[300px] bg-black rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-[#1a1a1a] overflow-hidden shadow-2xl"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-rose-900/30 z-0"
          style={{ transform: "translateZ(-50px) scale(1.2)" }}
        />
        <motion.div
          className="absolute top-1/4 left-1/2 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full blur-[30px] sm:blur-[40px] z-0"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transform: "translateZ(-20px)" }}
        />

        <div className="absolute inset-0 z-20 flex">
          <motion.div
            key={`left-${demoKey}`}
            className="w-1/2 h-full bg-gradient-to-l from-gray-900 to-black border-r border-white/10"
            initial={{ x: 0 }}
            animate={isUnlocking ? { x: "-120%", rotateY: -45 } : { x: 0 }}
            transition={{ duration: 1, delay: 3.5, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
          />
          <motion.div
            key={`right-${demoKey}`}
            className="w-1/2 h-full bg-gradient-to-r from-gray-900 to-black border-l border-white/10"
            initial={{ x: 0 }}
            animate={isUnlocking ? { x: "120%", rotateY: 45 } : { x: 0 }}
            transition={{ duration: 1, delay: 3.5, ease: "easeInOut" }}
            style={{ transformOrigin: "right" }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={demoKey}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 sm:p-8 text-center"
            style={{ transform: "translateZ(40px)" }}
          >
            <motion.div
              className="mb-6 sm:mb-8 text-white/80"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="sm:w-12 sm:h-12">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </motion.div>

            <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8" aria-label="Password input, 4 dots">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/40"
                  initial={{ backgroundColor: "transparent" }}
                  animate={{ backgroundColor: ["transparent", "transparent", "white", "white"] }}
                  transition={{ duration: 2, delay: 1.6 + i * 0.2, times: [0, 0.2, 0.4, 1] }}
                />
              ))}
            </div>

            <motion.div
              className="px-5 sm:px-6 py-1.5 sm:py-2 border border-white/30 rounded-full text-xs sm:text-sm text-white/80"
              animate={{ backgroundColor: ["transparent", "transparent", "rgba(255,255,255,0.2)", "transparent"] }}
              transition={{ duration: 1, delay: 3.3, times: [0, 0.3, 0.5, 1] }}
            >
              Unlock
            </motion.div>

            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1] }}
              transition={{ duration: 1, delay: 4.5, times: [0, 0.5, 1] }}
            >
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/40 mb-3 sm:mb-4">Your Message</p>
              <p className="font-serif text-sm sm:text-lg italic px-4">
                &quot;I love you more than words can say...&quot;
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`cursor-${demoKey}`}
          className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 border border-white/50 backdrop-blur-sm z-30 pointer-events-none"
          style={{ x: 0, y: 0, left: 0, top: 0 }}
          variants={cursorVariants}
          initial="initial"
          animate="moveToPassword"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 0] }}
          transition={{ duration: 1, delay: 6, times: [0, 0.85, 0.9, 1] }}
        />
      </motion.div>
    </motion.div>
  );
}
