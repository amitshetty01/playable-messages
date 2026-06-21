"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { playToneSound } from "@/lib/flowSounds";
import { hapticTone } from "@/lib/haptic";
import { Watermark } from "@/components/Watermark";
import type { ExperienceRecord, Template, Tone } from "@/lib/types";

type Props = { template: Template; experience: ExperienceRecord; mode: "demo" | "generated" | "preview"; shareUrl?: string };

type Phase = "opening" | "playing" | "success" | "message";
type Direction = "up" | "down" | "left" | "right";

interface Piece {
  r: number;
  c: number;
  dir: Direction;
  active: boolean;
  id: string;
}

const DIRS: Direction[] = ["up", "down", "left", "right"];
const DR: Record<Direction, number> = { up: -1, down: 1, left: 0, right: 0 };
const DC: Record<Direction, number> = { up: 0, down: 0, left: -1, right: 1 };

const HARD_CFG = { grid: 21, threshold: -0.18, edgeOutward: 0.80 };

const PROGRESS_LINES = [
  { pct: 0,  text: "Something is hidden inside…" },
  { pct: 25, text: "The heart is stirring…" },
  { pct: 50, text: "Keep going…" },
  { pct: 70, text: "Almost there…" },
  { pct: 85, text: "The heart is opening…" },
  { pct: 95, text: "Just one more…" },
];

const TONE_MESSAGES: Record<string, string> = {
  Romantic:   "You cleared the way to my heart. Every wall you removed brought us closer.",
  Sorry:      "I know things got messy… but I still wanted to say sorry. Thank you for staying.",
  Birthday:   "Happy Birthday! You made it through another year — and through every wall. 🎉",
  Friendship: "Through every arrow and every wall — you never gave up on me. That's real friendship.",
  Funny:      "OK fine, you win. The secret message is… you're impossible. In the best way. 😏",
  Emotional:  "Some hearts are worth the work. Thank you for not walking away.",
  Mystery:    "You found what was hidden. Now it's yours.",
};

const COLORS = ["#ff6b9d","#c44dff","#ffd166","#97dadf","#ff5fb7"];

function heartEq(x: number, y: number) {
  return (x * x + y * y - 1) ** 3 - x * x * y * y * y;
}

function createHeartMask(gridSize: number, threshold: number) {
  const mask: number[][] = [];
  for (let r = 0; r < gridSize; r++) {
    mask[r] = [];
    for (let c = 0; c < gridSize; c++) {
      const x = (c - (gridSize - 1) / 2) / (gridSize * 0.28);
      const y = (r - (gridSize - 1) / 2) / (gridSize * 0.28);
      const v = heartEq(x, y);
      const dist = Math.sqrt(x * x + y * y);
      mask[r][c] = v <= threshold && dist < 2.5 ? 1 : 0;
    }
  }
  return mask;
}

function getFacePositions(mask: number[][]) {
  const size = mask.length;
  let minR = size, maxR = 0, minC = size, maxC = 0;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (mask[r][c]) {
        minR = Math.min(minR, r); maxR = Math.max(maxR, r);
        minC = Math.min(minC, c); maxC = Math.max(maxC, c);
      }
  const height = maxR - minR;
  const width = maxC - minC;
  const centerC = Math.round((minC + maxC) / 2);
  const all = new Set<string>();
  const eyes = new Set<string>();

  const eyeRow = Math.round(minR + height * 0.6);
  const eyeOff = Math.max(2, Math.round(width * 0.25));
  const lEye = { r: eyeRow, c: centerC - eyeOff };
  const rEye = { r: eyeRow, c: centerC + eyeOff };
  const le = mask[lEye.r]?.[lEye.c];
  const re = mask[rEye.r]?.[rEye.c];
  if (le) { eyes.add(`${lEye.r},${lEye.c}`); all.add(`${lEye.r},${lEye.c}`); }
  if (re) { eyes.add(`${rEye.r},${rEye.c}`); all.add(`${rEye.r},${rEye.c}`); }
  if (!le || !re) {
    const eyeRow2 = Math.round(minR + height * 0.5);
    const eyeOff2 = Math.max(1, Math.round(width * 0.18));
    const l2 = { r: eyeRow2, c: centerC - eyeOff2 };
    const r2 = { r: eyeRow2, c: centerC + eyeOff2 };
    if (!le && mask[l2.r]?.[l2.c]) { eyes.add(`${l2.r},${l2.c}`); all.add(`${l2.r},${l2.c}`); }
    if (!re && mask[r2.r]?.[r2.c]) { eyes.add(`${r2.r},${r2.c}`); all.add(`${r2.r},${r2.c}`); }
  }

  const smileRow = Math.round(minR + height * 0.75);
  const smileSpread = Math.max(1, Math.round(width * 0.22));
  const smile = new Set<string>();
  for (let c = centerC - smileSpread; c <= centerC + smileSpread; c++) {
    if (mask[smileRow]?.[c]) { all.add(`${smileRow},${c}`); smile.add(`${smileRow},${c}`); }
  }

  return { all, eyes, smile };
}

