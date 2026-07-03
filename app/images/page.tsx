import type { Metadata } from "next";
import Link from "next/link";
import { imageSeoPages } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Message Images - Beautiful Quote Pictures | Craft Your Message",
  description: "Browse beautiful message images for every occasion. Love quotes, birthday wishes, good morning images, and more.",
  path: "/images",
});

export default function ImagesIndexPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Images</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Message Images</h1>
        <p className="mt-5 max-w-3xl text-white/70">Beautiful images with quotes and messages for every occasion. Perfect for sharing on social media, Pinterest, or as wallpapers.</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {imageSeoPages.map((img) => (
          <Link
            key={img.slug}
            href={`/images/${img.slug}`}
            className="glass group rounded-[2rem] p-5 transition hover:bg-white/15 sm:p-8"
          >
            <p className="text-xs font-bold tracking-[0.08em] text-white/50">{img.tone}</p>
            <h2 className="display-title mt-3 text-2xl font-bold leading-tight sm:text-3xl">{img.title}</h2>
            <p className="mt-3 line-clamp-3 text-white/70">{img.description}</p>
          </Link>
        ))}
      </div>

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="ghost-button" href="/templates">Browse Templates</Link>
        <Link className="ghost-button" href="/generator">AI Generators</Link>
        <Link className="ghost-button" href="/seasonal">Seasonal</Link>
      </section>
    </div>
  );
}
