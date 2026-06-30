"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const PINK = "#d4899e";
const CREAM = "#faf5f0";
const BROWN = "#3d2c2c";
const MUTED = "#8c7a7a";
const HEART = "#e8a0bf";
const GOLD = "#c9a87c";

/* ─── Utilities ─── */

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/* ─── Paper grain overlay ─── */
function PaperTexture() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "256px 256px",
    }} />
  );
}

/* ─── Page edge shadow (book-like) ─── */
function PageEdgeShadow() {
  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-[2] h-full w-8" style={{ background: `linear-gradient(to right, ${BROWN}08, transparent)` }} />
      <div className="pointer-events-none fixed right-0 top-0 z-[2] h-full w-8" style={{ background: `linear-gradient(to left, ${BROWN}08, transparent)` }} />
    </>
  );
}

/* ─── Floating hearts ─── */
function Hearts() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} className="absolute animate-float-up" style={{
          left: `${5 + Math.random() * 90}%`,
          bottom: "-8%",
          width: 6 + Math.random() * 18,
          height: 6 + Math.random() * 18,
          opacity: 0.08 + Math.random() * 0.18,
          animationDelay: `${Math.random() * 16}s`,
          animationDuration: `${14 + Math.random() * 18}s`,
        }}>
          <svg viewBox="0 0 24 24" fill={HEART} className="h-full w-full">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── Twinkle stars ─── */
function Stars() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="absolute rounded-full animate-twinkle" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: 3,
          height: 3,
          background: PINK,
          opacity: 0,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }} />
      ))}
    </div>
  );
}

/* ─── Section divider ─── */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="h-px w-8" style={{ background: `linear-gradient(to right, transparent, ${PINK}33)` }} />
      <span className="text-xs" style={{ color: PINK }}>♥</span>
      <div className="h-px w-8" style={{ background: `linear-gradient(to left, transparent, ${PINK}33)` }} />
    </div>
  );
}

/* ─── Scroll reveal ─── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); o.unobserve(el); } },
      { threshold: 0.1 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${vis ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-[0.97] opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Parallax ─── */
function Parallax({ children, speed = 0.3, elRef }: { children: React.ReactNode; speed?: number; elRef?: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = elRef?.current || ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    setOffset((center - viewCenter - scrollY + window.innerHeight) * speed * 0.1);
  }, [scrollY, speed, elRef]);
  return <div ref={ref} style={{ transform: `translateY(${Math.max(-60, Math.min(60, offset))}px)` }}>{children}</div>;
}

/* ─── Staggered word reveal ─── */
function StaggerText({ text, className = "", style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); o.unobserve(el); } },
      { threshold: 0.3 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <div ref={ref} className={`flex flex-wrap justify-center gap-x-[0.3em] ${className}`} style={style}>
      {words.map((w, i) => (
        <span
          key={i}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(12px)",
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {w}
        </span>
      ))}
    </div>
  );
}

/* ─── Wax seal stamp ─── */
function WaxSeal({ color = PINK }: { color?: string }) {
  return (
    <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full shadow-lg" style={{
      background: `radial-gradient(circle at 35% 35%, ${color}, ${color}dd)`,
      boxShadow: `0 4px 16px ${color}44, inset 0 1px 0 ${color}88`,
    }}>
      <span className="text-xl">❤️</span>
    </div>
  );
}

/* ─── Pressed flower SVG ─── */
function PressedFlower({ className = "", color = PINK, size = 40 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity: 0.15 }}>
      <circle cx="20" cy="14" r="6" fill={color} />
      <circle cx="14" cy="20" r="6" fill={color} />
      <circle cx="26" cy="20" r="6" fill={color} />
      <circle cx="20" cy="26" r="6" fill={color} />
      <circle cx="20" cy="20" r="5" fill={color} />
    </svg>
  );
}

/* ─── Photo date stamp ─── */
function DateStamp({ label }: { label: string }) {
  return (
    <div className="absolute bottom-3 right-3 rounded bg-white/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest shadow-sm" style={{ color: MUTED, fontFamily: "'Courier New', monospace" }}>
      {label}
    </div>
  );
}

/* ─── Sound toggle ─── */
function SoundToggle({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toggle = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  }, [playing, url]);
  useEffect(() => () => { audioRef.current?.pause(); }, []);
  return (
    <button onClick={toggle} className="fixed bottom-6 left-6 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition hover:scale-110" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(201,168,124,0.3)" }} title={playing ? "Pause music" : "Play music"}>
      <span className="text-sm">{playing ? "🔊" : "🔇"}</span>
    </button>
  );
}