function generatePuzzle(mask: number[][], cfg: { edgeOutward: number }, facePositions: Set<string>) {
  const size = mask.length;
  const pieces: Piece[] = [];

  function isEdge(r: number, c: number) {
    for (const d of DIRS) {
      const nr = r + DR[d], nc = c + DC[d];
      if (nr < 0 || nr >= size || nc < 0 || nc >= size || !mask[nr][nc]) return true;
    }
    return false;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!mask[r][c]) continue;
      if (facePositions.has(`${r},${c}`)) continue;
      const edge = isEdge(r, c);
      let dir: Direction;

      if (edge) {
        const outwardDirs = DIRS.filter(d => {
          const nr = r + DR[d], nc = c + DC[d];
          return nr < 0 || nr >= size || nc < 0 || nc >= size || !mask[nr][nc];
        });
        const inwardDirs = DIRS.filter(d => !outwardDirs.includes(d));
        if (Math.random() < cfg.edgeOutward && outwardDirs.length > 0) {
          dir = outwardDirs[Math.floor(Math.random() * outwardDirs.length)];
        } else if (inwardDirs.length > 0) {
          dir = inwardDirs[Math.floor(Math.random() * inwardDirs.length)];
        } else {
          dir = outwardDirs[0];
        }
      } else {
        let bestDir: Direction = "up", bestDist = Infinity;
        for (const d of DIRS) {
          let nr = r + DR[d], nc = c + DC[d], dist = 1;
          while (nr >= 0 && nr < size && nc >= 0 && nc < size && mask[nr][nc]) {
            nr += DR[d]; nc += DC[d]; dist++;
          }
          if (dist < bestDist) { bestDist = dist; bestDir = d; }
        }
        dir = Math.random() < 0.75 ? bestDir : DIRS[Math.floor(Math.random() * 4)];
      }

      pieces.push({ r, c, dir, active: true, id: `p-${r}-${c}` });
    }
  }
  return pieces;
}

function isSolvable(pieces: Piece[], size: number) {
  const remaining = pieces.filter(p => p.active).map(p => ({ ...p }));
  while (remaining.length > 0) {
    const idx = remaining.findIndex(p => {
      let r = p.r + DR[p.dir], c = p.c + DC[p.dir];
      while (r >= 0 && r < size && c >= 0 && c < size) {
        if (remaining.some(o => o.r === r && o.c === c)) return false;
        r += DR[p.dir]; c += DC[p.dir];
      }
      return true;
    });
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }
  return true;
}

