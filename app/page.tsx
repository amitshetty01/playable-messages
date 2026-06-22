"use client";

import { useState } from "react";
import Link from "next/link";
import { QuickFlow } from "@/components/QuickFlow";
import { GuidedFlow } from "@/components/GuidedFlow";
import { BrowseFlow } from "@/components/BrowseFlow";
import { AdsterraAd } from "@/components/AdsterraAd";
export default function HomePage() {
  const [showGuided, setShowGuided] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);

  return (
    <div className="pb-24">

      {/* ─── Primary: Quick flow ─── */}
      <section className="section-fade min-h-[80dvh] pt-12 sm:pt-20">
        <QuickFlow />
      </section>

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
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.65rem] font-bold text-white/15 transition-all hover:bg-white/5 hover:text-white/40"
        >
          <span>🔒</span>
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
