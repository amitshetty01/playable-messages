"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { messageAssist } from "@/lib/ai-service";
import { VoiceInput } from "@/components/VoiceInput";
import type { AssistTone } from "@/lib/ai-types";

const TONES: AssistTone[] = ["Romantic", "Sorry", "Cute", "Emotional", "Funny", "Premium"];

const LOADING_TEXTS = ["Writing magic...", "Finding the right words...", "Making it beautiful..."];
const LOADING_DURATION = 4000;

type Props = {
  onUse: (text: string) => void;
  currentMessage?: string;
};

export function AIMessageAssistant({ onUse, currentMessage = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [roughPoints, setRoughPoints] = useState(currentMessage);
  const [tone, setTone] = useState<AssistTone>("Romantic");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startLoadingTexts = useCallback(() => {
    let i = 0;
    setLoadingText(LOADING_TEXTS[0]);
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_TEXTS.length;
      setLoadingText(LOADING_TEXTS[i]);
    }, LOADING_DURATION);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!roughPoints.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const stop = startLoadingTexts();
    try {
      const res = await messageAssist(roughPoints, tone);
      setResult(res.rewritten);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      stop();
      setLoading(false);
    }
  }, [roughPoints, tone, startLoadingTexts]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleShorter = useCallback(() => {
    if (!result) return;
    const shortened = result.split(".").slice(0, 2).join(".") + ".";
    setResult(shortened);
  }, [result]);

  const handleMoreEmotional = useCallback(async () => {
    if (!result) return;
    setLoading(true);
    setError(null);
    const stop = startLoadingTexts();
    try {
      const res = await messageAssist(
        `Make this more emotional: ${result}`,
        tone
      );
      setResult(res.rewritten);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      stop();
      setLoading(false);
    }
  }, [result, tone, startLoadingTexts]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="premium-button text-xs"
      >
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          AI Assist
        </span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-2xl border border-violet/20 bg-violet/10 p-4 backdrop-blur-xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold tracking-[0.08em] text-violet/60 uppercase">AI Message Assistant</p>
        <button type="button" onClick={() => { setOpen(false); setResult(null); setError(null); }}
          className="text-xs text-white/40 hover:text-white/70 transition-colors">
          Close
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <textarea
            value={roughPoints}
            onChange={(e) => setRoughPoints(e.target.value)}
            placeholder="Type rough points or ideas..."
            maxLength={500}
            className="input min-h-20 flex-1 py-2 text-sm"
            rows={3}
          />
          <VoiceInput onTranscript={(text) => setRoughPoints((p) => p + text)} />
        </div>

        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                tone === t
                  ? "bg-violet text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                  : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !roughPoints.trim()}
          className="premium-button w-full text-xs disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" className="opacity-30" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" strokeDashoffset="-10" className="opacity-90" />
              </svg>
              {loadingText}
            </span>
          ) : (
            "Rewrite ✨"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-rose-200/20 bg-rose-500/10 p-3">
          <p className="text-xs text-rose-200">{error}</p>
          <button type="button" onClick={handleGenerate} className="mt-2 text-xs font-bold text-rose-300 underline underline-offset-2 hover:text-rose-200">
            Retry
          </button>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-sm leading-relaxed text-white/90">{result}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => { onUse(result); setOpen(false); setResult(null); }}
                className="rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all active:scale-95">
                Use This ✓
              </button>
              <button type="button" onClick={handleRegenerate}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white/60 hover:bg-white/20 hover:text-white transition-all active:scale-95">
                Regenerate 🔄
              </button>
              <button type="button" onClick={handleShorter}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white/60 hover:bg-white/20 hover:text-white transition-all active:scale-95">
                Make Shorter
              </button>
              <button type="button" onClick={handleMoreEmotional}
                className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white/60 hover:bg-white/20 hover:text-white transition-all active:scale-95">
                More Emotional 💕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
