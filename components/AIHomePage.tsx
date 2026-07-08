"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeParticleBackground } from "@/components/ThreeParticleBackground";
import { AIHeroSection } from "@/components/AIHeroSection";
import { MagicDemoSection } from "@/components/MagicDemoSection";
import { InspirationCarousel } from "@/components/InspirationCarousel";
import { AIConceptCard } from "@/components/AIConceptCard";
import { AIMediaUploads } from "@/components/AIMediaUploads";
import { AILoadingOverlay } from "@/components/AILoadingOverlay";
import { gameBuilder, surpriseMe } from "@/lib/ai-service";
import type { AIConcept } from "@/lib/ai-types";

export function AIHomePage() {
  const [showLoading, setShowLoading] = useState(false);
  const [concepts, setConcepts] = useState<AIConcept[] | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<AIConcept | null>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [previewConcept, setPreviewConcept] = useState<AIConcept | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const loadingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLoadingSequence = useCallback(() => {
    setShowLoading(true);
  }, []);

  const stopLoadingSequence = useCallback(() => {
    if (loadingInterval.current) {
      clearInterval(loadingInterval.current);
      loadingInterval.current = null;
    }
    setShowLoading(false);
  }, []);

  const handleGenerate = useCallback(async (prompt: string) => {
    setError(null);
    setDebugInfo(null);
    setConcepts(null);
    setSelectedConcept(null);
    setShowMedia(false);
    startLoadingSequence();

    try {
      if (prompt === "surprise_me") {
        const res = await surpriseMe();
        if (res.concepts && res.concepts.length > 0) {
          setConcepts(res.concepts);
        } else {
          throw new Error("No concepts returned. Please try again.");
        }
      } else {
        // Determine tone from prompt keywords
        const lower = prompt.toLowerCase();
        let tone = "Romantic";
        if (lower.includes("apolog") || lower.includes("sorry") || lower.includes("forgive")) tone = "Emotional";
        else if (lower.includes("fun") || lower.includes("laugh") || lower.includes("funny") || lower.includes("playful")) tone = "Funny";
        else if (lower.includes("birthday") || lower.includes("celebrate")) tone = "Premium";
        else if (lower.includes("friend") || lower.includes("bestie") || lower.includes("buddy")) tone = "Cute";
        else if (lower.includes("love") || lower.includes("romance") || lower.includes("confess") || lower.includes("crush")) tone = "Romantic";

        let occasion = "Just Because";
        if (lower.includes("confess") || lower.includes("crush") || lower.includes("love")) occasion = "Confession";
        else if (lower.includes("apolog") || lower.includes("sorry") || lower.includes("forgive")) occasion = "Apology";
        else if (lower.includes("birthday")) occasion = "Birthday";
        else if (lower.includes("anniversary")) occasion = "Anniversary";
        else if (lower.includes("propos") || lower.includes("engagement") || lower.includes("marry")) occasion = "Proposal";

        let recipient = "Partner";
        if (lower.includes("friend") || lower.includes("bestie") || lower.includes("buddy")) recipient = "Friend";
        else if (lower.includes("mom") || lower.includes("dad") || lower.includes("parent") || lower.includes("brother") || lower.includes("sister") || lower.includes("family")) recipient = "Family";
        else if (lower.includes("crush")) recipient = "Crush";

        const res = await gameBuilder(prompt, occasion, recipient, tone);
        if (res.concepts && res.concepts.length > 0) {
          setConcepts(res.concepts);
        } else {
          throw new Error("No concepts returned. Please try again.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      if (msg.includes("OPENROUTER_API_KEY") || msg.includes("401") || msg.includes("403")) {
        setDebugInfo("The OpenRouter API key may be missing or invalid. Make sure OPENROUTER_API_KEY is set in your .env.local file. Get a key at https://openrouter.ai/keys");
      } else {
        setDebugInfo("Please try again. If the issue persists, check the server console for details.");
      }
    } finally {
      stopLoadingSequence();
    }
  }, [startLoadingSequence, stopLoadingSequence]);

  const handleCustomize = useCallback((concept: AIConcept) => {
    setSelectedConcept(concept);
    setShowMedia(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePlayDemo = useCallback((concept: AIConcept) => {
    setPreviewConcept(concept);
  }, []);

  const handleMediaComplete = useCallback((files: Record<string, string>) => {
    // Redirect to create page with the concept data and media
    const params = new URLSearchParams();
    params.set("ai", "true");
    params.set("concept", selectedConcept?.id || "");
    params.set("media", JSON.stringify(Object.keys(files)));
    window.location.href = `/create?${params.toString()}`;
  }, [selectedConcept]);

  const handleSelectPrompt = useCallback((prompt: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => handleGenerate(prompt), 400);
  }, [handleGenerate]);

  return (
    <>
      <ThreeParticleBackground />
      <AILoadingOverlay visible={showLoading} />

      {/* Generate result dialog */}
      <AnimatePresence>
        {!showLoading && concepts && concepts.length > 0 && !showMedia && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="relative z-10 px-4 pb-24"
          >
            <div className="mx-auto max-w-6xl">
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Your concepts are ready!</h2>
                <p className="mt-2 text-sm text-white/50">Choose one to preview, customize, or regenerate.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {concepts.map((concept, idx) => (
                  <AIConceptCard
                    key={concept.id}
                    concept={concept}
                    index={idx}
                    onCustomize={() => handleCustomize(concept)}
                    onPlayDemo={() => handlePlayDemo(concept)}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => { setConcepts(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="ghost-button text-xs"
                >
                  ← Try a different idea
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Media Uploads */}
      <AnimatePresence>
        {showMedia && selectedConcept && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="relative z-10 px-4 pb-24"
          >
            <div className="mx-auto max-w-2xl">
              <AIMediaUploads
                concept={selectedConcept}
                onComplete={handleMediaComplete}
                onBack={() => { setShowMedia(false); setSelectedConcept(null); }}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && !showLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-10 px-4 pb-8"
          >
            <div className="mx-auto max-w-lg rounded-2xl border border-rose-200/20 bg-rose-500/10 p-6 text-center backdrop-blur-xl">
              <span className="text-3xl">😕</span>
              <p className="mt-2 text-sm font-bold text-rose-200">{error}</p>
              {debugInfo && (
                <p className="mt-2 text-xs text-rose-300/70 leading-relaxed">{debugInfo}</p>
              )}
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleGenerate("surprise_me")}
                  className="rounded-xl bg-white/10 px-5 py-2 text-xs font-bold text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  Try Surprise Me
                </button>
                <button
                  type="button"
                  onClick={() => { setError(null); setDebugInfo(null); }}
                  className="rounded-xl bg-rose-500/20 px-5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content (hidden during results) */}
      {!concepts && !showMedia && (
        <>
          <AIHeroSection onGenerate={handleGenerate} loading={showLoading} />
          <MagicDemoSection />
          <InspirationCarousel onSelectPrompt={handleSelectPrompt} />

          {/* Footer */}
          <footer className="relative z-10 border-t border-white/10 px-4 py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-xs text-white/40">
                  Prefer to build it yourself?{" "}
                  <Link href="/templates" className="font-bold text-violet underline underline-offset-4 hover:text-white transition-colors">
                    Browse all manual templates →
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-white/40">
                <a href="/about" className="hover:text-white/70 transition-colors">About</a>
                <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-white/70 transition-colors">Terms</a>
                <a href="/contact" className="hover:text-white/70 transition-colors">Contact</a>
                <a href="/faq" className="hover:text-white/70 transition-colors">FAQ</a>
              </div>
            </div>
            <p className="mt-6 text-center text-[10px] text-white/20">
              Craft Your Message &copy; {new Date().getFullYear()}
            </p>
          </footer>
        </>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewConcept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setPreviewConcept(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm"
            >
              <div className="relative mx-auto overflow-hidden rounded-[3rem] border-4 border-white/20 bg-black shadow-2xl">
                <div className="px-6 pb-8 pt-12">
                  <div className="mb-4 text-center">
                    <p className="text-[10px] font-bold tracking-[0.08em] text-violet/60 uppercase">{previewConcept.templateType}</p>
                    <h3 className="mt-1 text-xl font-bold text-white">{previewConcept.title}</h3>
                    <p className="text-xs text-white/50 italic">&ldquo;{previewConcept.vibe}&rdquo;</p>
                  </div>

                  <div className="space-y-3">
                    {previewConcept.scenes.map((scene, si) => (
                      <motion.div
                        key={si}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: si * 0.15 }}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/50 uppercase">
                            {scene.interaction}
                          </span>
                          <p className="text-sm font-bold text-white">{scene.heading}</p>
                        </div>
                        <p className="text-xs leading-relaxed text-white/70">{scene.message}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-gradient-to-br from-blush/20 to-violet/20 p-4 text-center">
                    <p className="text-xs font-bold tracking-[0.06em] text-violet/60 uppercase">Final Message</p>
                    <p className="mt-1 text-sm text-white">{previewConcept.finalMessage}</p>
                  </div>
                </div>

                <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
              </div>

              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewConcept(null)}
                  className="rounded-xl bg-white/10 px-5 py-2 text-xs font-bold text-white/60 hover:bg-white/20 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => { handleCustomize(previewConcept); setPreviewConcept(null); }}
                  className="premium-button text-xs"
                >
                  Customize ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
