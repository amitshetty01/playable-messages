"use client";

import { motion, AnimatePresence } from "framer-motion";

export function TranslateBanner({ language, onTranslate, onDismiss }: { language: string; onTranslate: () => void; onDismiss: () => void }) {
  let langLabel = language;
  try {
    const langNames = new Intl.DisplayNames(["en"], { type: "language" });
    langLabel = langNames.of(language) || language;
  } catch {}

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -30, height: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-white/[0.02] px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🌍</span>
            <span className="text-white/80">
              This message is in English. <span className="font-bold text-white">Translate to {langLabel}?</span>
            </span>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onTranslate}
              className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-white/25 active:scale-95"
            >
              Yes, translate
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-white/50 transition-all hover:text-white/80 active:scale-95"
            >
              No, thanks
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
