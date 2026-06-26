"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { QuickFlow } from "@/components/QuickFlow";
import { GuidedFlow } from "@/components/GuidedFlow";
import { BrowseFlow } from "@/components/BrowseFlow";
import { AdsterraAd } from "@/components/AdsterraAd";

const TestimonialCarousel = dynamic(
  () => import("@/components/TestimonialCarousel").then((m) => m.TestimonialCarousel),
  { ssr: false }
);

export default function HomePage() {
  const [showGuided, setShowGuided] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);

  return (
    <div className="pb-24">

      {/* ─── Primary: Quick flow ─── */}
      <section className="section-fade min-h-[80dvh] pt-12 sm:pt-20">
        <QuickFlow />
      </section>

      {/* ─── Long-tail SEO keywords ─── */}
      <div className="mx-auto mt-20 max-w-3xl text-center">
        <p className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">Ways to use</p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/40">
          <span>interactive birthday message link</span>
          <span>send a fun apology message</span>
          <span>creative way to say sorry over text</span>
          <span>romantic confession maker</span>
          <span>funny roast generator</span>
          <span>friendship message with games</span>
          <span>surprise text reveal</span>
          <span>interactive love letter online</span>
        </div>
      </div>

      {/* ─── Social proof / Testimonial carousel ─── */}
      <div className="mx-auto mt-20 max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.18em] text-white/50 uppercase">What people create</p>
          <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-blush/40 via-violet/40 to-neon/40" />
        </div>

        <TestimonialCarousel />

        {/* Stats row */}
        <div className="mt-6">
          <p className="text-center text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Trusted by thousands</p>
          <div className="mt-5 grid grid-cols-4 gap-3">
            {[
              { value: "50K", suffix: "+", icon: "💬", label: "Messages" },
              { value: "42", suffix: "K+", icon: "👥", label: "Recipients" },
              { value: "20", suffix: "+", icon: "🎨", label: "Templates" },
              { value: "7", suffix: "", icon: "🎭", label: "Moods" },
            ].map((s) => (
              <div key={s.label} className="group rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent px-2 py-4 text-center transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-lg sm:px-3 sm:py-5">
                <span className="text-lg sm:text-xl block">{s.icon}</span>
                <p className="mt-1 text-lg font-extrabold tracking-tight text-white sm:text-2xl">
                  <span>{s.value}</span>{s.suffix}
                </p>
                <p className="mt-0.5 text-[9px] font-semibold text-white/30 uppercase tracking-wider sm:text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
      </div>

      {/* ─── Escape hatches ─── */}
      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <button
          type="button"
          onClick={() => { setShowGuided(!showGuided); if (!showGuided) setShowBrowse(false); }}
          className="text-sm text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {showGuided ? "− Close guided mode" : "Not sure what to say? Let us guide you"}
        </button>
        <button
          type="button"
          onClick={() => { setShowBrowse(!showBrowse); if (!showBrowse) setShowGuided(false); }}
          className="text-sm text-white/40 underline underline-offset-4 transition-colors hover:text-white/70"
        >
          {showBrowse ? "− Close" : "See what's coming soon →"}
        </button>
      </div>

      {/* ─── Guided flow (expands inline) ─── */}
      {showGuided && (
        <section className="section-fade mt-12">
          <GuidedFlow />
        </section>
      )}

      {/* ─── Browse flow (expands inline) ─── */}
      {showBrowse && (
        <section className="section-fade mt-12">
          <BrowseFlow />
        </section>
      )}

      {/* ─── Secret space ─── */}
      <div className="mt-16 text-center">
        <Link
          href="/chat"
          className="group inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.65rem] font-bold text-white/35 transition-all hover:bg-white/5 hover:text-white/60"
        >
          <span className="transition-transform duration-300 group-hover:scale-110">🔒</span>
          <span>Secret space</span>
        </Link>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <AdsterraAd type="square" />
        <AdsterraAd type="square" />
        <AdsterraAd type="square" />
      </div>

    </div>
  );
}
