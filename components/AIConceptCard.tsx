"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import type { AIConcept } from "@/lib/ai-types";
import { recordFeedback } from "@/lib/ai-feedback";

const VIBE_COLORS: Record<string, string> = {
  Romantic: "from-pink-500/20 to-rose-500/10 border-pink-500/30",
  Cute: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  Emotional: "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
  Funny: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30",
  Premium: "from-amber-500/20 to-violet-500/10 border-amber-500/30",
  Mystery: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
};

const EMOJI_MAP: Record<string, string> = {
  storybook: "📖",
  quiz: "🎯",
  game: "🎮",
  letter: "✉️",
  adventure: "🗺️",
  reveal: "🎭",
  puzzle: "🧩",
};

function getDefaultEmoji(templateType: string): string {
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (templateType.toLowerCase().includes(key)) return emoji;
  }
  return "✨";
}

function getColorStyle(concept: AIConcept): string {
  for (const [key, value] of Object.entries(VIBE_COLORS)) {
    if (concept.vibe.toLowerCase().includes(key.toLowerCase())) return value;
    if (concept.visualStyle.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return "from-white/10 to-white/5 border-white/20";
}

type Props = {
  concept: AIConcept;
  index: number;
  onCustomize: () => void;
  onPlayDemo: () => void;
  onRegenerate?: () => void;
};

export function AIConceptCard({ concept, index, onCustomize, onPlayDemo, onRegenerate }: Props) {
  const colorStyle = getColorStyle(concept);
  const emoji = getDefaultEmoji(concept.templateType);

  const handleCustomize = useCallback(() => {
    recordFeedback({
      conceptId: concept.id,
      conceptTitle: concept.title,
      templateType: concept.templateType,
      vibe: concept.vibe,
      visualStyle: concept.visualStyle,
      feedbackType: "positive",
      source: "implicit_customize",
      timestamp: Date.now(),
    });
    onCustomize();
  }, [concept, onCustomize]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group rounded-2xl border bg-gradient-to-b p-4 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colorStyle}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg backdrop-blur-sm">
            {emoji}
          </span>
          <div>
            <p className="text-xs font-bold tracking-[0.06em] text-white/40 uppercase">{concept.templateType}</p>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/50">
          #{index + 1}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white leading-tight">{concept.title}</h3>
      <p className="mt-1 text-xs text-violet/60 italic">&ldquo;{concept.vibe}&rdquo;</p>
      <p className="mt-2 text-xs leading-relaxed text-white/60">{concept.shortDescription}</p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
          {concept.visualStyle}
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
          {concept.scenes.length} scenes
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {concept.scenes.slice(0, 2).map((scene, si) => (
          <div key={si} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/40 uppercase">
                {scene.interaction}
              </span>
              <p className="text-xs font-bold text-white/70 truncate">{scene.heading}</p>
            </div>
            <p className="mt-1 text-xs text-white/50 line-clamp-2">{scene.message}</p>
          </div>
        ))}
        {concept.scenes.length > 2 && (
          <p className="text-[10px] text-white/30 text-center">+{concept.scenes.length - 2} more scenes</p>
        )}
      </div>

      <div className="mt-3 rounded-xl bg-white/[0.04] p-2.5">
        <p className="text-[10px] font-bold tracking-[0.06em] text-white/30 uppercase">Final Message</p>
        <p className="mt-0.5 text-xs text-white/60 line-clamp-2">{concept.finalMessage}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={onPlayDemo}
          className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/20 hover:text-white transition-all active:scale-95">
          Play Demo ▶
        </button>
        <button type="button" onClick={handleCustomize}
          className="flex-1 rounded-xl bg-gradient-to-r from-blush to-violet px-3 py-2 text-xs font-bold text-white shadow-[0_0_12px_rgba(236,72,153,0.2)] hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all active:scale-95">
          Customize ✨
        </button>
        {onRegenerate && (
          <button type="button" onClick={onRegenerate}
            className="flex items-center justify-center rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/10 hover:text-white/80 transition-all active:scale-95"
            title="Not my vibe — try different">
            🔄
          </button>
        )}
      </div>
    </motion.div>
  );
}
