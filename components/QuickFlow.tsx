"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { pickTemplate } from "@/lib/pickTemplate";
import { ExperiencePreview } from "@/components/ExperiencePreview";
import { Spinner } from "@/components/Spinner";
import type { ExperienceRecord } from "@/lib/types";

const QUICK_TEMPLATES = [
  { emoji: "💖", label: "Love", slug: "love", hint: "I love the way you make me feel every single day." },
  { emoji: "💔", label: "Sorry", slug: "sorry", hint: "I'm sorry for what I said. I didn't mean it." },
  { emoji: "😂", label: "Funny", slug: "funny", hint: "I made this just for you. Promise me you'll keep smiling like this." },
  { emoji: "🎂", label: "Birthday", slug: "birthday", hint: "Happy birthday to the person who makes life brighter just by being in it." },
  { emoji: "🏆", label: "Roast", slug: "roast", hint: "Come closer. I've been saving this one just for you." },
  { emoji: "💓", label: "Memory", slug: "memory", hint: "Every heartbeat holds a story. Some are just waiting to be unlocked." },
];

export function QuickFlow() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [experience, setExperience] = useState<ExperienceRecord | null>(null);
  const { t } = useTranslation();

  const generate = useCallback(async () => {
    const msg = text.trim();
    if (!msg) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: pickTemplate(msg),
          finalMessage: msg,
          showCreatorName: true,
          customMessages: { landingText: msg.slice(0, 120), buttonText: "Open", steps: ["Here's something for you..."], ctaMessage: "Made with 💖" },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.id) { setError(json.error || "Could not generate."); return; }
      setExperience(json.experience);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }, [text]);

  if (experience) {
    return <ExperiencePreview experience={experience} onClose={() => { setExperience(null); setText(""); }} />;
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="display-title text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
        {t("site.tagline")}
      </h1>
      <p className="mt-4 max-w-lg text-lg text-white/60">
        {t("site.description")}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("home.quick.placeholder")}
        rows={4}
        aria-label="Your message"
        className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/8 px-5 py-4 text-center text-lg text-white placeholder-white/30 backdrop-blur-sm outline-none transition-all focus:border-white/30 focus:bg-white/12"
        maxLength={520}
      />

      {/* ─── Mood illustrations ─── */}
      <div className="mt-8 grid w-full max-w-2xl grid-cols-3 gap-3 sm:grid-cols-6">
        {[
          { emoji: "💖", labelKey: "mood.love", slug: "love", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop&auto=format", overlay: "from-pink-500/70 to-rose-600/70" },
          { emoji: "💔", labelKey: "mood.sorry", slug: "sorry", img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop&auto=format", overlay: "from-slate-600/70 to-slate-900/70" },
          { emoji: "😂", labelKey: "mood.funny", slug: "funny", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format", overlay: "from-amber-400/70 to-orange-500/70" },
          { emoji: "🎂", labelKey: "mood.birthday", slug: "birthday", img: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop&auto=format", overlay: "from-violet-500/70 to-purple-700/70" },
          { emoji: "🏆", labelKey: "mood.roast", slug: "roast", img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=300&fit=crop&auto=format", overlay: "from-red-500/70 to-red-700/70" },
          { emoji: "💓", labelKey: "mood.memory", slug: "memory", img: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=300&fit=crop&auto=format", overlay: "from-teal-400/70 to-cyan-600/70" },
        ].map((m) => (
          <Link key={m.slug} href={`/mood/${m.slug}`}
            className="group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity" style={{ backgroundImage: `url(${m.img})` }} />
            <div className={`absolute inset-0 bg-gradient-to-br ${m.overlay}`} />
            <span className="relative z-10 text-2xl sm:text-3xl">{m.emoji}</span>
            <span className="relative z-10 text-[10px] font-bold tracking-wide text-white/90">{t(m.labelKey)}</span>
          </Link>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-semibold text-white/50">{t("home.quick.mood.hint")}</p>

      <button
        type="button"
        disabled={loading || !text.trim()}
        onClick={generate}
        className="premium-button mt-6 min-w-[200px] disabled:opacity-40"
      >
        {loading ? <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> {t("home.quick.generating")}</span> : t("home.quick.create")}
      </button>
      {error && <p className="mt-4 rounded-2xl border border-rose-200/30 bg-rose-300/10 px-5 py-3 text-sm font-bold text-rose-100" role="alert">{error}</p>}
    </div>
  );
}
