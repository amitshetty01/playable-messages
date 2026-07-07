"use client";

import { motion, AnimatePresence } from "framer-motion";

type DraftData = Record<string, any>;

function formatTemplateName(id?: string): string {
  if (!id) return "Message";
  return id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DraftRecoveryModal({
  draft,
  onChoose,
}: {
  draft: DraftData;
  onChoose: (choice: "continue" | "fresh") => void;
}) {
  const templateName = formatTemplateName(draft.templateId);
  const preview = draft.finalMessage
    ? draft.finalMessage.length > 80
      ? draft.finalMessage.slice(0, 80) + "..."
      : draft.finalMessage
    : "No preview available";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative glass w-full max-w-md rounded-[2rem] p-8 text-center shadow-glow sm:p-10"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush/20 to-violet/20 text-3xl">
            ✨
          </div>

          <h2 className="text-2xl font-bold text-white">
            Welcome back!
          </h2>

          <p className="mt-2 text-white/60">
            You have an unfinished message
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left">
            <p className="text-[10px] font-bold tracking-[0.08em] text-white/30 uppercase">
              {templateName}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {preview}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              className="premium-button w-full"
              onClick={() => onChoose("continue")}
            >
              Continue editing
            </button>
            <button
              type="button"
              className="ghost-button w-full"
              onClick={() => onChoose("fresh")}
            >
              Start fresh
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
