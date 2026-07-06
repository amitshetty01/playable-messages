"use client";

import { useState } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Template } from "@/lib/types";

const VIBES: { emoji: string; label: string; categorySlug: string }[] = [
  { emoji: "😍", label: "Love", categorySlug: "love-crush" },
  { emoji: "🥺", label: "Sorry", categorySlug: "apology-fight-repair" },
  { emoji: "🤣", label: "Roast", categorySlug: "funny-roast" },
  { emoji: "🎂", label: "Birthday", categorySlug: "birthday-special-days" },
  { emoji: "🤝", label: "Friendship", categorySlug: "friendship-best-friend" },
];

export function TemplatesGrid({ templates }: { templates: Template[] }) {
  const [vibe, setVibe] = useState<string | null>(null);

  const filtered = vibe
    ? templates.filter((t) => t.categorySlugs.includes(vibe))
    : templates;

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-xs font-bold tracking-[0.08em] text-white/40">What&apos;s the vibe?</p>
        <div className="flex flex-wrap gap-3">
          {VIBES.map((v) => (
            <button
              key={v.categorySlug}
              type="button"
              onClick={() => setVibe(vibe === v.categorySlug ? null : v.categorySlug)}
              className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-bold transition-all duration-200 ${
                vibe === v.categorySlug
                  ? "border-white/40 bg-white/15 text-white shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                  : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/25 hover:text-white/80"
              }`}
            >
              <span className="text-2xl">{v.emoji}</span>
              <span>{v.label}</span>
            </button>
          ))}
          {vibe && (
            <button
              type="button"
              onClick={() => setVibe(null)}
              className="rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white/40 transition-all hover:text-white/60"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      <SearchableGrid placeholder="Search templates...">
        {filtered.map((template) => (
          <div key={template.id} data-search={`${template.title} ${template.hook} ${template.description} ${template.bestFor}`}>
            <TemplateCard template={template} />
          </div>
        ))}
      </SearchableGrid>
    </div>
  );
}
