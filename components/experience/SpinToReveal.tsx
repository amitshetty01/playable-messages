"use client";

import { useState, useRef } from "react";
import { TypewriterText } from "@/components/TypewriterText";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { FinalScreen } from "@/components/FinalScreen";
import { Watermark } from "@/components/Watermark";
import { ExperienceLayout } from "@/components/ExperienceLayout";
import { BackButton } from "@/components/BackButton";
import { playSound, playToneSound } from "@/lib/flowSounds";
import { haptic, hapticTone } from "@/lib/haptic";
import type { ExperienceRecord, Template } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

function PlayerCard({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl rounded-[1.6rem] border border-white/15 bg-white/10 p-5 shadow-glow backdrop-blur-2xl sm:rounded-[2rem] sm:p-10">{children}</div>;
}

const SEGMENTS = ["Truth", "Dare", "Apology", "Compliment", "Memory", "Wish"] as const;
const COLORS = ["#ff5fb7", "#7c5cff", "#23d3ee", "#ffd166", "#ff6b8a", "#a070ff"];
const ANGLE_PER_SEG = 360 / SEGMENTS.length;

function spinTarget(): number {
  const seg = Math.floor(Math.random() * SEGMENTS.length);
  const extra = 5 + Math.random() * 3;
  return seg * ANGLE_PER_SEG + 360 * extra;
}

const SEGMENT_PROMPTS: Record<string, string> = {
  Truth: "Here is a truth I should have said sooner.",
  Dare: "I dare you to read this without smiling.",
  Apology: "For this moment, I am truly sorry.",
  Compliment: "One thing I love about you...",
  Memory: "I still remember the time when...",
  Wish: "If I could wish for one thing..."
};

export function SpinToReveal({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const [screen, setScreen] = useState<"intro" | "spinning" | "landed" | "final">("intro");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landedSegment, setLandedSegment] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);
    playToneSound("whoosh", tone);
    hapticTone("tap", tone);
    const target = spinTarget();
    const finalRotation = rotation + target;
    setRotation(finalRotation);

    const normalized = finalRotation % 360;
    const segIndex = Math.floor(((360 - normalized + 270) % 360) / ANGLE_PER_SEG);
    const seg = SEGMENTS[segIndex];

    setTimeout(() => {
      setSpinning(false);
      setLandedSegment(seg);
      playToneSound("ding", tone);
      hapticTone("ding", tone);
      setShowPrompt(true);
      setTimeout(() => {
        setShowPrompt(false);
        setScreen("final");
      }, 2500);
    }, 2800);
  }

  const segText = landedSegment ? SEGMENT_PROMPTS[landedSegment] : "";

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
      {screen === "intro" ? (
        <StepTransition step={0}>
          <PlayerCard>
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Spin to Reveal</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Spin the wheel</h2>
            <p className="mt-5 text-white/75">Spin to find out what fate has in store. Each segment unlocks something different.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playToneSound("whoosh", tone); setScreen("spinning"); }}>Begin</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "spinning" || screen === "landed" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={screen === "landed" ? 100 : 60} total={100} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{screen === "landed" ? `Landed on: ${landedSegment}` : "Spin the wheel"}</p>

            <div className="mt-6 flex flex-col items-center gap-6">
              <div className="relative">
                <svg viewBox="0 0 200 200" className="h-56 w-56 sm:h-72 sm:w-72 drop-shadow-2xl" ref={wheelRef}>
                  <g style={{ transformOrigin: "100px 100px", transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 2.8s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }}>
                    {SEGMENTS.map((seg, i) => {
                      const startAngle = i * ANGLE_PER_SEG;
                      const endAngle = (i + 1) * ANGLE_PER_SEG;
                      const x1 = 100 + 90 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = 100 + 90 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = 100 + 90 * Math.cos((endAngle - 90) * Math.PI / 180);
                      const y2 = 100 + 90 * Math.sin((endAngle - 90) * Math.PI / 180);
                      const midAngle = (startAngle + endAngle) / 2;
                      const tx = 100 + 60 * Math.cos((midAngle - 90) * Math.PI / 180);
                      const ty = 100 + 60 * Math.sin((midAngle - 90) * Math.PI / 180);
                      return (
                        <g key={seg}>
                          <path d={`M100 100 L${x1} ${y1} A90 90 0 0 1 ${x2} ${y2} Z`} fill={COLORS[i]} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                          <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[8px] font-bold" transform={`rotate(${midAngle - 90}, ${tx}, ${ty})`}>{seg}</text>
                        </g>
                      );
                    })}
                  </g>
                  <circle cx="100" cy="100" r="12" className="fill-ink stroke-white/30" strokeWidth="2" />
                  <polygon points="90,8 110,8 100,24" className="fill-neon drop-shadow-lg" />
                </svg>
              </div>

              {screen === "spinning" && !spinning ? (
                <button className="premium-button" type="button" onClick={handleSpin}>
                  Spin
                </button>
              ) : spinning ? (
                <p className="animate-pulse text-sm text-white/60">Spinning...</p>
              ) : null}

              {showPrompt && landedSegment ? (
                <div className="animate-section-fade rounded-2xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold tracking-[0.08em] text-white/50">{landedSegment}</p>
                  <p className="mt-2 text-lg font-bold leading-snug text-white/90 sm:text-xl">{segText}</p>
                </div>
              ) : null}
            </div>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <Watermark />
    </ExperienceLayout>
  );
}
