"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 80;
const COLORS = ["#e0706a", "#d4b060", "#d4a080", "#c9a8cc", "#e85a7a", "#8c5a7c"];

type Particle = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

function spawnParticles(origin: THREE.Vector3): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const speed = 1.5 + Math.random() * 3;
    return {
      pos: origin.clone(),
      vel: new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed + 1,
        Math.cos(phi) * speed,
      ),
      life: 1,
      maxLife: 1 + Math.random() * 1.5,
      size: 0.05 + Math.random() * 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });
}

function Particles({ particles }: { particles: Particle[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    if (!meshRef.current || particles.length === 0) return;
    const count = Math.min(particles.length, PARTICLE_COUNT);
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.vel.y -= 4.8 * delta;
      p.pos.add(p.vel.clone().multiplyScalar(delta));
      p.life -= delta / p.maxLife;
      dummy.position.copy(p.pos);
      const s = Math.max(0, p.life) * p.size * 20;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, color.set(p.color));
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (particles.length === 0) return null;
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.min(particles.length, PARTICLE_COUNT)]}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}

function EnvelopeBody() {
  const meshRef = useRef<THREE.Mesh>(null);
  const flapRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !flapRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(t * 1.2) * 0.15;
    flapRef.current.position.y = Math.sin(t * 1.2) * 0.15;
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.15]} />
        <meshPhysicalMaterial
          color="#ff6b8a"
          emissive="#ff3b6a"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={flapRef} position={[0, 0.4, 0]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshPhysicalMaterial
          color="#e85a7a"
          emissive="#d0405a"
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.05}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function GlowRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08);
    if (ref.current.material && !Array.isArray(ref.current.material)) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 1.8) * 0.08;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 1.4, 32]} />
      <meshBasicMaterial color="#ff6b8a" transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

function FloatingEnvelopeInner() {
  const [exploded, setExploded] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    document.addEventListener("pointermove", handleMouseMove);
    return () => document.removeEventListener("pointermove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const mx = mouseRef.current.x * 0.3;
    const my = mouseRef.current.y * 0.2;
    groupRef.current.rotation.x += (my - groupRef.current.rotation.x) * delta * 3;
    groupRef.current.rotation.y += (mx - groupRef.current.rotation.y) * delta * 3;
  });

  const handleClick = useCallback(() => {
    if (exploded) return;
    setExploded(true);
    setParticles(spawnParticles(new THREE.Vector3(0, 0, 0)));
    setTimeout(() => setExploded(false), 3000);
  }, [exploded]);

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <EnvelopeBody />
      <GlowRing />
      <Particles particles={particles} />
    </group>
  );
}

export default function FloatingEnvelope({ className }: { className?: string }) {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#c9a8cc" />
      <FloatingEnvelopeInner />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={3} blur={2} far={3} />
    </Canvas>
  );
}
