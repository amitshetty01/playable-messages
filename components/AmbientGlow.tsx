"use client";

import { useState, useEffect, useRef } from "react";

const GLOW_COLORS: Record<string, string> = {
  blush: "246, 177, 201",
  violet: "196, 77, 255",
  neon: "151, 218, 223",
  rose: "255, 107, 157",
  amber: "255, 209, 102",
  emerald: "52, 211, 153",
  sky: "56, 189, 248",
};

export function AmbientGlow() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [color, setColor] = useState("151, 218, 223");
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      // Check for data-glow-color on hovered element or its parents
      const el = (e.target as Element)?.closest("[data-glow-color]");
      if (el) {
        const c = (el as HTMLElement).dataset.glowColor;
        if (c && GLOW_COLORS[c]) setColor(GLOW_COLORS[c]);
      }
    }

    function animate() {
      setPos((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.08,
        y: prev.y + (targetRef.current.y - prev.y) * 0.08,
      }));
      rafRef.current = requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", onMouseMove);
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(${color}, 0.12), transparent 60%)`,
        transition: "background 0.6s ease",
      }}
    />
  );
}
