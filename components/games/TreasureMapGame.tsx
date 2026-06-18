"use client";

import { useState, useRef, useCallback } from "react";
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

export function TreasureMapGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;

  const [target] = useState(() => ({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }));
  const [compass, setCompass] = useState({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
  const [dragging, setDragging] = useState(false);
  const [found, setFound] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  const distance = Math.sqrt((compass.x - target.x) ** 2 + (compass.y - target.y) ** 2);
  const label = found ? "Found!" : distance < 30 ? "Hot!" : distance < 60 ? "Warm" : distance < 150 ? "Warm" : "Cold";
  const labelColor = found ? "text-emerald-400" : distance < 30 ? "text-rose-400" : distance < 60 ? "text-amber-400" : distance < 150 ? "text-yellow-300" : "text-blue-300";

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging || !areaRef.current || found) return;
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newCompass = { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    setCompass(newCompass);
    const dist = Math.sqrt((newCompass.x - target.x) ** 2 + (newCompass.y - target.y) ** 2);
    if (dist < 20) {
      setFound(true);
      setDragging(false);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setTimeout(() => setShowFinal(true), 2000);
    }
  }

  const totalSteps = 3;
  const step = found ? 2 : 1;

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
            <ProgressBar current={found ? 3 : 2} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Treasure Map</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {found ? "Treasure found!" : "Find the X"}
            </h2>
            <p className="mt-5 text-white/75">
              {found ? "The ground opens to reveal what's buried." : "Drag the compass around the map. Follow the temperature clues."}
            </p>
            <div className="mt-8 flex flex-col items-center">
              <div
                ref={areaRef}
                className="relative h-64 w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border-2 border-amber-700/30 bg-gradient-to-br from-amber-900/30 via-yellow-800/20 to-amber-950/40 sm:h-72"
                onPointerDown={() => !found && setDragging(true)}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDragging(false)}
                onPointerLeave={() => setDragging(false)}
                style={{ touchAction: "none" }}
              >
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200">
                  <path d="M20 180 Q50 140 80 160 Q110 180 140 140 Q160 110 180 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 3" />
                  <path d="M30 100 Q70 80 100 110 Q130 140 170 90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 3" />
                  <text x="10" y="20" className="fill-amber-500/40 text-[6px] font-bold">Here be dragons</text>
                  <text x="150" y="190" className="fill-amber-500/30 text-[6px] font-bold">X marks the spot</text>
                </svg>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="absolute h-1 w-1 rounded-full bg-amber-400/20" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
                ))}
                {found && (
                  <div
                    className="absolute z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400/30 animate-ping-slow"
                    style={{ left: `${target.x}%`, top: `${target.y}%` }}
                  >
                    <span className="text-2xl font-extrabold text-amber-300 drop-shadow-lg">X</span>
                  </div>
                )}
                {!found && (
                  <div
                    className={`absolute z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-all duration-150 ${
                      dragging ? "border-amber-300/80 bg-amber-300/20 scale-110" : "border-amber-400/50 bg-amber-400/10"
                    }`}
                    style={{ left: `${compass.x}%`, top: `${compass.y}%`, cursor: "grab" }}
                  >
                    <span className="text-lg">🧭</span>
                  </div>
                )}
              </div>
              <p className={`mt-3 text-sm font-bold ${labelColor}`}>{label}</p>
              {!found && <p className="mt-1 text-[10px] text-white/30">Drag the compass</p>}
              {found && (
                <div className="mt-6 w-full animate-section-fade rounded-xl border border-amber-400/20 bg-amber-400/10 p-5 text-center">
                  <p className="text-xs font-bold text-amber-300/80">Buried treasure</p>
                  <p className="mt-1 text-base font-bold text-white/90"><TypewriterText text={message} speed={35} /></p>
                </div>
              )}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : final}
      <style jsx>{`
        @keyframes ping-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
      `}</style>
      <Watermark />
    </ExperienceLayout>
  );
}
