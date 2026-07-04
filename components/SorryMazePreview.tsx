"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const COLS = 13;
const ROWS = 13;

type Cell = { t: number; r: number; b: number; l: number; v: number };

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateMaze(c: number, r: number): Cell[][] {
  const cells: Cell[][] = [];
  for (let y = 0; y < r; y++) {
    cells[y] = [];
    for (let x = 0; x < c; x++) cells[y][x] = { t: 1, r: 1, b: 1, l: 1, v: 0 };
  }
  function car(x: number, y: number) {
    cells[y][x].v = 1;
    const d = shuffle([[0, -1, "t", "b"], [1, 0, "r", "l"], [0, 1, "b", "t"], [-1, 0, "l", "r"]]);
    for (const item of d) {
      const dx = item[0] as number, dy = item[1] as number;
      const w = item[2] as string, o = item[3] as string;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < c && ny >= 0 && ny < r && !cells[ny][nx].v) {
        (cells[y][x] as any)[w] = 0;
        (cells[ny][nx] as any)[o] = 0;
        car(nx, ny);
      }
    }
  }
  car(0, 0);
  return cells;
}

function toGrid(cells: Cell[][], c: number, r: number): number[][] {
  const gw = c * 2 + 1, gh = r * 2 + 1;
  const g: number[][] = Array.from({ length: gh }, () => Array(gw).fill(1));
  for (let y = 0; y < r; y++)
    for (let x = 0; x < c; x++) {
      const gx = x * 2 + 1, gy = y * 2 + 1;
      g[gy][gx] = 0;
      if (!cells[y][x].t && y > 0) g[gy - 1][gx] = 0;
      if (!cells[y][x].r && x < c - 1) g[gy][gx + 1] = 0;
      if (!cells[y][x].b && y < r - 1) g[gy + 1][gx] = 0;
      if (!cells[y][x].l && x > 0) g[gy][gx - 1] = 0;
    }
  return g;
}

type Phase = "title" | "playing" | "ending";

