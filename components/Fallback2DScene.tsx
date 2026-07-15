"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SceneFlow, SceneStep, SceneContext } from "@/lib/scene-types";
import type { ThemeName } from "@/lib/types";

const PALETTES: Record<string, string[]> = {
  "Dark Romantic": ["#1a0a1e", "#2d1b36", "#4a2d52", "#ff6b9d", "#c44dff"],
  "Soft Pastel": ["#fce4ec", "#f8bbd0", "#e1bee7", "#b39ddb", "#ce93d8"],
  "Minimal Black": ["#000000", "#1a1a1a", "#333333", "#ffffff", "#aaaaaa"],
  "Cute Pink": ["#ffb3c6", "#ff8fab", "#fb6f92", "#ffc8dd", "#ffd1dc"],
  "Neon Glitch": ["#0a0a0a", "#ff00ff", "#00ffff", "#ffff00", "#ff0066"],
  "Cinematic Purple": ["#0d0221", "#150534", "#2d0a52", "#7b2d8e", "#b84dff"],
  "Clean White": ["#f5f5f5", "#e0e0e0", "#ffffff", "#333333", "#666666"],
};

function GradientPlaceholder({ palette, index }: { palette: string[]; index: number }) {
  const angle = 45 + index * 30;
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(${angle}deg, ${palette[0]}22, ${palette[1]}44, ${palette[2]}, ${palette[3]}44, ${palette[4]}22)`,
        backgroundSize: "200% 200%",
        animation: `gradient-shift ${6 + index * 2}s ease-in-out infinite`,
        animationDelay: `${index * 0.5}s`,
      }}
    />
  );
}

function FloatingOrbs({ count = 6 }: { count?: number }) {
  const orbs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 40 + Math.random() * 80,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      dur: 8 + Math.random() * 8,
      color: `hsla(${200 + i * 40}, 70%, 60%, 0.08)`,
    })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {orbs.map(o => (
        <div
          key={o.id}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: `${o.x}%`,
            top: `${o.y}%`,
            background: `radial-gradient(circle, ${o.color}, transparent)`,
            animation: `float-particle ${o.dur}s ease-in-out infinite`,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

type Props = {
  flow: SceneFlow;
  context: SceneContext;
  theme: ThemeName;
  mode: "demo" | "generated" | "preview";
};

export function Fallback2DScene({ flow, context, theme, mode }: Props) {
  const [step, setStep] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const palette = PALETTES[theme] || PALETTES["Dark Romantic"];

  const total = flow.scenes.length;
  const scene: SceneStep | null = step < total ? flow.scenes[step] : null;

  const advance = useCallback(() => {
    if (scene?.interaction?.action === "complete") {
      setShowFinal(true);
      setTimeout(() => context.onComplete(), 1200);
      return;
    }
    setStep(s => Math.min(s + 1, total));
  }, [scene, total, context]);

  if (step >= total && !showFinal) return null;

  return (
    <div className={`relative flex w-full flex-col overflow-hidden ${mode !== "generated" ? "min-h-full" : "min-h-[100dvh]"}`}>
      {palette && <GradientPlaceholder palette={palette} index={step} />}
      <FloatingOrbs count={4} />

      <AnimatePresence mode="wait">
        {showFinal ? (
          <motion.div
            key="final"
            className="relative z-10 flex flex-1 items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md">
                <span className="text-4xl">💖</span>
              </div>
              <h2
                className="font-display font-bold leading-tight text-white"
                style={{ fontSize: "clamp(1.25rem, 5vw, 2.5rem)" }}
              >
                {context.finalMessage}
              </h2>
            </div>
          </motion.div>
        ) : scene ? (
          <motion.div
            key={step}
            className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-full max-w-lg text-center">
              <h1
                className="font-display font-bold leading-[1.1] tracking-tight text-white"
                style={{ fontSize: "clamp(1.5rem, 5.5vw, 3rem)" }}
              >
                {scene.content.title}
              </h1>
              {scene.content.body && (
                <p className="mx-auto mt-4 max-w-md text-white/60" style={{ fontSize: "clamp(0.875rem, 2.2vw, 1.125rem)" }}>
                  {scene.content.body}
                </p>
              )}
            </div>

            <div className="mt-8 flex shrink-0 justify-center">
              <button
                type="button"
                onClick={advance}
                className="min-h-[56px] rounded-full border border-white/20 bg-white/10 px-10 py-4 text-base font-extrabold tracking-wide text-white/90 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
              >
                {scene.interaction?.label || "Continue"}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-20 h-1.5 bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-white/40 transition-all duration-500"
          style={{ width: `${((step) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
