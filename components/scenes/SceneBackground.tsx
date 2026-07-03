"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { SceneStep } from "@/lib/scene-types";

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

function AnimatedGradientMesh({ colors }: { colors: string[] }) {
  const c = colors || ["rgba(246,177,201,0.12)", "rgba(184,165,255,0.08)", "rgba(151,218,223,0.06)"];
  return (
    <>
      {c.map((color, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${50 + (i - 1) * 30}% ${40 + i * 25}%, ${color}, transparent 60%)`,
            animation: `gradient-shift ${8 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </>
  );
}

function LightLeak({ color = "rgba(255,200,150,0.06)" }: { color?: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, ${color}, transparent 40%, transparent 60%, ${color})`,
        animation: "light-leak 10s ease-in-out infinite",
      }}
    />
  );
}

function FogLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
      }}
    />
  );
}

function BokehEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${30 + Math.random() * 80}px`,
            height: `${30 + Math.random() * 80}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)`,
            animation: `bokeh-float ${12 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}

function StarsField({ count = 60 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            background: `rgba(255,255,255,${0.3 + Math.random() * 0.7})`,
            animation: `star-twinkle ${3 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
            boxShadow: Math.random() > 0.7 ? `0 0 ${2 + Math.random() * 4}px rgba(255,255,255,0.3)` : "none",
          }}
        />
      ))}
    </div>
  );
}

function FloatParticles({ color = "rgba(255,255,255,0.06)", count = 15 }: { color?: string; count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 20}px`,
            height: `${6 + Math.random() * 20}px`,
            background: color,
            animation: `particle-float ${15 + Math.random() * 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  );
}

function GradientOrbs() {
  return (
    <>
      <div
        className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(246,177,201,0.3), transparent 70%)",
          animation: "orb-pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(184,165,255,0.25), transparent 70%)",
          animation: "orb-pulse 8s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />
    </>
  );
}

function StageLight() {
  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#ffd166]/[0.06] to-transparent" />
      <div
        className="absolute bottom-[15%] left-1/2 h-[3px] w-1/3 -translate-x-1/2 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,209,102,0.4), transparent)",
          boxShadow: "0 0 30px rgba(255,209,102,0.2)",
          animation: "stage-light-pulse 3s ease-in-out infinite",
        }}
      />
    </>
  );
}

function RomanticGlow() {
  return (
    <>
      <div
        className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(246,177,201,0.2), transparent 60%)",
          animation: "romantic-pulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,95,183,0.1), transparent 60%)",
          animation: "romantic-pulse 5s ease-in-out infinite",
          animationDelay: "1s",
        }}
      />
    </>
  );
}

function ChatDarkBg() {
  return (
    <div className="absolute inset-0" style={{ background: "#0a0a12" }}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, rgba(35,211,238,0.03), transparent 50%),
                       radial-gradient(circle at 70% 80%, rgba(184,165,255,0.03), transparent 50%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.01) 40px, rgba(255,255,255,0.01) 41px)`,
        }}
      />
    </div>
  );
}

function VignetteOverlay({ intensity = 0.6 }: { intensity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        boxShadow: `inset 0 0 150px rgba(0,0,0,${intensity}), inset 0 0 50px rgba(0,0,0,${intensity * 0.5})`,
      }}
    />
  );
}

function RoomDarkScene() {
  return (
    <div className="absolute inset-0" style={{ background: "#050508" }}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02), transparent 60%)`,
      }} />
    </div>
  );
}

function RoomLitScene({ color = "#120e1a" }: { color?: string }) {
  return (
    <div className="absolute inset-0" style={{ background: color }}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse at 50% 80%, rgba(255,255,255,0.05), transparent 60%)`,
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

export function SceneBackground({ scene }: { scene: SceneStep }) {
  const { type, gradient, color, imageUrl } = scene.background;
  const baseGradient = gradient || "from-[#120e1a] via-[#1a1430] to-[#0d0a15]";

  return (
    <>
      {imageUrl && (
        <Image src={imageUrl} alt="" fill className="object-cover" sizes="100vw" unoptimized />
      )}
      <div className={`absolute inset-0 ${imageUrl ? "bg-gradient-to-br from-black/60 via-black/40 to-black/60" : `bg-gradient-to-br ${baseGradient}`}`} />

      {/* Always-on base layers */}
      <AnimatedGradientMesh colors={[
        color || "rgba(246,177,201,0.1)",
        "rgba(184,165,255,0.07)",
        "rgba(151,218,223,0.05)"
      ]} />
      <VignetteOverlay intensity={0.5} />

      {/* Template-specific layers */}
      {type === "stars" && <ClientOnly><><StarsField /><FloatParticles color="rgba(255,255,255,0.04)" /></></ClientOnly>}
      {type === "particles" && <ClientOnly><FloatParticles color={color || "rgba(246,177,201,0.06)"} /></ClientOnly>}
      {type === "pulse-glow" && <><GradientOrbs /><RomanticGlow /></>}
      {type === "room-dark" && <RoomDarkScene />}
      {type === "room-lit" && <RoomLitScene color={color} />}
      {type === "chat" && <ChatDarkBg />}
      {type === "stage" && <><StageLight /><ClientOnly><BokehEffect /></ClientOnly></>}
      {type === "cards" && <ClientOnly><FloatParticles color="rgba(255,200,150,0.04)" count={10} /><BokehEffect /></ClientOnly>}
      {type === "envelope" && <><LightLeak color="rgba(192,132,122,0.06)" /><ClientOnly><StarsField count={25} /></ClientOnly></>}
      {type === "minimal" && null}
      {type === "gradient" && <><GradientOrbs /><LightLeak /></>}
      {type === "vignette" && <GradientOrbs />}

      <FogLayer />
    </>
  );
}
