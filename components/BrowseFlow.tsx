"use client";

import { TemplateCard } from "@/components/TemplateCard";
import { templates } from "@/lib/data";

export function BrowseFlow() {
  const comingSoon = templates.filter((t) => t.status === "coming-soon");

  return (
    <div>
      <p className="mb-6 text-sm text-white/50">
        More templates are on the way. Here&apos;s what&apos;s coming next:
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {comingSoon.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </div>
  );
}
