"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import type { ExperienceRecord, Template } from "@/lib/types";
function getBeatConfig(_tone: string) {
  return { icon: "💖", gradient: "", beat1: [""], unlockCopy: "", anonFallback: "", reactionEmojis: [] as string[], bgClass: "" };
}
import { playToneSound } from "@/lib/flowSounds";

type Beat = 0 | 1 | 2 | 3 | 4 | 5 | 6;

function chunkMessage(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [""];
  const words = trimmed.split(/\s+/);
  if (words.length <= 15) return [trimmed];

  const sentences = trimmed.match(/[^.!?\n]+[.!?]*(\s|$)/g) || [trimmed];
  const cleaned = sentences.map((s) => s.trim()).filter(Boolean);
  if (cleaned.length <= 4) return cleaned;

  const target = Math.min(4, Math.ceil(cleaned.length / 2));
  const perChunk = Math.ceil(cleaned.length / target);
  const chunks: string[] = [];
  for (let i = 0; i < cleaned.length; i += perChunk) {
    chunks.push(cleaned.slice(i, i + perChunk).join(" "));
  }
  return chunks;
}

export function BeatPlayer({
  experience,
  mode,
}: {
  experience: ExperienceRecord;
  template: Template;
  mode: "demo" | "generated" | "preview";
  shareUrl?: string;
}) {
  const config = getBeatConfig(experience.tone);
  const chunks = useMemo(() => chunkMessage(experience.finalMessage), [experience.finalMessage]);
  const name = experience.receiverName?.trim() || "there";
  const showSender = experience.showCreatorName && experience.creatorName?.trim();

  const [beat, setBeat] = useState<Beat>(0);
  const [openingStep, setOpeningStep] = useState(0);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [reaction, setReaction] = useState(experience.reaction || "");
  const [holdRejected, setHoldRejected] = useState(false);
  const [exitDir, setExitDir] = useState<"up" | "down">("up");
  const [animating, setAnimating] = useState(false);

  const holdAnimRef = useRef<number>(0);
  const holdStartedAt = useRef(0);
  const holdCompletedRef = useRef(false);
  const holdOscRef = useRef<{ stop: () => void; ctx: AudioContext } | null>(null);

  const nextBeat = useCallback((b: Beat) => {
    setAnimating(true);
    setExitDir("up");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBeat(b);
        setAnimating(false);
      });
    });
  }, []);

  const endHold = useCallback(() => {
    cancelAnimationFrame(holdAnimRef.current);
    if (holdOscRef.current) {
      try { holdOscRef.current.stop(); } catch {}
      holdOscRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(holdAnimRef.current);
      if (holdOscRef.current) {
        try { holdOscRef.current.stop(); } catch {}
      }
    };
  }, []);

  /* Beat 0 — Landing */
  useEffect(() => {
    if (beat !== 0) return;
    const t = setTimeout(() => {
      playToneSound("ding", experience.tone);
      nextBeat(1);
    }, 800);
    return () => clearTimeout(t);
  }, [beat, experience.tone, nextBeat]);

  /* Beat 1 — Opening */
  useEffect(() => {
    if (beat !== 1) return;
    setOpeningStep(0);
    const t1 = setTimeout(() => setOpeningStep(1), 400);
    const t2 = setTimeout(() => setOpeningStep(2), 1400);
    const t3 = setTimeout(() => nextBeat(2), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [beat, nextBeat]);

  /* Beat 3 — Message chunks */
  useEffect(() => {
    if (beat !== 3) return;
    setChunkIndex(0);
    if (chunks.length <= 1) return;
    const interval = setInterval(() => {
      setChunkIndex((prev) => {
        const next = prev + 1;
        if (next >= chunks.length) {
          clearInterval(interval);
          return prev;
        }
        playToneSound("tap", experience.tone);
        return next;
      });
    }, 2200);
    return () => clearInterval(interval);
  }, [beat, chunks.length, experience.tone]);

  /* Beat 4 — Attribution */
  useEffect(() => {
    if (beat !== 4) return;
    const t = setTimeout(() => nextBeat(5), 2200);
    return () => clearTimeout(t);
  }, [beat, nextBeat]);

  /* Beat 5 — Reaction (auto-advance after pick) */
  useEffect(() => {
    if (beat !== 5 || !reaction) return;
    const t = setTimeout(() => nextBeat(6), 1400);
    return () => clearTimeout(t);
  }, [beat, reaction, nextBeat]);

  /* ─── Hold mechanic (Beat 2) ─── */
  const startHold = useCallback(() => {
    if (beat !== 2) return;
    setHoldProgress(0);
    setHoldRejected(false);
    holdStartedAt.current = Date.now();
    holdCompletedRef.current = false;

    let ctx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    try {
      ctx = new AudioContext();
      osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc.start(ctx.currentTime);
      holdOscRef.current = { stop: () => osc!.stop(ctx!.currentTime), ctx };
    } catch {}

    const animate = () => {
      const elapsed = Date.now() - holdStartedAt.current;
      const progress = Math.min(elapsed / 1500, 1);
      setHoldProgress(progress);
      if (osc && ctx) {
        try {
          osc.frequency.setValueAtTime(220 + progress * 330, ctx.currentTime);
        } catch {}
      }
      if (progress >= 1) {
        holdCompletedRef.current = true;
        if (osc && ctx) { try { osc.stop(ctx.currentTime); } catch {} }
        holdOscRef.current = null;
        playToneSound("ding", experience.tone);
        nextBeat(3);
        return;
      }
      holdAnimRef.current = requestAnimationFrame(animate);
    };
    holdAnimRef.current = requestAnimationFrame(animate);
  }, [beat, experience.tone, nextBeat]);

  const cancelHold = useCallback(() => {
    cancelAnimationFrame(holdAnimRef.current);
    if (holdOscRef.current) {
      try { holdOscRef.current.stop(); } catch {}
      holdOscRef.current = null;
    }
    if (holdCompletedRef.current) return;
    const elapsed = Date.now() - holdStartedAt.current;
    if (elapsed < 1500 && beat === 2) {
      setHoldRejected(true);
      setHoldProgress(0);
      setTimeout(() => setHoldRejected(false), 600);
    }
  }, [beat]);

  /* ─── Reaction picker ─── */
  const pickReaction = useCallback(async (emoji: string) => {
    if (reaction) return;
    setReaction(emoji);
    playToneSound("ding", experience.tone);
    if (mode === "generated" && experience.id) {
      await fetch(`/api/experiences/${experience.id}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: emoji }),
      }).catch(() => {});
    }
  }, [reaction, experience.tone, mode, experience.id]);

  const isLastChunk = chunkIndex >= chunks.length - 1;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-500 ${config.bgClass}`}
      style={{ background: config.gradient }}
    >
      {/* Floating particles */}
      {beat >= 1 && beat <= 4 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute animate-float-particle text-lg opacity-20 sm:text-xl"
              style={{
                left: `${(i * 37 + 13) % 90}%`,
                top: `${(i * 53 + 7) % 90}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${6 + (i % 3) * 2}s`,
              }}
            >
              {config.icon}
            </span>
          ))}
        </div>
      )}

      {/* ─── Beat 0: Landing ─── */}
      {beat === 0 && (
        <div className="flex flex-col items-center gap-6">
          <span className="animate-heartbeat text-6xl sm:text-7xl">{config.icon}</span>
          <span className="h-1 w-16 animate-pulse rounded-full bg-white/20" />
        </div>
      )}

      {/* ─── Beat 1: Opening ─── */}
      {beat === 1 && (
        <div className="flex flex-col items-center gap-4 px-6 text-center">
          {config.beat1[0] && (
            <p
              className={`display-title text-3xl font-bold leading-snug transition-all duration-700 sm:text-5xl ${
                openingStep >= 1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {config.beat1[0].replace("{name}", name)}
            </p>
          )}
          {config.beat1[1] && (
            <p
              className={`max-w-md text-lg leading-relaxed text-white/70 transition-all duration-700 sm:text-xl ${
                openingStep >= 2 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {config.beat1[1]}
            </p>
          )}
        </div>
      )}

      {/* ─── Beat 2: Hold ─── */}
      {beat === 2 && (
        <div className="flex flex-col items-center gap-8 px-6">
          <p className="text-lg font-bold text-white/80 sm:text-xl">{config.unlockCopy}</p>
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            className={`relative grid h-32 w-32 select-none place-items-center rounded-full transition-all duration-150 sm:h-40 sm:w-40 ${
              holdRejected ? "animate-shake-strong" : ""
            } ${holdProgress > 0 && !holdRejected ? "scale-105" : "hover:scale-105 active:scale-95"}`}
            style={{
              background: holdProgress > 0
                ? `conic-gradient(rgba(255,255,255,0.3) ${holdProgress * 100}%, rgba(255,255,255,0.06) ${holdProgress * 100}%)`
                : "conic-gradient(rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.06) 100%)",
              boxShadow: holdProgress > 0
                ? `0 0 ${30 + holdProgress * 50}px rgba(255,255,255,${0.06 + holdProgress * 0.12})`
                : "0 0 10px rgba(255,255,255,0.04)",
            }}
          >
            <span className="relative z-10 text-5xl sm:text-6xl">{config.icon}</span>
          </button>
          <p className="h-5 text-xs font-bold tracking-widest text-white/30 uppercase">
            {holdRejected ? "Too soon — try again" : holdProgress > 0 ? "Hold steady..." : ""}
          </p>
        </div>
      )}

      {/* ─── Beat 3: Message reveal ─── */}
      {beat === 3 && (
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <p
            key={chunkIndex}
            className="animate-reveal-up display-title text-2xl font-bold leading-relaxed sm:text-4xl"
          >
            {chunks[chunkIndex]}
          </p>

          {chunks.length > 1 && !isLastChunk && (
            <p className="animate-fade-in text-xs tracking-widest text-white/25">
              {chunks.length - chunkIndex - 1} more part{chunks.length - chunkIndex - 1 > 1 ? "s" : ""}...
            </p>
          )}

          {isLastChunk && (
            <button
              type="button"
              onClick={() => nextBeat(4)}
              className="premium-button mt-4 animate-reveal-up text-sm"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {/* ─── Beat 4: Attribution ─── */}
      {beat === 4 && (
        <div className="flex flex-col items-center gap-5 px-6 text-center">
          <p className="animate-reveal-up display-title text-2xl font-bold leading-relaxed sm:text-3xl">
            {experience.finalMessage}
          </p>
          <p className="animate-reveal-up text-base text-white/60 sm:text-lg" style={{ animationDelay: "0.3s" }}>
            {showSender ? `— from ${experience.creatorName.trim()}` : config.anonFallback}
          </p>
        </div>
      )}

      {/* ─── Beat 5: Reaction ─── */}
      {beat === 5 && (
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          <p className="animate-reveal-up text-xl font-bold text-white/80 sm:text-2xl">
            How did that make you feel?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {config.reactionEmojis.map((emoji: string) => (
              <button
                key={emoji}
                type="button"
                onClick={() => pickReaction(emoji)}
                disabled={!!reaction}
                className={`relative grid h-16 w-16 place-items-center rounded-2xl text-3xl transition-all duration-200 sm:h-20 sm:w-20 sm:text-4xl ${
                  reaction === emoji
                    ? "scale-125 bg-white/15 shadow-lg shadow-white/10"
                    : reaction
                      ? "scale-90 opacity-30"
                      : "hover:scale-110 hover:bg-white/10 active:scale-95"
                } ${reaction ? "pointer-events-none" : "cursor-pointer"}`}
              >
                {emoji}
                {reaction === emoji && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 animate-emoji-burst text-4xl pointer-events-none">
                    {emoji}
                  </span>
                )}
              </button>
            ))}
          </div>
          {reaction && (
            <p className="animate-reveal-up text-sm text-white/40" key={reaction}>
              Thanks for sharing that
            </p>
          )}
        </div>
      )}

      {/* ─── Beat 6: Closing card ─── */}
      {beat === 6 && (
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <div className="animate-reveal-scale mb-2 grid h-16 w-16 place-items-center rounded-full bg-white/10 text-3xl shadow-lg">
            💌
          </div>
          <h2 className="animate-reveal-up display-title text-3xl font-bold sm:text-5xl">
            Delivered
          </h2>
          <p className="animate-reveal-up text-sm font-bold tracking-[0.15em] text-white/40" style={{ animationDelay: "0.2s" }}>
            CRAFT YOUR MESSAGE
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="premium-button animate-reveal-up"
              style={{ animationDelay: "0.35s" }}
            >
              Create your own →
            </Link>
            <Link
              href={`/create/${experience.templateId}`}
              className="ghost-button animate-reveal-up"
              style={{ animationDelay: "0.45s" }}
            >
              Send one back
            </Link>
          </div>
          {mode === "generated" && (
            <p className="mt-6 animate-reveal-up text-xs text-white/25" style={{ animationDelay: "0.55s" }}>
              Your reaction was saved — the sender will see it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
