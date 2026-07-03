import type { Metadata } from "next";
import Link from "next/link";
import { allMessagesCache, categoryDisplay } from "@/lib/messages-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Messages for Every Occasion - Browse Thousands of Messages | Craft Your Message",
  description: "Browse thousands of messages for every occasion and relationship. Romantic messages, birthday wishes, apology texts, love letters, and more.",
  path: "/messages",
});

export default function MessagesIndexPage() {
  const grouped: Record<string, typeof allMessagesCache> = {};
  for (const msg of allMessagesCache) {
    if (!grouped[msg.categorySlug]) grouped[msg.categorySlug] = [];
    grouped[msg.categorySlug].push(msg);
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Messages</p>
        <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Messages for every occasion</h1>
        <p className="mt-5 max-w-3xl text-white/70">Browse thousands of messages organized by category and relationship. Find the perfect words for every moment.</p>
        <p className="mt-2 text-sm text-white/40">{allMessagesCache.length} messages available</p>
      </section>

      {Object.entries(grouped).map(([slug, msgs]) => {
        const cat = categoryDisplay[slug];
        return (
          <section key={slug}>
            <div className="mb-4">
              <p className="text-xs font-bold tracking-[0.08em] text-white/50">{cat?.name || slug}</p>
              <h2 className="display-title mt-1 text-2xl font-bold sm:text-3xl">{cat?.name || slug}</h2>
              {cat && <p className="mt-1 text-sm text-white/50">{cat.description}</p>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {msgs.slice(0, 12).map((msg) => (
                <Link
                  key={msg.id}
                  href={`/messages/${msg.slug}`}
                  className="glass group rounded-[1.2rem] p-4 transition hover:bg-white/15"
                >
                  <h3 className="text-sm font-extrabold text-white group-hover:underline">{msg.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-white/50">{msg.metaDescription}</p>
                </Link>
              ))}
            </div>
            {msgs.length > 12 && (
              <Link href={`/messages?category=${slug}`} className="mt-3 inline-flex text-sm font-bold text-white/50 hover:text-white/70 transition">
                View all {msgs.length} messages →
              </Link>
            )}
          </section>
        );
      })}

      <section className="flex flex-wrap justify-center gap-3">
        <Link className="ghost-button" href="/collections">View Collections</Link>
        <Link className="ghost-button" href="/generator">AI Generators</Link>
        <Link className="ghost-button" href="/games">Message Games</Link>
      </section>
    </div>
  );
}
