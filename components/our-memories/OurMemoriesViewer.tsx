"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { OurMemoriesData, ThemePreset } from "@/lib/our-memories/types";
import { getTheme } from "@/lib/our-memories/types";

type Props = {
  data: OurMemoriesData;
};

/* ─── Scroll reveal wrapper ─── */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); o.unobserve(el); } },
      { threshold: 0.12 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${vis ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.97] opacity-0"}`}
    >
      {children}
    </div>
  );
}

/* ─── Floating hearts ─── */
function Hearts({ color }: { color: string }) {
  const [hs, setHs] = useState<{ id: number; x: number; s: number; d: number; dur: number; o: number }[]>([]);
  useEffect(() => {
    setHs(Array.from({ length: 12 }, (_, i) => ({
      id: i, x: Math.random() * 100, s: 8 + Math.random() * 16,
      d: Math.random() * 12, dur: 10 + Math.random() * 14, o: 0.1 + Math.random() * 0.25,
    })));
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hs.map((h) => (
        <div key={h.id} className="absolute animate-float-up" style={{
          left: `${h.x}%`, bottom: "-8%", width: h.s, height: h.s,
          opacity: h.o, animationDelay: `${h.d}s`, animationDuration: `${h.dur}s`,
        }}>
          <svg viewBox="0 0 24 24" fill={color} className="h-full w-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── Theme style tag generator ─── */
function ThemeStyles({ theme }: { theme: ThemePreset }) {
  return (
    <style>{`
      :root {
        --om-bg: ${theme.bg};
        --om-card-bg: ${theme.cardBg};
        --om-card-border: ${theme.cardBorder};
        --om-accent: ${theme.accent};
        --om-text: ${theme.textPrimary};
        --om-text-muted: ${theme.textSecondary};
        --om-heart: ${theme.heartColor};
        --om-heading-font: ${theme.headingFont};
        --om-body-font: ${theme.bodyFont};
      }
    `}</style>
  );
}

/* ─── Main viewer ─── */
export function OurMemoriesViewer({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const theme = getTheme(data.themeId);
  if (!mounted) return null;

  return (
    <div style={{ background: theme.bg, fontFamily: theme.bodyFont, color: theme.textPrimary }}>
      <ThemeStyles theme={theme} />
      <Hearts color={theme.heartColor} />

      {/* ───── HERO ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <div className={`max-w-2xl transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          {data.heroGif && (
            <div className="mx-auto mb-10 h-64 w-64 overflow-hidden rounded-3xl shadow-2xl ring-4" style={{ borderColor: theme.cardBorder, boxShadow: `0 24px 80px ${theme.heartColor}22` }}>
              <img src={data.heroGif} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: theme.headingFont, color: theme.accent }}>
            {data.heroHeading}
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed sm:text-xl" style={{ color: theme.textSecondary }}>
            {data.heroSubtext}
          </p>
          <div className="mt-14 flex flex-col items-center gap-2">
            <div className="h-10 w-px" style={{ background: `linear-gradient(to bottom, ${theme.accent}44, transparent)` }} />
            <span className="text-xs tracking-widest uppercase animate-pulse" style={{ color: theme.textSecondary }}>Scroll Down</span>
          </div>
        </div>
      </section>

      {/* ───── INTRO ───── */}
      <section className="relative z-10 px-6 py-20 text-center">
        <Reveal>
          <p className="mx-auto max-w-xl text-xl font-light leading-relaxed sm:text-2xl" style={{ fontFamily: theme.headingFont, color: theme.textSecondary }}>
            {data.introText}
          </p>
          <div className="mx-auto mt-8 h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}66, transparent)` }} />
        </Reveal>
      </section>

      {/* ───── OUR MEMORIES ───── */}
      <section className="relative z-10 px-6 py-8">
        <div className="mx-auto max-w-lg">
          {data.memories.map((m, i) => (
            <div key={m.id}>
              <Reveal delay={i * 80}>
                <div
                  className="mx-auto w-full max-w-sm transition-all duration-500 hover:shadow-2xl"
                  style={{
                    transform: `rotate(${((i % 5) - 2) * 1.8}deg)`,
                    borderRadius: "12px",
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    boxShadow: `0 12px 48px ${theme.textPrimary}0d`,
                  }}
                >
                  {m.photo ? (
                    <img src={m.photo} alt={m.title} className="h-80 w-full rounded-t-xl object-cover sm:h-96" loading="lazy" />
                  ) : (
                    <div className="flex h-80 w-full items-center justify-center rounded-t-xl sm:h-96" style={{ background: `linear-gradient(135deg, ${theme.accent}22, ${theme.accent}44)` }}>
                      <span className="text-5xl opacity-30">♥</span>
                    </div>
                  )}
                  <div className="space-y-1.5 px-5 py-5">
                    <h3 className="text-lg font-bold tracking-tight" style={{ fontFamily: theme.headingFont, color: theme.textPrimary }}>
                      {m.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                      {m.caption}
                    </p>
                  </div>
                </div>
              </Reveal>
              {/* Separator between cards */}
              {i < data.memories.length - 1 && (
                <Reveal delay={i * 80 + 120}>
                  <div className="my-16 text-center">
                    <p className="text-sm font-light italic tracking-wide" style={{ color: theme.textSecondary }}>
                      {data.separators[i % data.separators.length]}
                    </p>
                    <div className="mx-auto mt-4 h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}44, transparent)` }} />
                  </div>
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───── QUOTE ───── */}
      <section className="relative z-10 px-6 py-28">
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-3xl px-8 py-14 text-center backdrop-blur-sm" style={{
            background: `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}14)`,
            border: `1px solid ${theme.accent}22`,
          }}>
            <p className="text-2xl font-light italic leading-relaxed sm:text-3xl lg:text-4xl" style={{ fontFamily: theme.headingFont, color: theme.accent }}>
              &ldquo;{data.quote}&rdquo;
            </p>
          </div>
        </Reveal>
      </section>

      {/* ───── PROMISES ───── */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-lg">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: theme.headingFont, color: theme.accent }}>
              My Promises To You <span style={{ color: theme.heartColor }}>❤️</span>
            </h2>
          </Reveal>
          <div className="space-y-4">
            {data.promises.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <div className="rounded-2xl px-6 py-5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.01]" style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  boxShadow: `0 4px 20px ${theme.textPrimary}08`,
                }}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-lg" style={{ color: theme.accent }}>♥</span>
                    <p className="text-base font-medium leading-relaxed sm:text-lg" style={{ color: theme.textPrimary }}>
                      {p.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL MESSAGE ───── */}
      <section className="relative z-10 px-6 py-28 text-center">
        <Reveal>
          <div className="mx-auto max-w-xl">
            {data.endingImage && (
              <div className="mx-auto mb-10 h-48 w-48 overflow-hidden rounded-3xl shadow-xl ring-4" style={{ borderColor: theme.cardBorder }}>
                <img src={data.endingImage} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <p className="text-xl font-light leading-relaxed sm:text-2xl" style={{ color: theme.textPrimary }}>
              {data.finalMessage}
            </p>
            <div className="mx-auto mt-8 h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${theme.accent}66, transparent)` }} />
            <p className="mt-8 text-lg font-bold tracking-wide sm:text-xl" style={{ fontFamily: theme.headingFont, color: theme.accent }}>
              {data.signature}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-xs" style={{ color: theme.textSecondary }}>Made with love</p>
      </footer>
    </div>
  );
}
