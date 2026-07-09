"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameBuilder } from "@/lib/ai-service";
import { VoiceInput } from "@/components/VoiceInput";
import { AIConceptCard } from "@/components/AIConceptCard";
import { recordFeedback } from "@/lib/ai-feedback";
import type { GameOccasion, GameRecipient, GameTone, AIConcept } from "@/lib/ai-types";

const OCCASIONS: GameOccasion[] = ["Confession", "Apology", "Birthday", "Anniversary", "Proposal", "Just Because"];
const RECIPIENTS: GameRecipient[] = ["Partner", "Crush", "Friend", "Family"];
const GAME_TONES: GameTone[] = ["Romantic", "Cute", "Emotional", "Funny", "Premium"];

const LOADING_STATES = [
  "Creating 3 magical directions...",
  "Weaving your story...",
  "Finding the perfect vibe...",
  "Writing magic...",
  "Designing interactive scenes...",
  "Almost there...",
];
const LOADING_INTERVAL = 3500;

type Props = {
  onCustomize?: (concept: AIConcept) => void;
  onPlayDemo?: (concept: AIConcept) => void;
};

export function AIGameBuilder({ onCustomize, onPlayDemo }: Props) {
  const [story, setStory] = useState("");
  const [occasion, setOccasion] = useState<GameOccasion>("Confession");
  const [recipient, setRecipient] = useState<GameRecipient>("Partner");
  const [tone, setTone] = useState<GameTone>("Romantic");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
  const [concepts, setConcepts] = useState<AIConcept[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLoadingTexts = useCallback(() => {
    let i = 0;
    setLoadingText(LOADING_STATES[0]);
    loadingIntervalRef.current = setInterval(() => {
      i = (i + 1) % LOADING_STATES.length;
      setLoadingText(LOADING_STATES[i]);
    }, LOADING_INTERVAL);
  }, []);

  const stopLoadingTexts = useCallback(() => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopLoadingTexts();
  }, [stopLoadingTexts]);

  const handleGenerate = useCallback(async (isRegenerate?: boolean) => {
    if (!story.trim()) return;

    if (isRegenerate && concepts) {
      for (const c of concepts) {
        recordFeedback({
          conceptId: c.id,
          conceptTitle: c.title,
          templateType: c.templateType,
          vibe: c.vibe,
          visualStyle: c.visualStyle,
          feedbackType: "negative",
          source: "implicit_regenerate",
          timestamp: Date.now(),
          tone,
          occasion,
          recipient,
        });
      }
    }

    setLoading(true);
    setError(null);
    setConcepts(null);
    startLoadingTexts();
    try {
      const res = await gameBuilder(story, occasion, recipient, tone);
      setConcepts(res.concepts);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      stopLoadingTexts();
      setLoading(false);
    }
  }, [story, occasion, recipient, tone, concepts, startLoadingTexts, stopLoadingTexts]);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <div className="relative flex-1">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Tell us the story... What happened? What do you want to say?"
            maxLength={1000}
            className="input min-h-24 w-full py-3 text-sm"
            rows={4}
          />
        </div>
        <VoiceInput onTranscript={(text) => setStory((p) => p + text)} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-white/40">Occasion</p>
          <select value={occasion} onChange={(e) => setOccasion(e.target.value as GameOccasion)}
            className="input w-full appearance-none text-sm">
            {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-white/40">Recipient</p>
          <select value={recipient} onChange={(e) => setRecipient(e.target.value as GameRecipient)}
            className="input w-full appearance-none text-sm">
            {RECIPIENTS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-white/40">Tone</p>
          <select value={tone} onChange={(e) => setTone(e.target.value as GameTone)}
            className="input w-full appearance-none text-sm">
            {GAME_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleGenerate(!!concepts)}
        disabled={loading || !story.trim()}
        className="premium-button w-full disabled:opacity-40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" className="opacity-30" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" strokeDashoffset="-10" className="opacity-90" />
            </svg>
            {loadingText}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            {concepts ? "Regenerate 3 Concepts 🔄" : "Generate 3 Concepts ✨"}
          </span>
        )}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-rose-200/20 bg-rose-500/10 p-4"
          >
            <p className="text-sm text-rose-200">{error}</p>
            <button type="button" onClick={() => void handleGenerate()}
              className="mt-2 text-xs font-bold text-rose-300 underline underline-offset-2 hover:text-rose-200">
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {concepts && concepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <p className="mb-4 text-center text-sm text-white/40">
              Choose a concept to customize or preview
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {concepts.map((concept, idx) => (
                <AIConceptCard
                  key={concept.id}
                  concept={concept}
                  index={idx}
                  onCustomize={() => onCustomize?.(concept)}
                  onPlayDemo={() => onPlayDemo?.(concept)}
                  onRegenerate={() => { void handleGenerate(true); }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
