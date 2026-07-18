"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Template } from "@/lib/types";
import { createDemoExperience } from "@/lib/demo";
import { ScaledPhonePreview } from "@/components/ScaledPhonePreview";

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

  const isLoveChase = template.id === "love-chase";

  return (
    <div className={`flex min-h-[100dvh] flex-col ${isLoveChase ? "experience-love-chase" : "bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"}`} style={isLoveChase ? { background: "var(--experience-bg-gradient, linear-gradient(150deg, #fffaf9 0%, #fff4f6 52%, #f8f2ff 100%))" } : undefined}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            border: isLoveChase ? "1px solid var(--experience-border, rgba(70,40,72,0.09))" : "1px solid rgba(255,255,255,0.1)",
            background: isLoveChase ? "var(--experience-surface, rgba(255,255,255,0.68))" : "rgba(255,255,255,0.04)",
            color: isLoveChase ? "var(--experience-text, #765f79)" : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
          Back
        </Link>
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: isLoveChase ? "var(--experience-muted, #927f94)" : "rgba(255,255,255,0.3)" }}>{template.title}</p>
          <p className="text-[10px]" style={{ color: isLoveChase ? "var(--experience-muted, #927f94)" : "rgba(255,255,255,0.2)" }}>{template.length} &middot; {template.bestFor}</p>
        </div>
        <Link
          href={template.id === "our-memories" ? "/our-memories?edit=true" : `/create/${template.id}`}
          className="rounded-full px-4 py-2 text-xs font-extrabold shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            background: isLoveChase ? "linear-gradient(135deg, #f6a6bb 0%, #ed7f9d 52%, #d8658d 100%)" : "linear-gradient(135deg, var(--primary), var(--secondary))",
            color: isLoveChase ? "#321c3a" : "white",
            border: isLoveChase ? "1px solid rgba(255,255,255,0.55)" : undefined,
            boxShadow: isLoveChase ? "0 14px 30px rgba(200,79,120,0.22), inset 0 1px 0 rgba(255,255,255,0.42)" : undefined,
          }}
        >
          ✨ Create Yours
        </Link>
      </div>

      {/* Phone */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-[480px]">
          {/* Soft glow */}
          <div className="absolute -inset-12 rounded-[4rem] blur-3xl opacity-50" style={{
            background: isLoveChase
              ? "radial-gradient(circle at 40% 30%, rgba(237,127,157,0.20), transparent 60%)"
              : "linear-gradient(to bottom, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%)",
          }} />

          {/* Phone frame */}
          <div className="relative z-10">
            {/* Premium slim frame */}
            <div className="overflow-hidden rounded-[2.8rem] p-[3px]" style={{
              background: isLoveChase ? "var(--experience-phone-frame, linear-gradient(145deg, #3a303d, #171319))" : "linear-gradient(to bottom, rgb(113,113,122), rgb(161,161,170), rgb(82,82,91))",
              boxShadow: isLoveChase
                ? "0 35px 90px rgba(62,32,60,0.18), 0 8px 28px rgba(62,32,60,0.12), inset 0 1px 0 rgba(255,255,255,0.10)"
                : "0 0 80px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,204,0.08)",
            }}>
              {/* Inner screen body */}
              <div className="overflow-hidden rounded-[2.6rem]" style={{
                background: isLoveChase ? "var(--experience-bg, #fff8f7)" : "#000",
              }}>
                {/* Glass body */}
                <div className="relative">
                  {/* Subtle glass glare - full surface */}
                  <div className="pointer-events-none absolute inset-0 z-30 rounded-[2.6rem] bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

                  {/* Diagonal glass reflection line */}
                  <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[2.6rem]">
                    <div className="absolute -left-1/2 top-0 h-full w-1/3 skew-x-[20deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                  </div>

                  {/* Top edge - speaker grille */}
                  <div className="absolute left-1/2 top-0 z-20 h-[3px] w-20 -translate-x-1/2 rounded-b-full" style={{ background: isLoveChase ? "rgba(50,28,58,0.15)" : "rgb(39,39,42)" }} />

                  {/* Camera dot */}
                  <div className="absolute right-4 top-3 z-20 h-[6px] w-[6px] rounded-full shadow-inner" style={{ background: isLoveChase ? "rgba(50,28,58,0.20)" : "rgb(39,39,42)" }}>
                    <div className="h-full w-full rounded-full" style={{ background: isLoveChase ? "linear-gradient(to bottom right, rgba(50,28,58,0.30), rgba(50,28,58,0.15))" : "linear-gradient(to bottom right, rgb(63,63,70), rgb(24,24,27))" }} />
                  </div>

                  {/* Screen */}
                  <div className="relative aspect-[9/16] w-full" style={{ transform: "translateZ(0)", background: isLoveChase ? "var(--experience-bg, #fff8f7)" : "rgb(9,9,11)" }}>
                    <ScaledPhonePreview>
                      <ExperiencePlayer
                        key={previewKey}
                        template={template}
                        experience={experience}
                        mode="demo"
                      />
                    </ScaledPhonePreview>
                  </div>

                  {/* Bottom edge - home indicator */}
                  <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-28 -translate-x-1/2 rounded-full" style={{ background: isLoveChase ? "rgba(50,28,58,0.12)" : "rgb(39,39,42)" }} />
                </div>
              </div>
            </div>

            {/* Restart pill */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={restart}
                className="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all active:scale-95"
                style={{
                  border: isLoveChase ? "1px solid var(--experience-border, rgba(70,40,72,0.09))" : "1px solid rgba(255,255,255,0.1)",
                  background: isLoveChase ? "var(--experience-surface, rgba(255,255,255,0.68))" : "rgba(255,255,255,0.04)",
                  color: isLoveChase ? "var(--experience-muted, #927f94)" : "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                }}
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
