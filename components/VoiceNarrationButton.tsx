"use client";

import { useState, useRef, useCallback } from "react";
import { playAudioBuffer } from "@/lib/voice-narration";

export function VoiceNarrationButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "played" | "error">("idle");
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const waveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function startWaveform() {
    setWaveformBars(Array.from({ length: 20 }, () => Math.random() * 40 + 10));
    waveInterval.current = setInterval(() => {
      setWaveformBars(Array.from({ length: 20 }, () => Math.random() * 40 + 10));
    }, 150);
  }

  function stopWaveform() {
    if (waveInterval.current) clearInterval(waveInterval.current);
    setWaveformBars([]);
  }

  const handleClick = useCallback(async () => {
    if (state === "playing" || state === "loading") return;
    setState("loading");

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("API failed");

      const buffer = await response.arrayBuffer();
      setState("playing");
      startWaveform();
      await playAudioBuffer(buffer);
      stopWaveform();
      setState("played");
    } catch {
      stopWaveform();
      setState("idle");
      speakWithBrowser(text);
    }
  }, [text, state]);

  if (state === "played") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400/70">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        Played
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/70 transition-all hover:bg-white/[0.1] hover:text-white active:scale-95 disabled:opacity-50"
    >
      {state === "loading" ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      ) : state === "playing" ? (
        <span className="flex items-center gap-[2px]">
          {waveformBars.slice(0, 6).map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-white/70"
              style={{ height: `${h}%`, animation: `pulse 0.3s ease-in-out ${i * 0.05}s infinite alternate` }}
            />
          ))}
        </span>
      ) : (
        <span>🔊</span>
      )}
      {state === "loading" ? "Generating..." : state === "playing" ? "Playing..." : "Listen"}
    </button>
  );
}

function speakWithBrowser(text: string): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => resolve();
    speechSynthesis.speak(utterance);
  });
}
