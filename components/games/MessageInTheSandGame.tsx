"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TypewriterText } from "@/components/TypewriterText";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

export function MessageInTheSandGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;

  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [finished, setFinished] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [active, setActive] = useState(true);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setActive(false);
          setProgress(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, finished]);

  function handlePointerMove(e: React.PointerEvent) {
    if (!active || finished || !areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const last = lastPoint.current;
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 2) {
        setProgress((p) => {
          const newP = Math.min(100, p + 1.5);
          if (newP >= 100) {
            setFinished(true);
            clearInterval(timerRef.current!);
            playToneSound("ding", tone);
            hapticTone("ding", tone);
            setTimeout(() => setShowFinal(true), 2000);
            return 100;
          }
          return newP;
        });
        lastPoint.current = { x, y };
      }
    } else {
      lastPoint.current = { x, y };
    }
  }

  function handlePointerLeave() {
    lastPoint.current = null;
  }

  function resetTrace() {
    setActive(true);
    setTimeLeft(10);
    setProgress(0);
    setFinished(false);
    lastPoint.current = null;
  }

  const step = finished ? 2 : progress > 0 ? 1 : 0;
  const totalSteps = 3;

  const final = (
    <FinalScreen
      ctaMessage={experience.customMessages.ctaMessage}
      experienceId={mode === "generated" ? experience.id : undefined}
      finalMessage={experience.finalMessage}
      shareUrl={shareUrl}
      templateId={template.id}
      templateTitle={template.title}
    />
  );

  return (
    <ExperienceLayout kicker="Playable message" theme={experience.theme} title={template.title} titleAs={mode === "generated" ? "h1" : "h2"}>
      {!showFinal ? (
        <StepTransition step={step}>
          <PlayerCard>
            <ProgressBar current={finished ? 3 : progress > 0 ? 2 : 1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Message in the Sand</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {finished ? "Traced!" : !active ? "Washed away" : "Trace the message"}
            </h2>
            <p className="mt-5 text-white/75">
              {finished
                ? "The message is preserved before the tide returns."
                : !active
                  ? "The tide washed your trace away."
                  : `Drag your finger across the sand to trace the message before the tide returns.`}
            </p>
            <div className="mt-8 flex flex-col items-center">
              <div
                ref={areaRef}
                className="relative h-56 w-full max-w-sm cursor-crosshair overflow-hidden rounded-2xl border-2 border-amber-700/30 bg-gradient-to-b from-amber-300/20 to-amber-600/15 sm:h-64"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={{ touchAction: "none" }}
              >
                <div className="absolute inset-4 flex items-center justify-center">
                  <p
                    className={`text-center text-base font-bold leading-relaxed transition-all duration-300 sm:text-lg ${
                      finished
                        ? "text-white"
                        : active
                          ? "text-white/30"
                          : "text-white/20"
                    }`}
                    style={{
                      opacity: finished ? 1 : active ? 0.3 + progress / 100 : 0.2,
                    }}
                  >
                    {message}
                  </p>
                </div>
                {active && progress > 0 && (
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-400/30 to-transparent transition-all duration-150"
                    style={{ height: `${progress}%` }}
                  />
                )}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-1 w-2 rounded-full bg-amber-400/10"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>
              {active && !finished && (
                <p className="mt-3 text-sm font-bold text-cyan-300/60">
                  Tide in: {timeLeft}s
                </p>
              )}
              {active && !finished && progress > 0 && (
                <p className="text-xs text-white/40">{Math.round(progress)}% traced</p>
              )}
              {!active && !finished && (
                <button onClick={resetTrace} className="premium-button mt-4">
                  Try again
                </button>
              )}
              {finished && (
                <div className="mt-6 w-full animate-section-fade rounded-xl border border-amber-400/20 bg-amber-400/10 p-5 text-center">
                  <p className="text-xs font-bold text-amber-300/80">Preserved in the sand</p>
                  <p className="mt-1 text-base font-bold text-white/90"><TypewriterText text={message} speed={35} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <Watermark />
    </ExperienceLayout>
  );
}
