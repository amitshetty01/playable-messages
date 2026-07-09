"use client";

import { useMemo, useEffect, useState } from "react";

function Stars({ count = 80 }: { count?: number }) {
  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      delay: Math.random() * 4,
      dur: 2 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.5,
    })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0,
            background: `rgba(255,255,255,${s.opacity})`,
            boxShadow: s.size > 1.2 ? `0 0 ${s.size * 2}px rgba(255,255,255,0.3)` : "none",
            animation: `star-twinkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingOrbs() {
  const items = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: 120 + Math.random() * 200,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      delay: Math.random() * 3,
      dur: 12 + Math.random() * 10,
      color: i % 3 === 0 ? "rgba(184,165,255,0.06)"
           : i % 3 === 1 ? "rgba(255,107,157,0.05)"
           : "rgba(151,218,223,0.05)",
    })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map(o => (
        <div
          key={o.id}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: `${o.x}%`,
            top: `${o.y}%`,
            background: `radial-gradient(circle at center, ${o.color}, transparent 70%)`,
            animation: `float-particle ${o.dur}s ease-in-out infinite`,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function FogLayer() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        background: `radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 60%)`,
      }}
    />
  );
}

function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{
        boxShadow: "inset 0 0 200px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.3)",
      }}
    />
  );
}

type Props = {
  intensity?: "full" | "reduced";
};

export function CinematicAmbient({ intensity = "full" }: Props) {
  return (
    <>
      <Stars count={intensity === "full" ? 80 : 40} />
      <FloatingOrbs />
      <FogLayer />
      {intensity === "full" && <Vignette />}
    </>
  );
}
