import type { ThemeName } from "@/lib/types";

export const themeClasses: Record<ThemeName, string> = {
  "Dark Romantic": "from-[#241426] via-[#2d2142] to-[#171323] text-white",
  "Soft Pastel": "from-[#44304d] via-[#7b6488] to-[#2f3747] text-white",
  "Minimal Black": "from-[#16131d] via-[#23202d] to-[#101018] text-white",
  "Cute Pink": "from-[#321826] via-[#8c4b6d] to-[#241426] text-white",
  "Neon Glitch": "from-[#101924] via-[#173244] to-[#24172f] text-white",
  "Cinematic Purple": "from-[#1c1530] via-[#3a2a74] to-[#171323] text-white",
  "Clean White": "from-[#273246] via-[#3f5269] to-[#1b2231] text-white"
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
