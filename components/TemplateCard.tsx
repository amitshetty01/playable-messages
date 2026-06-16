import Link from "next/link";
import { categories, getTemplateSeoSlug } from "@/lib/data";
import type { Template } from "@/lib/types";

export function TemplateCard({ template }: { template: Template }) {
  const categoryNames = template.categorySlugs.map((slug) => categories.find((category) => category.slug === slug)?.name).filter(Boolean).join(", ");

  return (
    <article className="card-glow glass group relative overflow-hidden rounded-[1.6rem] p-5 sm:rounded-[1.8rem] sm:p-6">
      <div className="absolute inset-x-5 top-0 h-[2px] rounded-b-full bg-gradient-to-r from-blush via-violet to-neon opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-white/50">
          <span className="pulse-dot" />
          {template.status === "full" ? "Ready to play" : "Preview available"}
        </span>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-white/60 backdrop-blur-sm">{template.length}</span>
      </div>
      <div className="mt-5 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blush/20 via-violet/20 to-neon/20 text-xs font-extrabold text-white/70">
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
      </div>
      <h3 className="mt-4 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">
        <Link className="transition duration-200 hover:text-blush" href={`/templates/${getTemplateSeoSlug(template)}`}>{template.title}</Link>
      </h3>
      <p className="mt-2 text-sm leading-6 text-white/65">{template.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/50">Best for: {template.bestFor}</span>
        {template.categorySlugs.length > 0 ? <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-white/50">{categoryNames}</span> : null}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link className="ghost-button flex-1 text-sm" href={`/demo/${template.id}`}>
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V8.688z" /></svg>
          Preview
        </Link>
        <Link className="premium-button flex-1 text-sm" href={`/create/${template.id}`}>Use template</Link>
      </div>
    </article>
  );
}