export function SorryMazePreview() {
  const [phase, setPhase] = useState<Phase>("title");
  const [mazeCells, setMazeCells] = useState<Cell[][] | null>(null);
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const [showFlashback, setShowFlashback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(16);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitX = COLS - 1;
  const exitY = ROWS - 1;
  const gw = COLS * 2 + 1;
  const gh = ROWS * 2 + 1;

  useEffect(() => {
    function calc() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        const cs = Math.floor(Math.min(w / gw, h / gh));
        setCellSize(Math.max(8, Math.min(cs, 28)));
      }
    }
    calc();
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("resize", calc);
      if (timerRef.current) clearInterval(timerRef.current);
      if (flashbackTimerRef.current) clearTimeout(flashbackTimerRef.current);
    };
  }, []);

  const startGame = useCallback(() => {
    const cells = generateMaze(COLS, ROWS);
    const g = toGrid(cells, COLS, ROWS);
    setMazeCells(cells);
    setGrid(g);
    setPx(0);
    setPy(0);
    setWon(false);
    setShowFlashback(false);
    setSeconds(0);
    setPhase("playing");
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);

  const move = useCallback((dx: number, dy: number) => {
    if (phase !== "playing" || won || !mazeCells) return;
    const nx = px + dx;
    const ny = py + dy;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;
    const cell = mazeCells[py][px];
    if (dy === -1 && cell.t) return;
    if (dy === 1 && cell.b) return;
    if (dx === -1 && cell.l) return;
    if (dx === 1 && cell.r) return;
    setPx(nx);
    setPy(ny);

    if (nx === exitX && ny === exitY) {
      if (timerRef.current) clearInterval(timerRef.current);
      setWon(true);
      setTimeout(() => setPhase("ending"), 500);
      return;
    }
  }, [phase, won, mazeCells, px, py, exitX, exitY]);

  return (
    <div className="flex h-full w-full flex-col" style={{ background: "#1a0a2e", color: "#e0d0f0" }}>
      {phase === "title" && (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-5xl">💛</p>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #ffd700, #ff9a3e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Sorry Maze
          </h1>
          <p className="max-w-[240px] text-xs text-white/50">Find your way through the maze of excuses.</p>
          <button
            type="button"
            onClick={startGame}
            className="mt-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-2.5 text-sm font-extrabold text-[#1a0a2e] shadow-lg transition-all active:scale-95"
          >
            Begin the journey
          </button>
        </div>
      )}

      {phase === "playing" && grid && (
        <div className="flex h-full flex-col">
          {/* HUD */}
          <div className="flex items-center justify-end px-3 py-1.5 text-xs font-bold">
            <span className="text-white/40">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</span>
          </div>

          {/* Maze canvas area */}
          <div ref={containerRef} className="relative flex flex-1 items-center justify-center overflow-hidden">
            {/* Flashback overlay */}
            {showFlashback && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
                <div className="text-center">
                  <div className="mb-3 flex justify-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-blue-400/70" />
                      <div className="mt-0.5 h-5 w-5 rounded-sm bg-blue-400/70" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-white/20" />
                      <div className="mt-0.5 h-5 w-5 rounded-sm bg-white/20" />
                    </div>
                  </div>
                  <p className="text-xs text-blue-400/60">Turning away...</p>
                </div>
              </div>
            )}

            {/* Maze grid */}
            <div className="relative" style={{ width: grid[0].length * cellSize, height: grid.length * cellSize }}>
              {grid.map((rowArr, r) =>
                rowArr.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="absolute"
                    style={{
                      left: c * cellSize, top: r * cellSize,
                      width: cellSize, height: cellSize,
                      background: cell === 0 ? "#231552" : r === 0 || r === grid.length - 1 || c === 0 || c === grid[0].length - 1 ? "#1a0d38" : "#0f0825",
                      border: cell === 1 ? "1px solid rgba(100,60,180,0.15)" : "1px solid rgba(200,150,255,0.06)",
                    }}
                  />
                ))
              )}

              {/* Exit - waiting figure */}
              <div
                className="absolute flex flex-col items-center justify-center"
                style={{ left: (exitX * 2 + 1) * cellSize, top: (exitY * 2 + 1) * cellSize, width: cellSize, height: cellSize }}
              >
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1" fill="rgba(200,200,255,0.2)" />
                  <circle cx="8" cy="3.5" r="4" fill="rgba(200,200,255,0.35)" />
                  <line x1="2.5" y1="8.5" x2="6" y2="10" stroke="rgba(200,200,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="13.5" y1="8.5" x2="10" y2="10" stroke="rgba(200,200,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5.5" y1="14" x2="4.5" y2="17.5" stroke="rgba(200,200,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                  <line x1="10.5" y1="14" x2="11.5" y2="17.5" stroke="rgba(200,200,255,0.3)" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="9.5" cy="3" r="1" fill="rgba(200,200,255,0.2)" />
                </svg>
                <span className="text-white/20" style={{ fontSize: Math.max(5, cellSize * 0.25) }}>waiting...</span>
              </div>

              {/* Player */}
              <div
                className="absolute flex items-center justify-center"
                style={{ left: (px * 2 + 1) * cellSize, top: (py * 2 + 1) * cellSize, width: cellSize, height: cellSize }}
              >
                <svg width={cellSize * 0.75} height={cellSize * 0.95} viewBox="0 0 22 28" fill="none">
                  <ellipse cx="11" cy="26" rx="7" ry="2.5" fill="rgba(0,0,0,0.2)" />
                  <line x1="8" y1="19" x2="6.5" y2="24" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="14" y1="19" x2="15.5" y2="24" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="4.5" y="9" width="13" height="10" rx="1" fill="#ffd700" filter="url(#glow)" />
                  <line x1="4.5" y1="11" x2="1.5" y2="14" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="17.5" y1="11" x2="20.5" y2="14" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="11" cy="5" r="6.5" fill="#ffe066" filter="url(#glow)" />
                  <circle cx="9" cy="4.5" r="1.5" fill="#1a0a2e" />
                  <circle cx="13" cy="4.5" r="1.5" fill="#1a0a2e" />
                  <path d="M8.5 7 Q11 9 13.5 7" stroke="#1a0a2e" strokeWidth="1" fill="none" strokeLinecap="round" />
                  <defs>
                    <filter id="glow">
                      <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffd700" floodOpacity="0.3" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center py-2">
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button type="button" onPointerDown={() => move(0, -1)} className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-white/60 active:bg-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>▲</button>
              <div />
              <button type="button" onPointerDown={() => move(-1, 0)} className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-white/60 active:bg-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>◀</button>
              <button type="button" onPointerDown={() => move(0, 1)} className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-white/60 active:bg-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>▼</button>
              <button type="button" onPointerDown={() => move(1, 0)} className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-white/60 active:bg-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>▶</button>
            </div>
          </div>
        </div>
      )}

      {phase === "ending" && (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-5xl">💛</p>
          <h2 className="text-xl font-black" style={{ background: "linear-gradient(135deg, #ffd700, #ff9a3e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            You found your way back
          </h2>
          <p className="text-xs text-white/50">You listened. You showed up. That's what matters.</p>
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={startGame} className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-6 py-2 text-xs font-extrabold text-[#1a0a2e] shadow-lg transition-all active:scale-95">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
