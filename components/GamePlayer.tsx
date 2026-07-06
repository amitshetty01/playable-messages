"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import type { ExperienceRecord, Template } from "@/lib/types";
import { getGameConfig } from "@/lib/beat-configs";
import { playToneSound } from "@/lib/flowSounds";

type Phase = "game" | "message" | "attribution" | "reaction" | "closing";

export function GamePlayer({
  experience,
  template,
  mode,
  shareUrl,
  children,
}: {
  experience: ExperienceRecord;
  template: Template;
  mode: "demo" | "generated" | "preview";
  shareUrl?: string;
  children: (props: { onComplete: () => void; revealed: boolean; config: ReturnType<typeof getGameConfig> }) => ReactNode;
}) {
  const config = getGameConfig(template.id, experience.tone);
  const showSender = experience.showCreatorName && experience.creatorName?.trim();
  const [phase, setPhase] = useState<Phase>("game");
  const [reaction, setReaction] = useState(experience.reaction || "");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const nextPhase = useCallback((p: Phase) => {
    setFadeIn(false);
    setTimeout(() => {
      setPhase(p);
      setFadeIn(true);
    }, 350);
  }, []);

  const handleWin = useCallback(() => {
    playToneSound("ding", experience.tone);
    nextPhase("message");
  }, [experience.tone, nextPhase]);

  /* Dynamic reading time for message phase */
  useEffect(() => {
    if (phase !== "message") return;
    const readTime = Math.max(2200, experience.finalMessage.split(" ").length * 180);
    const t = setTimeout(() => nextPhase("attribution"), readTime);
    return () => clearTimeout(t);
  }, [phase, nextPhase, experience.finalMessage]);

  /* After reaction is picked in attribution, advance to closing */
  useEffect(() => {
    if (phase !== "attribution" || !reaction) return;
    const t = setTimeout(() => nextPhase("closing"), 1400);
    return () => clearTimeout(t);
  }, [phase, reaction, nextPhase]);

  const sendReaction = useCallback(async (emoji: string) => {
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

  const base = "fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-500";

  return (
    <div className={`${base} ${config.bgClass}`} style={{ background: config.gradient }}>
      {phase === "game" && (
        <div className={`flex h-full w-full flex-col transition-all duration-500 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
          <div className="flex shrink-0 items-center justify-center px-6 pt-8 text-center">
            <p className="text-lg font-bold text-white/80 sm:text-xl">{config.opener}</p>
          </div>
          <div className="flex-1">
            {children({ onComplete: handleWin, revealed: false, config })}
          </div>
          <div className="flex shrink-0 items-center justify-center px-6 pb-6">
            <p className="text-xs tracking-widest text-white/25 uppercase">{config.gameHint}</p>
          </div>
        </div>
      )}

      {phase === "message" && (
        <div className={`flex flex-col items-center gap-6 px-6 text-center transition-all duration-600 ${fadeIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <p className="animate-reveal-up display-title text-2xl font-bold leading-relaxed sm:text-4xl">
            {experience.finalMessage}
          </p>
        </div>
      )}

      {phase === "attribution" && (
        <div className={`flex flex-col items-center gap-4 px-6 text-center transition-all duration-600 ${fadeIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <p className="animate-reveal-up display-title text-xl font-bold leading-relaxed sm:text-3xl">
            {experience.finalMessage}
          </p>
          <p className="animate-reveal-up text-base text-white/60 sm:text-lg" style={{ animationDelay: "0.25s" }}>
            {showSender ? `— from ${experience.creatorName.trim()}` : config.anonFallback}
          </p>
          {/* Inline reactions — message stays visible */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {config.reactionEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => sendReaction(emoji)}
                disabled={!!reaction}
                className={`relative grid h-14 w-14 place-items-center rounded-2xl text-2xl transition-all duration-200 sm:h-16 sm:w-16 sm:text-3xl ${
                  reaction === emoji
                    ? "scale-125 bg-white/15 shadow-lg shadow-white/10"
                    : reaction
                      ? "scale-90 opacity-30"
                      : "hover:scale-110 hover:bg-white/10 active:scale-95"
                } ${reaction ? "pointer-events-none" : "cursor-pointer"}`}
              >
                {emoji}
                {reaction === emoji && (
                  <span className="animate-emoji-burst pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 text-4xl">
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

      {phase === "closing" && (
        <div className={`flex flex-col items-center gap-6 px-6 text-center transition-all duration-600 ${fadeIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="animate-reveal-scale mb-2 grid h-16 w-16 place-items-center rounded-full bg-white/10 text-3xl shadow-lg">
            💌
          </div>
          <h2 className="animate-reveal-up display-title text-3xl font-bold sm:text-5xl">
            {experience.tone === "Emotional" || experience.tone === "Sorry"
              ? "Sent with heart"
              : experience.tone === "Funny" || experience.tone === "Savage"
                ? "Mission accomplished"
                : "Sent with love"}
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
