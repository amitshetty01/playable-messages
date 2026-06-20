"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { SceneBackground } from "@/components/scenes/SceneBackground";
import { SceneProp } from "@/components/scenes/SceneProp";
import { ConfettiEffect } from "@/components/scenes/ConfettiEffect";
import { Watermark } from "@/components/Watermark";
import { useAutoAdvance } from "@/lib/useAutoAdvance";
import { useEasterEgg } from "@/lib/useEasterEgg";
import { useSceneAnimation, AnimatedText } from "@/lib/useSceneAnimation";
import { playSound, playToneSound } from "@/lib/flowSounds";
import { initAudio } from "@/lib/sounds";
import { haptic, hapticTone } from "@/lib/haptic";
import type { SceneStep, SceneContext, SceneFlow } from "@/lib/scene-types";
import type { ThemeName, Tone } from "@/lib/types";

type Props = {
  flow: SceneFlow;
  context: SceneContext;
  theme: ThemeName;
  mode: "demo" | "generated" | "preview";
};

let currentTone: Tone = "Emotional";

const REACTION_EMOJIS = ["💖", "✨", "🔥", "💫", "🎉", "💗", "⭐", "🌸"];

function EggBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#97dadf]/30 bg-black/80 px-6 py-3 text-sm font-bold text-[#97dadf] shadow-lg backdrop-blur-xl">
      {message}
    </div>
  );
}

function SceneProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-700"
            style={{
              width: i === current ? "24px" : "4px",
              background: i <= current
                ? "rgba(255,255,255,0.6)"
                : "rgba(255,255,255,0.15)",
              boxShadow: i === current ? "0 0 8px rgba(255,255,255,0.2)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TitleText({ text, align }: { text: string; align?: "center" | "left" }) {
  return (
    <h1
      className={`font-display font-bold leading-[1.1] tracking-tight text-white animate-text-glow ${
        align === "left" ? "text-left" : "text-center"
      }`}
      style={{ fontSize: "clamp(1.5rem, 5.5vw, 3.5rem)" }}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block" style={{ overflow: "hidden", verticalAlign: "bottom" }}>
          <AnimatedText delay={i * 120} distance={35}>
            {word}
          </AnimatedText>
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </h1>
  );
}

function BodyText({ text }: { text: string }) {
  return (
    <AnimatedText as="p" delay={400} distance={25} className="max-w-md text-white/60 animate-body-breathe" style={{ fontSize: "clamp(0.875rem, 2.2vw, 1.125rem)", lineHeight: 1.6 }}>
      {text}
    </AnimatedText>
  );
}

const DODGE_POSITIONS = [
  { left: "5%", top: "40%" },
  { left: "82%", top: "30%" },
  { left: "40%", top: "5%" },
  { left: "50%", top: "78%" },
  { left: "10%", top: "12%" },
  { left: "78%", top: "75%" },
  { left: "8%", top: "65%" },
  { left: "85%", top: "8%" },
];

function ChaseTitle({ text, attempts, onCaught }: { text: string; attempts: number; onCaught: () => void }) {
  const [dodges, setDodges] = useState(0);
  const [pos, setPos] = useState({ left: "50%", top: "50%" });
  const [caught, setCaught] = useState(false);
  const [flash, setFlash] = useState("");

  function handleAttempt() {
    if (caught) return;
    const next = dodges + 1;
    if (next > attempts) {
      setCaught(true);
      playToneSound("ding", currentTone);
      hapticTone("ding", currentTone);
      setFlash("caught");
      setTimeout(() => { setFlash(""); onCaught(); }, 500);
      return;
    }
    playToneSound("tap", currentTone);
    hapticTone("tap", currentTone);
    setDodges(next);
    setPos(DODGE_POSITIONS[(next - 1) % DODGE_POSITIONS.length]);
    setFlash("dodge");
    setTimeout(() => setFlash(""), 300);
  }

  const teaseText = dodges === 0 ? "Catch me! 👀"
    : dodges === 1 ? "Too slow! 😜"
    : dodges === 2 ? "Almost got me! 😏"
    : "One more try! 💨";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
      {!caught ? (
        <button
          type="button"
          onClick={handleAttempt}
          onMouseEnter={handleAttempt}
          className="pointer-events-auto absolute whitespace-nowrap rounded-2xl px-6 py-4 text-sm font-extrabold tracking-wider backdrop-blur-md transition-all duration-200"
          style={{
            left: pos.left,
            top: pos.top,
            transform: "translate(-50%, -50%)",
            background: flash === "dodge"
              ? "rgba(255,80,80,0.2)"
                              : "rgba(255,255,255,0.08)",
            border: flash === "dodge"
              ? "2px solid rgba(255,80,80,0.5)"
              : "2px solid rgba(255,255,255,0.2)",
            color: flash === "dodge" ? "#ff6b8a" : "white",
          }}
        >
          <span className="text-base sm:text-lg">{teaseText}</span>
        </button>
      ) : (
        <h1
          className="pointer-events-auto font-display font-bold leading-[1.1] tracking-tight text-white animate-reveal-scale-3d"
          style={{ fontSize: "clamp(1.5rem, 5.5vw, 3.5rem)" }}
        >
          {text}
        </h1>
      )}
    </div>
  );
}

