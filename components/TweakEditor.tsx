"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { SceneFlow, SceneStep } from "@/lib/scene-types";
import type { Tone } from "@/lib/types";

type TweakTarget = {
  stepIndex: number;
  sceneId: string;
  title: string;
  body?: string;
};

type Props = {
  flow: SceneFlow;
  children: React.ReactNode;
  tone: Tone;
  theme: string;
  currentStep: number;
  onTweak: (stepIndex: number, newTitle: string, newBody?: string) => void;
};

export function TweakEditor({ flow, children, tone, theme, currentStep, onTweak }: Props) {
  const [target, setTarget] = useState<TweakTarget | null>(null);
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (target && inputRef.current) {
      inputRef.current.focus();
    }
  }, [target]);

  const handleTweak = useCallback((stepIndex: number) => {
    const scene = flow.scenes[stepIndex];
    if (!scene) return;
    setTarget({
      stepIndex,
      sceneId: scene.id,
      title: scene.content.title,
      body: scene.content.body,
    });
    setInstruction("");
    setError("");
  }, [flow.scenes]);

  const handleCancel = useCallback(() => {
    setTarget(null);
    setInstruction("");
    setError("");
  }, []);

  const handleApply = useCallback(async () => {
    if (!target || !instruction.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/tweak-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: target.title,
          body: target.body || "",
          instruction: instruction.trim(),
          tone,
          theme,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to tweak");
      }

      onTweak(target.stepIndex, json.data.title, json.data.body || undefined);
      setTarget(null);
      setInstruction("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [target, instruction, tone, theme, onTweak]);

  return (
    <div className="relative">
      {children}

      {target && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-white/20 bg-[#1a0a1e] p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white/80">
                Tweak Step {target.stepIndex + 1}
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white/80"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <p className="mb-3 text-xs text-white/40">
              Current: &ldquo;{target.title}&rdquo;
              {target.body && <span className="ml-1">&mdash; {target.body.slice(0, 60)}...</span>}
            </p>

            <textarea
              ref={inputRef}
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              placeholder='e.g. "Make it shorter and less serious"'
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] p-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-white/30 focus:bg-white/[0.1]"
              rows={3}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleApply();
                }
              }}
            />

            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/60 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={loading || !instruction.trim()}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#ff6b9d] to-[#c44dff] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "✨ Tweaking..." : "✨ Apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
