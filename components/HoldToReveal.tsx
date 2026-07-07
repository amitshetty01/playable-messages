"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface HoldToRevealProps {
  onComplete: () => void;
  holdDuration?: number;
  children?: React.ReactNode;
}

export function HoldToReveal({
  onComplete,
  holdDuration = 2000,
  children,
}: HoldToRevealProps) {
  const [status, setStatus] = useState<"idle" | "holding" | "complete">("idle");
  const [shakeKey, setShakeKey] = useState(0);
  const progress = useSpring(0, { stiffness: 120, damping: 20 });
  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const circumference = useMemo(() => 2 * Math.PI * 52, []);
  const [dashOffset, setDashOffset] = useState(circumference);

  useMotionValueEvent(progress, "change", (v: number) => {
    setDashOffset(circumference * (1 - v));
  });
  const prefersReducedMotion = useReducedMotion();

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleTapStart = useCallback(() => {
    if (status === "complete") return;
    setStatus("holding");
    startTimeRef.current = performance.now();

    if (prefersReducedMotion) {
      progress.set(1);
      setDisplayProgress(1);
      setStatus("complete");
      onComplete();
      return;
    }

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / holdDuration, 1);
      progress.set(p);
      setDisplayProgress(p);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setStatus("complete");
        onComplete();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [holdDuration, onComplete, status, progress, prefersReducedMotion]);

  const reset = useCallback(() => {
    cleanup();
    progress.set(0);
    setDisplayProgress(0);
    setStatus("idle");
    setShakeKey((k) => k + 1);
  }, [cleanup, progress]);

  const handleTapEnd = useCallback(() => {
    if (status === "holding") reset();
  }, [status, reset]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (status === "complete") return;
      handleTapStart();
    }
  }, [handleTapStart, status]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const radius = 52;
  const strokeWidth = 5;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        key={shakeKey}
        className="relative cursor-pointer select-none"
        variants={{
          idle: { x: 0 },
          shake: {
            x: [0, -5, 5, -4, 4, -2, 2, 0],
            transition: { duration: 0.4, ease: "easeInOut" },
          },
        }}
        animate={shakeKey > 0 ? "shake" : "idle"}
        whileTap={status !== "complete" ? { scale: 0.96 } : undefined}
        onTapStart={handleTapStart}
        onTapCancel={handleTapEnd}
        role="button"
        tabIndex={0}
        aria-label={status === "complete" ? "Revealed" : "Hold to reveal"}
      >
        <motion.div
          className="absolute -inset-4 rounded-full"
          animate={{
            boxShadow:
              status === "complete"
                ? "0 0 80px rgba(151,218,223,0.25), 0 0 160px rgba(184,165,255,0.12)"
                : status === "holding"
                ? "0 0 40px rgba(246,177,201,0.18), 0 0 80px rgba(184,165,255,0.08)"
                : "0 0 20px rgba(184,165,255,0.06)",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        <svg width="136" height="136" className="-rotate-90 relative z-10">
          <defs>
            <linearGradient id="holdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f6b1c9" />
              <stop offset="50%" stopColor="#b8a5ff" />
              <stop offset="100%" stopColor="#97dadf" />
            </linearGradient>
          </defs>
          <circle
            cx="68"
            cy="68"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="68"
            cy="68"
            r={radius}
            fill="none"
            stroke="url(#holdGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>

        <AnimatePresence>
          {status === "complete" && (
            <motion.div
              key="ripple"
              className="absolute inset-0 z-10 rounded-full border-2"
              style={{ borderColor: "rgba(184, 165, 255, 0.3)" }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "complete" ? (
              <motion.div
                key="checkmark"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#97dadf"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.35,
                      ease: "easeOut",
                      delay: 0.05,
                    }}
                  />
                </svg>
              </motion.div>
            ) : status === "holding" ? (
              <motion.span
                key="progress"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-sm font-bold tabular-nums"
              >
                <span className="text-gradient">
                  {Math.round(displayProgress * 100)}%
                </span>
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-bold leading-tight text-center text-white/50"
              >
                Hold to<br />reveal
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {status === "complete" && children && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.2,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
