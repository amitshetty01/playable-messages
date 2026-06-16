"use client";

import { playSound } from "@/lib/flowSounds";

export function BackButton({ onBack, disabled }: { onBack: () => void; disabled?: boolean }) {
  if (disabled) return null;
  return (
    <button
      type="button"
      onClick={() => { playSound("click"); onBack(); }}
      className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-white/50 transition hover:text-white"
    >
      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
      Back
    </button>
  );
}
