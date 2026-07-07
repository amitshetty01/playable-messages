"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ParticleBurstProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export function ParticleBurst({ x, y, color, onComplete }: ParticleBurstProps) {
  const particles = useRef<Array<{ id: number; delay: number; size: number; startX: number; startY: number; endX: number; endY: number; }>>([]);
  const count = 15; // Number of particles
  const spread = 80; // How far particles spread

  useEffect(() => {
    particles.current = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2; // Full circle spread
      const distance = Math.random() * spread;
      return {
        id: i,
        delay: Math.random() * 0.1, // Staggered start
        size: Math.random() * 6 + 3, // Particle size
        startX: 0,
        startY: 0,
        endX: Math.cos(angle) * distance,
        endY: Math.sin(angle) * distance,
      };
    });

    const timer = setTimeout(onComplete, 1000); // Remove burst after 1 second
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: color,
            x: x + p.startX, // Start at burst origin
            y: y + p.startY, // Start at burst origin
          }}
          initial={{ opacity: 1, scale: 1, x: x, y: y }}
          animate={{ opacity: 0, scale: 0, x: x + p.endX, y: y + p.endY }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1], // Cinematic ease-out
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}