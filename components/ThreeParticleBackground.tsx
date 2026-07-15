"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 280;

  const [positions, speeds] = useMemo(() => {
    const rng = seededRandom(42);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rng() - 0.5) * 24;
      pos[i * 3 + 1] = (rng() - 0.5) * 24;
      pos[i * 3 + 2] = (rng() - 0.5) * 24;
      spd[i] = 0.008 + rng() * 0.015;
    }
    return [pos, spd];
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    const array = posAttr.array as Float32Array;
    const t = clock.getElapsedTime() * 0.3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3 + 1] += Math.sin(t * speeds[i] + array[i3]) * 0.0015;
      array[i3] += Math.cos(t * speeds[i] * 0.6 + array[i3 + 1]) * 0.0015;
      if (array[i3] > 12) array[i3] = -12;
      if (array[i3] < -12) array[i3] = 12;
      if (array[i3 + 1] > 12) array[i3 + 1] = -12;
      if (array[i3 + 1] < -12) array[i3 + 1] = 12;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        transparent
        opacity={0.35}
        color="#c9a8cc"
        sizeAttenuation
        blending={2}
        depthWrite={false}
      />
    </points>
  );
}

export function ThreeParticleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-50">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