const LOVE_DODGE_TEXTS = [
  "Not you 💔",
  "Keep chasing 🌪️",
  "Not meant for you 😏",
  "This one runs forever 🏃",
  "Can't catch this one ✨",
  "Wrong path 💨",
  "Some things never stop 👀",
  "It's already gone 😘",
];

function LoveChaseInteraction({ label, onTruth }: { label: string; onTruth: () => void }) {
  const [flying, setFlying] = useState(false);
  const [pos, setPos] = useState({ left: "50%", top: "50%" });
  const [textIndex, setTextIndex] = useState(0);
  const textIndexRef = useRef(0);

  function handleMove() {
    if (!flying) {
      setFlying(true);
      setPos({
        left: `${15 + Math.random() * 70}%`,
        top: `${10 + Math.random() * 70}%`,
      });
    } else {
      setPos({
        left: `${5 + Math.random() * 80}%`,
        top: `${5 + Math.random() * 75}%`,
      });
    }
    textIndexRef.current = (textIndexRef.current + 1) % LOVE_DODGE_TEXTS.length;
    setTextIndex(textIndexRef.current);
  }

  return (
    <div className="relative flex w-full items-center justify-between px-4 sm:px-8">
      <button
        type="button"
        onClick={onTruth}
        className="z-20 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[#ff6b9d] to-[#c44dff] px-8 py-4 text-sm font-extrabold tracking-wider text-white shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        {label}
      </button>

      <span
        onMouseEnter={handleMove}
        onTouchStart={handleMove}
        className={`cursor-default whitespace-nowrap rounded-2xl px-6 py-3 text-sm font-extrabold tracking-wider backdrop-blur-md select-none ${
          flying ? "fixed z-40" : "relative z-20"
        }`}
        style={
          flying
            ? {
                left: pos.left,
                top: pos.top,
                transform: "translate(-50%, -50%)",
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.2)",
                color: "white",
                transition: "left 0.25s ease-in-out, top 0.25s ease-in-out",
              }
            : {
                background: "rgba(255,255,255,0.05)",
                border: "1px dashed rgba(255,255,255,0.15)",
                color: "white",
              }
        }
      >
        <span className="text-base sm:text-lg">{LOVE_DODGE_TEXTS[flying ? textIndex : 0]}</span>
      </span>
    </div>
  );
}

function GhostType({ words, onComplete }: { words: string[]; onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [restored, setRestored] = useState<string[]>([]);
  const [fading, setFading] = useState(false);
  const [missed, setMissed] = useState(false);

  useEffect(() => {
    if (index >= words.length) { onComplete(); return; }
    setFading(false);
    setMissed(false);
    const fadeTimer = setTimeout(() => setFading(true), 1500);
    return () => clearTimeout(fadeTimer);
  }, [index, words.length, onComplete]);

  useEffect(() => {
    if (!fading) return;
    const loseTimer = setTimeout(() => {
      setMissed(true);
      playToneSound("tap", currentTone);
      hapticTone("tap", currentTone);
      setTimeout(() => setIndex((i) => i), 600);
    }, 2000);
    return () => clearTimeout(loseTimer);
  }, [fading]);

  function handleTap() {
    if (missed) return;
    playToneSound("tap", currentTone);
    hapticTone("tap", currentTone);
    setRestored((prev) => [...prev, words[index]]);
    setIndex((i) => i + 1);
  }

  const currentOpacity = missed ? 0 : fading ? 0.3 : 1;

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <div className="flex min-h-[60px] flex-wrap items-center justify-center gap-2">
        {restored.map((w, i) => (
          <span key={i} className="rounded-xl bg-emerald-400/20 px-3 py-1 text-sm font-bold text-emerald-300">{w}</span>
        ))}
        {index < words.length && (
          <button
            type="button"
            onClick={handleTap}
            disabled={missed}
            className={`rounded-xl border px-4 py-2 text-sm font-bold tracking-wide transition-all duration-500 ${missed ? "border-red-400/50 bg-red-400/10 text-red-300" : fading ? "border-white/15 bg-white/10 text-white/70" : "border-white/25 bg-white/15 text-white"}`}
            style={{ opacity: currentOpacity }}
          >
            {words[index]}
          </button>
        )}
      </div>
      <p className="text-xs text-white/40">{restored.length}/{words.length} restored</p>
    </div>
  );
}

