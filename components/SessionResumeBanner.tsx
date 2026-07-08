"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const RESUME_CODE_KEY = "cym_resume_code";
const DRAFT_KEY = "craft-message-draft";

type DraftInfo = {
  id: string;
  resumeCode: string;
  templateId: string;
  templateTitle: string;
  preview: string;
};

export function SessionResumeBanner() {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeInput, setCodeInput] = useState("");

  useEffect(() => {
    const storedCode = localStorage.getItem(RESUME_CODE_KEY);
    if (!storedCode) {
      setLoading(false);
      return;
    }

    fetch(`/api/drafts?code=${encodeURIComponent(storedCode)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Draft not found");
        return res.json();
      })
      .then((json) => {
        const d = json.data;
        if (!d) throw new Error("No data");
        const formState = d.form_state ?? {};
        setDraft({
          id: d.id,
          resumeCode: d.resume_code,
          templateId: d.template_id,
          templateTitle: formatTemplateName(d.template_id),
          preview: (formState.finalMessage as string)?.slice(0, 100) ?? "Unfinished message",
        });
      })
      .catch(() => {
        localStorage.removeItem(RESUME_CODE_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleResume = useCallback(() => {
    if (!draft) return;
    router.push(`/create/${draft.templateId}?resume=${draft.resumeCode}`);
  }, [draft, router]);

  const handleStartFresh = useCallback(() => {
    localStorage.removeItem(RESUME_CODE_KEY);
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
    setDismissed(true);
  }, []);

  const handleCodeResume = useCallback(() => {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    localStorage.setItem(RESUME_CODE_KEY, code);
    window.location.reload();
  }, [codeInput]);

  if (loading || dismissed || !draft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative mx-auto mb-6 max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-2xl border border-violet/30 bg-gradient-to-r from-violet/15 via-purple-500/10 to-blush/10 p-4 shadow-lg shadow-violet/5 sm:p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet/20 text-lg">
                ✨
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">Welcome back!</p>
                <p className="mt-0.5 text-xs text-white/60">
                  You have an unfinished message (<span className="font-bold text-white/80">{draft.templateTitle}</span>)
                </p>
                <p className="mt-1 text-xs text-white/40 line-clamp-1">{draft.preview}</p>
                <p className="mt-1 text-[10px] font-mono text-violet/60">Code: {draft.resumeCode}</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={handleResume} className="premium-button text-xs px-4 py-2">
                Resume
              </button>
              <button type="button" onClick={handleStartFresh} className="ghost-button text-xs px-4 py-2">
                Start fresh
              </button>
              <button type="button" onClick={() => setDismissed(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 hover:bg-white/10 hover:text-white/60 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            {showCodeInput ? (
              <div className="flex items-center gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCodeResume(); }}
                  placeholder="Enter code (e.g. Lucky-Heart-42)"
                  className="input flex-1 text-xs py-1.5"
                  autoFocus
                />
                <button type="button" onClick={handleCodeResume} className="premium-button text-xs px-3 py-1.5">
                  Restore
                </button>
                <button type="button" onClick={() => setShowCodeInput(false)} className="text-xs text-white/40 hover:text-white/60">
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setShowCodeInput(true)} className="text-[11px] font-bold text-violet/60 hover:text-violet/80 transition-colors">
                Have a resume code from another device? →
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatTemplateName(id?: string): string {
  if (!id) return "Message";
  return id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
