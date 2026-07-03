"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { templates } from "@/lib/data";
import type { Template } from "@/lib/types";

type TemplateVisuals = {
  id: string;
  emoji: string;
  gradient: string;
  pattern: string;
};

const FULL_VISUALS: TemplateVisuals[] = [
  { id: "the-final-button", emoji: "🎯", gradient: "from-rose-600 via-pink-500 to-red-700", pattern: "dots" },
  { id: "love-chase", emoji: "💖", gradient: "from-violet-600 via-purple-500 to-fuchsia-700", pattern: "grid" },
  { id: "love-contract", emoji: "📜", gradient: "from-amber-500 via-orange-400 to-rose-500", pattern: "stars" },
  { id: "birthday-surprise-journey", emoji: "🎂", gradient: "from-sky-500 via-indigo-400 to-violet-600", pattern: "stars" },
  { id: "come-closer", emoji: "👻", gradient: "from-pink-500 via-blush-400 to-rose-600", pattern: "diamonds" },
  { id: "our-memories", emoji: "📖", gradient: "from-teal-500 via-emerald-400 to-cyan-500", pattern: "waves" },
  { id: "escape-me", emoji: "🧩", gradient: "from-purple-600 via-violet-500 to-indigo-700", pattern: "grid" },
  { id: "kitty-apology", emoji: "🐱", gradient: "from-pink-400 via-rose-300 to-orange-400", pattern: "dots" },
  { id: "memory-maze", emoji: "💜", gradient: "from-indigo-700 via-purple-600 to-fuchsia-700", pattern: "stars" },
  { id: "sorry-maze", emoji: "💛", gradient: "from-yellow-500 via-amber-400 to-orange-500", pattern: "diamonds" },
  { id: "birthday-journey", emoji: "🎈", gradient: "from-sky-400 via-blue-500 to-indigo-600", pattern: "waves" },
];

const patternSvgs: Record<string, string> = {
  dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")`,
  grid: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 24 0 L 0 0 0 24' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3C/svg%3E")`,
  waves: `url("data:image/svg+xml,%3Csvg width='40' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q10 0 20 10 Q30 20 40 10' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3C/svg%3E")`,
  stars: `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='15,2 18,11 28,11 20,17 23,26 15,21 7,26 10,17 2,11 12,11' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
  diamonds: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='8' y='8' width='8' height='8' transform='rotate(45 12 12)' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
};

const TRENDING_TABS = ["🔥 Trending Today", "Most Played", "Recently Added", "Staff Picks"] as const;

const TRENDING_ORDER = [
  "birthday-surprise-journey",
  "love-chase",
  "our-memories",
  "love-contract",
  "come-closer",
  "kitty-apology",
  "sorry-maze",
  "escape-me",
  "the-final-button",
  "memory-maze",
  "birthday-journey",
];

export function TrendingTemplates({ onDemo }: { onDemo: (id: string, rect?: DOMRect) => void }) {
  const allTemplates = templates
    .filter((t) => t.status === "full")
    .slice().sort((a, b) => TRENDING_ORDER.indexOf(a.id) - TRENDING_ORDER.indexOf(b.id));

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="mb-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Trending templates</h2>
          <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
          <p className="mt-4 text-lg text-white/60">The most popular experiences right now. Tap Demo to try any one live.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {allTemplates.map((t) => {
          const v = FULL_VISUALS.find((x) => x.id === t.id);
          if (!v) return null;
          return <TemplateCard key={t.id} template={t} visuals={v} onDemo={onDemo} />;
        })}
      </div>

      <div className="mt-8 text-center">
        <Link href="/templates" className="text-sm font-bold text-white/50 underline underline-offset-4 transition-colors hover:text-white/70">
          See all 50+ experiences →
        </Link>
      </div>
    </section>
  );
}

function TemplateCard({ template: t, visuals: v, onDemo }: { template: Template; visuals: TemplateVisuals; onDemo: (id: string, rect?: DOMRect) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleCardClick = useCallback(() => {
    const rect = cardRef.current?.getBoundingClientRect();
    onDemo(t.id, rect);
  }, [t.id, onDemo]);

  return (
    <div
      ref={cardRef}
      data-card
      onClick={handleCardClick}
      className="card-glow glass group relative overflow-hidden rounded-[1.4rem] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className={`relative h-28 w-full bg-gradient-to-br ${v.gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: patternSvgs[v.pattern], backgroundSize: v.pattern === "waves" ? "40px 20px" : v.pattern === "grid" ? "24px 24px" : "20px 20px" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 opacity-0 group-hover:opacity-60 transition-all duration-500" />
          <span className="relative text-4xl drop-shadow-2xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">{v.emoji}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-extrabold text-white">{t.title}</h3>
          <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-white/40">{t.length}</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-white/60">{t.hook}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold text-white/40">Best for: {t.bestFor}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); const rect = cardRef.current?.getBoundingClientRect(); onDemo(t.id, rect); }}
            className="flex-1 rounded-xl border border-white/15 bg-white/[0.06] py-2 text-xs font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            Demo
          </button>
          <Link
            href={t.id === "our-memories" ? "/our-memories?edit=true" : `/create/${t.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-xl bg-gradient-to-r from-blush/80 to-violet/80 py-2 text-center text-xs font-extrabold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95"
          >
            Create Yours
          </Link>
        </div>
      </div>
    </div>
  );
}
