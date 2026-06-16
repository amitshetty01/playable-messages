"use client";

export function ChoiceBadge({ label }: { label: string | null }) {
  if (!label) return null;
  return (
    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-neon/20 bg-neon/10 px-3 py-1 text-xs font-bold text-neon">
      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
      {label}
    </div>
  );
}
