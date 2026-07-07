"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tone } from "@/lib/types";

const TONE_EMOJIS: Record<Tone, string> = {
  Romantic: "💖",
  Funny: "😂",
  Sorry: "🥺",
  Savage: "🔥",
  Emotional: "💗",
  Mystery: "🔮",
  Birthday: "🎂",
  Friendship: "🤝",
};

export function SentimentBadge({ tone, confidence, onDismiss }: { tone: Tone; confidence: number; onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);
  const [pulsed, setPulsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPulsed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  function handleDismiss() {
    setVisible(false);
    setTimeout(onDismiss, 200);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            boxShadow: pulsed
              ? "0 0 0 0 rgba(255,255,255,0)"
              : ["0 0 0 0 rgba(255,255,255,0)", "0 0 0 8px rgba(255,255,255,0.08)", "0 0 0 0 rgba(255,255,255,0)"],
          }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.3, boxShadow: { duration: 1, repeat: pulsed ? 0 : 1 } }}
          onClick={handleDismiss}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/70 backdrop-blur-sm transition-all hover:bg-white/[0.1] hover:text-white active:scale-95"
          title="Click to dismiss"
        >
          <span className="animate-pulse">✨</span>
          <span>
            Detected: {TONE_EMOJIS[tone]} {tone}
          </span>
          {confidence > 0.7 && <span className="ml-0.5 text-[10px] text-emerald-400">●</span>}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