function ArrowSVG({ dir }: { dir: Direction }) {
  const s = 32;
  const half = 16;
  const pad = 2;

  const paths: Record<Direction, { line: string; head: string }> = {
    up:    { line: `M${half} ${s} L${half} ${pad + 4}`,        head: `M${half - 7} ${pad + 12} L${half} ${pad + 4} L${half + 7} ${pad + 12}` },
    down:  { line: `M${half} ${pad} L${half} ${s - 4}`,        head: `M${half - 7} ${s - 12} L${half} ${s - 4} L${half + 7} ${s - 12}` },
    left:  { line: `M${s} ${half} L${pad + 4} ${half}`,        head: `M${pad + 12} ${half - 7} L${pad + 4} ${half} L${pad + 12} ${half + 7}` },
    right: { line: `M${pad} ${half} L${s - 4} ${half}`,        head: `M${s - 12} ${half - 7} L${s - 4} ${half} L${s - 12} ${half + 7}` },
  };

  return (
    <svg viewBox={`0 0 ${s} ${s}`} style={{ display: "block", width: "100%", height: "100%", padding: 2 }}>
      <path d={paths[dir].line} stroke="#e0e0f0" strokeWidth={3.5} strokeLinecap="round" fill="none" />
      <path d={paths[dir].head} fill="#e0e0f0" />
    </svg>
  );
}

