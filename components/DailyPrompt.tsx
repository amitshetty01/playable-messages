"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Tone } from "@/lib/types";

type DailyPromptData = {
  id: string;
  title: string;
  description: string;
  tone: Tone;
  prompt: string;
  emoji: string;
};

export function DailyPrompt() {
  const [prompt, setPrompt] = useState<DailyPromptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cron/daily-prompt")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.prompt) setPrompt(data.prompt);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!prompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[2rem] p-6 sm:p-8 text-center"
    >
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="text-5xl mb-3"
      >
        {prompt.emoji}
      </motion.p>
      <p className="text-[10px] font-bold tracking-[0.15em] text-white/30 uppercase mb-2">Today&apos;s Prompt</p>
      <h3 className="text-xl font-bold text-white">{prompt.title}</h3>
      <p className="mt-2 text-sm text-white/60 max-w-sm mx-auto">{prompt.description}</p>
      <div className="mt-5">
        <Link
          className="premium-button inline-flex"
          href={`/create?tone=${prompt.tone}&prompt=${encodeURIComponent(prompt.prompt)}`}
        >
          Try it out →
        </Link>
      </div>
    </motion.div>
  );
}
