"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const PATH_POINTS = [
  { x: 40, y: 20 }, { x: 45, y: 20 }, { x: 60, y: 22 }, { x: 80, y: 28 },
  { x: 85, y: 35 }, { x: 82, y: 48 }, { x: 72, y: 58 }, { x: 58, y: 65 },
  { x: 44, y: 68 }, { x: 32, y: 65 }, { x: 22, y: 58 }, { x: 18, y: 48 },
  { x: 20, y: 35 }, { x: 28, y: 25 }, { x: 42, y: 20 }, { x: 58, y: 22 },
  { x: 75, y: 30 }, { x: 82, y: 42 }, { x: 80, y: 56 }, { x: 72, y: 66 },
  { x: 58, y: 72 }, { x: 44, y: 74 }, { x: 30, y: 72 }, { x: 20, y: 66 },
  { x: 18, y: 56 }, { x: 22, y: 44 }, { x: 32, y: 35 }, { x: 46, y: 30 },
  { x: 62, y: 28 }, { x: 78, y: 34 }, { x: 84, y: 46 }, { x: 82, y: 60 },
  { x: 72, y: 72 }, { x: 60, y: 80 }, { x: 46, y: 82 }, { x: 34, y: 80 },
  { x: 26, y: 72 }, { x: 24, y: 58 }, { x: 30, y: 46 }, { x: 42, y: 38 },
  { x: 58, y: 34 }, { x: 74, y: 38 }, { x: 82, y: 48 }, { x: 84, y: 62 },
  { x: 80, y: 74 }, { x: 70, y: 82 }, { x: 58, y: 88 }, { x: 44, y: 90 },
  { x: 34, y: 88 }, { x: 28, y: 82 }, { x: 26, y: 72 },
];

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function pointToSegmentDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, ax, ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return dist(px, py, ax + t * dx, ay + t * dy);
}

export function SorryMazePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"title" | "tracing" | "done">("title");
  const [progress, setProgress] = useState(0);
  const [offPath, setOffPath] = useState(false);
  const idxRef = useRef(0);
  const drawnRef = useRef<{ x: number; y: number }[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw maze path
    ctx.beginPath();
    ctx.moveTo(PATH_POINTS[0].x * w / 100, PATH_POINTS[0].y * h / 100);
    for (let i = 1; i < PATH_POINTS.length; i++) {
      ctx.lineTo(PATH_POINTS[i].x * w / 100, PATH_POINTS[i].y * h / 100);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw traced path
    if (drawnRef.current.length > 1) {
      ctx.beginPath();
      ctx.moveTo(drawnRef.current[0].x, drawnRef.current[0].y);
      for (let i = 1; i < drawnRef.current.length; i++) {
        ctx.lineTo(drawnRef.current[i].x, drawnRef.current[i].y);
      }
      ctx.strokeStyle = offPath ? "#ff4444" : "#ffd700";
      ctx.lineWidth = 4;
      ctx.shadowColor = offPath ? "#ff4444" : "#ffd700";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw start and end markers
    ctx.fillStyle = "rgba(255,215,0,0.3)";
    ctx.beginPath();
    ctx.arc(PATH_POINTS[0].x * w / 100, PATH_POINTS[0].y * h / 100, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,100,100,0.3)";
    ctx.beginPath();
    ctx.arc(PATH_POINTS[PATH_POINTS.length - 1].x * w / 100, PATH_POINTS[PATH_POINTS.length - 1].y * h / 100, 6, 0, Math.PI * 2);
    ctx.fill();
  }, [offPath]);

  useEffect(() => { if (phase === "tracing") draw(); }, [phase, draw]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top;
    idxRef.current = 0;
    drawnRef.current = [{ x, y }];
    setOffPath(false);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || idxRef.current >= PATH_POINTS.length - 1) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top;
    drawnRef.current.push({ x, y });

    const pathStart = PATH_POINTS[idxRef.current];
    const pathEnd = PATH_POINTS[Math.min(idxRef.current + 1, PATH_POINTS.length - 1)];
    const wx = canvas.width, wy = canvas.height;
    const d = pointToSegmentDist(
      x, y,
      pathStart.x * wx / 100, pathStart.y * wy / 100,
      pathEnd.x * wx / 100, pathEnd.y * wy / 100
    );

    if (d > 25) {
      setOffPath(true);
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      const idx = Math.round(idxRef.current + d / 25);
      if (idx > idxRef.current) {
        idxRef.current = Math.min(idx, PATH_POINTS.length - 1);
        setProgress(idxRef.current / (PATH_POINTS.length - 1));
        if (idxRef.current >= PATH_POINTS.length - 1) {
          setTimeout(() => setPhase("done"), 400);
        }
      }
    }
    draw();
  }, [draw]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX, y: t.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  return (
    <div className="flex h-full w-full flex-col" style={{ background: "#1a0a2e", color: "#e0d0f0" }}>
      {phase === "title" && (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-5xl">💛</p>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #ffd700, #ff9a3e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Trace Your Way Back
          </h1>
          <p className="max-w-[260px] text-xs text-white/50">Follow the path with your finger. Stay on track — every wrong turn makes it harder.</p>
          <button
            type="button"
            onClick={() => setPhase("tracing")}
            className="mt-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-2.5 text-sm font-extrabold text-[#1a0a2e] shadow-lg transition-all active:scale-95"
          >
            Begin
          </button>
        </div>
      )}

      {phase === "tracing" && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-bold text-white/40">Trace the path</span>
            <div className="h-2 flex-1 mx-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
          <div className="relative flex-1 mx-4 mb-4 rounded-2xl overflow-hidden" style={{ background: "#231552", border: "1px solid rgba(200,150,255,0.1)" }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={800}
              className="absolute inset-0 w-full h-full touch-none"
              style={{ touchAction: "none" }}
              onMouseDown={(e) => handleStart(getPos(e).x, getPos(e).y)}
              onMouseMove={(e) => { if (e.buttons) handleMove(getPos(e).x, getPos(e).y); }}
              onTouchStart={(e) => { e.preventDefault(); handleStart(getPos(e).x, getPos(e).y); }}
              onTouchMove={(e) => { e.preventDefault(); handleMove(getPos(e).x, getPos(e).y); }}
            />
            {offPath && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-red-500/20 px-4 py-1.5 text-xs font-bold text-red-300 backdrop-blur-sm">
                Off track! Slow down.
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-5xl">💛</p>
          <h2 className="text-xl font-black" style={{ background: "linear-gradient(135deg, #ffd700, #ff9a3e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            You found your way back
          </h2>
          <p className="text-xs text-white/50">You listened. You showed up. That's what matters.</p>
        </div>
      )}
    </div>
  );
}
