"use client";

export function ProgressBar({ current, total, theme }: { current: number; total: number; theme?: string }) {
  const pct = total > 0 ? Math.min(current / total, 1) : 0;

  const gradientMap: Record<string, string> = {
    "Dark Romantic": "from-blush via-violet to-neon",
    "Soft Pastel": "from-pink-300 via-amber-200 to-sky-300",
    "Minimal Black": "from-white/50 via-white/30 to-white/10",
    "Cute Pink": "from-pink-400 via-rose-300 to-fuchsia-300",
    "Neon Glitch": "from-cyan-400 via-fuchsia-400 to-amber-300",
    "Cinematic Purple": "from-violet-500 via-purple-400 to-fuchsia-400",
    "Clean White": "from-white/60 via-white/30 to-white/10"
  };

  const gradient = gradientMap[theme ?? ""] || "from-blush via-violet to-neon";

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 ease-out`}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold tracking-[0.08em] text-white/50 shrink-0">
          {current}/{total}
        </span>
      </div>
      <div className="flex gap-1 mt-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-400 ${
              i < current ? `bg-gradient-to-r ${gradient}` : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
