import type { ThemeName } from "@/lib/types";

export const themeClasses: Record<ThemeName, string> = {
  "Dark Romantic": "from-[#2a1824] via-[#3d2140] to-[#1a1018] text-white",
  "Soft Pastel": "from-[#3d2a38] via-[#7a5a72] to-[#2a1a28] text-white",
  "Minimal Black": "from-[#1a1218] via-[#241a22] to-[#120e14] text-white",
  "Cute Pink": "from-[#321826] via-[#8c4b6d] to-[#241426] text-white",
  "Neon Glitch": "from-[#1a1418] via-[#2f1e28] to-[#20141c] text-white",
  "Cinematic Purple": "from-[#1c1530] via-[#3a2a74] to-[#171323] text-white",
  "Clean White": "from-[#2a1a24] via-[#4a3a52] to-[#1a121c] text-white"
};

export const themePanelClasses: Record<ThemeName, string> = {
  "Dark Romantic": "border-white/15 bg-white/10",
  "Soft Pastel": "border-white/20 bg-white/15",
  "Minimal Black": "border-white/15 bg-white/[0.07]",
  "Cute Pink": "border-pink-200/25 bg-pink-200/10",
  "Neon Glitch": "border-cyan-300/25 bg-cyan-300/10",
  "Cinematic Purple": "border-violet-200/25 bg-violet-300/10",
  "Clean White": "border-white/20 bg-white/10"
};
