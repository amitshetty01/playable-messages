"use client";

import { useState, useCallback } from "react";
import { templates } from "@/lib/data";
import { pickTemplate } from "@/lib/pickTemplate";
import { Spinner } from "@/components/Spinner";

export function BrowseFlow() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  const selected = templates.find((t) => t.id === selectedId);

  const generate = useCallback(async () => {
    if (!selectedId || !message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedId,
          finalMessage: message,
          customMessages: { landingText: message.slice(0, 120), buttonText: "Open", steps: ["Here's something for you..."], ctaMessage: "Made with 💖" },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.id) { setError(json.error || "Could not generate."); return; }
      setShareUrl(`${window.location.origin}/experience/${json.id}`);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  }, [selectedId, message]);

  if (shareUrl) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <div className="w-full max-w-md text-center">
          <div className="rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 p-10 backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-3xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-300"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 className="display-title text-3xl font-bold text-white">Your link is ready!</h2>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-2">
              <input readOnly value={shareUrl} className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none" onClick={(e) => (e.target as HTMLInputElement).select()} />
              <button type="button" className="shrink-0 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/25 active:scale-95" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
            </div>
            <button type="button" className="mt-6 ghost-button" onClick={() => { setShareUrl(""); setSelectedId(null); setMessage(""); }}>Start over</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setSelectedId(t.id); setMessage(""); }}
            className={`group rounded-2xl border p-5 text-left transition-all ${
              selectedId === t.id
                ? "border-white/40 bg-white/12 shadow-lg"
                : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
            }`}
          >
            <h3 className="text-sm font-extrabold tracking-[-0.02em]">{t.title}</h3>
            <p className="mt-2 text-xs leading-5 text-white/55">{t.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/40">{t.tone}</span>
              <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/40">{t.length}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mx-auto mt-10 max-w-xl animate-section-fade">
          <div className="rounded-[2rem] border border-white/15 bg-white/[0.06] p-6">
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">You picked: {selected.title}</p>
            <p className="mt-1 text-sm text-white/60">{selected.description}</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Now type your message..."
              rows={3}
              aria-label="Your message"
              className="mt-5 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-white/30"
              maxLength={520}
            />
            <div className="mt-4 flex gap-3">
              <button type="button" className="ghost-button text-sm" onClick={() => { setSelectedId(null); setMessage(""); }}>← Pick another</button>
              <button type="button" className="premium-button disabled:opacity-40" disabled={loading || !message.trim()} onClick={generate}>
                {loading ? <span className="inline-flex items-center gap-2"><Spinner className="h-4 w-4" /> Generating...</span> : "Generate my link →"}
              </button>
            </div>
            {error && <p className="mt-4 rounded-2xl border border-rose-200/30 bg-rose-300/10 p-4 text-sm font-bold text-rose-100" role="alert">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
