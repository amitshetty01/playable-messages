import Link from "next/link";
import { categories, getTemplateSeoSlug } from "@/lib/data";
import type { Template } from "@/lib/types";

type ThumbVisual = {
  gradient: string;
  mainIcon: string;
  floaters: { emoji: string; style: string }[];
  pattern: "dots" | "grid" | "waves" | "stars" | "diamonds";
};

const MECHANICS: Record<string, { icon: string; label: string }> = {
  "the-final-button": { icon: "🎯", label: "Dodge" },
  "memory-maze": { icon: "🧩", label: "Match" },
  "birthday-surprise-journey": { icon: "🎈", label: "Explore" },
  "love-chase": { icon: "🏃", label: "Chase" },
  "kitty-apology": { icon: "🐱", label: "Pet" },
  "come-closer": { icon: "👻", label: "Reveal" },
  "birthday-journey": { icon: "🕯️", label: "Blow" },
  "escape-me": { icon: "🔐", label: "Escape" },
  "sorry-maze": { icon: "🧭", label: "Navigate" },
  "our-memories": { icon: "📖", label: "Browse" },
  "type-or-else": { icon: "💣", label: "Type" },
  "the-last-deleted-message": { icon: "📩", label: "Tap" },
  "the-risk-button": { icon: "🎲", label: "Risk" },
  "dont-smile-challenge": { icon: "😐", label: "Stare" },
  "scratch-card": { icon: "💳", label: "Scratch" },
  "roast-to-respect": { icon: "🔥", label: "Climb" },
  "secret-letter": { icon: "✉️", label: "Unfold" },
  "surprise-room": { icon: "🚪", label: "Open" },
};

const thumbVisuals: Record<string, ThumbVisual> = {
  "the-final-button": {
    gradient: "from-pink-600 via-rose-500 to-fuchsia-700",
    mainIcon: "🎯",
    floaters: [{ emoji: "💘", style: "top-2 left-3 text-xs animate-bounce-soft" }, { emoji: "✨", style: "top-4 right-5 text-lg animate-spin-slow" }, { emoji: "💖", style: "bottom-4 left-5 text-sm animate-float-slow" }],
    pattern: "stars",
  },
  "memory-maze": {
    gradient: "from-teal-600 via-emerald-500 to-cyan-700",
    mainIcon: "💜",
    floaters: [{ emoji: "🌀", style: "top-2 right-3 text-sm animate-spin-slow" }, { emoji: "🔮", style: "bottom-3 left-4 text-base animate-float-slow" }, { emoji: "✨", style: "top-5 left-2 text-xs" }],
    pattern: "grid",
  },
  "birthday-surprise-journey": {
    gradient: "from-violet-600 via-purple-500 to-fuchsia-700",
    mainIcon: "🎂",
    floaters: [{ emoji: "🎈", style: "top-2 right-4 text-lg animate-sway-gentle" }, { emoji: "🎉", style: "bottom-3 left-3 text-sm animate-bounce-soft" }, { emoji: "⭐", style: "top-3 left-6 text-xs animate-pulse" }],
    pattern: "stars",
  },
  "love-chase": {
    gradient: "from-rose-600 via-pink-500 to-red-700",
    mainIcon: "💖",
    floaters: [{ emoji: "🏃", style: "top-3 right-3 text-lg animate-float-slow" }, { emoji: "💕", style: "bottom-4 left-4 text-sm animate-bounce-soft" }, { emoji: "🔥", style: "top-2 left-5 text-xs" }],
    pattern: "dots",
  },
  "kitty-apology": {
    gradient: "from-sky-600 via-indigo-500 to-slate-800",
    mainIcon: "🐱",
    floaters: [{ emoji: "💔", style: "top-2 right-4 text-sm animate-float-slow" }, { emoji: "🧶", style: "bottom-3 left-3 text-base animate-sway-gentle" }, { emoji: "🥺", style: "top-4 left-2 text-xs animate-pulse" }],
    pattern: "dots",
  },
  "come-closer": {
    gradient: "from-amber-600 via-orange-500 to-red-700",
    mainIcon: "👻",
    floaters: [{ emoji: "👀", style: "top-2 right-3 text-lg animate-bounce-soft" }, { emoji: "🕯️", style: "bottom-3 left-4 text-base animate-float-slow" }, { emoji: "💀", style: "top-4 left-5 text-xs" }],
    pattern: "waves",
  },
  "birthday-journey": {
    gradient: "from-indigo-600 via-violet-500 to-purple-800",
    mainIcon: "🎈",
    floaters: [{ emoji: "🎁", style: "top-2 right-4 text-lg animate-bounce-soft" }, { emoji: "🕯️", style: "bottom-3 left-3 text-sm animate-float-slow" }, { emoji: "✨", style: "top-3 left-6 text-xs animate-pulse" }],
    pattern: "stars",
  },
  "escape-me": {
    gradient: "from-fuchsia-600 via-purple-500 to-violet-800",
    mainIcon: "🧩",
    floaters: [{ emoji: "🔐", style: "top-2 right-3 text-lg animate-bounce-soft" }, { emoji: "🗝️", style: "bottom-3 left-4 text-base animate-float-slow" }, { emoji: "👁️", style: "top-4 left-2 text-xs" }],
    pattern: "grid",
  },
  "sorry-maze": {
    gradient: "from-amber-500 via-orange-400 to-yellow-600",
    mainIcon: "💛",
    floaters: [{ emoji: "🧭", style: "top-2 right-3 text-lg animate-spin-slow" }, { emoji: "💎", style: "bottom-3 left-4 text-base animate-float-slow" }, { emoji: "⭐", style: "top-4 left-2 text-xs animate-pulse" }],
    pattern: "stars",
  },
  "our-memories": {
    gradient: "from-pink-300 via-rose-400 to-blush-500",
    mainIcon: "📖",
    floaters: [{ emoji: "💕", style: "top-2 right-3 text-sm animate-float-slow" }, { emoji: "✨", style: "bottom-3 left-4 text-base animate-pulse" }, { emoji: "🌹", style: "top-4 left-2 text-xs animate-sway-gentle" }],
    pattern: "stars",
  },
};

