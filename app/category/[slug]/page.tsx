import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateCard } from "@/components/TemplateCard";
import { categories, getCategory, getTemplatesByCategory } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return buildMetadata({ title: "Category Not Found", description: "This interactive message category could not be found.", path: `/category/${slug}`, noIndex: true });
  return buildMetadata({
    title: `${category.name} Message Templates`,
    description: `${category.description} Browse interactive templates and create a shareable message link.`,
    path: `/category/${category.slug}`
  });
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const items = getTemplatesByCategory(category.slug);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">{category.name}</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">{category.name} templates.</h1>
        <p className="mt-5 max-w-3xl text-white/70">{category.description}</p>
      </section>
      {items.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((template) => <TemplateCard key={template.id} template={template} />)}</div> : <p className="glass rounded-3xl p-5 text-center text-white/70 sm:p-8">No templates in this category yet.</p>}
    </div>
  );
}