const SMASH_EMOJIS = ["😏", "😜", "😂", "😈", "🤭", "😋", "😅", "😘"];

function SmashEmoji({ count = 5, onComplete }: { count?: number; onComplete: () => void }) {
  const [smashed, setSmashed] = useState(0);
  const [emoji, setEmoji] = useState({ emoji: "😏", left: "50%", top: "50%" });
  const [burst, setBurst] = useState(false);

  function spawn() {
    setEmoji({
      emoji: SMASH_EMOJIS[Math.floor(Math.random() * SMASH_EMOJIS.length)],
      left: `${10 + Math.random() * 70}%`,
      top: `${10 + Math.random() * 65}%`,
    });
    setBurst(false);
  }

  function handleSmash() {
    playToneSound("tap", currentTone);
    hapticTone("tap", currentTone);
    setBurst(true);
    const next = smashed + 1;
    if (next >= count) {
      setTimeout(onComplete, 400);
      return;
    }
    setTimeout(() => { setSmashed(next); spawn(); }, 300);
  }

  useEffect(() => { spawn(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex h-48 w-full max-w-xs flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      {!burst ? (
        <button
          type="button"
          onClick={handleSmash}
          className="absolute animate-bounce text-4xl transition-all hover:scale-125"
          style={{ left: emoji.left, top: emoji.top }}
        >
          {emoji.emoji}
        </button>
      ) : (
        <span className="animate-reveal-scale-3d text-5xl">💥</span>
      )}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <div className="mx-auto h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#c44dff] transition-all duration-300" style={{ width: `${(smashed / count) * 100}%` }} />
        </div>
        <p className="mt-1 text-xs text-white/40">{smashed}/{count}</p>
      </div>
    </div>
  );
}

function FlipCoin({ flips = 3, onComplete }: { flips?: number; onComplete: () => void }) {
  const [flipCount, setFlipCount] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [side, setSide] = useState(0);

  function handleFlip() {
    if (flipping) return;
    setFlipping(true);
    playToneSound("tap", currentTone);
    hapticTone("tap", currentTone);
    setTimeout(() => {
      const next = flipCount + 1;
      setFlipCount(next);
      setSide((s) => (s + 1) % 2);
      setFlipping(false);
      if (next >= flips) setTimeout(onComplete, 400);
    }, 500);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={handleFlip}
        disabled={flipCount >= flips}
        className={`flex h-24 w-24 items-center justify-center rounded-2xl border-2 text-2xl font-extrabold transition-all ${flipping ? "animate-spin border-white/40 bg-white/20" : side === 0 ? "border-rose-400/40 bg-rose-500/20 text-rose-300" : "border-emerald-400/40 bg-emerald-500/20 text-emerald-300"}`}
      >
        {side === 0 ? "🔥" : "💖"}
      </button>
      <p className="text-sm font-bold text-white/60">{side === 0 ? "Roast" : "Respect"}</p>
      <p className="text-xs text-white/40">Flip {flipCount}/{flips}</p>
    </div>
  );
}

function Candles({ count = 5, onComplete }: { count?: number; onComplete: () => void }) {
  const [lit, setLit] = useState<boolean[]>(Array(count).fill(true));

  function blow(i: number) {
    if (!lit[i]) return;
    playToneSound("whoosh", currentTone);
    hapticTone("whoosh", currentTone);
    const next = [...lit];
    next[i] = false;
    setLit(next);
    if (next.every((l) => !l)) setTimeout(onComplete, 500);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {lit.map((isLit, i) => (
        <button
          key={i}
          type="button"
          onClick={() => blow(i)}
          disabled={!isLit}
          className={`flex h-16 w-12 flex-col items-center justify-end rounded-xl border pb-2 text-2xl transition-all ${isLit ? "border-amber-400/30 bg-amber-400/10 hover:scale-110" : "border-white/10 bg-white/[0.04] opacity-40"}`}
        >
          {isLit ? "🕯️" : "🕯️"}
          {isLit && <span className="absolute -top-3 text-lg animate-pulse">🔥</span>}
        </button>
      ))}
    </div>
  );
}

function ScratchReveal({ text, onComplete }: { text: string; onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);
  const brushRadius = 28;

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function scratch(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkRevealed() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const step = 4;
    let cleared = 0;
    let total = 0;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        if (pixels[(y * canvas.width + x) * 4 + 3] === 0) cleared++;
        total++;
      }
    }
    if (cleared / total > 0.4) {
      setRevealed(true);
      hapticTone("ding", currentTone);
      setTimeout(onComplete, 400);
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (revealed) return;
    isDrawing.current = true;
    scratch(getPos(e).x, getPos(e).y);
    checkRevealed();
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || revealed) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
    checkRevealed();
  }

  function handlePointerUp() {
    isDrawing.current = false;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (w < 1 || h < 1) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "source-over";

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#a8b8c8");
    grad.addColorStop(0.3, "#d0d8e0");
    grad.addColorStop(0.5, "#e8ecf0");
    grad.addColorStop(0.7, "#c8d0d8");
    grad.addColorStop(1, "#a0b0c0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.06})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 4, 1 + Math.random() * 2);
    }

    ctx.font = "bold 13px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH HERE ✨", w / 2, h / 2);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[18rem] overflow-hidden rounded-xl border border-white/20 shadow-xl">
      <div className="flex min-h-[80px] items-center justify-center bg-white/5 p-4">
        <p className="text-center text-sm font-bold leading-relaxed text-white/80">{text}</p>
      </div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          style={{ borderRadius: "inherit" }}
        />
      )}
      {revealed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-[1px]">
          <span className="animate-reveal-scale-3d text-3xl">✨</span>
        </div>
      )}
    </div>
  );
}

