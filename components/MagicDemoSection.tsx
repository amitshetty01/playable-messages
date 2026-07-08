"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DEMO_STEPS = [
  { icon: "💭", text: "Type your thought", time: "1s" },
  { icon: "✨", text: "AI reads & understands", time: "2s" },
  { icon: "🎨", text: "Chooses 3 concepts", time: "3s" },
  { icon: "🎮", text: "Generates interactive experience", time: "5s" },
];

export function MagicDemoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative z-10 overflow-hidden px-4 py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blush/8 via-violet/8 to-neon/8 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-5xl text-center"
      >
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          From a simple thought to an unforgettable interactive experience in{" "}
          <span className="bg-gradient-to-r from-blush to-violet bg-clip-text text-transparent">60 seconds</span>
        </h2>

        {/* Demo visualization */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {DEMO_STEPS.map((step, idx) => (
            <motion.div
              key={step.text}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              {/* Step number */}
              <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blush to-violet text-[10px] font-bold text-white">
                {idx + 1}
              </div>

              <span className="text-3xl">{step.icon}</span>
              <p className="mt-2 text-sm font-bold text-white/80">{step.text}</p>
              <p className="mt-1 text-[10px] text-violet/50 font-mono">~{step.time}</p>

              {/* Connector line */}
              {idx < DEMO_STEPS.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 sm:block">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet/30">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Result preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mt-10 max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-1 backdrop-blur-xl"
        >
          <div className="rounded-2xl bg-gradient-to-b from-ink to-black p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet/20 text-sm">
                🎮
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-white">The Midnight Confession</p>
                <p className="text-[10px] text-white/40">Interactive Experience</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                Live
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-3/4 rounded-full bg-white/10" />
              <div className="h-2 w-1/2 rounded-full bg-white/10" />
              <div className="h-2 w-5/6 rounded-full bg-white/10" />
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-violet/50" />
              ))}
            </div>
            <p className="mt-3 text-center text-[10px] text-white/30 font-mono">Interactive demo generated in 6.2s</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
