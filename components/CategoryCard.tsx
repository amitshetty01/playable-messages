import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} className="block no-underline">
      <article className="card-glow glass group relative overflow-hidden rounded-[1.6rem] p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sm:rounded-[1.8rem] sm:p-6">
        <div className="absolute inset-x-5 top-0 h-[2px] rounded-b-full opacity-80 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, ${category.accent}, rgba(151,218,223,.9))` }} />
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl font-extrabold backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:border-white/20"
          style={{ color: category.accent }}
        >
          {category.icon}
        </div>
        <h3 className="mt-5 text-xl font-extrabold tracking-[-0.03em] sm:text-2xl">{category.name}</h3>
        <p className="mt-2 text-sm leading-6 text-white/65 sm:min-h-20">{category.description}</p>
        <span className="ghost-button mt-6 inline-flex w-full items-center justify-center gap-2 text-sm">
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          Browse {category.name}
        </span>
      </article>
    </Link>
  );
}