function WaxSeal({ cracks = 3, onComplete }: { cracks?: number; onComplete: () => void }) {
  const [cracked, setCracked] = useState(0);

  function handleCrack() {
    const next = cracked + 1;
    setCracked(next);
    playToneSound("tap", currentTone);
    hapticTone("tap", currentTone);
    if (next >= cracks) setTimeout(onComplete, 400);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleCrack}
        disabled={cracked >= cracks}
        className={`flex h-20 w-20 items-center justify-center rounded-full border-2 text-3xl transition-all ${cracked >= cracks ? "border-emerald-400/40 bg-emerald-400/20 scale-110" : "border-rose-400/30 bg-rose-500/15 hover:scale-105"}`}
      >
        {cracked >= cracks ? "💌" : "🔴"}
      </button>
      <p className="text-xs font-bold text-white/50">
        {cracked >= cracks ? "Opened!" : `Tap to crack the seal (${cracked}/${cracks})`}
      </p>
    </div>
  );
}

function DragBox({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const dragRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  function handleStart(e: React.TouchEvent | React.MouseEvent) {
    startXRef.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  function handleMove(e: React.TouchEvent | React.MouseEvent) {
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const delta = x - startXRef.current;
    const pct = Math.min(100, Math.max(0, (delta / 150) * 100));
    setProgress(pct);
    if (pct >= 100) { onComplete(); hapticTone("ding", currentTone); }
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <div
        ref={dragRef}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        className="relative h-20 w-full cursor-grab overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06]"
      >
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🎁</div>
        <div
          className="absolute inset-y-0 left-0 rounded-2xl bg-gradient-to-r from-[#ff6b9d]/30 to-[#c44dff]/30 transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute inset-y-0 flex w-12 items-center justify-center text-lg"
          style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
        >
          👆
        </div>
      </div>
      <p className="text-xs text-white/40">Drag to open</p>
    </div>
  );
}

function RippleButton({ interaction, onClick }: { interaction: NonNullable<SceneStep["interaction"]>; onClick: () => void }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);

  const base = "relative min-h-[56px] rounded-full px-10 py-4 text-base font-extrabold tracking-wide transition-all duration-300 active:scale-95 overflow-hidden";

  const variantClass =
    interaction.variant === "ghost"
      ? "border border-white/20 bg-white/10 text-white/90 backdrop-blur-md hover:bg-white/15"
      : interaction.variant === "danger"
        ? "border-2 border-[#ff6b8a]/40 bg-gradient-to-r from-[#ff6b8a]/20 to-[#ff3355]/10 text-[#ff6b8a] backdrop-blur-md hover:from-[#ff6b8a]/30 hover:to-[#ff3355]/20"
        : interaction.variant === "escape"
          ? "border-2 border-white/25 bg-white/[0.08] text-white/80 backdrop-blur-md hover:border-white/40 hover:bg-white/15"
          : "bg-gradient-to-r from-white via-[#ffddec] to-[#d9f7f7] text-[#21172c] shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)]";

  const animClass =
    interaction.animation === "pulse" ? "animate-pulse-glow" : "";

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++idRef.current;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    onClick();
  }

  return (
    <button
      type="button"
      className={`${base} ${variantClass} ${animClass}`}
      onClick={handleClick}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-ripple"
          style={{ left: r.x - 8, top: r.y - 8, width: 16, height: 16 }}
        />
      ))}
      {interaction.label || "Continue"}
    </button>
  );
}

