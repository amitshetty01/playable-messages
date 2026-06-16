"use client";

import { useState } from "react";
import { QuickFlow } from "@/components/QuickFlow";
import { GuidedFlow } from "@/components/GuidedFlow";
import { BrowseFlow } from "@/components/BrowseFlow";

export default function HomePage() {
  const [showGuided, setShowGuided] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);

  return (
    <div className="pb-24">

      {/* ─── Primary: Quick flow ─── */}
      <section className="section-fade min-h-[80dvh] pt-12 sm:pt-20">
        <QuickFlow />
      </section>

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
          {showBrowse ? "− Close template browser" : "Browse template styles"}
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

    </div>
  );
}
