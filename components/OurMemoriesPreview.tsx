"use client";

import { useState } from "react";

const PINK = "#d4899e";
const CREAM = "#faf5f0";
const BROWN = "#3d2c2c";
const MUTED = "#8c7a7a";
const GOLD = "#c9a87c";

const DEMO = {
  heroHeading: "Hey Cutie ❤️",
  heroSubtitle: "I collected every heartbeat, every laugh, every quiet glance between us and tucked them somewhere safe.",
  heroImage: "/models/assets/Cat%20kiss.gif",
  introText: "I could tell you about a thousand moments. But some feelings can only be felt, not explained.",
  pics: [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&h=800&fit=crop&auto=format",
  ],
  memories: [
    { title: "The First Time My World Stopped", caption: "I didn't just see you that day. I felt you.", note: "Your smile made me believe in love at first sight." },
    { title: "You, in the Silence", caption: "Your hand fit perfectly in mine, like it was always meant to be there.", note: "Just you, just me, just real." },
    { title: "The Memory I'd Live In Forever", caption: "The second I realized I never wanted to love anyone but you.", note: "I want to feel it over and over again." },
  ],
  interludeQuotes: [
    "Some memories don't fade. They stay in your chest and breathe with you.",
    "Not every moment becomes a memory. But you became my everything.",
  ],
  promises: [
    "I promise to love you not just when it's easy, but especially when it's hard.",
    "I promise to be the reason you smile, even on days when your heart feels heavy.",
    "I promise to never stop choosing you every single day.",
  ],
  finalLines: [
    "Thank you for being the best part of every single one of my days.",
    "I want every sunrise, every sunset, every breath in between\u2014with you.",
  ],
  endingImage: "/models/assets/asset%2002.png",
  closingQuote: "Some people search their whole lives for what we found. I stopped searching the day I found you.",
};

export function OurMemoriesPreview() {
  const [section, setSection] = useState(0);
  const totalSections = 6;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setSection(Math.min(idx, totalSections - 1));
  };

  return (
    <div className="flex h-full w-full flex-col" style={{ background: CREAM, color: BROWN }}>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain" onScroll={handleScroll}>
        {/* ─── Hero ─── */}
        <section className="relative flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-4 h-40 w-40 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/30">
            <img src={DEMO.heroImage} alt="" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-xl font-black leading-tight" style={{ fontFamily: "'Caveat', cursive", color: BROWN }}>{DEMO.heroHeading}</h1>
          <p className="mt-3 max-w-xs text-xs leading-relaxed" style={{ color: MUTED }}>{DEMO.heroSubtitle}</p>
          <div className="mt-6 flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill={PINK}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span className="text-xs font-bold tracking-wider" style={{ color: MUTED }}>SCROLL DOWN</span>
          </div>
        </section>

        {/* ─── Intro ─── */}
        <section className="flex min-h-full flex-col items-center justify-center px-8 py-10 text-center">
          <p className="text-sm leading-relaxed italic" style={{ color: BROWN }}>{DEMO.introText}</p>
          <div className="mt-4 h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
        </section>

        {/* ─── Photos ─── */}
        <section className="flex min-h-full flex-col items-center justify-center gap-3 px-6 py-8">
          <div className="grid grid-cols-3 gap-2">
            {DEMO.pics.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl shadow-md" style={{ aspectRatio: "3/4" }}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: MUTED }}>Our moments</p>
        </section>

        {/* ─── Memories ─── */}
        <section className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-8">
          {DEMO.memories.map((m, i) => (
            <div key={i} className="w-full rounded-xl p-4 text-center shadow-sm" style={{ background: "#fff", borderLeft: `3px solid ${PINK}` }}>
              <p className="text-xs font-bold" style={{ color: BROWN }}>{m.title}</p>
              <p className="mt-1 text-[11px] leading-relaxed" style={{ color: MUTED }}>{m.caption}</p>
              <p className="mt-2 text-[10px] italic" style={{ color: PINK }}>{m.note}</p>
            </div>
          ))}
        </section>

        {/* ─── Promises ─── */}
        <section className="flex min-h-full flex-col items-center justify-center gap-3 px-6 py-8 text-center">
          <p className="text-xs font-black tracking-wider uppercase" style={{ color: GOLD }}>I Promise</p>
          {DEMO.promises.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span style={{ color: PINK }}>❤️</span>
              <p className="text-xs leading-relaxed" style={{ color: BROWN }}>{p}</p>
            </div>
          ))}
        </section>

        {/* ─── Final ─── */}
        <section className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-10 text-center">
          <div className="mb-2 h-32 w-32 overflow-hidden rounded-full shadow-lg ring-2 ring-white/30">
            <img src={DEMO.endingImage} alt="" className="h-full w-full object-contain" />
          </div>
          {DEMO.finalLines.map((line, i) => (
            <p key={i} className="text-sm leading-relaxed italic" style={{ color: BROWN }}>{line}</p>
          ))}
          <p className="mt-2 text-xs" style={{ color: MUTED }}>{DEMO.closingQuote}</p>
          <p className="mt-2 text-sm font-bold" style={{ color: PINK, fontFamily: "'Caveat', cursive" }}>— From someone who loves you</p>
        </section>
      </div>

      {/* Section dots */}
      <div className="flex justify-center gap-1.5 py-2" style={{ background: CREAM }}>
        {Array.from({ length: totalSections }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === section ? 20 : 6, background: i === section ? PINK : `${MUTED}44` }} />
        ))}
      </div>
    </div>
  );
}