function MultiTapButton({ interaction, onComplete }: { interaction: NonNullable<SceneStep["interaction"]>; onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [dodges, setDodges] = useState(0);
  const [chasePos, setChasePos] = useState({ left: 50, top: 50 });
  const [flash, setFlash] = useState<"" | "dodge" | "hit">("");
  const needed = interaction.tapCount || 5;
  const isChase = interaction.animation === "shake";
  const dodgeThreshold = isChase ? 2 : 1;

  const chasePositions = [
    { left: 8, top: 10 }, { left: 75, top: 8 }, { left: 15, top: 68 },
    { left: 80, top: 72 }, { left: 42, top: 5 }, { left: 5, top: 42 },
    { left: 85, top: 38 }, { left: 50, top: 58 }, { left: 28, top: 75 },
    { left: 62, top: 12 }, { left: 10, top: 50 }, { left: 78, top: 55 },
  ];

  function tap() {
    if (dodges < dodgeThreshold) {
      const nextDodge = dodges + 1;
      setDodges(nextDodge);
      setFlash("dodge");
      if (isChase) setChasePos(chasePositions[nextDodge % chasePositions.length]);
      setTimeout(() => setFlash(""), 300);
      playToneSound("tap", currentTone);
      hapticTone("tap", currentTone);
      return;
    }
    playToneSound("tap", currentTone);
    hapticTone("tap", currentTone);
    setFlash("hit");
    setTimeout(() => setFlash(""), 200);
    const next = count + 1;
    setCount(next);
    if (isChase) setChasePos(chasePositions[(next + dodgeThreshold) % chasePositions.length]);
    if (next >= needed) onComplete();
  }

  const btnLabel = dodges < dodgeThreshold
    ? isChase
      ? ["Where did it go? 👀", "Too slow! 😜", "Almost! 😏"][dodges] || "Catch me! 🏃"
      : "Missed! Try again 💨"
    : interaction.label || `Tap ${needed} times`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative w-full ${isChase ? "min-h-[30dvh]" : ""}`}>
        {isChase ? (
          <button
            type="button"
            onClick={tap}
            className={`absolute min-h-[56px] w-auto whitespace-nowrap rounded-2xl border-2 px-8 py-4 text-sm font-bold tracking-wider backdrop-blur-sm transition-all duration-200 active:scale-95 ${
              flash === "dodge"
                ? "border-red-400/50 bg-red-500/20 text-red-300"
                : flash === "hit"
                  ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                  : "border-white/25 bg-white/10 text-white/90 hover:bg-white/20"
            }`}
            style={{
              left: `${chasePos.left}%`,
              top: `${chasePos.top}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="relative z-10">{btnLabel}</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={tap}
              className={`min-h-[56px] w-full max-w-xs rounded-2xl border-2 px-8 py-4 text-sm font-bold tracking-wider backdrop-blur-sm transition-all duration-200 active:scale-95 ${
                flash === "dodge"
                  ? "border-red-400/50 bg-red-500/20 text-red-300"
                  : flash === "hit"
                    ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                    : "border-white/25 bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              <span className="relative z-10">{btnLabel}</span>
            </button>
            {dodges < dodgeThreshold && (
              <span className="text-xs font-bold text-red-300/70 animate-pulse">💨 Just missed!</span>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: needed }).map((_, i) => (
          <span
            key={i}
            className="inline-block text-lg transition-all duration-300"
            style={{
              transform: i < count ? "scale(1.3)" : "scale(0.6)",
              opacity: i < count ? 1 : 0.25,
            }}
          >
            {["💖", "✨", "🔥", "💫", "⭐", "💗", "🌸", "💥"][i % 8]}
          </span>
        ))}
      </div>
    </div>
  );
}

function ChoiceButtons({ choices, onChoose }: { choices: NonNullable<NonNullable<SceneStep["interaction"]>["choices"]>; onChoose: (id: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => { playToneSound("tap", currentTone); hapticTone("tap", currentTone); onChoose(choice.id); }}
          className="group relative min-h-[56px] rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white/90 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95"
        >
          {choice.emoji && <span className="mr-2 inline-block">{choice.emoji}</span>}
          {choice.label}
        </button>
      ))}
    </div>
  );
}

function ReactionEmoji({ emoji, step }: { emoji: string; step: number }) {
  return (
    <span
      key={step}
      className="fixed top-1/3 right-8 z-10 animate-reveal-scale-3d text-6xl opacity-60"
    >
      {emoji}
    </span>
  );
}

function EmojiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const items = useMemo(() =>
    REACTION_EMOJIS.map((emoji, i) => ({
      emoji,
      x: 20 + Math.random() * 60,
      y: 10 + Math.random() * 40,
      delay: i * 0.08,
      size: 1 + Math.random() * 0.8,
    })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute animate-emoji-burst text-2xl"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animationDelay: `${item.delay}s`,
            fontSize: `${item.size}rem`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}



export function SceneEngine({ flow, context, theme, mode }: Props) {
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFullscreenCelebration, setShowFullscreenCelebration] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [suspense, setSuspense] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loveAudioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [loveReady, setLoveReady] = useState(false);
  const [loveActive, setLoveActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const { customMessages, finalMessage, onComplete, onTrack, tone } = context;
  currentTone = tone;

  useEffect(() => {
    const attemptPlay = () => {
      if (!audioRef.current || audioReady) return;
      if (audioRef.current.readyState < 2) {
        audioRef.current.addEventListener("canplaythrough", attemptPlay, { once: true });
        return;
      }
      initAudio();
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.play().then(() => setAudioReady(true)).catch(() => {});
    };
    attemptPlay();
    document.addEventListener("pointerdown", attemptPlay, { once: true });
    return () => document.removeEventListener("pointerdown", attemptPlay);
  }, [audioReady]);

  useEffect(() => {
    const love = new Audio("/audio/love-confession-bg.mp3");
    love.volume = 0;
    love.loop = true;
    love.preload = "auto";
    love.addEventListener("canplaythrough", () => setLoveReady(true), { once: true });
    loveAudioRef.current = love;
    return () => { love.pause(); loveAudioRef.current = null; };
  }, []);

  useEffect(() => {
    if (currentRef.current?.id === "yes-no" && !loveActive && loveReady && loveAudioRef.current && audioRef.current) {
      setLoveActive(true);
      loveAudioRef.current.volume = 0;
      loveAudioRef.current.currentTime = 0;
      loveAudioRef.current.play().catch(() => {});
      const crossfade = setInterval(() => {
        if (!audioRef.current || !loveAudioRef.current) { clearInterval(crossfade); return; }
        const curVol = audioRef.current.volume;
        const loveVol = loveAudioRef.current.volume;
        if (curVol <= 0.01 && loveVol >= 0.29) {
          audioRef.current.volume = 0;
          audioRef.current.pause();
          loveAudioRef.current.volume = 0.3;
          clearInterval(crossfade);
          return;
        }
        audioRef.current.volume = Math.max(0, curVol - 0.015);
        loveAudioRef.current.volume = Math.min(0.3, loveVol + 0.015);
      }, 50);
    }
  }, [loveActive, loveReady, step]);

  useEffect(() => {
    if (showFinalScreen) {
      setShowCTA(false);
      const t = setTimeout(() => setShowCTA(true), 200);
      return () => clearTimeout(t);
    }
  }, [showFinalScreen]);

  useEffect(() => {
    if (showFinalScreen || showFullscreenCelebration) {
      const fade = setInterval(() => {
        let anyActive = false;
        if (audioRef.current && audioRef.current.volume > 0.01) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.01);
          anyActive = true;
        } else if (audioRef.current) { audioRef.current.pause(); }
        if (loveAudioRef.current && loveAudioRef.current.volume > 0.01) {
          loveAudioRef.current.volume = Math.max(0, loveAudioRef.current.volume - 0.01);
          anyActive = true;
        } else if (loveAudioRef.current) { loveAudioRef.current.pause(); }
        if (!anyActive) clearInterval(fade);
      }, 50);
    }
  }, [showFinalScreen, showFullscreenCelebration]);
  const totalScenes = flow.scenes.length;
  const templateId = flow.templateId;

  const fillScene = useCallback((scene: SceneStep): SceneStep => {
    const filled = { ...scene };
    if (filled.content) {
      const customTitle = customMessages.sceneTitles?.[step];
      filled.content = {
        ...filled.content,
        title: customTitle || filled.content.title
          .replace(/\{finalMessage\}/g, finalMessage)
          .replace(/\{step\}/g, customMessages.steps[0] || ""),
      };
    }
    return filled;
  }, [finalMessage, customMessages.steps, customMessages.sceneTitles, step]);

  const currentRef = useRef<SceneStep | null>(null);
  const current = step < flow.scenes.length ? fillScene(flow.scenes[step]) : null;
  currentRef.current = current;

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const advance = useCallback(() => {
    const cur = currentRef.current;
    if (!cur) return;
    hapticTone("tap", tone);
    if (cur.interaction?.action === "complete") {
      playToneSound("ding", tone);
      setSuspense(true);
      onTrack("completed");
      setTimeout(() => {
        setSuspense(false);
        setShowConfetti(true);
        setShowFullscreenCelebration(true);
        if (containerRef.current) {
          containerRef.current.requestFullscreen?.().catch(() => {});
        }
        setTimeout(() => {
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
          setShowFullscreenCelebration(false);
          setShowFinalScreen(true);
        }, 600);
      }, 1200);
      return;
    }
    playToneSound("whoosh", tone);
    triggerShake();
    setStep((s) => Math.min(s + 1, flow.scenes.length));
    setTransitionKey((k) => k + 1);
  }, [onComplete, onTrack, triggerShake]);

  const handleChoice = useCallback((_choiceId: string) => {
    advance();
  }, [advance]);

  const autoDelay = useMemo(() => {
    if (current?.interaction?.type !== "auto") return 4000;
    const titleLen = current.content?.title?.length ?? 0;
    const bodyLen = current.content?.body?.length ?? 0;
    return Math.min(5000, 800 + titleLen * 60 + bodyLen * 40);
  }, [current]);

  useAutoAdvance({
    active: current?.interaction?.type === "auto",
    delay: autoDelay,
    onAdvance: useCallback(() => {
      if (current?.interaction?.type === "auto") advance();
    }, [current, advance]),
  });

  const { message: eggMessage } = useEasterEgg(flow.templateId);

  if (step >= totalScenes && !showFinalScreen) return null;

  return (
    <>
      <audio ref={audioRef} preload="auto" src="/audio/love-button-bg.mp3" />
      <audio ref={loveAudioRef} preload="auto" src="/audio/love-confession-bg.mp3" />
      <ConfettiEffect active={showConfetti} />
      <EggBanner message={eggMessage} />
      <div
        ref={containerRef}
        key={transitionKey}
        className={`animate-scene-enter relative flex w-full flex-col ${shaking ? "animate-shake" : ""} ${mode === "preview" ? "min-h-full" : "min-h-[100dvh] overflow-hidden"}`}
      >
        <SceneBackground scene={current!} />

        {showFinalScreen ? (
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8">
            <div className="animate-reveal-scale-3d mx-auto w-full max-w-lg text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md">
                <span className="text-4xl">💖</span>
              </div>
              <h2 className="font-display font-bold leading-tight text-white" style={{ fontSize: "clamp(1.25rem, 5vw, 2.5rem)" }}>
                {finalMessage}
              </h2>
              <div className="mt-8 space-y-3" style={{ opacity: showCTA ? 1 : 0, transform: showCTA ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {}
                  }}
                  className="inline-flex min-h-[56px] w-full max-w-xs items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 text-base font-extrabold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                >
                  {copied ? "✅ Copied!" : "🔗 Share this moment"}
                </button>
                {(mode === "demo" || mode === "preview") && (
                  <div>
                    <p className="mb-3 text-sm text-white/40">Make someone's heart skip a beat.</p>
                    <Link
                      className="inline-flex min-h-[56px] items-center gap-2 rounded-full bg-gradient-to-r from-white via-[#ffddec] to-[#d9f7f7] px-10 text-base font-extrabold text-[#21172c] shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] active:scale-95"
                      href={`/create/${templateId}`}
                    >
                      Create for someone 💕
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : suspense ? (
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="flex gap-2">
                <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-white/40" style={{ animationDelay: "0s" }} />
                <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-white/40" style={{ animationDelay: "0.2s" }} />
                <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-white/40" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto px-5 pb-4 pt-4 sm:px-6">
            <SceneProp scene={current!} />
            {current?.reaction && <ReactionEmoji emoji={current.reaction} step={step} />}

            {current?.dodge ? (
              <ChaseTitle
                text={current.content.title}
                attempts={current.dodge.attempts}
                onCaught={advance}
              />
            ) : (
              <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-2 sm:gap-3">
                <div className={`flex w-full flex-col items-center justify-center gap-2 sm:gap-3 text-${current?.content.align === "left" ? "left" : "center"}`}>
                  {current?.content.title && <TitleText text={current.content.title} align={current.content.align} />}
                  {current?.content.body && <BodyText text={current.content.body} />}
                </div>

                {current?.interaction && current.interaction.type !== "auto" && (
                  <div className="flex w-full shrink-0 justify-center pt-1">
                    {current.interaction.type === "love-chase" ? (
                      <LoveChaseInteraction label={current.interaction.label || "You love me 💖"} onTruth={advance} />
                    ) : current.interaction.type === "multi-tap" ? (
                      <MultiTapButton interaction={current.interaction} onComplete={advance} />
                    ) : current.interaction.type === "choices" && current.interaction.choices ? (
                      <ChoiceButtons choices={current.interaction.choices} onChoose={handleChoice} />
                    ) : current.interaction.type === "ghost-type" && current.interaction.words ? (
                      <GhostType words={current.interaction.words} onComplete={advance} />
                    ) : current.interaction.type === "smash-emoji" ? (
                      <SmashEmoji count={current.interaction.count || 5} onComplete={advance} />
                    ) : current.interaction.type === "flip-coin" ? (
                      <FlipCoin flips={current.interaction.count || 3} onComplete={advance} />
                    ) : current.interaction.type === "candles" ? (
                      <Candles count={current.interaction.count || 5} onComplete={advance} />
                    ) : current.interaction.type === "scratch-reveal" ? (
                      <ScratchReveal text={current.interaction.label || "Your message here"} onComplete={advance} />
                    ) : current.interaction.type === "wax-seal" ? (
                      <WaxSeal cracks={current.interaction.count || 3} onComplete={advance} />
                    ) : current.interaction.type === "drag-box" ? (
                      <DragBox onComplete={advance} />
                    ) : current.interaction.type === "tap-anywhere" ? (
                      <button
                        type="button"
                        className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-white/15 bg-white/10 px-8 py-3 text-sm font-bold tracking-wider text-white/80 backdrop-blur-sm transition-all hover:bg-white/15 active:scale-95"
                        onClick={advance}
                      >
                        {current.interaction.label || "Tap anywhere"}
                      </button>
                    ) : (
                      <RippleButton interaction={current.interaction} onClick={advance} />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Fullscreen celebration overlay */}
      {showFullscreenCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,107,157,0.35) 0%, rgba(196,77,255,0.25) 40%, rgba(0,0,0,0.6) 100%)",
          backdropFilter: "blur(4px)",
        }}>
          <EmojiBurst active={true} />
          <div className="animate-reveal-scale-3d mx-auto w-full max-w-2xl px-8 text-center">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 backdrop-blur-md shadow-[0_0_60px_rgba(255,255,255,0.15)]">
              <span className="text-6xl animate-pulse">💖</span>
            </div>
            <h1 className="font-display font-bold leading-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)" }}>
              {finalMessage}
            </h1>
          </div>
        </div>
      )}

      <Watermark />
    </>
  );
}
