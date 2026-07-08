"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSnippets, addSnippet, removeSnippet } from "@/lib/quick-snippets";
import type { Snippet } from "@/lib/quick-snippets";

const EMOJI_OPTIONS = ["💬", "😂", "💖", "🔥", "🥺", "🎂", "🎵", "✨", "👻", "🤝", "😭", "💀"];

export function QuickSnippetsManager({ onInsert }: { onInsert?: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [snippets, setSnippets] = useState<Snippet[]>(() => getSnippets());
  const [newLabel, setNewLabel] = useState("");
  const [newText, setNewText] = useState("");
  const [newEmoji, setNewEmoji] = useState("💬");

  const handleAdd = useCallback(() => {
    if (!newLabel.trim() || !newText.trim()) return;
    const updated = addSnippet(newLabel.trim(), newText.trim(), newEmoji);
    setSnippets(updated);
    setNewLabel("");
    setNewText("");
    setNewEmoji("💬");
  }, [newLabel, newText, newEmoji]);

  const handleRemove = useCallback((id: string) => {
    setSnippets(removeSnippet(id));
  }, []);

  const count = snippets.length;

  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs font-bold tracking-[0.08em] text-white/40 hover:text-white/60 transition-colors">
        Inside Jokes &amp; Snippets {count > 0 ? `(${count})` : ""} ▾
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              {snippets.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold tracking-[0.08em] text-white/30">SAVED SNIPPETS</p>
                  <div className="space-y-1.5">
                    {snippets.map((s) => (
                      <div key={s.id} className="group flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                        <span className="mt-0.5 text-lg">{s.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white/80 truncate">{s.label}</p>
                          <p className="text-xs text-white/40 line-clamp-2">{s.text}</p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button type="button" onClick={() => onInsert?.(`${s.emoji} ${s.text}`)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs text-white/60 hover:bg-white/20 hover:text-white transition-colors" title="Insert">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </button>
                          <button type="button" onClick={() => handleRemove(s.id)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs text-rose-300/50 hover:bg-rose-500/20 hover:text-rose-300 transition-colors" title="Delete">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-[0.08em] text-white/30">ADD NEW SNIPPET</p>
                <div className="flex gap-2">
                  <select value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} className="input w-12 appearance-none text-center text-lg">
                    {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} maxLength={80} className="input min-w-0 flex-1" placeholder="Label (e.g. Our song - Landslide)" />
                </div>
                <textarea value={newText} onChange={(e) => setNewText(e.target.value)} maxLength={500} className="input min-h-20 py-2" placeholder="The full text snippet..." />
                <button type="button" onClick={handleAdd} disabled={!newLabel.trim() || !newText.trim()} className="premium-button w-full text-xs disabled:opacity-40">
                  Save Snippet
                </button>
                {snippets.length === 0 && !newLabel.trim() && !newText.trim() && (
                  <p className="text-[11px] text-white/30 leading-relaxed">
                    Save your inside jokes, song lyrics, pet names — then type <kbd className="rounded bg-white/10 px-1 py-0.5 font-mono text-white/60">/</kbd> in your message to insert them instantly.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
