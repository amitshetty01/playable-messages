"use client";

import { useState } from "react";
import type { ExperienceRecord } from "@/lib/types";

type ComparisonShowcaseProps = {
  experience: ExperienceRecord;
};

export function ComparisonShowcase({ experience }: ComparisonShowcaseProps) {
  const [showInteractive, setShowInteractive] = useState(false);

  const plainText = experience.finalMessage || "Your message here";
  const creatorMsg = experience.creatorName ? `— ${experience.creatorName}` : "";

  return (
    <div className="glass rounded-[2rem] p-6 sm:p-8">
      <div className="text-center mb-6">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Before vs After</p>
        <h2 className="text-2xl font-bold text-white mt-1">Plain text vs Interactive experience</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={`rounded-[1.4rem] p-5 transition-all ${!showInteractive ? "ring-2 ring-pink-400/50" : "opacity-60"}`}
          style={{ background: "linear-gradient(135deg, #1a1527, #2a1f3d)" }}>
          <p className="text-xs font-bold text-white/30 mb-2">📱 Plain text</p>
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm text-white/60 italic">&ldquo;{plainText}&rdquo;{creatorMsg}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-white/30">
            <span>Sent via SMS</span>
            <span>·</span>
            <span>Forgotten in minutes</span>
          </div>
        </div>

        <div
          className={`rounded-[1.4rem] p-5 transition-all cursor-pointer ${showInteractive ? "ring-2 ring-fuchsia-400/50" : "opacity-60 hover:opacity-80"}`}
          onClick={() => setShowInteractive(true)}
          style={{ background: "linear-gradient(135deg, #1a1527, #3d1f4a)" }}
        >
          <p className="text-xs font-bold text-white/30 mb-2">✨ Interactive experience</p>
          <div className="rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 p-4 border border-pink-400/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-xs text-pink-300 font-bold">Interactive message</span>
            </div>
            <p className="text-sm text-white/80">&ldquo;{plainText}&rdquo;{creatorMsg}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-pink-300/50">
            <span>🎮 Mini-game</span>
            <span>·</span>
            <span>🎨 Custom theme</span>
            <span>·</span>
            <span>💝 Unforgettable</span>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm text-white/50">
          {showInteractive
            ? "Interactive messages feel more personal and are remembered longer."
            : "Tap the right card to see the difference."}
        </p>
      </div>
    </div>
  );
}
