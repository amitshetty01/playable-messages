"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIGameBuilder } from "@/components/AIGameBuilder";
import { AIMessageAssistant } from "@/components/AIMessageAssistant";
import { AIConceptCard } from "@/components/AIConceptCard";
import { AIMediaUploads } from "@/components/AIMediaUploads";
import { surpriseMe } from "@/lib/ai-service";
import type { AIConcept } from "@/lib/ai-types";

type Tab = "assist" | "builder" | "surprise";

type Props = {
  onUseMessage?: (text: string) => void;
  onUseConcept?: (concept: AIConcept, media?: Record<string, string>) => void;
  currentMessage?: string;
};

export function AIWorkflow({ onUseMessage, onUseConcept, currentMessage = "" }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("assist");
  const [selectedConcept, setSelectedConcept] = useState<AIConcept | null>(null);
  const [showMediaUploads, setShowMediaUploads] = useState(false);
  const [surpriseConcepts, setSurpriseConcepts] = useState<AIConcept[] | null>(null);
  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const [surpriseError, setSurpriseError] = useState<string | null>(null);
  const [previewConcept, setPreviewConcept] = useState<AIConcept | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = useMemo(() => [
    { id: "assist", label: "Message Assist", icon: "✍️" },
    { id: "builder", label: "Game Builder", icon: "🎮" },
    { id: "surprise", label: "Surprise Me", icon: "✨" },
  ], []);

  const handleCustomize = useCallback((concept: AIConcept) => {
    setSelectedConcept(concept);
    setShowMediaUploads(true);
  }, []);

  const handlePlayDemo = useCallback((concept: AIConcept) => {
    setPreviewConcept(concept);
  }, []);

  const handleMediaComplete = useCallback((files: Record<string, string>) => {
    if (selectedConcept && onUseConcept) {
      onUseConcept(selectedConcept, files);
    }
    setShowMediaUploads(false);
    setSelectedConcept(null);
  }, [selectedConcept, onUseConcept]);

  const handleMediaBack = useCallback(() => {
    setShowMediaUploads(false);
    setSelectedConcept(null);
  }, []);

  const handleSurprise = useCallback(async () => {
    setSurpriseLoading(true);
    setSurpriseError(null);
    setSurpriseConcepts(null);
    try {
      const res = await surpriseMe();
      setSurpriseConcepts(res.concepts);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setSurpriseError(msg);
    } finally {
      setSurpriseLoading(false);
    }
  }, []);

  if (showMediaUploads && selectedConcept) {
    return (
      <AIMediaUploads
        concept={selectedConcept}
        onComplete={handleMediaComplete}
        onBack={handleMediaBack}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blush to-violet text-white shadow-lg"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "assist" && (
          <motion.div key="assist" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
            <AIMessageAssistant onUse={(text) => onUseMessage?.(text)} currentMessage={currentMessage} />
          </motion.div>
        )}

        {activeTab === "builder" && (
          <motion.div key="builder" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
            <AIGameBuilder onCustomize={handleCustomize} onPlayDemo={handlePlayDemo} />
          </motion.div>
        )}

        {activeTab === "surprise" && (
          <motion.div key="surprise" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} className="text-center">
            <button
              type="button"
              onClick={handleSurprise}
              disabled={surpriseLoading}
              className="group relative mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blush/20 to-violet/20 transition-all hover:from-blush/30 hover:to-violet/30 active:scale-95"
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blush/10 to-violet/10" />
              {surpriseLoading ? (
                <svg className="h-8 w-8 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" className="opacity-30" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.4 31.4" strokeDashoffset="-10" className="opacity-90" />
                </svg>
              ) : (
                <span className="text-4xl transition-transform group-hover:scale-110 group-active:scale-90">
                  ✨
                </span>
              )}
            </button>
            <p className="mt-4 text-lg font-bold text-white">
              {surpriseLoading ? "Preparing your surprise..." : "Surprise Me"}
            </p>
            <p className="mt-1 text-sm text-white/40">
              {surpriseLoading ? "Creating something magical..." : "Let AI create a random delightful concept for you"}
            </p>

            <AnimatePresence>
              {surpriseError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="mt-4 rounded-xl border border-rose-200/20 bg-rose-500/10 p-4">
                  <p className="text-sm text-rose-200">{surpriseError}</p>
                  <button type="button" onClick={handleSurprise}
                    className="mt-2 text-xs font-bold text-rose-300 underline underline-offset-2 hover:text-rose-200">
                    Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surprise results */}
      <AnimatePresence>
        {surpriseConcepts && surpriseConcepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="mt-4"
          >
            <p className="mb-4 text-center text-sm text-white/40">Here&apos;s a surprise concept for you</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {surpriseConcepts.map((concept, idx) => (
                <AIConceptCard
                  key={concept.id}
                  concept={concept}
                  index={idx}
                  onCustomize={() => handleCustomize(concept)}
                  onPlayDemo={() => handlePlayDemo(concept)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {/* Phone frame */}
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

                {/* Notch */}
                <div className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />
              </div>

              <button
                type="button"
                onClick={() => setPreviewConcept(null)}
                className="mx-auto mt-4 block rounded-xl bg-white/10 px-6 py-2 text-xs font-bold text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              >
                Close Preview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
