"use client";

import { useState } from "react";
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

export function FrozenInIceGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;
  const maxClicks = 5;
  const [clicks, setClicks] = useState(0);
  const [cracks, setCracks] = useState<{ id: number; x: number; y: number; angle: number; length: number }[]>([]);
  const [shattered, setShattered] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  function chip(e: React.MouseEvent | React.TouchEvent) {
    if (shattered || clicks >= maxClicks) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const newClick = clicks + 1;
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    setCracks((prev) => [
      ...prev,
      { id: prev.length, x, y, angle: Math.random() * 360, length: 20 + Math.random() * 40 },
    ]);
    if (newClick >= maxClicks) {
      setClicks(newClick);
      setShattered(true);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 1200);
    } else {
      setClicks(newClick);
    }
  }

  const opacity = Math.max(0, 0.9 - clicks * 0.18);
  const blur = Math.max(0, 6 - clicks * 1.5);
  const totalSteps = maxClicks + 1;

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
        <StepTransition step={clicks}>
          <PlayerCard>
            <ProgressBar current={clicks + 1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Frozen in Ice</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {shattered ? "Ice shattered!" : "Break through the ice"}
            </h2>
            <p className="mt-5 text-white/75">
              {shattered ? "The message breaks free." : "Tap the ice to chip through. Each crack brings you closer to the truth."}
            </p>
            <div className="relative mt-8 flex flex-col items-center">
              <div
                className={`relative h-56 w-full max-w-sm overflow-hidden rounded-2xl border-2 border-cyan-300/20 bg-gradient-to-b from-cyan-900/40 to-blue-900/30 sm:h-64 ${!shattered ? "cursor-pointer" : ""}`}
                onClick={!shattered ? chip : undefined}
              >
                <div
                  className="flex h-full w-full items-center justify-center p-6 text-center text-lg font-bold text-white/90 transition-all duration-300 select-none sm:text-xl"
                  style={{
                    opacity: shattered ? 1 : opacity,
                    filter: `blur(${shattered ? 0 : blur}px)`,
                    transform: shattered ? "scale(1.05)" : "scale(1)",
                    pointerEvents: "none",
                  }}
                >
                  {message}
                </div>
                <svg className="absolute inset-0 h-full w-full pointer-events-none">
                  {cracks.map((c) => (
                    <line
                      key={c.id}
                      x1={`${c.x}%`}
                      y1={`${c.y}%`}
                      x2={`${c.x + Math.cos((c.angle * Math.PI) / 180) * c.length}%`}
                      y2={`${c.y + Math.sin((c.angle * Math.PI) / 180) * c.length}%`}
                      stroke={shattered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.8)"}
                      strokeWidth={shattered ? "1.5" : "2"}
                      className="transition-all duration-300"
                    />
                  ))}
                  {shattered && (
                    <>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <polygon
                          key={i}
                          points={Array.from({ length: 3 }, () => `${10 + Math.random() * 80} ${10 + Math.random() * 80}`).join(" ")}
                          fill="rgba(180, 230, 255, 0.15)"
                          className="animate-shard-fly"
                          style={{ animationDelay: `${i * 40}ms`, transformOrigin: `${30 + Math.random() * 40}% ${30 + Math.random() * 40}%` }}
                        />
                      ))}
                    </>
                  )}
                </svg>
                {!shattered && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="rounded-full bg-white/10 px-6 py-2 text-sm font-bold text-white/60 backdrop-blur-sm">
                      {clicks}/{maxClicks} chips
                    </div>
                  </div>
                )}
              </div>
              {shattered && (
                <div className="mt-6 w-full animate-section-fade rounded-xl border border-cyan-300/20 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Frozen truth</p>
                  <p className="mt-1 text-lg font-bold text-white/90"><TypewriterText text={message} speed={40} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <style jsx>{`
        @keyframes shard-fly {
          0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translate(${Math.random() > 0.5 ? "" : "-"}60px, ${Math.random() > 0.5 ? "" : "-"}40px) rotate(${Math.random() * 180}deg) scale(0.3); }
        }
        .animate-shard-fly { animation: shard-fly 0.6s ease-out forwards; }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
