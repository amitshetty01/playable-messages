"use client";

import Image from "next/image";
import { getPlaceholderForIndex } from "@/lib/empty-state-healing";
import type { SceneStep } from "@/lib/scene-types";

function anim(a: string | undefined): string {
  switch (a) {
    case "float": return "animate-float-3d";
    case "shake": return "animate-shake-3d";
    case "pulse": return "animate-pulse-glow";
    case "bounce": return "animate-bounce-soft";
    case "sway": return "animate-sway-3d";
    case "reveal-up": return "animate-reveal-3d";
    case "reveal-scale": return "animate-reveal-scale-3d";
    case "drift": return "animate-drift-3d";
    case "tilt": return "animate-tilt-3d";
    default: return "";
  }
}

function Card3D({ label, animation }: { label?: string; animation?: string }) {
  return (
    <div className={anim(animation)} style={{ perspective: "800px" }}>
      <div className="relative mx-auto h-52 w-52 transition-transform duration-700 hover-3d-3" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-3xl border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-white/5 shadow-2xl backdrop-blur-sm" style={{ transform: "translateZ(20px)" }}>
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <svg className="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            {label && <span className="text-center text-xs font-bold tracking-widest text-white/40 uppercase">{label}</span>}
          </div>
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" style={{ transform: "translateZ(-10px)" }} />
      </div>
    </div>
  );
}

