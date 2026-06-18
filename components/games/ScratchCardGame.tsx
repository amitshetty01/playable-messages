"use client";

import { useRef, useEffect, useState, useCallback } from "react";

export function ScratchCardGame({
  onComplete,
  message,
}: {
  onComplete: () => void;
  message: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [percent, setPercent] = useState(0);
  const isScratching = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#ff5fb7";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    ctx.fillStyle = "#fff8f1";
    ctx.font = "bold 48px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💖", w / 2, h / 2);

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.font = "14px system-ui";
    ctx.fillText("Scratch here", w / 2, h - 30);
  }, []);

  const getPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const scratch = useCallback((x: number, y: number, w: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, w, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }, []);

  const calcPercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    return transparent / (pixels.length / 4);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    isScratching.current = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y, 28);
  }, [getPos, scratch]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching.current) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y, 28);
    const p = calcPercent();
    setPercent(p);
    if (p >= 0.45) {
      isScratching.current = false;
      onComplete();
    }
  }, [getPos, scratch, calcPercent, onComplete]);

  const handlePointerUp = useCallback(() => {
    isScratching.current = false;
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/5 p-6">
          <p className="text-center text-lg font-bold text-white/80 sm:text-xl">{message}</p>
        </div>
        <canvas
          ref={canvasRef}
          width={280}
          height={200}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          className="relative block w-[280px] cursor-crosshair rounded-2xl touch-none sm:w-[320px]"
          style={{ height: 200 }}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10 sm:w-48">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blush to-rose transition-all duration-200"
            style={{ width: `${Math.min(percent * 100, 45)}%` }}
          />
        </div>
        <span className="text-xs font-bold text-white/40">{Math.round(percent * 100)}%</span>
      </div>
    </div>
  );
}
