"use client";

import { useEffect, useState } from "react";
import type { OurMemoriesData } from "@/lib/our-memories/types";
import { FloatingHearts } from "@/components/our-memories/FloatingHearts";
import { ScrollReveal } from "@/components/our-memories/ScrollReveal";

type Props = {
  data: OurMemoriesData;
};

export function OurMemoriesViewer({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const { heroGif, heroHeading, heroSubheading, memories, quote, promises, finalMessage, endingImage, signature, theme } = data;

  return (
    <div className={`relative min-h-screen ${theme.background} bg-gradient-to-b`} style={{ fontFamily: theme.font === "serif" ? "Georgia, 'Times New Roman', serif" : theme.font === "sans" ? "'Nunito Sans', sans-serif" : "'Fraunces', serif" }}>
      <FloatingHearts color={theme.heartColor} />

      {/* ───── HERO ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        <div className={`transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          {heroGif && (
            <img src={heroGif} alt="" className="mx-auto mb-8 h-64 w-64 rounded-2xl object-cover shadow-2xl ring-4 ring-white/50" />
          )}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ color: theme.accent }}>
            {heroHeading}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            {heroSubheading}
          </p>
          <p className="mt-12 animate-bounce text-sm text-gray-400">Scroll Down ↓</p>
        </div>
      </section>

      {/* ───── OUR MEMORIES ───── */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: theme.accent }}>
              Our Memories
            </h2>
          </ScrollReveal>
          <div className="space-y-24">
            {memories.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 100}>
                <div
                  className="group relative mx-auto max-w-md"
                  style={{ transform: `rotate(${((i % 3) - 1) * 2.5}deg)` }}
                >
                  <div className="rounded-2xl bg-white/70 p-3 shadow-xl backdrop-blur-md ring-1 ring-white/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                    {m.photo ? (
                      <img src={m.photo} alt={m.title} className="h-72 w-full rounded-xl object-cover sm:h-96" />
                    ) : (
                      <div className="flex h-72 w-full items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 sm:h-96">
                        <span className="text-6xl opacity-40">📸</span>
                      </div>
                    )}
                    <div className="mt-4 space-y-1 px-1 pb-2">
                      <h3 className="text-lg font-bold text-gray-800">{m.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-500">{m.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── QUOTE ───── */}
      <section className="relative z-10 px-4 py-32">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-3xl font-light italic leading-relaxed sm:text-4xl" style={{ color: theme.accent }}>
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ───── PROMISES ───── */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <h2 className="mb-14 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: theme.accent }}>
              My Promises To You ❤️
            </h2>
          </ScrollReveal>
          <div className="space-y-4">
            {promises.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 80}>
                <div className="rounded-2xl bg-white/60 px-6 py-5 shadow-lg backdrop-blur-sm ring-1 ring-white/40 transition-all duration-300 hover:shadow-xl">
                  <p className="text-lg font-medium text-gray-700 sm:text-xl">{p.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL MESSAGE ───── */}
      <section className="relative z-10 px-4 py-32 text-center">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl">
            <p className="text-2xl font-light leading-relaxed text-gray-700 sm:text-3xl">{finalMessage}</p>
            {endingImage && (
              <img src={endingImage} alt="" className="mx-auto mt-10 h-48 w-48 rounded-2xl object-cover shadow-xl ring-4 ring-white/50" />
            )}
            <p className="mt-10 text-xl font-bold tracking-wide sm:text-2xl" style={{ color: theme.accent }}>
              {signature}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-xs text-gray-400">Made with ❤️</p>
      </footer>
    </div>
  );
}
