import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us — Craft Your Message",
  description: "Learn about Craft Your Message, the interactive message generator that turns simple texts into playful, personal, and shareable link-based experiences.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Craft Your Message",
            url: "https://craftyourmessage.com",
            description: "Create interactive messages people actually feel. Turn simple texts into playful, personal shareable links.",
            foundingDate: "2025",
            sameAs: []
          })
        }}
      />
      <article className="mx-auto max-w-4xl space-y-8">
        <section className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">About</p>
          <h1 className="display-title mt-3 text-4xl font-bold leading-tight text-white sm:text-6xl">A better way to send a message that actually lands</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Craft Your Message lets you turn plain words into an interactive link — with choices, little games, and a moment of reveal at the end. No design skills needed. No coding. Just your message, wrapped in something worth opening.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="premium-button" href="/create">Create your own</Link>
            <Link className="ghost-button" href="/templates">Browse templates</Link>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">Our Story</h2>
          <p className="mt-4 leading-8 text-white/70">Texting is how most of us talk now. But a wall of text — it doesn't land the way you want it to. We wanted something that felt more like a moment and less like a notification. So we built this: a place where a single link can carry warmth, timing, and a little bit of magic that plain words just can't deliver.</p>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="glass rounded-[1.6rem] p-5">
            <h2 className="text-xl font-extrabold text-white">Mobile-first</h2>
            <p className="mt-3 text-white/70">Every flow is designed for small screens, quick taps, and sharing directly in chat apps.</p>
          </div>
          <div className="glass rounded-[1.6rem] p-5">
            <h2 className="text-xl font-extrabold text-white">Personalizable</h2>
            <p className="mt-3 text-white/70">Change names, tone, theme, step-by-step copy, and the final reveal. Every message is unique.</p>
          </div>
          <div className="glass rounded-[1.6rem] p-5">
            <h2 className="text-xl font-extrabold text-white">No login needed</h2>
            <p className="mt-3 text-white/70">Create and share in seconds. No account, no app download, no friction.</p>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">What Makes Us Different</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-white">Interactive by design</h3>
              <p className="mt-2 text-white/70">Each template includes taps, choices, reveals, or mini-interactions. The recipient does not just read — they experience the message.</p>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Private by default</h3>
              <p className="mt-2 text-white/70">No accounts, no profiles, no social feed. Every experience has a unique, unguessable link. You control who sees it.</p>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Built for real moments</h3>
              <p className="mt-2 text-white/70">From apologies to birthday wishes, confessions to inside jokes — every template is designed around a genuine human interaction.</p>
            </div>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-5 text-center sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">Ready to try it?</h2>
          <p className="mt-4 text-white/70">Create your first interactive message in under a minute. No sign-up required.</p>
          <Link className="premium-button mt-6 inline-flex" href="/create">Create your first message</Link>
        </section>
      </article>
    </>
  );
}
