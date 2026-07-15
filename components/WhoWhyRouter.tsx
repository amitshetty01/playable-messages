"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { templates } from "@/lib/data";
import type { Template } from "@/lib/types";

type WhoKey = "partner" | "friend" | "parent" | "coworker" | "";
type WhyKey = "apology" | "birthday" | "confession" | "thankyou" | "";

const WHO_OPTIONS: { key: WhoKey; emoji: string; label: string }[] = [
  { key: "partner", emoji: "💕", label: "Partner" },
  { key: "friend", emoji: "🤝", label: "Friend" },
  { key: "parent", emoji: "👨‍👩‍👧‍👦", label: "Parent" },
  { key: "coworker", emoji: "💼", label: "Co-worker" },
];

const WHY_OPTIONS: { key: WhyKey; emoji: string; label: string }[] = [
  { key: "apology", emoji: "💔", label: "Apology" },
  { key: "birthday", emoji: "🎂", label: "Birthday" },
  { key: "confession", emoji: "💌", label: "Confession" },
  { key: "thankyou", emoji: "🙏", label: "Thank You" },
];

const bestTemplates: Record<string, string[]> = {
  "partner-apology": ["kitty-apology", "sorry-maze", "love-chase"],
  "partner-birthday": ["birthday-surprise-journey", "birthday-journey", "our-memories"],
  "partner-confession": ["the-final-button", "love-chase", "escape-me"],
  "partner-thankyou": ["our-memories", "love-chase", "memory-maze"],
  "friend-apology": ["kitty-apology", "sorry-maze", "come-closer"],
  "friend-birthday": ["birthday-surprise-journey", "birthday-journey", "our-memories"],
  "friend-confession": ["the-final-button", "escape-me", "love-chase"],
  "friend-thankyou": ["our-memories", "memory-maze", "kitty-apology"],
  "parent-apology": ["kitty-apology", "sorry-maze", "love-chase"],
  "parent-birthday": ["birthday-surprise-journey", "birthday-journey", "our-memories"],
  "parent-confession": ["the-final-button", "escape-me", "our-memories"],
  "parent-thankyou": ["our-memories", "memory-maze", "kitty-apology"],
  "coworker-apology": ["kitty-apology", "sorry-maze", "come-closer"],
  "coworker-birthday": ["birthday-surprise-journey", "birthday-journey", "our-memories"],
  "coworker-confession": ["the-final-button", "escape-me", "come-closer"],
  "coworker-thankyou": ["our-memories", "memory-maze", "kitty-apology"],
};

function getBestThree(who: WhoKey, why: WhyKey): Template[] {
  if (!who || !why) return [];
  const key = `${who}-${why}`;
  const ids = bestTemplates[key] ?? [];
  return ids.map((id) => templates.find((t) => t.id === id)).filter(Boolean) as Template[];
}

type WhoWhyRouterProps = {
  onCreateClick: () => void;
};

export function WhoWhyRouter({ onCreateClick }: WhoWhyRouterProps) {
  const [who, setWho] = useState<WhoKey>("");
  const [why, setWhy] = useState<WhyKey>("");

  const matched = useMemo(() => getBestThree(who, why), [who, why]);
  const showResults = who && why && matched.length > 0;

  function reset() {
    setWho("");
    setWhy("");
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!who && (
          <motion.div
            key="who"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <p className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase mb-4">
              Step 1 of 2
            </p>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              Who is this for?
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {WHO_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setWho(opt.key)}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:-translate-y-1 active:scale-95 min-w-[120px]"
                >
                  <span className="text-3xl transition-transform duration-300 group-hover:scale-125">
                    {opt.emoji}
                  </span>
                  <span className="text-sm font-bold text-white/70 group-hover:text-white">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {who && !why && (
          <motion.div
            key="why"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <p className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase mb-4">
              Step 2 of 2
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-white/40">For</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-bold text-white">
                {WHO_OPTIONS.find((o) => o.key === who)?.emoji}{" "}
                {WHO_OPTIONS.find((o) => o.key === who)?.label}
              </span>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-white/30 hover:text-white/60 underline underline-offset-2"
              >
                Change
              </button>
            </div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              What&apos;s the vibe?
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {WHY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setWhy(opt.key)}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 transition-all hover:border-white/25 hover:bg-white/[0.08] hover:-translate-y-1 active:scale-95 min-w-[120px]"
                >
                  <span className="text-3xl transition-transform duration-300 group-hover:scale-125">
                    {opt.emoji}
                  </span>
                  <span className="text-sm font-bold text-white/70 group-hover:text-white">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {showResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-bold text-white">
                {WHO_OPTIONS.find((o) => o.key === who)?.emoji}{" "}
                {WHO_OPTIONS.find((o) => o.key === who)?.label}
              </span>
              <span className="text-white/30">&rarr;</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-bold text-white">
                {WHY_OPTIONS.find((o) => o.key === why)?.emoji}{" "}
                {WHY_OPTIONS.find((o) => o.key === why)?.label}
              </span>
            </div>
            <p className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase mb-4">
              Perfect templates for you
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {matched.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 text-left transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(201,168,204,0.12)] flex-1 max-w-[220px] mx-auto sm:mx-0"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-lg ring-1 ring-white/10">
                      {t.id === "the-final-button" ? "🎯" :
                       t.id === "love-chase" ? "💖" :
                       t.id === "kitty-apology" ? "🐱" :
                       t.id === "sorry-maze" ? "💛" :
                       t.id === "birthday-surprise-journey" ? "🎂" :
                       t.id === "our-memories" ? "📖" :
                       t.id === "memory-maze" ? "💜" :
                       t.id === "escape-me" ? "🧩" :
                       t.id === "come-closer" ? "👻" :
                       t.id === "birthday-journey" ? "🎈" : "✨"}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-extrabold text-white truncate">{t.title}</h4>
                      <p className="text-[10px] font-medium text-white/40">{t.length}</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-white/50 line-clamp-2 mb-4">
                    {t.description}
                  </p>
                  <Link
                    href={`/create/${t.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block w-full rounded-lg bg-gradient-to-r from-blush/80 to-violet/80 py-2.5 text-center text-xs font-extrabold text-white shadow transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Create
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onCreateClick}
                className="text-xs text-white/50 underline underline-offset-4 hover:text-white/70 transition-colors"
              >
                Not sure? Let me type my own message
              </button>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-white/50 underline underline-offset-4 hover:text-white/70 transition-colors"
              >
                Start over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
