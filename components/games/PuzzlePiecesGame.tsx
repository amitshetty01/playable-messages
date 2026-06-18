"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { playToneSound } from "@/lib/flowSounds";
import type { Tone } from "@/lib/types";

type Piece = {
  id: number;
  x: number;
  y: number;
  placed: boolean;
  tiltX: number;
  tiltY: number;
};

export function PuzzlePiecesGame({
  onComplete,
  tone,
  gridSize = 2,
}: {
  onComplete: () => void;
  tone: Tone;
  gridSize?: number;
}) {
  const totalPieces = gridSize * gridSize;
  const cellSize = 68;
  const gap = 8;
  const gridPx = gridSize * cellSize + (gridSize - 1) * gap;

  const [pieces, setPieces] = useState<Piece[]>(() =>
    Array.from({ length: totalPieces }, (_, i) => ({
      id: i, x: 0, y: 0, placed: false, tiltX: 0, tiltY: 0,
    }))
  );
  const [placed, setPlaced] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const dragPosRef = useRef({ x: 0, y: 0 });
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    setPieces((prev) =>
      prev.map((p, i) => ({
        ...p,
        x: (i % gridSize) * (cellSize + gap) + (Math.random() - 0.5) * gridPx * 0.5 + gridPx * 0.25,
        y: Math.floor(i / gridSize) * (cellSize + gap) + (Math.random() - 0.3) * gridPx * 0.3 + gridPx * 0.15,
      }))
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, id: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const piece = pieces.find((p) => p.id === id);
      if (!piece || piece.placed) return;
      offsetRef.current = {
        x: e.clientX - rect.left - piece.x,
        y: e.clientY - rect.top - piece.y,
      };
      dragPosRef.current = { x: piece.x, y: piece.y };
      setDragging(id);
    },
    [pieces]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      /* Calculate tilt from pointer position relative to piece center */
      const p = pieces[dragging];
      const px = offsetRef.current.x + p.x;
      const py = offsetRef.current.y + p.y;
      const relX = (e.clientX - rect.left - px) / cellSize;
      const relY = (e.clientY - rect.top - py) / cellSize;
      const tiltX = Math.max(-12, Math.min(12, relY * -16));
      const tiltY = Math.max(-12, Math.min(12, relX * 16));

      const x = e.clientX - rect.left - offsetRef.current.x;
      const y = e.clientY - rect.top - offsetRef.current.y;
      dragPosRef.current = {
        x: Math.max(0, Math.min(x, gridPx - cellSize)),
        y: Math.max(0, Math.min(y, gridPx)),
      };
      setPieces((prev) =>
        prev.map((p) => (p.id === dragging ? { ...p, tiltX, tiltY } : p))
      );

      /* Check snap */
      const targetCol = pieces[dragging].id % gridSize;
      const targetRow = Math.floor(pieces[dragging].id / gridSize);
      const targetX = targetCol * (cellSize + gap);
      const targetY = targetRow * (cellSize + gap);
      const dist = Math.sqrt(
        Math.pow(dragPosRef.current.x - targetX, 2) +
        Math.pow(dragPosRef.current.y - targetY, 2)
      );
      if (dist < 30) {
        playToneSound("ding", tone);
        const newPieces = pieces.map((p) =>
          p.id === dragging
            ? { ...p, x: targetX, y: targetY, placed: true, tiltX: 0, tiltY: 0 }
            : p
        );
        setPieces(newPieces);
        const newPlaced = placed + 1;
        setPlaced(newPlaced);
        setDragging(null);
        if (newPlaced >= totalPieces) {
          setTimeout(() => onComplete(), 600);
        }
      }
    },
    [dragging, pieces, placed, totalPieces, gridSize, cellSize, gap, gridPx, tone, onComplete]
  );

  const handlePointerUp = useCallback(() => {
    if (dragging === null) return;
    setPieces((prev) =>
      prev.map((p) =>
        p.id === dragging && !p.placed
          ? { ...p, x: dragPosRef.current.x, y: dragPosRef.current.y, tiltX: 0, tiltY: 0 }
          : p
      )
    );
    setDragging(null);
  }, [dragging]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
      <div
        ref={containerRef}
        className="relative touch-none select-none"
        style={{ width: gridPx, height: gridPx + 10 }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 rounded-2xl border border-dashed border-white/10"
          style={{ height: gridPx, width: gridPx }}
        >
          {Array.from({ length: totalPieces }).map((_, i) => {
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);
            return (
              <div
                key={i}
                className="absolute rounded-xl border border-white/5 bg-white/[0.02]"
                style={{
                  width: cellSize,
                  height: cellSize,
                  left: col * (cellSize + gap),
                  top: row * (cellSize + gap),
                }}
              />
            );
          })}
        </div>

        {/* Pieces */}
        {pieces.map((piece) => {
          const isDragging = dragging === piece.id;
          const dx = isDragging ? dragPosRef.current.x : piece.x;
          const dy = isDragging ? dragPosRef.current.y : piece.y;
          return (
            <div
              key={piece.id}
              onPointerDown={(e) => handlePointerDown(e, piece.id)}
              className={`absolute flex items-center justify-center rounded-xl text-lg font-bold ${
                piece.placed
                  ? "pointer-events-none border-2 border-[#8FA3C0]/50 bg-[#8FA3C0]/20 text-[#b0c8e0]"
                  : isDragging
                    ? "z-10 border-2 border-white/30 bg-[#8FA3C0]/30 text-white"
                    : "border border-white/20 bg-[#8FA3C0]/15 text-white/70 hover:border-white/30 hover:bg-[#8FA3C0]/25"
              } ${!piece.placed && !isDragging ? "cursor-grab active:cursor-grabbing" : ""}`}
              style={{
                width: cellSize,
                height: cellSize,
                left: dx,
                top: dy,
                transition: isDragging ? "none" : "left 0.35s cubic-bezier(0.34,1.56,0.64,1), top 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                transform: isDragging
                  ? `perspective(500px) rotateX(${piece.tiltY}deg) rotateY(${piece.tiltX}deg) scale(1.05)`
                  : piece.placed
                    ? "perspective(500px) rotateX(0) rotateY(0) scale(1)"
                    : "perspective(500px) rotateX(0) rotateY(0) scale(1)",
                boxShadow: isDragging
                  ? "0 14px 28px -8px rgba(0,0,0,0.5)"
                  : piece.placed
                    ? "0 4px 12px -4px rgba(143,163,192,0.2)"
                    : "0 6px 16px -6px rgba(0,0,0,0.4)",
              }}
            >
              {piece.placed ? "✓" : piece.id + 1}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10 sm:w-48">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8FA3C0] to-violet transition-all duration-300"
            style={{ width: `${(placed / totalPieces) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-white/40">{placed}/{totalPieces}</span>
      </div>
    </div>
  );
}
