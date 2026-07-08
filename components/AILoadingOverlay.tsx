"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { emoji: "✨", text: "Reading your story..." },
  { emoji: "🎨", text: "Choosing the perfect experience..." },
  { emoji: "🎮", text: "Designing interactions..." },
  { emoji: "💫", text: "Adding visual magic..." },
  { emoji: "🚀", text: "Almost ready..." },
];

type Props = {
  visible: boolean;
  onComplete?: () => void;
};

export function AILoadingOverlay({ visible, onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          onCompleteRef.current?.();
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [visible]);

  // Reset when hidden
  useEffect(() => {
    if (!visible) setStepIndex(0); // eslint-disable-line react-hooks/set-state-in-effect
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          <div className="absolute h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-br from-violet/20 via-blush/10 to-transparent blur-[120px]" />

          <div className="relative z-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <span className="text-6xl">{STEPS[stepIndex].emoji}</span>
                <p className="text-xl font-bold text-white">{STEPS[stepIndex].text}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-center gap-2">
              {STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i <= stepIndex ? "bg-violet" : "bg-white/20"
                  }`}
                  animate={i === stepIndex ? { scale: [1, 1.5, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
