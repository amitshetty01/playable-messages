"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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

export function Inkblot({ template, experience, mode, shareUrl }: Props) {
  const tone = experience.tone;
  const [screen, setScreen] = useState<"intro" | "painting" | "final">("intro");
  const [coverage, setCoverage] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const painted = useRef(new Set<number>());

  const target = experience.finalMessage;
  const requiredPct = 70;

  const drawChar = useCallback((ctx: CanvasRenderingContext2D, ch: string, x: number, y: number, size: number) => {
    ctx.font = `bold ${size}px "Fraunces", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff8f1";
    ctx.fillText(ch, x, y);
  }, []);

  useEffect(() => {
    if (screen !== "painting") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#1a1424";
    ctx.fillRect(0, 0, w, h);

    const fontSize = Math.min(w, h) / 6;
    const lines: string[] = [];
    let line = "";
    for (const ch of target) {
      const test = line + ch;
      if (test.length > 10) { lines.push(line); line = ch; }
      else line = test;
    }
    if (line) lines.push(line);

    const totalH = lines.length * fontSize * 1.4;
    let startY = (h - totalH) / 2 + fontSize / 2;

    for (const l of lines) {
      drawChar(ctx, l, w / 2, startY, fontSize);
      startY += fontSize * 1.4;
    }

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    painted.current.clear();
    for (let i = 0; i < data.length; i += 16) {
      const alpha = data[i + 3];
      if (alpha > 128) {
        const px = Math.floor(i / 4);
        painted.current.add(px);
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    function onPointer(e: PointerEvent) {
      if (!isDrawing.current) return;
      const rect = canvas!.getBoundingClientRect();
      const px = Math.floor(e.clientX - rect.left);
      const py = Math.floor(e.clientY - rect.top);
      const r = 18;
      const left = Math.max(0, px - r);
      const top = Math.max(0, py - r);
      const regionW = Math.min(r * 2, w - left);
      const regionH = Math.min(r * 2, h - top);
      if (regionW <= 0 || regionH <= 0) return;

      const imgData = ctx!.getImageData(left, top, regionW, regionH);
      for (let y = 0; y < regionH; y++) {
        for (let x = 0; x < regionW; x++) {
          const cx = x + left - (px - r);
          const cy = y + top - (py - r);
          const dist = Math.sqrt((cx - r) ** 2 + (cy - r) ** 2);
          if (dist > r) continue;
          const idx = (y * regionW + x) * 4;
          imgData.data[idx + 3] = 255;
        }
      }
      ctx!.putImageData(imgData, left, top);

      const revealedCount = [...painted.current].filter((p) => {
        const px2 = p % w;
        const py2 = Math.floor(p / w);
        return Math.abs(px2 - px) < r && Math.abs(py2 - py) < r;
      }).length;

      const pct = Math.min(100, painted.current.size > 0 ? Math.round((revealedCount / painted.current.size) * 100) : 0);
      setCoverage(pct);

      if (pct >= requiredPct) {
        playToneSound("ding", tone);
        hapticTone("ding", tone);
        canvas!.removeEventListener("pointermove", onPointer);
        setTimeout(() => setScreen("final"), 500);
      }
    }

    function onDown() { isDrawing.current = true; playToneSound("tap", tone); hapticTone("tap", tone); }
    function onUp() { isDrawing.current = false; }
    function onLeave() { isDrawing.current = false; }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointermove", onPointer);
    canvas.style.cursor = "crosshair";

    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointermove", onPointer);
    };
  }, [screen, target, drawChar, requiredPct]);

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
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Inkblot</p>
            <h2 className="display-title mt-4 text-3xl font-bold leading-tight sm:text-5xl">The message is hidden in the ink.</h2>
            <p className="mt-5 text-white/75">Drag your cursor across the canvas to reveal the hidden text. The full message appears when 70% is uncovered.</p>
            <button className="premium-button mt-8" type="button" onClick={() => { playToneSound("whoosh", tone); setScreen("painting"); }}>Reveal the ink</button>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "painting" ? (
        <StepTransition step={1}>
          <PlayerCard>
            <BackButton onBack={() => setScreen("intro")} disabled={mode === "demo"} />
            <ProgressBar current={Math.min(coverage, 70)} total={70} theme={experience.theme} />
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">Ink revealed: {coverage}%</p>
            <canvas
              ref={canvasRef}
              width={400}
              height={220}
              className="mt-4 w-full rounded-2xl border border-white/15 touch-none"
            />
            <p className="mt-3 text-xs text-white/50">Drag to develop the ink. Need 70% coverage.</p>
          </PlayerCard>
        </StepTransition>
      ) : null}
      {screen === "final" ? final : null}
      <Watermark />
    </ExperienceLayout>
  );
}
