"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getSnippets } from "@/lib/quick-snippets";
import type { Snippet } from "@/lib/quick-snippets";

type Props = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onInsert: (text: string) => void;
};

export function QuickSnippetsDropdown({ textareaRef, onInsert }: Props) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Snippet[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const allSnippets = useRef<Snippet[]>([]);

  useEffect(() => {
    allSnippets.current = getSnippets();
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    function handleInput() {
      const val = el!.value;
      const pos = el!.selectionStart;
      const before = val.slice(0, pos);
      const slashIdx = before.lastIndexOf("/");

      if (slashIdx !== -1 && slashIdx === pos - 1) {
        setQuery("");
        setMatches(allSnippets.current.filter(() => true));
        setSelectedIdx(0);
        setShow(allSnippets.current.length > 0);
      } else if (slashIdx !== -1 && slashIdx < pos - 1) {
        const q = before.slice(slashIdx + 1);
        if (!q.includes(" ")) {
          setQuery(q);
          const lower = q.toLowerCase();
          const filtered = allSnippets.current.filter(
            (s) => s.label.toLowerCase().includes(lower) || s.text.toLowerCase().includes(lower)
          );
          setMatches(filtered);
          setSelectedIdx(0);
          setShow(filtered.length > 0);
        } else {
          setShow(false);
        }
      } else {
        setShow(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (!show) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((p) => Math.min(p + 1, matches.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((p) => Math.max(p - 1, 0)); }
      else if (e.key === "Enter" || e.key === "Tab") { if (matches.length > 0) { e.preventDefault(); insertSnippet(matches[selectedIdx]); } }
      else if (e.key === "Escape") { e.preventDefault(); setShow(false); }
    }

    el.addEventListener("input", handleInput);
    el.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, matches, selectedIdx, textareaRef]);

  function insertSnippet(snippet: Snippet) {
    const el = textareaRef.current;
    if (!el) return;
    const val = el.value;
    const pos = el.selectionStart;
    const before = val.slice(0, pos);
    const slashIdx = before.lastIndexOf("/");
    const after = val.slice(pos);
    const insertion = `${snippet.emoji} ${snippet.text}`;
    el.value = before.slice(0, slashIdx) + insertion + after;
    el.selectionStart = el.selectionEnd = slashIdx + insertion.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    setShow(false);
    onInsert(insertion);
  }

  if (!show || matches.length === 0) return null;

  return (
    <div ref={dropdownRef} className="absolute bottom-full left-0 right-0 z-50 mb-1 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1525] shadow-2xl backdrop-blur-xl">
      {matches.map((s, i) => (
        <button key={s.id} type="button" onMouseDown={(e) => { e.preventDefault(); insertSnippet(s); }}
          onMouseEnter={() => setSelectedIdx(i)}
          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
            i === selectedIdx ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white/80"
          }`}>
          <span className="text-base">{s.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{s.label}</p>
            <p className="truncate text-xs text-white/40">{s.text}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
