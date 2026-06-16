"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

const MAX_ZOOM = 100;

export function CloserYouGet({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const [screen, setScreen] = useState<"intro" | "zooming" | "final">("intro");
  const [zoom, setZoom] = useState(15);
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const target = experience.finalMessage;

  function addZoom(delta: number) {
    if (revealed) return;
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(5, prev + delta));
      if (next >= MAX_ZOOM && !revealed) {
        setRevealed(true);
        playToneSound("ding", tone);
        hapticTone("ding", tone);
        setTimeout(() => setScreen("final"), 800);
      }
      return next;
    });
  }

  const handleClick = useCallback(() => {
    if (revealed) return;
    playToneSound("tap", tone);
    hapticTone("tap", tone);
    addZoom(12);
  }, [revealed]);

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (revealed || screen !== "zooming") return;
      e.preventDefault();
      addZoom(e.deltaY < 0 ? 8 : -5);
    }
    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener("wheel", handleWheel); };
  }, [revealed, screen]);

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">The Closer You Get</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">Get closer to read it</h2>
            <p className="mt-5 text-white/75">The message is hidden in plain sight. Click or scroll to zoom in until you can read every word.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playToneSound("whoosh", tone); setScreen("zooming"); }}>Begin</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "zooming" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={zoom} total={MAX_ZOOM} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Zoom: {zoom}%</p>
            <div
              ref={containerRef}
              onClick={handleClick}
              className="mt-6 flex min-h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:min-h-72"
            >
              <p
                className="select-none text-center font-extrabold leading-relaxed transition-all duration-200 ease-out"
                style={{
                  transform: `scale(${0.2 + (zoom / MAX_ZOOM) * 1.8})`,
                  filter: `blur(${Math.max(0, 6 - (zoom / MAX_ZOOM) * 8)}px)`,
                  opacity: revealed ? 1 : 0.3 + (zoom / MAX_ZOOM) * 0.7
                }}
              >
                {target}
              </p>
            </div>
            <p className="mt-4 text-center text-sm text-white/50">
              {revealed ? "You got it!" : "Click or scroll to zoom in closer"}
            </p>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <Watermark />
    </ExperienceLayout>
  );
}