export default function OurMemoriesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pics = [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&h=800&fit=crop&auto=format",
  ];
  const stripPics = [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=200&h=200&fit=crop&auto=format",
  ];
  const memories = [
    { title: "The First Smile", caption: "Some smiles stay in your heart forever.", date: "03. 2025" },
    { title: "The Little Moments", caption: "It was never about the place. It was always about you.", date: "07. 2025" },
    { title: "My Favorite Memory", caption: "If I could replay one feeling, it would be this.", date: "12. 2025" },
  ];
  const promises = [
    "I promise to choose you even on ordinary days.",
    "I promise to make you smile when the world feels heavy.",
    "I promise to protect what we have.",
    "I promise to create more beautiful memories with you.",
    "I promise to stay\u2014not just in words, but in actions.",
  ];

  return (
    <div className="relative w-screen overflow-x-hidden" style={{ marginLeft: "calc(-50vw + 50%)", width: "100vw", background: CREAM, color: BROWN, fontFamily: "'Nunito Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg) scale(0.4); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.1; }
          100% { transform: translateY(-120vh) rotate(360deg) scale(1); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px ${PINK}22, 0 24px 80px ${PINK}22; }
          50% { box-shadow: 0 0 50px ${PINK}33, 0 24px 80px ${PINK}33; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.18); }
          28% { transform: scale(1); }
          42% { transform: scale(1.12); }
          56% { transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${CREAM}; }
        ::-webkit-scrollbar-thumb { background: ${PINK}55; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${PINK}88; }
      `}</style>

      <PaperTexture />
      <PageEdgeShadow />
      <Hearts />
      <Stars />
      <SoundToggle url="" />

      {/* ───── HERO ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Parallax speed={0.12}>
          <div className={`max-w-2xl transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}>
            <div className="mx-auto mb-10 h-64 w-64 overflow-hidden rounded-3xl ring-4 sm:h-72 sm:w-72" style={{ borderColor: "#f0e4d8", animation: "pulse-glow 4s ease-in-out infinite" }}>
              <img src="/models/assets/Cat%20kiss.gif" alt="" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: PINK }}>
              Hey Cutie <span style={{ animation: "heartbeat 1.5s ease-in-out infinite", display: "inline-block" }}>❤️</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed sm:text-lg" style={{ color: MUTED }}>
              Every moment with you feels like a dream I never want to wake up from. So I kept a few memories here, just for us. Scroll slowly&hellip; some feelings deserve time.
            </p>
            <div className="mt-14 flex flex-col items-center gap-3">
              <div className="h-12 w-px" style={{ background: `linear-gradient(to bottom, ${PINK}55, transparent)` }} />
              <span className="animate-pulse text-[10px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>Scroll Down</span>
            </div>
          </div>
        </Parallax>
      </section>

      {/* ───── INTRO ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Parallax speed={-0.08}>
            <StaggerText text="There are thousands of moments… but these are the ones my heart kept." className="mx-auto max-w-xl text-xl font-light leading-relaxed sm:text-2xl lg:text-3xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: MUTED }} />
            <div className="mt-4 flex justify-center gap-4">
              <PressedFlower color={PINK} size={28} />
              <PressedFlower color={GOLD} size={22} className="mt-2" />
              <PressedFlower color={PINK} size={28} />
            </div>
            <Divider />
          </Parallax>
        </Reveal>
      </section>

      {/* ───── PHOTO STRIP ───── */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 py-10">
        <Reveal>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {stripPics.map((url, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl bg-white p-2 shadow-md" style={{ transform: `rotate(${-3 + i * 3}deg)` }}>
                <img src={url} alt="" className="h-24 w-24 rounded-lg object-cover sm:h-28 sm:w-28" />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───── OUR MEMORIES ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto w-full max-w-lg">
          {memories.map((m, i) => (
            <div key={i}>
              <Reveal delay={i * 120}>
                <Parallax speed={i === 0 ? 0.08 : i === 1 ? 0 : -0.08}>
                  <div className="group relative mx-auto w-full max-w-sm transition-all duration-700 hover:shadow-2xl" style={{
                    transform: `rotate(${((i % 5) - 2) * 2}deg)`,
                    borderRadius: 16,
                    background: "#fff",
                    border: "1px solid rgba(201,168,124,0.25)",
                    boxShadow: `0 12px 48px ${BROWN}0d`,
                  }}>
                    {/* Corner fold decoration */}
                    <div className="absolute -bottom-px -right-px z-10 h-8 w-8 overflow-hidden rounded-br-[16px]" style={{ background: CREAM }}>
                      <div className="absolute -bottom-2 -right-2 h-6 w-6 rotate-45 shadow-md" style={{ background: CREAM, boxShadow: `-2px -2px 8px ${BROWN}15` }} />
                    </div>
                    {/* Photo area */}
                    <div className="relative overflow-hidden rounded-t-[16px]">
                      <img src={pics[i]} alt={m.title} className="h-80 w-full object-cover transition-all duration-700 group-hover:scale-105 sm:h-96" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      {/* Polaroid corner brackets */}
                      <div className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-white/60 rounded-tl" />
                      <div className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-white/60 rounded-tr" />
                      <div className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-white/60 rounded-bl" />
                      <div className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-white/60 rounded-br" />
                      {/* Date stamp */}
                      <DateStamp label={m.date} />
                    </div>
                    <div className="space-y-1.5 px-5 py-5">
                      <h3 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif", color: BROWN }}>
                        {m.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontSize: "1.1rem", color: MUTED }}>
                        {m.caption}
                      </p>
                    </div>
                  </div>
                </Parallax>
              </Reveal>
              {i < memories.length - 1 && (
                <Reveal delay={i * 120 + 100}>
                  <div className="my-16 text-center">
                    <p className="text-sm font-light italic tracking-wide" style={{ color: MUTED }}>
                      {["Some memories don't fade. They glow.", "Not every moment becomes a memory. But these did.", "Some feelings have no words. That's why we keep them close."][i]}
                    </p>
                    <Divider />
                  </div>
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ───── QUOTE ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Parallax speed={0.1}>
            <div className="relative mx-auto max-w-2xl rounded-3xl px-8 py-16 backdrop-blur-sm sm:px-12 sm:py-20" style={{
              background: `linear-gradient(135deg, ${PINK}06, ${PINK}12)`,
              border: `1px solid ${PINK}22`,
            }}>
              <PressedFlower color={PINK} size={32} className="absolute -left-3 -top-3" />
              <PressedFlower color={GOLD} size={24} className="absolute -right-2 -bottom-2" />
              <span className="text-3xl sm:text-4xl" style={{ color: PINK }}>&ldquo;</span>
              <p className="-mt-2 text-2xl font-light italic leading-relaxed sm:text-3xl lg:text-4xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: PINK }}>
                Our best memories are not behind us.<br />We are still creating them.
              </p>
              <span className="mt-2 block text-right text-3xl sm:text-4xl" style={{ color: PINK }}>&rdquo;</span>
            </div>
          </Parallax>
        </Reveal>
      </section>

      {/* ───── PROMISES ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto w-full max-w-lg">
          <Reveal>
            <h2 className="mb-14 text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: PINK }}>
              My Promises To You <span style={{ animation: "heartbeat 1.5s ease-in-out infinite", display: "inline-block" }}>❤️</span>
            </h2>
          </Reveal>
          <div className="space-y-4">
            {promises.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group rounded-2xl px-6 py-5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02]" style={{
                  background: "#fff",
                  border: "1px solid rgba(201,168,124,0.2)",
                  boxShadow: `0 4px 20px ${BROWN}08`,
                }}>
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-lg transition-transform duration-300 group-hover:scale-125" style={{ color: PINK, animation: `heartbeat 2s ease-in-out ${i * 0.3}s infinite` }}>
                      ♥
                    </span>
                    <p className="text-base font-medium leading-relaxed sm:text-lg" style={{ color: BROWN }}>
                      {p}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL MESSAGE ───── */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <Parallax speed={-0.08}>
            <div className="mx-auto max-w-xl">
              <div className="mx-auto mb-10 h-48 w-48 overflow-hidden rounded-3xl shadow-xl ring-4 sm:h-56 sm:w-56" style={{ borderColor: "#f0e4d8" }}>
                <img src={pics[1]} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="text-xl font-light leading-relaxed sm:text-2xl" style={{ color: BROWN }}>
                Thank you for being part of my favorite memories. I don&apos;t just want to remember the past with you&hellip; I want to create every beautiful tomorrow with you.
              </p>
              <Divider />
              <p className="text-lg font-bold tracking-wide sm:text-xl" style={{ fontFamily: "'Fraunces', Georgia, serif", color: PINK }}>
                Forever yours <span style={{ animation: "heartbeat 1.5s ease-in-out infinite", display: "inline-block" }}>❤️</span>
              </p>
              <WaxSeal color={PINK} />
            </div>
          </Parallax>
        </Reveal>
      </section>

      {/* ───── BACK TO TOP ───── */}
      <section className="relative z-10 pb-12 text-center">
        <a href="#top" className="inline-flex flex-col items-center gap-2 transition hover:opacity-60" style={{ color: MUTED }}>
          <span className="text-xs">↑</span>
          <span className="text-[10px] tracking-[0.2em] uppercase">Start over</span>
        </a>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-xs" style={{ color: MUTED }}>Made with love</p>
      </footer>
    </div>
  );
}