function Envelope3D({ animation }: { animation?: string }) {
  return (
    <div className={anim(animation)} style={{ perspective: "1000px" }}>
      <div className="relative mx-auto h-56 w-56 transition-transform duration-700 hover-3d-1" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 rounded-3xl border-2 border-[#c0847a]/30 bg-gradient-to-br from-[#c0847a]/20 via-[#a8645a]/10 to-[#8b5e4a]/10 shadow-2xl backdrop-blur-sm" style={{ transform: "translateZ(15px)" }}>
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <svg className="h-20 w-20 text-[#c0847a]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
            </svg>
            <span className="text-xs font-bold tracking-widest text-[#c0847a]/50 uppercase">Tap to open</span>
          </div>
        </div>
        <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#c0847a]/10 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ transform: "translateZ(-15px)" }} />
      </div>
    </div>
  );
}

function Button3D({ label, animation, config }: { label?: string; animation?: string; config?: Record<string, string | number | boolean> }) {
  return (
    <div className={anim(animation)} style={{ perspective: "600px" }}>
      <div className="mx-auto transition-transform duration-300 hover:scale-105" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="rounded-2xl border-2 border-white/25 bg-gradient-to-br from-white/20 via-white/10 to-white/5 px-12 py-6 shadow-2xl backdrop-blur-sm"
          style={{
            transform: "translateZ(10px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <span className="text-lg font-extrabold tracking-wider text-white/90">{label || "The Button"}</span>
        </div>
      </div>
    </div>
  );
}

function Balloons3D() {
  const colors = [
    { bg: "#ff6b8a", shadow: "rgba(255,107,138,0.3)" },
    { bg: "#ffd166", shadow: "rgba(255,209,102,0.3)" },
    { bg: "#97dadf", shadow: "rgba(151,218,223,0.3)" },
    { bg: "#b8a5ff", shadow: "rgba(184,165,255,0.3)" },
    { bg: "#ff5fb7", shadow: "rgba(255,95,183,0.3)" },
  ];
  return (
    <div className="flex items-end justify-center gap-4">
      {colors.map((c, i) => (
        <div key={i} style={{ perspective: "400px" }}>
          <div
            className="animate-float-balloon rounded-t-full"
            style={{
              width: `${48 + i * 6}px`,
              height: `${80 + i * 20}px`,
              background: `linear-gradient(180deg, ${c.bg}, ${c.bg}aa)`,
              boxShadow: `0 -10px 50px ${c.shadow}, inset 0 -20px 40px rgba(0,0,0,0.1)`,
              borderTopLeftRadius: "100%",
              borderTopRightRadius: "100%",
              animationDelay: `${i * 0.3}s`,
              transform: `rotate(${(i - 2) * 4}deg)`,
            }}
          >
            <div className="mx-auto mt-2 h-2 w-2 rounded-full bg-white/30" />
            <div className="mx-auto h-6 w-px bg-white/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Cake3D() {
  return (
    <div style={{ perspective: "600px" }}>
      <div className="mx-auto animate-reveal-3d" style={{ transformStyle: "preserve-3d" }}>
        <div className="flex justify-center gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-1.5 rounded-full bg-[#ffd166] animate-bounce-soft" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <div className="mx-auto mt-2 h-6 w-36 rounded-lg bg-gradient-to-b from-[#ffd166] to-[#d4a000] shadow-lg" style={{ transform: "translateZ(5px)" }} />
        <div className="mx-auto h-24 w-44 rounded-xl bg-gradient-to-b from-[#f5a0b8] to-[#d46a8a] shadow-xl" style={{ transform: "translateZ(10px)" }}>
          <div className="flex justify-center gap-3 pt-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3 w-3 rounded-full bg-[#ffd166] shadow-sm" />
            ))}
          </div>
        </div>
        <div className="mx-auto h-5 w-52 rounded-md bg-gradient-to-b from-[#b08070] to-[#8a6050] shadow-lg" style={{ transform: "translateZ(3px)" }} />
      </div>
    </div>
  );
}

function Banner3D() {
  return (
    <div style={{ perspective: "800px" }}>
      <div className="mx-auto w-80 animate-reveal-scale-3d" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="rounded-2xl border border-[#ffd166]/40 bg-gradient-to-br from-[#ffd166]/30 via-[#ffd166]/15 to-transparent p-6 shadow-2xl backdrop-blur-md text-center"
          style={{ transform: "translateZ(20px)", boxShadow: "0 0 60px rgba(255,209,102,0.15)" }}
        >
          <span className="text-3xl font-black tracking-widest text-[#ffd166]">HAPPY BIRTHDAY</span>
        </div>
      </div>
    </div>
  );
}

function Box3D({ label, animation, index = 0 }: { label?: string; animation?: string; index?: number }) {
  return (
    <div className={anim(animation)} style={{ perspective: "600px", animationDelay: `${index * 0.2}s` }}>
      <div
        className="mx-auto h-28 w-28 rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 via-white/8 to-white/5 shadow-2xl backdrop-blur-sm transition-all duration-500 hover-3d-4 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-2" style={{ transform: "translateZ(8px)" }}>
          <svg className="h-10 w-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {label && <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">{label}</span>}
        </div>
      </div>
    </div>
  );
}

function PhotoCard3D({ animation, index = 0, image, theme = "Dark Romantic" }: { animation?: string; index?: number; image?: string; theme?: string }) {
  const rots = [-6, 3, -2, 5];
  const placeholder = !image ? getPlaceholderForIndex(theme, index) : null;
  return (
    <div className={anim(animation)} style={{ perspective: "600px", animationDelay: `${index * 0.25}s` }}>
      <div
        className="mx-auto h-72 w-56 rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 via-white/8 to-white/5 p-3 shadow-2xl backdrop-blur-sm transition-all duration-500 hover-3d-2"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotate(${rots[index % rots.length]}deg)`,
        }}
      >
        {image ? (
          <div className="relative h-48 w-full overflow-hidden rounded-xl" style={{ transform: "translateZ(5px)" }}>
            <Image src={image} alt="memory" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" unoptimized />
          </div>
        ) : placeholder ? (
          <div
            className="flex h-48 w-full items-center justify-center rounded-xl"
            style={{ background: placeholder.gradient, transform: "translateZ(5px)" }}
          >
            <span className="text-4xl opacity-60">{placeholder.emoji}</span>
          </div>
        ) : (
          <div className="h-48 w-full rounded-xl bg-white/10" style={{ transform: "translateZ(5px)" }} />
        )}
        <div className="mt-3 h-2 w-3/4 rounded-full bg-white/10" style={{ transform: "translateZ(3px)" }} />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-white/[0.08]" style={{ transform: "translateZ(3px)" }} />
      </div>
    </div>
  );
}

function ChatBubble3D({ label, align = "left" }: { label?: string; align?: "left" | "right" }) {
  return (
    <div style={{ perspective: "400px" }} className={`${align === "right" ? "ml-auto" : "mr-auto"} max-w-[88%]`}>
      <div
        className={`rounded-2xl border border-white/10 bg-gradient-to-br from-white/15 to-white/5 px-5 py-4 shadow-lg backdrop-blur-sm ${align === "right" ? "rounded-tr-md" : "rounded-tl-md"}`}
        style={{ transform: `translateZ(${align === "right" ? "8px" : "4px"})` }}
      >
        <span className="text-sm leading-relaxed text-white/80">{label || "Typing..."}</span>
        {align === "left" && <span className="ml-1 inline-block h-3 w-1.5 animate-pulse rounded-full bg-white/40" />}
      </div>
    </div>
  );
}

function Seal3D({ label, index = 0 }: { label?: string; index?: number }) {
  return (
    <div className="animate-reveal-3d" style={{ perspective: "500px", animationDelay: `${index * 0.2}s` }}>
      <div
        className="mx-auto h-24 w-24 rounded-full border-2 border-[#c0847a]/30 bg-gradient-to-br from-[#c0847a]/20 via-[#a8645a]/10 to-[#8b5e4a]/10 shadow-xl backdrop-blur-sm transition-transform duration-500 hover-3d-3"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex h-full flex-col items-center justify-center" style={{ transform: "translateZ(5px)" }}>
          <span className="text-3xl font-black text-[#c0847a]/50">{index + 1}</span>
          {label && <span className="mt-1 text-[10px] font-bold tracking-widest text-[#c0847a]/40 uppercase">{label}</span>}
        </div>
      </div>
    </div>
  );
}

function RoastCard3D({ label, animation }: { label?: string; animation?: string }) {
  return (
    <div className={anim(animation)} style={{ perspective: "800px" }}>
      <div
        className="mx-auto w-80 rounded-2xl border-2 border-[#ff6b8a]/30 bg-gradient-to-br from-[#ff6b8a]/20 via-[#cc3355]/10 to-transparent p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover-3d-1 hover:shadow-[0_20px_60px_rgba(255,107,138,0.2)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="text-center" style={{ transform: "translateZ(15px)" }}>
          <p className="text-2xl font-black italic leading-relaxed text-white/90">
            &ldquo;{label || "You're impossible in the best way."}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function Emoji3D({ animation }: { animation?: string }) {
  const faces = ["😐", "😶", "🤨", "😏", "😒"];
  return (
    <div className={anim(animation)} style={{ perspective: "400px" }}>
      <div className="mx-auto text-8xl transition-transform duration-500 hover-3d-3" style={{ transformStyle: "preserve-3d" }}>
        {faces[Math.floor(Math.random() * faces.length)]}
      </div>
    </div>
  );
}

function Sparkle3D() {
  return (
    <div className="animate-sparkle-burst" style={{ perspective: "500px" }}>
      <div className="mx-auto relative" style={{ transformStyle: "preserve-3d" }}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              background: "#ffd166",
              boxShadow: "0 0 6px rgba(255,209,102,0.6)",
              transform: `rotate(${angle}deg) translateY(-24px)`,
              opacity: 0.7 + Math.random() * 0.3,
              animation: "star-twinkle 2s ease-in-out infinite",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <svg className="relative h-16 w-16 text-[#ffd166]/60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l1.5 6.5L20 12l-6.5 1.5L12 20l-1.5-6.5L4 12l6.5-1.5z" />
        </svg>
      </div>
    </div>
  );
}

function Mirror3D() {
  return (
    <div style={{ perspective: "600px" }}>
      <div
        className="mx-auto h-36 w-36 rounded-full border-2 border-white/15 bg-gradient-to-br from-white/20 via-white/10 to-white/5 shadow-2xl backdrop-blur-sm transition-transform duration-500 hover-3d-2"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="flex h-full items-center justify-center" style={{ transform: "translateZ(10px)" }}>
          <svg className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Polaroid3D({ animation, image, index = 0, theme = "Dark Romantic" }: { animation?: string; image?: string; index?: number; theme?: string }) {
  const rots = [-8, 4, -3, 6];
  const placeholder = !image ? getPlaceholderForIndex(theme, index) : null;
  return (
    <div className={anim(animation)} style={{ perspective: "600px", animationDelay: `${index * 0.25}s` }}>
      <div
        className="mx-auto w-52 rounded-2xl bg-white/90 p-3 pb-8 shadow-2xl"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotate(${rots[index % rots.length]}deg)`,
        }}
      >
        {image ? (
          <div className="relative h-44 w-full overflow-hidden rounded-xl" style={{ transform: "translateZ(5px)" }}>
            <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" unoptimized />
          </div>
        ) : placeholder ? (
          <div
            className="flex h-44 w-full items-center justify-center rounded-xl"
            style={{ background: placeholder.gradient, transform: "translateZ(5px)" }}
          >
            <span className="text-3xl opacity-50">{placeholder.emoji}</span>
          </div>
        ) : (
          <div className="h-44 w-full rounded-xl bg-gradient-to-br from-amber-100 to-amber-200" style={{ transform: "translateZ(5px)" }} />
        )}
      </div>
    </div>
  );
}

export function SceneProp({ scene, theme = "Dark Romantic" }: { scene: SceneStep; theme?: string }) {
  const { type, animation, label, config } = scene.prop;
  if (type === "none") return null;

  const py = config?.size === "sm" ? "py-4" : config?.size === "lg" ? "py-12" : config?.size === "xl" ? "py-16" : "py-8";

  return (
    <div className={`relative z-10 flex items-center justify-center ${py} px-6`}>
      {type === "floating-card" && <Card3D label={label} animation={animation} />}
      {type === "button" && <Button3D label={label} animation={animation} config={config} />}
      {type === "envelope" && <Envelope3D animation={animation} />}
      {type === "balloon-group" && <Balloons3D />}
      {type === "cake" && <Cake3D />}
      {type === "banner" && <Banner3D />}
      {type === "box" && <Box3D label={label} animation={animation} index={typeof config?.index === "number" ? config.index : 0} />}
      {type === "photo-card" && <PhotoCard3D animation={animation} index={typeof config?.index === "number" ? config.index : 0} image={typeof config?.image === "string" ? config.image : undefined} theme={theme} />}
      {type === "chat-bubble" && <ChatBubble3D label={label} align={config?.align as "left" | "right" | undefined} />}
      {type === "seal" && <Seal3D label={label} index={typeof config?.index === "number" ? config.index : 0} />}
      {type === "roast-card" && <RoastCard3D label={label} animation={animation} />}
      {type === "emoji-face" && <Emoji3D animation={animation} />}
      {type === "sparkle" && <Sparkle3D />}
      {type === "mirror" && <Mirror3D />}
      {type === "polaroid" && <Polaroid3D animation={animation} image={typeof config?.image === "string" ? config.image : undefined} index={typeof config?.index === "number" ? config.index : 0} theme={theme} />}
    </div>
  );
}