function Particles({ cx, cy }: { cx: number; cy: number }) {
  const items = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 40;
      return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, color: COLORS[Math.floor(Math.random() * COLORS.length)], size: 4 + Math.random() * 4, delay: Math.random() * 0.1 };
    }), []);
  return (
    <div style={{ position: "fixed", left: cx, top: cy, pointerEvents: "none", zIndex: 60 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%", width: item.size, height: item.size,
          background: item.color, opacity: 1,
          animation: `particleFade 0.6s ease ${item.delay}s forwards`,
          "--tx": `${item.dx}px`, "--ty": `${item.dy}px`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Confetti({ area }: { area: DOMRect | null }) {
  const items = useMemo(() => {
    if (!area) return [];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i, left: Math.random() * 100, delay: Math.random() * 0.4, dur: 1 + Math.random() * 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)], size: 4 + Math.random() * 4,
    }));
  }, [area]);

  if (!area) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 60 }}>
      {items.map(item => (
        <div key={item.id} style={{
          position: "absolute", left: `${item.left}%`, top: "-10px",
          width: item.size, height: item.size, borderRadius: 2, background: item.color,
          animation: `confettiFall ${item.dur}s ease ${item.delay}s forwards`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function EscapeMeGame({ template, experience, mode }: Props) {
  const [phase, setPhase] = useState<Phase>("opening");
  const [puzzle, setPuzzle] = useState<Piece[]>([]);
  const [eyePositions, setEyePositions] = useState<Set<string>>(new Set());
  const [smilePositions, setSmilePositions] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(3);
  const [hintsRemaining, setHintsRemaining] = useState(10);
  const [piecesRemoved, setPiecesRemoved] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [hintId, setHintId] = useState<string | null>(null);
  const [particles, setParticles] = useState<{ id: number; cx: number; cy: number }[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const pidRef = useRef(0);
  const sizeRef = useRef(21);

  const toneMsg = TONE_MESSAGES[experience.tone] || TONE_MESSAGES.Romantic;

  function initGame() {
    let cfg = { ...HARD_CFG };
    for (let attempt = 0; attempt < 20; attempt++) {
      const mask = createHeartMask(cfg.grid, cfg.threshold);
      let cnt = 0;
      for (let r = 0; r < cfg.grid; r++)
        for (let c = 0; c < cfg.grid; c++)
          if (mask[r][c]) cnt++;
      if (cnt >= 10 && cnt <= cfg.grid * cfg.grid * 0.55) break;
      cfg = { ...cfg, threshold: cfg.threshold + (cnt < 10 ? 0.05 : -0.05) };
    }
    const mask = createHeartMask(cfg.grid, cfg.threshold);
    const { all: faceP, eyes: eyeP, smile: smileP } = getFacePositions(mask);
    let pieces: Piece[] = [];
    for (let i = 0; i < 100; i++) {
      pieces = generatePuzzle(mask, cfg, faceP);
      if (isSolvable(pieces, cfg.grid)) break;
    }
    sizeRef.current = cfg.grid;
    setEyePositions(eyeP);
    setSmilePositions(smileP);
    setPuzzle(pieces);
    setTotalPieces(pieces.length);
    setPiecesRemoved(0);
    setLives(3);
    setHintsRemaining(10);
    setIsAnimating(false);
    setRemovingId(null);
    setShakeId(null);
    setHintId(null);
    setParticles([]);
    setPhase("playing");
  }

  const progressText = useMemo(() => {
    const pct = totalPieces > 0 ? (piecesRemoved / totalPieces) * 100 : 0;
    let text = "";
    for (let i = PROGRESS_LINES.length - 1; i >= 0; i--) {
      if (pct >= PROGRESS_LINES[i].pct) { text = PROGRESS_LINES[i].text; break; }
    }
    return text;
  }, [piecesRemoved, totalPieces]);

  function isPathClear(piece: Piece, puzzleArr: Piece[], size: number) {
    let r = piece.r + DR[piece.dir];
    let c = piece.c + DC[piece.dir];
    while (r >= 0 && r < size && c >= 0 && c < size) {
      if (puzzleArr.some(p => p.active && p.r === r && p.c === c)) return false;
      r += DR[piece.dir];
      c += DC[piece.dir];
    }
    return true;
  }

  function onCellClick(r: number, c: number) {
    if (phase !== "playing" || isAnimating) return;
    const piece = puzzle.find(p => p.r === r && p.c === c && p.active);
    if (!piece) return;

    const size = sizeRef.current;

    const blocked = !isPathClear(piece, puzzle, size);

    if (!blocked) {
      setRemovingId(piece.id);
      setIsAnimating(true);
      playToneSound("ding", experience.tone);
      hapticTone("ding", experience.tone);

      const cell = document.querySelector(`[data-eid="${piece.id}"]`);
      if (cell) {
        const rect = cell.getBoundingClientRect();
        const root = document.getElementById("__next") || document.body;
        const rootRect = root.getBoundingClientRect();
        setParticles(prev => [...prev, { id: ++pidRef.current, cx: rect.left - rootRect.left + rect.width / 2, cy: rect.top - rootRect.top + rect.height / 2 }]);
      }

      setTimeout(() => {
        setPuzzle(prev => prev.map(p => p.id === piece.id ? { ...p, active: false } : p));
        setPiecesRemoved(prev => prev + 1);
        setRemovingId(null);
        setIsAnimating(false);
      }, 350);
    } else {
      setShakeId(piece.id);
      setIsAnimating(true);
      playToneSound("tap", experience.tone);
      hapticTone("tap", experience.tone);

      setTimeout(() => {
        setShakeId(null);
        setLives(prev => prev - 1);
        setIsAnimating(false);
      }, 350);
    }
  }

  useEffect(() => {
    if (piecesRemoved > 0 && piecesRemoved >= totalPieces && totalPieces > 0) {
      const t = setTimeout(() => setPhase("success"), 500);
      return () => clearTimeout(t);
    }
  }, [piecesRemoved, totalPieces]);

  useEffect(() => {
    if (lives <= 0 && phase === "playing") {
      const t = setTimeout(() => setPhase("opening"), 1200);
      return () => clearTimeout(t);
    }
  }, [lives, phase]);

  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (phase === "success") {
      const t = setTimeout(() => setShowMessage(true), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none" style={{ touchAction: "manipulation", background: "#0f0f14" }}>
      <style>{`
        @keyframes particleFade {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx),var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Opening */}
      {phase === "opening" && (
        <div className="flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ minHeight: "100dvh" }}>
          <div style={{ fontSize: "4.5rem" }}>💗</div>
          <h1 className="font-display font-bold" style={{ fontSize: "clamp(2.5rem,10vw,4.5rem)", background: "linear-gradient(135deg,#ff6b9d,#c44dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Escape Me</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(1rem,4vw,1.2rem)", maxWidth: 360, lineHeight: 1.6 }}>A message is trapped inside this heart.<br />Remove the arrows in the right order to unlock it.</p>
          <button onClick={initGame} style={{ marginTop: 20, padding: "16px 52px", borderRadius: 50, border: "none", fontSize: "1.15rem", fontWeight: 800, cursor: "pointer", background: "linear-gradient(135deg,#ff6b9d,#c44dff)", color: "#fff", boxShadow: "0 6px 30px rgba(196,77,255,0.35)" }}>Start</button>
          {lives <= 0 && (
            <p style={{ color: "#ff6b8a", fontSize: "1rem", fontWeight: 700, marginTop: 16 }}>Some walls couldn't be moved this time. Try again!</p>
          )}
        </div>
      )}

      {/* Playing */}
      {phase === "playing" && (
        <>
          {/* Top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", zIndex: 20, paddingTop: "max(16px, env(safe-area-inset-top))" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{totalPieces - piecesRemoved} remaining</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[0,1,2].map(i => <span key={i} style={{ fontSize: 24, opacity: i < lives ? 1 : 0.15, transform: i < lives ? "scale(1)" : "scale(0.4)", transition: "all 0.3s ease" }}>❤️</span>)}
            </div>
          </div>

          {/* Emotional progress */}
          {progressText && (
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(1.1rem,4.5vw,1.6rem)", fontWeight: 700, color: "rgba(255,255,255,0.1)", textAlign: "center", pointerEvents: "none", zIndex: 1, letterSpacing: "0.5px" }}>
              {progressText}
            </div>
          )}

          {/* Grid + Heart */}
          <div ref={gridRef} style={{
            display: "grid",
            gridTemplateColumns: `repeat(${sizeRef.current},1fr)`,
            gridTemplateRows: `repeat(${sizeRef.current},1fr)`,
            gap: 0,
            position: "relative",
            zIndex: 10,
            width: "min(calc(100vw - 24px), 720px)",
            maxHeight: "80dvh",
          }}>
            {puzzle.map((piece) => {
              return (
                <div
                  key={piece.id}
                  data-eid={piece.id}
                  onClick={() => onCellClick(piece.r, piece.c)}
                  style={{
                    gridRow: piece.r + 1,
                    gridColumn: piece.c + 1,
                    aspectRatio: "1",
                    display: piece.active ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transform: removingId === piece.id
                      ? `translate${piece.dir === "up" ? "Y" : piece.dir === "down" ? "Y" : piece.dir === "left" ? "X" : "X"}(${piece.dir === "up" || piece.dir === "left" ? "-" : ""}180px) scale(0.3)`
                      : shakeId === piece.id ? "translateX(0)" : hintId === piece.id ? "scale(1)" : "none",
                    opacity: removingId === piece.id ? 0 : 1,
                    transition: removingId === piece.id ? "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease" : "none",
                    boxShadow: hintId === piece.id ? "inset 0 0 20px rgba(100,200,255,0.5), 0 0 15px rgba(100,200,255,0.25)" : shakeId === piece.id ? "inset 0 0 20px rgba(255,50,50,0.4)" : "none",
                    borderRadius: 4,
                  }}
                >
                  <ArrowSVG dir={piece.dir} />
                </div>
              );
            })}
            {Array.from(eyePositions).map(key => {
              const [r, c] = key.split(",").map(Number);
              return (
                <div key={`eye-${key}`} style={{
                  gridRow: r + 1, gridColumn: c + 1,
                  aspectRatio: "1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none", zIndex: 15,
                }}>
                  <div style={{
                    width: "40%", paddingBottom: "40%", borderRadius: "50%",
                    background: "radial-gradient(circle at 40% 35%, #fff 10%, #ff6b9d 80%)",
                    boxShadow: "0 0 12px rgba(255,107,157,0.6)",
                    border: "2px solid rgba(255,107,157,0.3)",
                  }} />
                </div>
              );
            })}
            {(() => {
              const keys = Array.from(smilePositions);
              if (keys.length < 2) return null;
              const cells = keys.map(k => k.split(",").map(Number));
              const allC = cells.map(([_, c]) => c);
              const minC = Math.min(...allC);
              const maxC = Math.max(...allC);
              const theRow = cells[0][0];
              const span = maxC - minC + 1;
              return (
                <div key="smile-arc" style={{
                  gridRow: theRow + 1,
                  gridColumn: `${minC + 1} / ${minC + 1 + span}`,
                  width: "100%", height: "100%",
                  display: "flex", alignItems: "flex-end", justifyContent: "center",
                  pointerEvents: "none", zIndex: 15, overflow: "visible",
                  paddingBottom: "5%",
                }}>
                  <svg style={{ display: "block", width: "75%", height: "35%" }}
                    viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M 5 8 Q 50 18 95 8"
                      stroke="rgba(255,107,157,0.5)" strokeWidth={3} fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              );
            })()}
          </div>

          {/* Shake animation overlay */}
          {shakeId && (
            <style>{`
              [data-eid="${shakeId}"] { animation: escape-shake 0.35s ease !important; }
              @keyframes escape-shake {
                0%,100% { transform: translateX(0); }
                20% { transform: translateX(-4px); }
                40% { transform: translateX(4px); }
                60% { transform: translateX(-3px); }
                80% { transform: translateX(3px); }
              }
            `}</style>
          )}

          {/* Hint button */}
          <button
            onClick={() => {
              if (hintsRemaining <= 0 || isAnimating) return;
              setHintsRemaining(prev => prev - 1);
              const hint = puzzle.find(p => {
                if (!p.active) return false;
                return isPathClear(p, puzzle, sizeRef.current);
              });
              if (hint) {
                setHintId(hint.id);
                setTimeout(() => setHintId(null), 2000);
              }
            }}
            disabled={hintsRemaining <= 0}
            style={{
              position: "absolute", bottom: "max(24px, env(safe-area-inset-bottom))", left: "50%",
              transform: "translateX(-50%)", padding: "12px 32px", borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
              color: hintsRemaining > 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
              fontSize: 15, fontWeight: 700, cursor: hintsRemaining > 0 ? "pointer" : "default",
              zIndex: 20, opacity: hintsRemaining > 0 ? 1 : 0.3,
            }}
          >💡 Hint ({hintsRemaining})</button>

          <Watermark />
        </>
      )}

      {/* Success + Message */}
      {phase === "success" && (
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center", position: "relative" }}>
          <Confetti area={headRef.current?.getBoundingClientRect() || null} />

          <div style={{ fontSize: "2.5rem" }}>💖</div>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.8rem,7vw,2.8rem)", background: "linear-gradient(135deg,#ff6b9d,#c44dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Nice Work!</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.875rem,3vw,1rem)", maxWidth: 300 }}>You cleared the way to my heart… now read this.</p>

          {showMessage && (
            <div ref={headRef} style={{
              background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "32px 24px",
              maxWidth: 340, width: "100%", backdropFilter: "blur(20px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)", marginTop: 8,
              animation: "section-fade 0.6s ease",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>💌</div>
              <div style={{ fontSize: "clamp(0.95rem,3.5vw,1.15rem)", fontWeight: 600, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>
                {experience.finalMessage}
              </div>
              {experience.showCreatorName && experience.creatorName && (
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
                  — {experience.creatorName}
                </div>
              )}
              <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", marginBottom: 4, fontWeight: 600 }}>{toneMsg}</div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => { setShowMessage(false); setPhase("opening"); setLives(3); setPiecesRemoved(0); }}
              className="btn-primary-hf" style={{ padding: "12px 32px", borderRadius: 50, border: "none", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#ff6b9d,#c44dff)", color: "#fff", boxShadow: "0 4px 25px rgba(196,77,255,0.3)" }}>
              Replay
            </button>
            {mode !== "generated" && (
              <Link href={`/create/${template.id}`} style={{ padding: "12px 32px", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none" }}>
                Create your own
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Particles */}
      {particles.map(p => <Particles key={p.id} cx={p.cx} cy={p.cy} />)}
    </div>
  );
}
