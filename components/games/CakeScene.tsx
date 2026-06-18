"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const CAKE_RADIUS = 1.2;
const CAKE_HEIGHT = 1.4;
const FROST_RADIUS = 1.25;
const FROST_HEIGHT = 0.15;
const TOP_RADIUS = 0.7;
const TOP_HEIGHT = 0.6;
const CANDLE_HEIGHT = 0.6;

/* ─── Particles ─── */
type Crumb = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

function spawnCrumbs(count: number, origin: THREE.Vector3): Crumb[] {
  const crumbs: Crumb[] = [];
  const colors = ["#ffd166", "#ff8fab", "#ff5fb7", "#f6b1c9", "#fff8f1"];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 1.5;
    crumbs.push({
      pos: origin.clone(),
      vel: new THREE.Vector3(
        Math.cos(theta) * speed * (0.5 + Math.random()),
        1.5 + Math.random() * 2.5,
        Math.sin(theta) * speed * (0.5 + Math.random()),
      ),
      life: 1,
      maxLife: 1.2 + Math.random() * 1.5,
      size: 0.04 + Math.random() * 0.08,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
  return crumbs;
}

function Particles({ crumbs }: { crumbs: Crumb[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = crumbs.length;

  useFrame((_, delta) => {
    if (!meshRef.current || count === 0) return;
    for (let i = 0; i < Math.min(count, 80); i++) {
      const c = crumbs[i];
      c.vel.y -= 5.8 * delta;
      c.pos.add(c.vel.clone().multiplyScalar(delta));
      c.life -= delta / c.maxLife;
      dummy.position.copy(c.pos);
      dummy.scale.setScalar(Math.max(0, c.life) * c.size * 30);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (count === 0) return null;
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, Math.min(count, 80)]}>
      <sphereGeometry args={[0.03, 6, 6]} />
      <meshStandardMaterial color="#ffd166" />
    </instancedMesh>
  );
}

/* ─── Cake half ─── */
function CakeHalf({
  side,
  offsetX,
}: {
  side: "left" | "right";
  offsetX: number;
}) {
  const thetaStart = side === "left" ? Math.PI * 0.5 : Math.PI * 1.5;
  const sign = side === "left" ? -1 : 1;

  const cakeMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f5d6b8",
        roughness: 0.7,
        metalness: 0.0,
      }),
    []
  );
  const frostingMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ff8fab",
        roughness: 0.25,
        metalness: 0.05,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
      }),
    []
  );
  const insideMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e8c8a0",
        roughness: 0.9,
        metalness: 0,
      }),
    []
  );
  const topFrostMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffa0c0",
        roughness: 0.2,
        metalness: 0.02,
        clearcoat: 0.4,
      }),
    []
  );

  return (
    <group position={[sign * offsetX, 0, 0]}>
      {/* Cake body (half cylinder) */}
      <mesh position={[0, CAKE_HEIGHT / 2, 0]} material={cakeMat}>
        <cylinderGeometry args={[CAKE_RADIUS, CAKE_RADIUS, CAKE_HEIGHT, 32, 1, true, thetaStart, Math.PI]} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, CAKE_HEIGHT, 0]} rotation={[0, 0, 0]} material={cakeMat}>
        <circleGeometry args={[CAKE_RADIUS, 32, thetaStart, Math.PI]} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} material={cakeMat}>
        <circleGeometry args={[CAKE_RADIUS, 32, thetaStart, Math.PI]} />
      </mesh>

      {/* Cut face (inside of cake) */}
      <mesh position={[sign * -0.005, CAKE_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={insideMat}>
        <planeGeometry args={[CAKE_RADIUS * 2, CAKE_HEIGHT]} />
      </mesh>

      {/* Frosting ring on bottom tier */}
      <mesh position={[0, CAKE_HEIGHT - FROST_HEIGHT / 2, 0]} material={frostingMat}>
        <torusGeometry args={[CAKE_RADIUS, FROST_HEIGHT * 0.6, 8, 32, Math.PI]} />
      </mesh>

      {/* Top tier */}
      <mesh position={[0, CAKE_HEIGHT + 0.05, 0]}>
        <cylinderGeometry args={[TOP_RADIUS, TOP_RADIUS, TOP_HEIGHT, 24, 1, true, thetaStart, Math.PI]} />
        <meshPhysicalMaterial color="#f0d0b0" roughness={0.7} />
      </mesh>
      {/* Top tier top cap */}
      <mesh position={[0, CAKE_HEIGHT + TOP_HEIGHT + 0.05, 0]} material={cakeMat}>
        <circleGeometry args={[TOP_RADIUS, 24, thetaStart, Math.PI]} />
      </mesh>
      {/* Top tier cut face */}
      <mesh position={[sign * -0.005, CAKE_HEIGHT + TOP_HEIGHT / 2 + 0.05, 0]} rotation={[0, Math.PI / 2, 0]} material={insideMat}>
        <planeGeometry args={[TOP_RADIUS * 2, TOP_HEIGHT]} />
      </mesh>

      {/* Top frosting drip */}
      <mesh position={[0, CAKE_HEIGHT + TOP_HEIGHT + 0.1, 0]} material={topFrostMat}>
        <cylinderGeometry args={[TOP_RADIUS + 0.04, TOP_RADIUS + 0.04, 0.06, 24, 1, true, thetaStart, Math.PI]} />
      </mesh>
      <mesh position={[0, CAKE_HEIGHT + TOP_HEIGHT + 0.1, 0]} material={topFrostMat}>
        <circleGeometry args={[TOP_RADIUS + 0.04, 24, thetaStart, Math.PI]} />
      </mesh>

      {/* Candle on left half only */}
      {side === "left" && (
        <Candle y={CAKE_HEIGHT + TOP_HEIGHT + 0.2} />
      )}
    </group>
  );
}

