"use client";

/* eslint-disable react-hooks/purity -- intentional randomness for procedural 3D preview */

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Float, PerformanceMonitor, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

import { ModelSlot } from "./ModelSlot";
import type { ChestStatus, CreatureId, GamePhase, InteractionPulses, NearbyTarget, SwimControlsRef } from "./types";
import { CLUE_TARGETS, TEMPLE_TARGET, CHEST_TARGET, PLAYER_START, REQUIRED_CLUES } from "./world";

interface OceanSceneProps {
  phase: GamePhase;
  controlsRef: SwimControlsRef;
  clues: CreatureId[];
  interactionPulses: InteractionPulses;
  chestStatus: ChestStatus;
  wrongPulse: number;
  revealMessage: string;
  onPhaseChange: (phase: GamePhase) => void;
  onTargetChange: (target: NearbyTarget | null) => void;
}

const PLAYER_SPEED = 4.6;
const BOOST_MULTIPLIER = 2.3;
const DIVE_DURATION = 3.8;
const DEPTH_MIN = -1.8;
const DEPTH_MAX = -38;
const FAR_LIMIT = 200;

type PhaseRef = { current: GamePhase };

function useInteractTargets(clues: CreatureId[], chestStatus: ChestStatus) {
  return useMemo(() => {
    const targets: NearbyTarget[] = [];
    const allCollected = REQUIRED_CLUES.every((id) => clues.includes(id));

    for (const t of CLUE_TARGETS) {
      targets.push({
        ...t,
        distance: Infinity,
        disabled: clues.includes(t.id as CreatureId),
      });
    }

    targets.push({
      ...TEMPLE_TARGET,
      distance: Infinity,
      disabled: !allCollected,
    });

    if (allCollected && chestStatus === "sealed") {
      targets.push({
        ...CHEST_TARGET,
        distance: Infinity,
        disabled: false,
      });
    }

    return targets;
  }, [clues, chestStatus]);
}

function distanceToTarget(player: THREE.Vector3, target: { position: [number, number, number] }): number {
  return player.distanceTo(new THREE.Vector3(...target.position));
}

function CameraRig({
  controlsRef,
  phase,
  phaseRef,
  onPhaseChange,
  onTargetChange,
  clues,
  chestStatus,
}: {
  controlsRef: SwimControlsRef;
  phase: GamePhase;
  phaseRef: PhaseRef;
  onPhaseChange: (p: GamePhase) => void;
  onTargetChange: (t: NearbyTarget | null) => void;
  clues: CreatureId[];
  chestStatus: ChestStatus;
}) {
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3(...PLAYER_START));
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const diveStart = useRef(0);
  const targetList = useInteractTargets(clues, chestStatus);
  const frameCount = useRef(0);

  useEffect(() => {
    if (phase === "dive") {
      diveStart.current = performance.now();
    }
  }, [phase]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const currentPhase = phaseRef.current;
    const controls = controlsRef.current;

    if (currentPhase === "surface") {
      const t = performance.now() * 0.00012;
      const radius = 8;
      pos.current.set(Math.sin(t) * radius, -3, Math.cos(t) * radius + 2);
      camera.position.copy(pos.current);
      camera.lookAt(0, -3, 0);
      onTargetChange(null);
      return;
    }

    if (currentPhase === "dive") {
      const elapsed = (performance.now() - diveStart.current) / 1000;
      const progress = Math.min(elapsed / DIVE_DURATION, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const start = new THREE.Vector3(0, -2, 6);
      const end = new THREE.Vector3(...PLAYER_START);
      pos.current.lerpVectors(start, end, eased);
      camera.position.copy(pos.current);

      const lookTarget = new THREE.Vector3(0, -12, 0);
      camera.lookAt(lookTarget);

      if (progress >= 1) {
        onPhaseChange("explore");
      }
      onTargetChange(null);
      return;
    }

    if (currentPhase === "password" || currentPhase === "reveal") {
      if (currentPhase === "reveal") {
        const t = performance.now() * 0.00006;
        pos.current.y += Math.sin(t) * 0.006;
      }
      camera.position.copy(pos.current);

      const euler = new THREE.Euler(0, 0, 0, "YXZ");
      euler.set(controls.pitch, controls.yaw, 0);
      const dir = new THREE.Vector3(0, 0, -1).applyEuler(euler);
      const lookTarget = pos.current.clone().add(dir);
      camera.lookAt(lookTarget);
      return;
    }

    const forward = new THREE.Vector3(0, 0, -1);
    const euler = new THREE.Euler(0, 0, 0, "YXZ");
    euler.set(controls.pitch, controls.yaw, 0);
    forward.applyEuler(euler);

    const right = new THREE.Vector3(1, 0, 0).applyEuler(euler);
    const up = new THREE.Vector3(0, 1, 0);

    const boost = controls.boost ? BOOST_MULTIPLIER : 1;
    const speed = PLAYER_SPEED * boost;
    const accel = speed * dt;

    vel.current.addScaledVector(forward, controls.forward * accel);
    vel.current.addScaledVector(right, controls.strafe * accel * 0.7);
    vel.current.addScaledVector(up, controls.vertical * accel * 0.6);

    const damping = 1 - (controls.boost ? 5.5 : 3.5) * dt;
    vel.current.multiplyScalar(Math.max(0, damping));

    const maxV = controls.boost ? 8 : 4;
    if (vel.current.length() > maxV) vel.current.setLength(maxV);

    pos.current.addScaledVector(vel.current, dt);

    pos.current.y = Math.max(DEPTH_MAX, Math.min(DEPTH_MIN, pos.current.y));
    pos.current.x = Math.max(-FAR_LIMIT, Math.min(FAR_LIMIT, pos.current.x));
    pos.current.z = Math.max(-FAR_LIMIT, Math.min(FAR_LIMIT, pos.current.z));

    camera.position.copy(pos.current);

    const lookTarget = pos.current.clone().add(forward);
    camera.lookAt(lookTarget);

    frameCount.current += 1;
    if (frameCount.current % 6 === 0) {
      let nearest: NearbyTarget | null = null;
      let nearestDist = Infinity;

      for (const t of targetList) {
        const dist = distanceToTarget(pos.current, t);
        if (dist < t.radius && dist < nearestDist) {
          nearest = { ...t, distance: Math.round(dist) };
          nearestDist = dist;
        }
      }

      onTargetChange(nearest);
    }
  });

  return null;
}

