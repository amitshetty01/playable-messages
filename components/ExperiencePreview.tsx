"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExperiencePlayer } from "@/components/ExperiencePlayer";
import { getTemplate } from "@/lib/data";
import type { ExperienceRecord } from "@/lib/types";

export function ExperiencePreview({ experience, onClose }: { experience: ExperienceRecord; onClose: () => void }) {
  const router = useRouter();
  const [showShare, setShowShare] = useState(false);
  const template = getTemplate(experience.templateId);
  if (!template) return null;

  const shareUrl = `${window.location.origin}/experience/${experience.id}`;

  if (showShare) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
        <div className="mx-auto w-full max-w-md px-4 text-center">
          <div className="rounded-[2rem] bg-gradient-to-b from-white/10 to-white/5 p-10 backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-3xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-300"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 className="display-title text-3xl font-bold text-white">Your link is ready!</h2>
            <p className="mt-3 text-sm text-white/60">Share this with someone special:</p>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-2">
              <input readOnly value={shareUrl} className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none" onClick={(e) => (e.target as HTMLInputElement).select()} />
              <button type="button" className="shrink-0 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/25 active:scale-95" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" className="ghost-button" onClick={() => window.open(shareUrl, "_blank")}>Open</button>
              <button type="button" className="premium-button" onClick={onClose}>Create another</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Experience takes full viewport */}
      <div className="relative flex-1">
        <ExperiencePlayer template={template} experience={experience} mode="preview" />

        {/* Floating controls overlaid on top */}
        <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3">
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-full bg-black/50 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur-md transition-colors hover:text-white">
              ← Back
            </button>
            <button type="button" onClick={() => router.push(`/edit/${experience.id}`)} className="rounded-full bg-black/50 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur-md transition-colors hover:text-white">
              Edit
            </button>
          </div>
          <button type="button" onClick={() => setShowShare(true)} className="rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#c44dff] px-5 py-2 text-sm font-bold text-white shadow-lg transition-all hover:scale-105">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