/* ─── Candle ─── */
function Candle({ y }: { y: number }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!flameRef.current) return;
    const t = clock.getElapsedTime();
    flameRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.08);
    flameRef.current.position.y = y + 0.35 + Math.sin(t * 6) * 0.02;
  });

  return (
    <group position={[0.2, 0, 0.2]}>
      <mesh position={[0, y + 0.15, 0]}>
        <cylinderGeometry args={[0.05, 0.05, CANDLE_HEIGHT, 8]} />
        <meshPhysicalMaterial color="#fff8f1" roughness={0.8} />
      </mesh>
      <mesh position={[0, y + 0.5, 0]} ref={flameRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff8c00" emissive="#ff6600" emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, y + 0.5, 0]} intensity={0.4} color="#ff8c00" distance={3} />
    </group>
  );
}

/* ─── Knife ─── */
function Knife({ x, active }: { x: number; active: boolean }) {
  return (
    <group position={[x, 1.2, CAKE_RADIUS + 0.3]}>
      {/* Blade */}
      <mesh rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.02, 0.6, 0.25]} />
        <meshPhysicalMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>
      {/* Handle */}
      <mesh position={[0, -0.4, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.08]} />
        <meshPhysicalMaterial color="#4a3520" roughness={0.8} metalness={0} />
      </mesh>
      {/* Glow when active */}
      {active && (
        <mesh rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.04, 0.6, 0.28]} />
          <meshBasicMaterial color="#ffd166" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}

/* ─── Plate ─── */
function Plate() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <ringGeometry args={[CAKE_RADIUS + 0.2, CAKE_RADIUS + 0.7, 32]} />
      <meshPhysicalMaterial color="#f0f0f0" roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

/* ─── Main Scene ─── */
export function CakeScene({ cut, onCut }: { cut: boolean; onCut: () => void }) {
  const [offsetX, setOffsetX] = useState(0);
  const [knifeX, setKnifeX] = useState(0);
  const [knifeActive, setKnifeActive] = useState(false);
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const pointerDownRef = useRef(false);
  const cutTriggeredRef = useRef(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handlePointerDown = useCallback(() => {
    if (cut) return;
    pointerDownRef.current = true;
    setKnifeActive(true);
  }, [cut]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerDownRef.current || cut) return;
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      setKnifeX(Math.max(-0.9, Math.min(0.9, x)));

      if (Math.abs(x) < 0.15 && !cutTriggeredRef.current) {
        cutTriggeredRef.current = true;
        setKnifeActive(false);
        pointerDownRef.current = false;
        onCut();

        const origin = new THREE.Vector3(0, CAKE_HEIGHT * 0.6, 0);
        setCrumbs(spawnCrumbs(30, origin));
        timerRefs.current.push(setTimeout(() => setCrumbs(spawnCrumbs(40, origin)), 200));
        timerRefs.current.push(setTimeout(() => setCrumbs(spawnCrumbs(25, origin)), 450));
        const target = 1.8;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const t = Math.min(elapsed / 800, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setOffsetX(eased * target);
          if (t < 1) animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
      }
    },
    [cut, onCut]
  );

  const handlePointerUp = useCallback(() => {
    pointerDownRef.current = false;
    setKnifeActive(false);
  }, []);

  return (
    <div
      className="h-full w-full touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        camera={{ position: [2.2, 2.8, 4.5], fov: 38 }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <directionalLight position={[-2, 1, -3]} intensity={0.3} color="#b8a5ff" />
        <hemisphereLight args={["#ffd166", "#b8a5ff", 0.25]} />

        <group position={[0, 0.2, 0]}>
          <CakeHalf side="left" offsetX={cut ? offsetX : 0} />
          <CakeHalf side="right" offsetX={cut ? offsetX : 0} />
          <Plate />
          {!cut && <Knife x={knifeX} active={knifeActive} />}
        </group>

        <Particles crumbs={crumbs} />

        <ContactShadows
          position={[0, -0.25, 0]}
          opacity={0.4}
          scale={5}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}