function OceanSurface({ phase }: { phase: GamePhase }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position;
    const array = positions.array as Float32Array;
    const count = positions.count;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i += 1) {
      const x = array[i * 3];
      const z = array[i * 3 + 2];
      array[i * 3 + 1] =
        Math.sin(x * 0.3 + time * 0.6) * 0.22 +
        Math.sin(z * 0.25 + time * 0.5 + x * 0.1) * 0.14;
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(80, 80, 64, 64);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geo} visible={phase === "surface"}>
      <meshStandardMaterial
        color="#2a8fbf"
        transparent
        opacity={0.65}
        roughness={0.2}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CliffTerrain() {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 12;
    const d = 8;

    shape.moveTo(-w, 0);
    shape.lineTo(-w * 0.3, d);
    shape.lineTo(w * 0.2, d * 1.1);
    shape.lineTo(w * 0.7, d * 0.4);
    shape.lineTo(w, 0);

    const extrudeSettings = { depth: 0.5, bevelEnabled: true, bevelSize: 0.2, bevelThickness: 0.3 };
    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    g.translate(0, -4, -5);
    g.rotateY(Math.PI * 0.1);
    return g;
  }, []);

  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#7a5a3a" roughness={0.9} flatShading />
    </mesh>
  );
}

function GrassBlades() {
  const count = 320;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 5;
      arr.push([Math.cos(angle) * r, -3 + Math.random() * 0.4, Math.sin(angle) * r - 4]);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const [x, y, z] = positions[i];
      const sway = Math.sin(x * 1.2 + time * 0.8 + i) * 0.12;
      dummy.position.set(x, y, z);
      dummy.rotation.set(sway, Math.atan2(x, z), 0);
      dummy.scale.setScalar(0.5 + Math.random() * 0.6);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.08, 0.5, 4]} />
      <meshStandardMaterial color="#4a8c3a" roughness={0.8} />
    </instancedMesh>
  );
}

function Clouds() {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      child.position.x += delta * (0.15 + i * 0.03);
      if (child.position.x > 40) child.position.x = -40;
    });
  });

  const clouds = useMemo(() => {
    const items: ReactNode[] = [];
    for (let i = 0; i < 5; i += 1) {
      const x = -30 + Math.random() * 60;
      const y = 2 + Math.random() * 3;
      const z = -10 + Math.random() * 20;
      items.push(
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.7 + Math.random() * 0.5, 7, 7]} />
            <meshStandardMaterial color="white" transparent opacity={0.35} roughness={1} />
          </mesh>
          <mesh position={[0.6, 0.05, 0]} scale={[0.9, 0.7, 0.9]}>
            <sphereGeometry args={[0.6, 7, 7]} />
            <meshStandardMaterial color="white" transparent opacity={0.3} roughness={1} />
          </mesh>
          <mesh position={[-0.5, 0.08, 0.3]} scale={[0.8, 0.6, 0.8]}>
            <sphereGeometry args={[0.5, 7, 7]} />
            <meshStandardMaterial color="white" transparent opacity={0.25} roughness={1} />
          </mesh>
        </group>
      );
    }
    return items;
  }, []);

  return <group ref={ref}>{clouds}</group>;
}

function WindParticles() {
  const count = 80;
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 50;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] += delta * (0.5 + (i % 3) * 0.2);
      if (positions[i * 3] > 25) positions[i * 3] = -25;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#aaccff" size={0.08} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function SurfaceWorld({ phase }: { phase: GamePhase }) {
  const visible = phase === "surface" || phase === "dive";
  if (!visible) return null;

  return (
    <group>
      <OceanSurface phase={phase} />
      <CliffTerrain />
      <GrassBlades />
      <Clouds />
      <WindParticles />
      <ambientLight intensity={0.9} color="#ddeeff" />
      <directionalLight position={[10, 14, 6]} intensity={2.5} color="#ffe8cc" castShadow />
    </group>
  );
}

function WaterVolume() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial
        color="#0a2a4a"
        transparent
        opacity={0.25}
        roughness={0.1}
        metalness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function OceanFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, DEPTH_MAX, 0]}>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color="#5b6651" roughness={0.92} metalness={0.03} />
    </mesh>
  );
}

