"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import type { AIConcept } from "@/lib/ai-types";

type Props = {
  concept: AIConcept;
  onComplete: (files: Record<string, string>) => void;
  onBack: () => void;
};

export function AIMediaUploads({ concept, onComplete, onBack }: Props) {
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSlotRef = useRef<string | null>(null);

  const handleFileSelect = useCallback((slotId: string) => {
    currentSlotRef.current = slotId;
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSlotRef.current) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploads((prev) => ({ ...prev, [currentSlotRef.current!]: dataUrl }));
      setActiveSlot(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const allUploaded = concept.mediaSlots.every((slot) => uploads[slot.label]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-white">Make it yours</h3>
        <p className="mt-1 text-sm text-white/50">
          This template has <span className="font-bold text-violet">{concept.mediaSlots.length}</span> perfect spots for photos. Upload them here to make it complete.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {concept.mediaSlots.map((slot, idx) => (
          <motion.div
            key={slot.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <button
              type="button"
              onClick={() => handleFileSelect(slot.label)}
              onMouseEnter={() => setActiveSlot(slot.label)}
              onMouseLeave={() => setActiveSlot(null)}
              className={`group relative w-full overflow-hidden rounded-2xl border-2 border-dashed p-4 text-left transition-all ${
                uploads[slot.label]
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : activeSlot === slot.label
                  ? "border-violet/50 bg-violet/10"
                  : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
              }`}
            >
              {uploads[slot.label] ? (
                <div className="relative">
                  <img src={uploads[slot.label]} alt={slot.label}
                    className="h-32 w-full rounded-xl object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white">Tap to change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/40">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-white/60">{slot.label}</p>
                  <p className="text-center text-xs text-white/40">{slot.description}</p>
                </div>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="ghost-button flex-1 text-xs">
          Back to Concepts
        </button>
        <button
          type="button"
          onClick={() => onComplete(uploads)}
          disabled={!allUploaded}
          className="premium-button flex-1 text-xs disabled:opacity-40"
        >
          {allUploaded
            ? "Continue ✨"
            : `Upload photos (${Object.keys(uploads).length}/${concept.mediaSlots.length})`}
        </button>
      </div>
    </motion.div>
  );
}
