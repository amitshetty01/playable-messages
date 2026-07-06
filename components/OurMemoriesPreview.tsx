"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

function Tape({ className }: { className?: string }) {
  return (
    <div
      className={`absolute top-[-6px] h-5 w-10 opacity-60 ${className || ""}`}
      style={{ background: "rgba(255,255,255,0.5)", transform: "rotate(-5deg)" }}
    />
  );
}

function ParallaxSection({
  children,
  offset,
  className,
}: {
  children: React.ReactNode;
  offset: any;
  className?: string;
}) {
  return (
    <motion.section
      style={{ y: offset }}
      className={`flex min-h-full flex-col items-center justify-center px-6 py-10 text-center ${className || ""}`}
    >
      {children}
    </motion.section>
  );
}

export function OurMemoriesPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const imgParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textParallax = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="flex h-full w-full flex-col" style={{ background: CREAM, color: BROWN }}>
      <div ref={containerRef} className="flex-1 overflow-y-auto overscroll-contain">
        {/* Hero */}
        <ParallaxSection offset={textParallax}>
          <motion.div className="mb-4 h-52 w-52 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/30" style={{ y: imgParallax }}>
            <img src={DEMO.heroImage} alt="" className="h-full w-full object-cover" />
          </motion.div>
          <h1 className="text-2xl font-black leading-tight sm:text-3xl" style={{ fontFamily: "'Caveat', cursive", color: BROWN }}>{DEMO.heroHeading}</h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>{DEMO.heroSubtitle}</p>
        </ParallaxSection>

        {/* Intro */}
        <ParallaxSection offset={textParallax} className="px-8">
          <p className="text-lg leading-relaxed italic sm:text-xl" style={{ color: BROWN }}>{DEMO.introText}</p>
          <div className="mt-4 h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
        </ParallaxSection>

        {/* Photos */}
        <ParallaxSection offset={imgParallax} className="gap-3">
          <div className="grid grid-cols-3 gap-3">
            {DEMO.pics.map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl shadow-md"
                style={{ aspectRatio: "3/4", transform: `rotate(${i === 0 ? -2 : i === 2 ? 2 : 0}deg)`, boxShadow: "2px 4px 12px rgba(0,0,0,0.15)" }}
              >
                <Tape className="left-1/2 -translate-x-1/2 z-10" />
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-sm font-bold tracking-widest uppercase sm:text-base" style={{ color: MUTED }}>Our moments</p>
        </ParallaxSection>

        {/* Memories */}
        <ParallaxSection offset={textParallax} className="gap-4">
          {DEMO.memories.map((m, i) => (
            <div
              key={i}
              className="w-full rounded-xl p-5 text-center shadow-md"
              style={{
                background: "#fff",
                borderLeft: `3px solid ${PINK}`,
                transform: `rotate(${i === 0 ? 1 : i === 1 ? -1.5 : 0.5}deg)`,
                boxShadow: "2px 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              <Tape className="left-1/2 -translate-x-1/2" />
              <p className="text-base font-bold sm:text-lg" style={{ color: BROWN }}>{m.title}</p>
              <p className="mt-1 text-sm leading-relaxed sm:text-base" style={{ color: MUTED }}>{m.caption}</p>
              <p className="mt-2 text-sm italic sm:text-base" style={{ color: PINK }}>{m.note}</p>
            </div>
          ))}
        </ParallaxSection>

        {/* Promises */}
        <ParallaxSection offset={textParallax} className="gap-3">
          <p className="text-lg font-black tracking-wider uppercase sm:text-xl" style={{ color: GOLD }}>I Promise</p>
          {DEMO.promises.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span style={{ color: PINK }}>❤️</span>
              <p className="text-sm leading-relaxed sm:text-base" style={{ color: BROWN }}>{p}</p>
            </div>
          ))}
        </ParallaxSection>

        {/* Final */}
        <ParallaxSection offset={textParallax} className="gap-4">
          <motion.div className="mb-2 h-40 w-40 overflow-hidden rounded-full shadow-lg ring-2 ring-white/30" style={{ y: imgParallax }}>
            <img src={DEMO.endingImage} alt="" className="h-full w-full object-contain" />
          </motion.div>
          {DEMO.finalLines.map((line, i) => (
            <p key={i} className="text-lg leading-relaxed italic sm:text-xl" style={{ color: BROWN }}>{line}</p>
          ))}
          <p className="mt-2 text-sm sm:text-base" style={{ color: MUTED }}>{DEMO.closingQuote}</p>
          <p className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: PINK, fontFamily: "'Caveat', cursive" }}>— From someone who loves you</p>
        </ParallaxSection>
      </div>
    </div>
  );
}