function UnderwaterBackdrop() {
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uTop: { value: new THREE.Color("#3ba2d8") },
      uMid: { value: new THREE.Color("#07436d") },
      uDeep: { value: new THREE.Color("#010816") },
    },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uTop;
      uniform vec3 uMid;
      uniform vec3 uDeep;
      varying vec3 vPos;
      void main() {
        float h = clamp(vPos.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 col = mix(uDeep, uMid, smoothstep(0.08, 0.62, h));
        col = mix(col, uTop, smoothstep(0.62, 1.0, h));
        float sun = pow(max(dot(normalize(vPos), normalize(vec3(-0.2, 0.9, 0.35))), 0.0), 16.0);
        float pulse = 0.025 * sin(uTime * 0.25 + vPos.x * 6.0 + vPos.z * 4.0);
        gl_FragColor = vec4(col + sun * vec3(0.18, 0.32, 0.45) + pulse, 1.0);
      }
    `,
  }), []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime; // eslint-disable-line react-hooks/immutability
  });

  return (
    <mesh scale={[220, 220, 220]} frustumCulled={false}>
      <sphereGeometry args={[1, 48, 24]} />
      <primitive attach="material" object={material} />
    </mesh>
  );
}

function CausticBands() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      child.position.x = Math.sin(time * 0.18 + i) * 10;
      child.rotation.z = Math.sin(time * 0.12 + i * 0.7) * 0.08;
    });
  });

  return (
    <group ref={ref} position={[0, -8, -45]}>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={i} position={[-36 + i * 9, 0, -10 + (i % 3) * 8]} rotation={[-0.9, 0.15, 0.25]}>
          <planeGeometry args={[2.6, 34]} />
          <meshBasicMaterial
            color="#b9f3ff"
            transparent
            opacity={0.055}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function LandmarkBeacons({ clues, allCluesCollected }: { clues: CreatureId[]; allCluesCollected: boolean }) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.children.forEach((child, i) => {
      child.rotation.y = state.clock.elapsedTime * (0.18 + i * 0.01);
      child.position.y += Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.0015;
    });
  });

  return (
    <group ref={ringRef}>
      {CLUE_TARGETS.map((target, i) => {
        const collected = clues.includes(target.id as CreatureId);
        const color = collected ? "#ffd76a" : "#62e6ff";
        return (
          <group key={target.id} position={target.position}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.05, 0.025, 8, 48]} />
              <meshBasicMaterial color={color} transparent opacity={collected ? 0.75 : 0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]} scale={0.62}>
              <torusGeometry args={[1.05, 0.018, 8, 48]} />
              <meshBasicMaterial color={color} transparent opacity={collected ? 0.52 : 0.24} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <pointLight color={color} intensity={collected ? 0.85 : 0.35} distance={12} decay={1.5} />
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[collected ? 0.18 : 0.12, 12, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.82} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            {!collected && Array.from({ length: i + 1 }).map((_, dot) => (
              <mesh key={dot} position={[Math.sin((dot / (i + 1)) * Math.PI * 2) * 0.32, 1.2, Math.cos((dot / (i + 1)) * Math.PI * 2) * 0.32]}>
                <sphereGeometry args={[0.04, 8, 6]} />
                <meshBasicMaterial color={color} transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} />
              </mesh>
            ))}
          </group>
        );
      })}

      <group position={TEMPLE_TARGET.position}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={allCluesCollected ? 1.4 : 1}>
          <torusGeometry args={[4.7, 0.05, 12, 96]} />
          <meshBasicMaterial color={allCluesCollected ? "#8ef5ff" : "#244a67"} transparent opacity={allCluesCollected ? 0.7 : 0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {allCluesCollected && <pointLight color="#8ef5ff" intensity={1.6} distance={26} decay={1.4} />}
      </group>
    </group>
  );
}

function SeaweedForest() {
  const count = 420;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const arr: { x: number; z: number; height: number; phase: number }[] = [];
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = 8 + Math.random() * 82;
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        height: 0.9 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const d = data[i];
      const sway = Math.sin(d.phase + time * 0.6) * 0.15;
      dummy.position.set(d.x, DEPTH_MAX + d.height * 0.5, d.z);
      dummy.rotation.set(sway, Math.atan2(d.x, d.z), 0);
      dummy.scale.set(0.75, d.height, 0.75);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.18, 1, 2, 6]} />
      <meshStandardMaterial color="#2f8d65" emissive="#06351f" emissiveIntensity={0.2} roughness={0.62} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function CoralForest() {
  const count = 220;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const arr: { x: number; z: number; color: string; scale: number }[] = [];
    const colors = ["#ff6f91", "#ff9671", "#ffc75f", "#00c9a7", "#7dd3fc", "#c084fc"];
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 72;
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        color: colors[i % colors.length],
        scale: 0.35 + Math.random() * 1.05,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const d = data[i];
      const sway = Math.sin(time * 0.4 + i) * 0.06;
      dummy.position.set(d.x, DEPTH_MAX + d.scale * 0.3, d.z);
      dummy.rotation.set(sway, Math.atan2(d.x, d.z) + 0.3, 0);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
      ref.current.setColorAt(i, new THREE.Color(d.color));
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.42, 1]} />
      <meshStandardMaterial vertexColors emissive="#081b24" emissiveIntensity={0.18} roughness={0.36} metalness={0.02} />
    </instancedMesh>
  );
}

function HeroReefClusters() {
  const clusters = useMemo(() => {
    const colors = ["#ff6f91", "#ff9671", "#ffc75f", "#00c9a7", "#7dd3fc", "#c084fc"];
    return Array.from({ length: 24 }).map((_, i) => {
      const lane = i % 4;
      const z = -18 - i * 5.2;
      const x = [-18, -7, 9, 21][lane] + (Math.random() - 0.5) * 5;
      return {
        x,
        z,
        scale: 0.8 + Math.random() * 0.9,
        color: colors[i % colors.length],
        accent: colors[(i + 2) % colors.length],
      };
    });
  }, []);

  return (
    <group>
      {clusters.map((cluster, i) => (
        <group key={i} position={[cluster.x, DEPTH_MAX + 0.25, cluster.z]} scale={cluster.scale} rotation={[0, i * 0.37, 0]}>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.85, 14, 8]} />
            <meshStandardMaterial color={cluster.color} emissive={cluster.color} emissiveIntensity={0.09} roughness={0.55} />
          </mesh>
          {Array.from({ length: 5 }).map((_, branch) => (
            <mesh
              key={branch}
              position={[Math.sin(branch * 1.26) * 0.75, 0.75 + branch * 0.05, Math.cos(branch * 1.26) * 0.75]}
              rotation={[0.45 + branch * 0.08, branch * 1.26, 0.28]}
            >
              <cylinderGeometry args={[0.08, 0.16, 1.05, 8]} />
              <meshStandardMaterial color={branch % 2 ? cluster.accent : cluster.color} emissive={branch % 2 ? cluster.accent : cluster.color} emissiveIntensity={0.08} roughness={0.5} />
            </mesh>
          ))}
          {Array.from({ length: 4 }).map((_, bulb) => (
            <mesh key={bulb} position={[Math.sin(bulb * 1.57) * 0.55, 1.25, Math.cos(bulb * 1.57) * 0.55]}>
              <sphereGeometry args={[0.18, 10, 6]} />
              <meshStandardMaterial color="#fff3b0" emissive="#ffbf4d" emissiveIntensity={0.18} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function RockFormations() {
  const count = 45;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const arr: { x: number; z: number; scale: number }[] = [];
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const r = 15 + Math.random() * 55;
      arr.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        scale: 0.6 + Math.random() * 1.4,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const d = data[i];
      const sway = Math.sin(time * 0.2 + i * 0.5) * 0.03;
      dummy.position.set(d.x, DEPTH_MAX + d.scale * 0.3, d.z);
      dummy.rotation.set(sway, Math.atan2(d.x, d.z), 0);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial color="#5a5a6a" roughness={0.8} flatShading />
    </instancedMesh>
  );
}

function AncientRuins() {
  return (
    <group position={[20, DEPTH_MAX + 0.4, -30]} rotation={[0, -0.55, 0]}>
      {[-2.8, -0.9, 1.2, 3.1].map((x, i) => (
        <mesh key={i} position={[x, 1.25 + (i % 2) * 0.25, 0]} rotation={[0.06 * i, 0, i === 3 ? 0.22 : 0]}>
          <cylinderGeometry args={[0.28, 0.38, 2.7 - i * 0.25, 14]} />
          <meshStandardMaterial color="#8b8d92" roughness={0.88} metalness={0.02} />
        </mesh>
      ))}
      <mesh position={[0.1, 2.7, 0]} rotation={[0, 0, -0.05]}>
        <torusGeometry args={[2.15, 0.18, 12, 48, Math.PI]} />
        <meshStandardMaterial color="#9a9ca3" roughness={0.82} />
      </mesh>
      <mesh position={[0.2, 0.1, 1.2]} rotation={[0.05, -0.35, 0.12]}>
        <boxGeometry args={[4.8, 0.28, 1.1]} />
        <meshStandardMaterial color="#6f737d" roughness={0.94} />
      </mesh>
      <mesh position={[-2.9, 0.2, -1.2]} rotation={[0.2, 0.3, -0.18]}>
        <boxGeometry args={[1.6, 0.36, 0.9]} />
        <meshStandardMaterial color="#747783" roughness={0.96} />
      </mesh>
      <pointLight position={[0, 1.8, 0.8]} color="#69dfff" intensity={0.28} distance={10} />
    </group>
  );
}

function Shipwreck() {
  return (
    <group position={[-25, DEPTH_MAX + 0.7, -60]} rotation={[0.18, -0.7, 0.25]}>
      <mesh position={[0, 0.45, 0]} scale={[1, 0.45, 0.55]}>
        <sphereGeometry args={[2.3, 18, 8]} />
        <meshStandardMaterial color="#5b3828" roughness={0.9} metalness={0.04} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-1.8 + i * 0.6, 0.9, 0]} rotation={[0, 0, 0.2 - i * 0.05]}>
          <boxGeometry args={[0.07, 1.1, 1.8]} />
          <meshStandardMaterial color="#3f291f" roughness={0.92} />
        </mesh>
      ))}
      <mesh position={[0.4, 1.8, -0.1]} rotation={[0.1, 0, 0.12]}>
        <cylinderGeometry args={[0.08, 0.12, 2.8, 8]} />
        <meshStandardMaterial color="#3e2c23" roughness={0.9} />
      </mesh>
      <mesh position={[0.8, 2.2, 0.35]} rotation={[0.1, 0.08, -0.2]}>
        <planeGeometry args={[1.3, 1.1]} />
        <meshStandardMaterial color="#7a6b55" transparent opacity={0.35} roughness={0.86} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 1.1, 0.9]} color="#f0a24a" intensity={0.22} distance={8} />
    </group>
  );
}

function VolcanicVent() {
  const ref = useRef<THREE.Points>(null);
  const count = 30;
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      positions[i * 3 + 1] += delta * 0.3;
      if (positions[i * 3 + 1] > 3) positions[i * 3 + 1] = 0;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={[8, DEPTH_MAX, -20]}>
      <mesh>
        <coneGeometry args={[0.4, 0.6, 6]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>
      <points ref={ref} geometry={geo}>
        <pointsMaterial color="#ff6633" size={0.08} transparent opacity={0.5} sizeAttenuation />
      </points>
    </group>
  );
}

function FishSchool({ id }: { id: string }) {
  const count = 18;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offset = useMemo(() => Math.random() * 100, []);

  const basePos = useMemo(() => {
    if (id === "school1") return new THREE.Vector3(-10, -10, -15);
    if (id === "school2") return new THREE.Vector3(15, -14, -30);
    return new THREE.Vector3(-5, -18, -50);
  }, [id]);

  const positions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < count; i += 1) {
      arr.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 4
        )
      );
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime + offset;
    const cx = Math.sin(time * 0.2) * 8;
    const cz = Math.cos(time * 0.25) * 8;
    const cy = Math.sin(time * 0.15) * 2;

    for (let i = 0; i < count; i += 1) {
      const p = positions[i];
      const t = time + i * 0.1;
      const px = cx + p.x + Math.sin(t * 0.5) * 0.3;
      const pz = cz + p.z + Math.cos(t * 0.6) * 0.3;
      const py = basePos.y + cy + p.y + Math.sin(t * 0.4) * 0.2;
      dummy.position.set(px, py, pz);
      dummy.rotation.set(0, Math.atan2(-Math.sin(time * 0.2), -Math.cos(time * 0.25)), Math.sin(t) * 0.1);
      dummy.scale.setScalar(0.12);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  const fishGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const verts = new Float32Array([
      -0.1, 0, 0.15,
      0.1, 0, 0.15,
      0, 0, -0.15,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    g.setIndex([0, 1, 2]);
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <instancedMesh ref={ref} args={[fishGeo, undefined, count]}>
      <meshStandardMaterial color="#88ccdd" roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function TurtleModel({ pulse }: { pulse: number }) {
  const ref = useRef<THREE.Group>(null);
  const targetRef = useRef<THREE.Vector3>(new THREE.Vector3(-28, -9, -20));
  const pulseCount = useRef(0);

  useEffect(() => {
    if (pulse > pulseCount.current) {
      pulseCount.current = pulse;
      targetRef.current.set(-20, -12, -10);
    }
  }, [pulse]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const current = ref.current.position;
    const target = targetRef.current;
    current.lerp(target, 0.008);
    ref.current.rotation.y = Math.atan2(-current.x, -current.z) + Math.sin(t * 0.3) * 0.1;
    ref.current.position.y += Math.sin(t * 0.5) * 0.003;
  });

  return (
    <ModelSlot assetKey="turtle">
      <group ref={ref} position={[-28, -9, -20]}>
        <mesh rotation={[0, 0.3, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#3a6a3a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.2, 0.5]} scale={[0.8, 0.2, 0.6]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#4a7a4a" roughness={0.7} />
        </mesh>
        <mesh position={[0.5, 0, 0.2]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 4]} />
          <meshStandardMaterial color="#3a6a3a" roughness={0.6} />
        </mesh>
        <mesh position={[-0.5, 0, 0.2]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 4]} />
          <meshStandardMaterial color="#3a6a3a" roughness={0.6} />
        </mesh>
      </group>
    </ModelSlot>
  );
}

function DolphinModel({ pulse }: { pulse: number }) {
  const ref = useRef<THREE.Group>(null);
  const orbitCenter = useRef(new THREE.Vector3(0, -10, -30));
  const pulseCount = useRef(0);

  useEffect(() => {
    if (pulse > pulseCount.current) {
      pulseCount.current = pulse;
    }
  }, [pulse]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const r = 6;
    ref.current.position.set(
      orbitCenter.current.x + Math.sin(t * 0.3) * r,
      orbitCenter.current.y + Math.sin(t * 0.2) * 2,
      orbitCenter.current.z + Math.cos(t * 0.3) * r
    );
    ref.current.rotation.y = -t * 0.3 + Math.PI / 2;
    ref.current.rotation.z = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <ModelSlot assetKey="dolphin">
      <group ref={ref}>
        {[-0.9, 0, 0.85].map((offset, i) => (
          <group key={i} position={[offset, Math.sin(i) * 0.35, i * -0.65]} scale={i === 1 ? 1 : 0.72}>
            <mesh scale={[1.35, 0.42, 0.48]}>
              <sphereGeometry args={[0.52, 18, 10]} />
              <meshStandardMaterial color="#5f8db3" roughness={0.32} metalness={0.08} />
            </mesh>
            <mesh position={[0, 0.08, 0.55]} scale={[0.35, 0.2, 0.62]}>
              <sphereGeometry args={[0.48, 14, 8]} />
              <meshStandardMaterial color="#7fb3d5" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.42, -0.05]} rotation={[0.25, 0, 0]} scale={[0.35, 0.18, 0.45]}>
              <coneGeometry args={[0.45, 0.7, 3]} />
              <meshStandardMaterial color="#406f95" roughness={0.36} />
            </mesh>
            <mesh position={[0, 0, -0.78]} rotation={[Math.PI / 2, 0, 0]} scale={[0.65, 0.32, 0.35]}>
              <coneGeometry args={[0.45, 0.8, 4]} />
              <meshStandardMaterial color="#47789f" roughness={0.34} />
            </mesh>
          </group>
        ))}
      </group>
    </ModelSlot>
  );
}

function JellyfishModel({ pulse }: { pulse: number }) {
  const ref = useRef<THREE.Group>(null);
  const pulseCount = useRef(0);
  const glowRef = useRef<THREE.Mesh>(null);
  const glowIntensity = useRef(0.3);

  useEffect(() => {
    if (pulse > pulseCount.current) {
      pulseCount.current = pulse;
      glowIntensity.current = 1.0;
    }
  }, [pulse]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = -16 + Math.sin(t * 0.4) * 1.5;
    ref.current.rotation.y = t * 0.05;

    glowIntensity.current += (0.3 - glowIntensity.current) * 0.02;
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = glowIntensity.current;
    }
  });

  return (
    <ModelSlot assetKey="jellyfish">
      <group ref={ref} position={[30, -16, -38]}>
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.6, 12, 8]} />
          <meshStandardMaterial
            color="#88ddff"
            emissive="#44aaff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
            roughness={0.1}
          />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin((i / 6) * Math.PI * 2) * 0.4,
              -0.4 - Math.random() * 0.3,
              Math.cos((i / 6) * Math.PI * 2) * 0.4,
            ]}
          >
            <cylinderGeometry args={[0.01, 0.03, 0.4 + Math.random() * 0.3, 4]} />
            <meshStandardMaterial color="#88ddff" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </ModelSlot>
  );
}

function OctopusModel({ pulse }: { pulse: number }) {
  const ref = useRef<THREE.Group>(null);
  const pulseCount = useRef(0);
  const moved = useRef(false);

  useEffect(() => {
    if (pulse > pulseCount.current) {
      pulseCount.current = pulse;
      moved.current = true;
    }
  }, [pulse]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    if (moved.current) {
      ref.current.position.y += (6 - ref.current.position.y) * 0.01;
      ref.current.position.x += (-28 - ref.current.position.x) * 0.01;
      ref.current.position.z += (-70 - ref.current.position.z) * 0.01;
    }

    ref.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    ref.current.position.y += Math.sin(t * 0.3) * 0.003;
  });

  return (
    <ModelSlot assetKey="octopus">
      <group ref={ref} position={[-34, -20, -78]}>
        <mesh>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color="#8a4a5a" roughness={0.6} />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin((i / 5) * Math.PI * 2) * 0.4,
              -0.3,
              Math.cos((i / 5) * Math.PI * 2) * 0.4,
            ]}
            rotation={[0.3, 0, (i / 5) * Math.PI * 2]}
          >
            <cylinderGeometry args={[0.03, 0.05, 0.5, 4]} />
            <meshStandardMaterial color="#7a3a4a" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </ModelSlot>
  );
}

function WhaleModel({ pulse }: { pulse: number }) {
  const ref = useRef<THREE.Group>(null);
  const pulseCount = useRef(0);
  const entranceDone = useRef(false);

  useEffect(() => {
    if (pulse > pulseCount.current) {
      pulseCount.current = pulse;
    }
  }, [pulse]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    if (!entranceDone.current) {
      entranceDone.current = true;
      ref.current.position.set(60, -24, -80);
    }

    const targetX = 42 + Math.sin(t * 0.02) * 5;
    const targetZ = -106 + Math.cos(t * 0.03) * 5;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.005;
    ref.current.position.z += (targetZ - ref.current.position.z) * 0.005;
    ref.current.position.y = -24 + Math.sin(t * 0.05) * 0.5;
    ref.current.rotation.y = Math.atan2(-ref.current.position.x, -ref.current.position.z);
  });

  return (
    <ModelSlot assetKey="whale">
      <group ref={ref} scale={1.8}>
        <mesh scale={[2.4, 0.72, 0.95]}>
          <sphereGeometry args={[1.05, 24, 14]} />
          <meshStandardMaterial color="#273b5d" roughness={0.48} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.08, 1.08]} scale={[1.0, 0.45, 0.72]}>
          <sphereGeometry args={[0.9, 18, 10]} />
          <meshStandardMaterial color="#3d5476" roughness={0.46} />
        </mesh>
        <mesh position={[0, -0.08, -1.7]} rotation={[Math.PI / 2, 0, 0]} scale={[1.15, 0.34, 0.5]}>
          <coneGeometry args={[0.8, 1.25, 4]} />
          <meshStandardMaterial color="#213452" roughness={0.48} />
        </mesh>
        <mesh position={[0, -0.25, 0.05]} rotation={[Math.PI / 2, 0, 0]} scale={[1.7, 0.08, 0.42]}>
          <cylinderGeometry args={[0.45, 0.45, 1.6, 18]} />
          <meshStandardMaterial color="#dbeafe" transparent opacity={0.28} roughness={0.42} />
        </mesh>
        <pointLight position={[0, 0.2, 0]} color="#6aaeff" intensity={0.55} distance={16} />
      </group>
    </ModelSlot>
  );
}

function AmbientMantas() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      child.position.x = Math.sin(time * 0.12 + i * 2.1) * 18;
      child.position.z = -48 - i * 20 + Math.cos(time * 0.1 + i) * 7;
      child.position.y = -15 - i * 2 + Math.sin(time * 0.22 + i) * 1.5;
      child.rotation.y = Math.sin(time * 0.12 + i) * 0.7;
      child.rotation.z = Math.sin(time * 0.9 + i) * 0.08;
    });
  });

  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <group key={i} scale={1.2 - i * 0.16}>
          <mesh scale={[1.7, 0.08, 0.75]}>
            <sphereGeometry args={[0.75, 18, 8]} />
            <meshStandardMaterial color="#456b83" roughness={0.38} metalness={0.06} />
          </mesh>
          <mesh position={[-1.2, 0, 0]} rotation={[0, 0, -0.18]} scale={[1.55, 0.03, 0.5]}>
            <coneGeometry args={[0.65, 1.4, 3]} />
            <meshStandardMaterial color="#567e92" roughness={0.36} />
          </mesh>
          <mesh position={[1.2, 0, 0]} rotation={[0, 0, 0.18]} scale={[1.55, 0.03, 0.5]}>
            <coneGeometry args={[0.65, 1.4, 3]} />
            <meshStandardMaterial color="#567e92" roughness={0.36} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Temple({ allCluesCollected }: { allCluesCollected: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null);
  const doorRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!glowRef.current) return;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    const opacity = allCluesCollected ? 0.34 : 0.13;
    mat.opacity += (opacity - mat.opacity) * 0.025;

    if (doorRef.current && allCluesCollected) {
      doorRef.current.position.y += (-1.1 - doorRef.current.position.y) * 0.018;
    }
  });

  return (
    <ModelSlot assetKey="temple">
      <group position={[0, -31, -136]} scale={1.15}>
        <mesh position={[0, -0.15, -0.35]}>
          <boxGeometry args={[11.8, 0.45, 4.2]} />
          <meshStandardMaterial color="#4f5563" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.2, -0.25]}>
          <boxGeometry args={[9.4, 5.9, 0.8]} />
          <meshStandardMaterial color="#596271" roughness={0.86} metalness={0.02} />
        </mesh>
        {[-4.7, -2.8, 2.8, 4.7].map((x, i) => (
          <group key={i} position={[x, 2.55, 0.25]}>
            <mesh>
              <cylinderGeometry args={[0.34, 0.46, 5.6, 18]} />
              <meshStandardMaterial color="#737b89" roughness={0.84} />
            </mesh>
            <mesh position={[0, 2.95, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.28, 18]} />
              <meshStandardMaterial color="#848c9a" roughness={0.8} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 6.2, -0.2]} rotation={[0, 0, 0]}>
          <coneGeometry args={[5.9, 2.0, 3]} />
          <meshStandardMaterial color="#687180" roughness={0.84} />
        </mesh>
        <mesh position={[0, 2.1, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.65, 0.16, 14, 80]} />
          <meshStandardMaterial color="#8b94a5" roughness={0.76} />
        </mesh>
        <mesh ref={doorRef} position={[0, 1.05, 0.34]}>
          <boxGeometry args={[2.55, 3.45, 0.22]} />
          <meshStandardMaterial color="#25354a" emissive="#123a70" emissiveIntensity={allCluesCollected ? 0.35 : 0.05} roughness={0.66} />
        </mesh>
        <mesh ref={glowRef} position={[0, 1.55, 0.48]}>
          <planeGeometry args={[5.7, 4.6]} />
          <meshBasicMaterial
            color="#5fe9ff"
            transparent
            opacity={allCluesCollected ? 0.34 : 0.13}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[-3 + i * 1.5, 4.05, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.02, 8, 32]} />
            <meshBasicMaterial color={allCluesCollected ? "#8ef5ff" : "#2f6c84"} transparent opacity={allCluesCollected ? 0.8 : 0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
        <Float speed={0.85} floatIntensity={0.45}>
          {allCluesCollected && Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} position={[2.8 * Math.sin((i / 12) * Math.PI * 2), 2.2 + Math.sin(i) * 0.6, 0.75 + 0.3 * Math.cos(i)]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#8ef5ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          ))}
        </Float>
      </group>
    </ModelSlot>
  );
}

function TreasureChest({ status, wrongPulse }: { status: ChestStatus; wrongPulse: number }) {
  const lidRef = useRef<THREE.Group>(null);
  const chainRef = useRef<THREE.Mesh>(null);
  const prevWrong = useRef(0);

  useEffect(() => {
    if (wrongPulse > prevWrong.current) {
      prevWrong.current = wrongPulse;
      if (chainRef.current) {
        const mat = chainRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.8;
        setTimeout(() => { mat.emissiveIntensity = 0; }, 300);
      }
    }
  }, [wrongPulse]);

  useFrame(() => {
    if (!lidRef.current) return;
    const opening = status === "unlocking" || status === "open";
    const targetRot = opening ? -1.2 : 0;
    lidRef.current.rotation.x += (targetRot - lidRef.current.rotation.x) * 0.04;

    if (chainRef.current) {
      const visible = status === "sealed" || status === "wrong" || status === "unlocking";
      chainRef.current.visible = visible;
      if (status === "unlocking") {
        chainRef.current.position.y += (0.5 - chainRef.current.position.y) * 0.05;
      }
    }
  });

  return (
    <ModelSlot assetKey="treasureChest">
      <group position={[0, -27, -149]}>
        <Float speed={0.65} floatIntensity={0.24}>
          <group scale={1.12}>
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[2.45, 0.95, 1.55]} />
              <meshStandardMaterial color="#7a4d24" roughness={0.62} metalness={0.08} />
            </mesh>
            <group ref={lidRef} position={[0, 0.72, -0.58]}>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.55]}>
                <cylinderGeometry args={[0.78, 0.78, 2.48, 18, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#8b5d2c" roughness={0.58} metalness={0.12} />
              </mesh>
            </group>
            {[-0.92, 0, 0.92].map((x) => (
              <mesh key={x} position={[x, 0.36, 0.8]}>
                <boxGeometry args={[0.14, 1.12, 0.12]} />
                <meshStandardMaterial color="#d5a541" emissive="#7a4a08" emissiveIntensity={0.08} metalness={0.55} roughness={0.32} />
              </mesh>
            ))}
            <mesh position={[0, 0.86, 0.8]}>
              <boxGeometry args={[2.7, 0.12, 0.14]} />
              <meshStandardMaterial color="#e1b24d" emissive="#7a4a08" emissiveIntensity={0.08} metalness={0.65} roughness={0.28} />
            </mesh>
            {status !== "open" && (
              <mesh ref={chainRef} position={[0, 0.58, 0.9]} rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 0.72, 1]}>
                <torusGeometry args={[0.42, 0.045, 10, 42]} />
                <meshStandardMaterial
                  color="#aa8844"
                  emissive="#ffaa44"
                  emissiveIntensity={status === "unlocking" ? 0.4 : 0}
                  metalness={0.72}
                  roughness={0.28}
                />
              </mesh>
            )}
            <mesh position={[0, 0.16, 0.86]}>
              <planeGeometry args={[1.5, 0.45]} />
              <meshBasicMaterial color="#ffcf5a" transparent opacity={status === "open" ? 0.9 : 0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh position={[-1.25, 0.38, 0.1]} rotation={[0.1, 0, 0.5]}>
              <torusGeometry args={[0.38, 0.035, 8, 30]} />
              <meshStandardMaterial color="#2f8d65" roughness={0.7} />
            </mesh>
            <mesh position={[1.12, 0.62, -0.28]} rotation={[0.2, 0.5, -0.35]}>
              <torusGeometry args={[0.32, 0.03, 8, 30]} />
              <meshStandardMaterial color="#d86d8a" roughness={0.62} />
            </mesh>
          </group>
        </Float>
      </group>
    </ModelSlot>
  );
}

function ParticleMessage({ text }: { text: string }) {
  const ref = useRef<THREE.Points>(null);
  const progressRef = useRef(0);
  const startPositions = useRef<Float32Array | null>(null);

  const { positions, count } = useMemo(() => {
    if (typeof document === "undefined") {
      return { positions: new Float32Array(), count: 0 };
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { positions: new Float32Array(), count: 0 };

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 60px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const dots: number[] = [];

    const step = 3;
    const maxDots = 1800;

    for (let y = 0; y < canvas.height && dots.length < maxDots * 3; y += step) {
      for (let x = 0; x < canvas.width && dots.length < maxDots * 3; x += step) {
        const index = (y * canvas.width + x) * 4;
        if (pixels[index] > 128) {
          const px = (x / canvas.width - 0.5) * 8;
          const py = (y / canvas.height - 0.5) * 3;
          const pz = 0;
          dots.push(px, py, pz);
        }
      }
    }

    return {
      positions: new Float32Array(dots),
      count: dots.length / 3,
    };
  }, [text]);

  const geo = useMemo(() => {
    if (count === 0) return new THREE.BufferGeometry();

    const start = new Float32Array(count * 3);
    const rng = () => Math.random();
    for (let i = 0; i < count * 3; i += 1) {
      start[i] = (rng() - 0.5) * 12;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(start.slice(), 3));
    return g;
  }, [count]);

  useEffect(() => {
    if (count === 0) return;
    const start = new Float32Array(count * 3);
    const rng = () => Math.random();
    for (let i = 0; i < count * 3; i += 1) {
      start[i] = (rng() - 0.5) * 12;
    }
    startPositions.current = start;
    if (ref.current) {
      const array = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < array.length; i += 1) {
        array[i] = start[i];
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
    progressRef.current = 0;
  }, [count, positions]);

  useFrame((_, delta) => {
    if (!ref.current || count === 0 || !startPositions.current) return;
    progressRef.current = Math.min(1, progressRef.current + delta * 0.15);
    const ease = 1 - (1 - progressRef.current) * (1 - progressRef.current);
    const array = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count * 3; i += 1) {
      array[i] = startPositions.current[i] * (1 - ease) + positions[i] * ease;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={ref} geometry={geo} position={[0, -25.5, -147.5]}>
      <pointsMaterial
        color="#ffdd44"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function LightRays() {
  const count = 30;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(() => {
    const arr: { x: number; z: number; scale: number; phase: number }[] = [];
    const rng = () => Math.random();
    for (let i = 0; i < count; i += 1) {
      arr.push({
        x: (rng() - 0.5) * 60,
        z: (rng() - 0.5) * 60,
        scale: 0.3 + rng() * 0.5,
        phase: rng() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const d = data[i];
      dummy.position.set(d.x, -5 + Math.sin(time + i) * 0.4, d.z);
      dummy.rotation.set(0.1, 0, 0);
      dummy.scale.set(d.scale, 6, d.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.3, 1, 6]} />
      <meshStandardMaterial
        color="#aaddff"
        transparent
        opacity={0.08}
        roughness={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function AmbientBubbles() {
  const count = 120;
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const rng = () => Math.random();
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (rng() - 0.5) * 100;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      positions[i * 3 + 1] += delta * (0.2 + (i % 3) * 0.1);
      positions[i * 3] += Math.sin(i + performance.now() * 0.001) * delta * 0.03;
      if (positions[i * 3 + 1] > -1) positions[i * 3 + 1] = DEPTH_MAX;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#88bbee"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function OceanPostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.75} luminanceThreshold={0.12} luminanceSmoothing={0.62} mipmapBlur />
      <Vignette offset={0.22} darkness={0.46} />
    </EffectComposer>
  );
}

function SceneContent(props: OceanSceneProps) {
  const phaseRef = useRef(props.phase);

  useEffect(() => {
    phaseRef.current = props.phase;
  }, [props.phase]);

  const allCluesCollected = REQUIRED_CLUES.every((id) => props.clues.includes(id));

  return (
    <>
      <color attach="background" args={["#031321"]} />
      <fog attach="fog" args={["#031321", 22, 105]} />

      <ambientLight intensity={0.72} color="#8cc9e8" />
      <directionalLight position={[6, 10, 4]} intensity={1.8} color="#c8ecff" />
      <directionalLight position={[-8, 4, -8]} intensity={0.58} color="#5fc6ff" />
      <pointLight position={[0, -9, -8]} intensity={0.9} color="#5ecbff" decay={0.7} />
      <pointLight position={[20, -18, -40]} intensity={0.62} color="#77d7ff" />
      <pointLight position={[-25, -15, -70]} intensity={0.48} color="#8fa7ff" />
      <pointLight position={[0, -27, -148]} intensity={1.45} color="#ffdc66" decay={0.45} />

      <SurfaceWorld phase={props.phase} />

      <group visible={props.phase !== "surface"}>
        <UnderwaterBackdrop />
        <WaterVolume />
        <OceanFloor />
        <CausticBands />
        <SeaweedForest />
        <CoralForest />
        <HeroReefClusters />
        <RockFormations />
        <AncientRuins />
        <Shipwreck />
        <VolcanicVent />
        <FishSchool id="school1" />
        <FishSchool id="school2" />
        <LightRays />
        <AmbientBubbles />
        <Sparkles count={420} scale={[110, 42, 150]} size={2.2} speed={0.18} opacity={0.32} color="#9be8ff" position={[0, -20, -70]} />

        <TurtleModel pulse={props.interactionPulses.turtle} />
        <DolphinModel pulse={props.interactionPulses.dolphin} />
        <JellyfishModel pulse={props.interactionPulses.jellyfish} />
        <OctopusModel pulse={props.interactionPulses.octopus} />
        <WhaleModel pulse={props.interactionPulses.whale} />
        <AmbientMantas />
        <LandmarkBeacons clues={props.clues} allCluesCollected={allCluesCollected} />

        <Temple allCluesCollected={allCluesCollected} />
        <TreasureChest status={props.chestStatus} wrongPulse={props.wrongPulse} />

        {props.phase === "reveal" && <ParticleMessage text={props.revealMessage} />}

        {props.phase === "reveal" && (
          <group position={[0, -29, -148]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.4, 0.04, 12, 96]} />
              <meshBasicMaterial color="#ffdd44" transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <pointLight color="#ffdd44" intensity={1.8} distance={18} decay={1.2} />
          </group>
        )}
      </group>

      <CameraRig
        controlsRef={props.controlsRef}
        phase={props.phase}
        phaseRef={phaseRef}
        onPhaseChange={props.onPhaseChange}
        onTargetChange={props.onTargetChange}
        clues={props.clues}
        chestStatus={props.chestStatus}
      />
    </>
  );
}

export default function OceanScene(props: OceanSceneProps) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 60, near: 0.1, far: 250, position: [0, -3, 8] }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.setClearColor("#031321");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
    >
      <PerformanceMonitor flipflops={3} onDecline={() => {}}>
        <AdaptiveDpr pixelated />
      </PerformanceMonitor>
      <SceneContent {...props} />
      <OceanPostFX />
    </Canvas>
  );
}
