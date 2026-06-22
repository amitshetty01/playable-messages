import type { Metadata } from "next";
import { TemplateCard } from "@/components/TemplateCard";
import { SearchableGrid } from "@/components/SearchableGrid";
import { AdsterraAd } from "@/components/AdsterraAd";
import { templates } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Coming Soon — Interactive Message Templates",
  description: "New interactive message templates are coming. Be the first to know when apology, birthday, friendship, and surprise reveal templates launch.",
  path: "/templates"
});

export default function TemplatesPage() {
  const comingSoon = templates.filter((t) => t.status === "coming-soon");
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Coming soon</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">More templates are on the way.</h1>
        <p className="mt-5 max-w-3xl text-white/70">We&apos;re building new interactive experiences. Here&apos;s what&apos;s coming next:</p>
      </section>
      <SearchableGrid placeholder="Search coming soon templates...">{comingSoon.map((template) => <div key={template.id} data-search={`${template.title} ${template.hook} ${template.description}`}><TemplateCard template={template} /></div>)}</SearchableGrid>
      <div className="mt-10 flex flex-col items-center gap-4">
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
        <AdsterraAd type="rectangle" />
      </div>
    </div>
  );
}
