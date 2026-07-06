import type { Metadata } from "next";
import { TemplateCard } from "@/components/TemplateCard";
import { templates } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { TemplatesGrid } from "@/components/TemplatesGrid";
import { AdsterraAd } from "@/components/AdsterraAd";

export const metadata: Metadata = buildMetadata({
  title: "Interactive Message Templates",
  description: "Browse interactive message templates for love confessions, birthday wishes, apology messages, funny roasts, and surprise reveals.",
  path: "/templates"
});

export default function TemplatesPage() {
  const liveTemplates = templates.filter((t) => t.status === "full");
  const comingSoon = templates.filter((t) => t.status === "coming-soon");

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Templates</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Choose your interactive message style.</h1>
        <p className="mt-5 max-w-3xl text-white/70">Pick a template, customize your message, and share a link. Each one is a mini interactive experience.</p>
      </section>

      <TemplatesGrid templates={liveTemplates} />

      {comingSoon.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-bold text-white/30 hover:text-white/50 transition-colors">
            {comingSoon.length} more templates in development →
          </summary>
          <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {comingSoon.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </details>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
      </div>
    </div>
  );
}
