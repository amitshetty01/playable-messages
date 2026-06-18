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

export function ScratchCardGame({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const message = experience.finalMessage;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const scratchedPixels = useRef(new Set<string>());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawCover(ctx, canvas.width, canvas.height);
  }, []);

  function drawCover(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#a8a8a8");
    gradient.addColorStop(0.5, "#d4d4d4");
    gradient.addColorStop(1, "#888");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 40 + 10, 1);
    }
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scratch here", w / 2, h / 2);
  }

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function scratch(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    const key = `${Math.round(x / 5)},${Math.round(y / 5)}`;
    scratchedPixels.current.add(key);

    if (scratchedPixels.current.size % 8 === 0) {
      const total = (canvas.width / 5) * (canvas.height / 5);
      const pct = Math.min(scratchedPixels.current.size / (total * 0.3), 1);
      setProgress(Math.round(pct * 100));
      if (pct >= 0.65 && !revealed) {
        setRevealed(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = "0";
        playToneSound("ding", tone);
        hapticTone("ding", tone);
        setTimeout(() => setShowFinal(true), 1500);
      }
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (revealed) return;
    setIsScratching(true);
    const pos = getPos(e);
    if (pos) {
      lastPoint.current = pos;
      scratch(pos.x, pos.y);
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isScratching || revealed) return;
    const pos = getPos(e);
    if (pos) {
      const last = lastPoint.current;
      if (last) {
        const dx = pos.x - last.x;
        const dy = pos.y - last.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 5) {
          scratch(pos.x, pos.y);
          lastPoint.current = pos;
        }
      } else {
        scratch(pos.x, pos.y);
        lastPoint.current = pos;
      }
    }
  }

  function handlePointerUp() {
    setIsScratching(false);
    lastPoint.current = null;
  }

  const totalSteps = 3;
  const step = revealed ? 2 : progress > 0 ? 1 : 0;

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
            <ProgressBar current={revealed ? 3 : progress > 0 ? 2 : 1} total={totalSteps} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Scratch Card</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              {revealed ? "Scratched!" : "Scratch the surface"}
            </h2>
            <p className="mt-5 text-white/75">
              {revealed ? "Your message is revealed." : "Drag your finger or cursor across the silver coating to reveal the message underneath."}
            </p>
            <div className="mt-8 flex flex-col items-center">
              <div className="relative h-48 w-full max-w-sm rounded-2xl border-2 border-white/15 bg-white/5 sm:h-56">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <p className="text-center text-base font-bold text-white/90 sm:text-lg">
                    {revealed ? message : ""}
                  </p>
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className={`absolute inset-0 h-full w-full rounded-2xl cursor-crosshair transition-opacity duration-500 ${revealed ? "opacity-0" : ""}`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  style={{ touchAction: "none" }}
                />
              </div>
              {!revealed && progress > 0 && (
                <p className="mt-3 text-xs font-bold text-white/40">{progress}% scratched</p>
              )}
              {revealed && (
                <div className="mt-6 w-full animate-section-fade rounded-xl border border-white/15 bg-white/10 p-5 text-center">
                  <p className="text-xs font-bold text-white/40">Underneath</p>
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
