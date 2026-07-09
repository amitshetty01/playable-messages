"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CinematicAmbient } from "@/components/CinematicAmbient";
import type { Template } from "@/lib/types";
import { createDemoExperience } from "@/lib/demo";

const ExperiencePlayer = dynamic(
  () => import("@/components/ExperiencePlayer").then(m => ({ default: m.ExperiencePlayer })),
  { ssr: false }
);

const LOADING_STEPS = [
  { text: "Preparing your experience...", delay: 600 },
  { text: "Loading memories...", delay: 1400 },
  { text: "Adding magic...", delay: 2200 },
  { text: "Ready.", delay: 3000 },
];

type Phase = "loading" | "playing" | "celebrating" | "cta";

export function CinematicDemo({ template }: { template: Template }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showWow, setShowWow] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);
  const [parallax, setParallax] = useState({ rx: 0, ry: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const experience = useMemo(() => createDemoExperience(template), [template]);
  const [restartKey, setRestartKey] = useState(0);

  /* ─── Loading sequence ─── */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timers = LOADING_STEPS.map((step, i) =>
      setTimeout(() => setLoadingStep(i + 1), step.delay)
    );
    const finishTimer = setTimeout(() => setPhase("playing"), LOADING_STEPS[LOADING_STEPS.length - 1].delay + 400);
    return () => {
      document.body.style.overflow = "";
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, []);

  /* ─── Mouse parallax + glow ─── */
  useEffect(() => {
    if (phase === "loading") return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    const animate = () => {
      const m = mouseRef.current;
      setParallax({ rx: (m.x - 0.5) * 3, ry: (0.5 - m.y) * 3 });
      setGlowPos({ x: m.x * 100, y: m.y * 100 });
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  /* ─── Completion handler ─── */
  const handleComplete = useCallback(() => {
    setCompleted(true);
    setTimeout(() => setShowWow(true), 1200);
    setTimeout(() => setPhase("celebrating"), 1800);
    setTimeout(() => setPhase("cta"), 2800);
  }, []);

  /* ─── Escape handler ─── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  const handleRestart = useCallback(() => {
    setCompleted(false);
    setShowWow(false);
    setPhase("playing");
    setRestartKey(k => k + 1);
  }, []);

  const loadingProgress = loadingStep / LOADING_STEPS.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0a0a0f]">
      <CinematicAmbient />

      {/* Interactive background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(184,165,255,0.08), rgba(255,107,157,0.04), transparent 60%)`,
          opacity: phase === "loading" ? 0 : 1,
        }}
      />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-[2]" style={{ boxShadow: "inset 0 0 250px rgba(0,0,0,0.6)" }} />

      {/* ─── Top bar ─── */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/60 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
          Back
        </button>

        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold tracking-wider text-white/40 backdrop-blur-md uppercase">
          Sample Experience
        </div>

        <Link
          href={`/create/${template.id}`}
          className="rounded-full bg-gradient-to-r from-blush to-violet px-4 py-2 text-xs font-extrabold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ✨ Create Yours
        </Link>
      </div>

      {/* ─── Main content area ─── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-4">
        <AnimatePresence mode="wait">
          {phase === "loading" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Loading phone silhouette */}
              <div
                className="relative rounded-[2.8rem] border border-white/[0.06] bg-white/[0.02]"
                style={{ width: 280, height: 500 }}
              >
                <div className="absolute left-1/2 top-0 h-[3px] w-20 -translate-x-1/2 rounded-b-full bg-white/10" />
                <div className="absolute right-5 top-3 h-[6px] w-[6px] rounded-full bg-white/10" />
                <div className="flex h-full items-center justify-center">
                  <svg className="h-8 w-8 animate-spin text-white/30" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4 31.4" className="opacity-20" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4 31.4" strokeDashoffset="-10" className="opacity-70" />
                  </svg>
                </div>
              </div>

              {/* Loading text */}
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-sm font-bold text-white/60"
                  >
                    {LOADING_STEPS[Math.min(loadingStep, LOADING_STEPS.length - 1)]?.text || "Ready."}
                  </motion.p>
                </AnimatePresence>
                {/* Progress bar */}
                <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blush to-violet"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(loadingProgress * 100, 100)}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`phone-${restartKey}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Glow behind phone */}
              <div
                className="pointer-events-none absolute -inset-16 rounded-full opacity-40 blur-3xl transition-all duration-1000"
                style={{
                  background: `radial-gradient(circle at center, rgba(184,165,255,0.15), transparent 70%)`,
                }}
              />

              {/* Phone device */}
              <motion.div
                ref={phoneRef}
                className="relative"
                style={{ perspective: "1200px" }}
                animate={{
                  rotateX: parallax.ry,
                  rotateY: parallax.rx,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                {/* Volume buttons */}
                <div className="absolute -left-[3px] top-[100px] z-20 flex flex-col gap-2">
                  <div className="h-8 w-[3px] rounded-r-sm bg-zinc-600" />
                  <div className="h-8 w-[3px] rounded-r-sm bg-zinc-600" />
                </div>
                {/* Power button */}
                <div className="absolute -right-[3px] top-[110px] z-20 h-12 w-[3px] rounded-l-sm bg-zinc-600" />

                {/* Titanium frame */}
                <div
                  className="overflow-hidden rounded-[3rem] shadow-2xl"
                  style={{
                    padding: "3px",
                    background: "linear-gradient(180deg, #71717a, #a1a1aa, #52525b, #a1a1aa, #71717a)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Inner black bezel */}
                  <div className="overflow-hidden rounded-[2.7rem] bg-black">
                    <motion.div
                      className="relative"
                      animate={{ scale: [1, 1.003, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {/* Glass glare */}
                      <div className="pointer-events-none absolute inset-0 z-30 rounded-[2.7rem] bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

                      {/* Glass reflection diagonal */}
                      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[2.7rem]">
                        <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                      </div>

                      {/* Speaker grille */}
                      <div className="absolute left-1/2 top-0 z-20 h-[3px] w-20 -translate-x-1/2 rounded-b-full bg-zinc-800" />

                      {/* Camera dot */}
                      <div className="absolute right-5 top-3 z-20 h-[6px] w-[6px] rounded-full bg-zinc-800 shadow-inner">
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
                      </div>

                      {/* Screen */}
                      <div className="relative aspect-[9/19.5] w-[280px] overflow-hidden bg-zinc-950 sm:w-[320px]" style={{ transform: "translateZ(0)" }}>
                        <ExperiencePlayer
                          key={restartKey}
                          template={template}
                          experience={experience}
                          mode="demo"
                          onComplete={handleComplete}
                        />

                        {/* Completion overlay - blur + wow message */}
                        <AnimatePresence>
                          {completed && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
                            >
                              <AnimatePresence>
                                {showWow && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-6 text-center"
                                  >
                                    <p className="text-lg font-bold text-white/90">
                                      Now imagine this...
                                    </p>
                                    <p className="mt-2 text-sm text-white/50">
                                      Made with your own memories.
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-28 -translate-x-1/2 rounded-full bg-zinc-800" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Completion CTA bottom sheet ─── */}
      <AnimatePresence>
        {phase === "cta" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 24 }}
            className="relative z-20 border-t border-white/[0.06] bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent px-6 pb-8 pt-6"
          >
            <div className="mx-auto max-w-md text-center">
              <p className="text-lg font-bold text-white">
                ❤️ Loved this?
              </p>
              <p className="mt-1 text-sm text-white/50">
                Imagine this with your own memories, photos and message.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  href={`/create/${template.id}`}
                  className="rounded-full bg-gradient-to-r from-blush to-violet px-8 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  Create Yours
                </Link>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  Replay
                </button>
              </div>
              <p className="mt-3 text-xs text-white/30">No signup required</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
