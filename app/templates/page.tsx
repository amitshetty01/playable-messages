import type { Metadata } from "next";
import { TemplateCard } from "@/components/TemplateCard";
import { SearchableGrid } from "@/components/SearchableGrid";
import { AdsterraAd } from "@/components/AdsterraAd";
import { templates } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Interactive Message Templates",
  description: "Preview interactive templates for apology messages, birthday messages, friendship notes, confession reveals, funny roasts, and surprise message links.",
  path: "/templates"
});

export default function TemplatesPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Template library</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Preview first, personalize when ready.</h1>
        <p className="mt-5 max-w-3xl text-white/70">Browse interactive message templates with demos, gentle pacing, and simple customization.</p>
      </section>
      <SearchableGrid placeholder="Search templates by name or description...">{templates.map((template) => <div key={template.id} data-search={`${template.title} ${template.hook} ${template.description}`}><TemplateCard template={template} /></div>)}</SearchableGrid>
      <div className="mt-10 flex flex-col items-center gap-4">
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
      </div>
    </div>
  );
}
