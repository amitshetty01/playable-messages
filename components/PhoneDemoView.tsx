"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Template } from "@/lib/types";
import { createDemoExperience } from "@/lib/demo";

const ExperiencePlayer = dynamic(
  () => import("@/components/ExperiencePlayer").then((m) => ({ default: m.ExperiencePlayer })),
  { ssr: false }
);

export function PhoneDemoView({ template }: { template: Template }) {
  const [previewKey, setPreviewKey] = useState(0);

  const experience = useMemo(() => createDemoExperience(template), [template]);

  const restart = useCallback(() => {
    setPreviewKey((k) => k + 1);
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
          Back
        </Link>
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.15em] text-white/30 uppercase">{template.title}</p>
          <p className="text-[10px] text-white/20">{template.length} &middot; {template.bestFor}</p>
        </div>
        <Link
          href={template.id === "our-memories" ? "/our-memories?edit=true" : `/create/${template.id}`}
          className="rounded-full bg-gradient-to-r from-blush to-violet px-4 py-2 text-xs font-extrabold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          ✨ Create Yours
        </Link>
      </div>

      {/* Phone */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-[480px]">
          {/* Soft glow */}
          <div className="absolute -inset-12 rounded-[4rem] bg-gradient-to-b from-blush/15 via-violet/15 to-neon/15 blur-3xl opacity-50" />

          {/* Phone frame */}
          <div className="relative z-10">
            {/* Metallic frame */}
            <div className="overflow-hidden rounded-[2.8rem] bg-gradient-to-b from-zinc-500 via-zinc-400 to-zinc-600 p-[4px] shadow-[0_0_80px_rgba(0,0,0,0.6),0_0_40px_rgba(201,168,204,0.08)]">
              {/* Inner black border for depth */}
              <div className="overflow-hidden rounded-[2.6rem] bg-black">
                {/* Glass body */}
                <div className="relative">
                  {/* Subtle glass glare - full surface */}
                  <div className="pointer-events-none absolute inset-0 z-30 rounded-[2.6rem] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

                  {/* Diagonal glass reflection line */}
                  <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[2.6rem]">
                    <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                  </div>

                  {/* Top edge - speaker grille */}
                  <div className="absolute left-1/2 top-0 z-20 h-[3px] w-20 -translate-x-1/2 rounded-b-full bg-zinc-800" />

                  {/* Camera dot */}
                  <div className="absolute right-4 top-3 z-20 h-[6px] w-[6px] rounded-full bg-zinc-800 shadow-inner">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
                  </div>

                  {/* Screen */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950" style={{ transform: "translateZ(0)" }}>
                    <ExperiencePlayer
                      key={previewKey}
                      template={template}
                      experience={experience}
                      mode="demo"
                    />
                  </div>

                  {/* Bottom edge - home indicator */}
                  <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-28 -translate-x-1/2 rounded-full bg-zinc-800" />
                </div>
              </div>
            </div>

            {/* Restart pill */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={restart}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-bold text-white/50 transition-all hover:bg-white/10 hover:text-white/80 active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