const defaultVisual: ThumbVisual = {
  gradient: "from-blush/40 via-violet/40 to-neon/40",
  mainIcon: "✨",
  floaters: [{ emoji: "💫", style: "top-2 right-3 text-sm animate-float-slow" }, { emoji: "⭐", style: "bottom-3 left-4 text-xs animate-pulse" }],
  pattern: "dots",
};

export function TemplateCard({ template }: { template: Template }) {
  const isLocked = template.status === "coming-soon";
  const categoryNames = template.categorySlugs.map((slug) => categories.find((category) => category.slug === slug)?.name).filter(Boolean).join(", ");
  const v = thumbVisuals[template.id] || defaultVisual;

  const patternSvgs: Record<string, string> = {
    dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")`,
    grid: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 24 0 L 0 0 0 24' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3C/svg%3E")`,
    waves: `url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q10 0 20 10 Q30 20 40 10' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3C/svg%3E")`,
    stars: `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='15,2 18,11 28,11 20,17 23,26 15,21 7,26 10,17 2,11 12,11' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
    diamonds: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8' y='8' width='8' height='8' transform='rotate(45 12 12)' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
  };

  return (
    <article
      data-glow-color={template.categorySlugs.includes("love-crush") ? "blush" : template.categorySlugs.includes("apology-fight-repair") ? "violet" : template.categorySlugs.includes("funny-roast") ? "rose" : template.categorySlugs.includes("birthday-special-days") ? "amber" : template.categorySlugs.includes("friendship-best-friend") ? "neon" : "violet"}
      className={`card-sheen glass group relative overflow-hidden rounded-[1.6rem] sm:rounded-[1.8rem] ${isLocked ? "opacity-50" : ""}`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
        e.currentTarget.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty("--mx", "50%");
        e.currentTarget.style.setProperty("--my", "50%");
      }}
    >
      {/* Thumbnail */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${v.gradient} flex items-center justify-center overflow-hidden`}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: patternSvgs[v.pattern], backgroundSize: v.pattern === "waves" ? "40px 20px" : v.pattern === "grid" ? "24px 24px" : "20px 20px" }} />

        {/* Diagonal overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.15) 6px, rgba(255,255,255,0.15) 7px)" }} />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Floating decorative elements */}
        {v.floaters.map((f, i) => (
          <span key={i} className={`absolute select-none transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-1 ${f.style}`} style={{ transitionDelay: `${i * 60}ms` }}>{f.emoji}</span>
        ))}

        {/* Main emoji with glow */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 opacity-0 group-hover:opacity-60 transition-all duration-500" />
          <span className="relative text-4xl drop-shadow-2xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">{v.mainIcon}</span>
        </div>

        {/* Hover shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Mechanic badge - micro-interactive hover hint */}
        {MECHANICS[template.id] && (
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur-sm ring-1 ring-white/15">
              <span className="text-xs">{MECHANICS[template.id].icon}</span>
              <span>{MECHANICS[template.id].label}</span>
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute bottom-2 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold text-white-static backdrop-blur-sm ring-1 ring-white/10">{template.length}</span>
          {!isLocked && <span className="rounded-full bg-emerald-500/25 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur-sm ring-1 ring-emerald-400/20">Live</span>}
        </div>
      </div>
      <div className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-white/50">
          <span className={isLocked ? "" : "pulse-dot"} />
          {isLocked ? "Coming soon" : "Ready to play"}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
        {isLocked ? (
          <span className="text-white/50">{template.title}</span>
        ) : (
          <Link className="transition duration-200 hover:text-blush" href={`/templates/${getTemplateSeoSlug(template)}`}>{template.title}</Link>
        )}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/50">Best for: {template.bestFor}</span>
        {template.categorySlugs.length > 0 ? <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/50">{categoryNames}</span> : null}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {isLocked ? (
          <div className="flex w-full items-center justify-center py-4">
            <span className="inline-block text-4xl animate-lock-shake select-none">🔒</span>
          </div>
        ) : (
          <>
            <Link className="ghost-button flex-1 text-sm" href={template.id === "our-memories" ? "/our-memories" : `/demo/${template.id}`}>
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V8.688z" /></svg>
              Preview
            </Link>
            <Link className="premium-button flex-1 text-sm" href={template.id === "our-memories" ? "/our-memories?edit=true" : `/create/${template.id}`}>Use template</Link>
          </>
        )}
      </div>
      </div>
    </article>
  );
}
