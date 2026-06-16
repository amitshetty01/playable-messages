import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchableGrid } from "@/components/SearchableGrid";
import { categories } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Message Categories for Every Feeling",
  description: "Browse interactive message categories for apology messages, birthdays, friendship notes, confessions, funny roasts, and surprise links.",
  path: "/categories"
});

export default function CategoriesPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Experience categories</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Pick the feeling, then the format.</h1>
        <p className="mt-5 max-w-3xl text-white/70">Each category includes templates you can preview, personalize, and share as a simple link.</p>
      </section>
      <SearchableGrid placeholder="Search categories...">{categories.map((category) => <div key={category.slug} data-search={`${category.name} ${category.description}`}><CategoryCard category={category} /></div>)}</SearchableGrid>
    </div>
  );
}
