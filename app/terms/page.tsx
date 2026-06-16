import type { Metadata } from "next";
import { buildMetadata, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of service for Craft Your Message. Understand the rules, allowed use, content guidelines, and disclaimers for creating interactive shareable messages.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service — Craft Your Message",
            description: "Terms governing the use of Craft Your Message interactive message generator.",
            url: "https://craftyourmessage.com/terms",
            isPartOf: {
              "@type": "WebSite",
              name: "Craft Your Message",
              url: "https://craftyourmessage.com"
            }
          })
        }}
      />
      <article className="mx-auto max-w-4xl space-y-8">
        <section className="glass rounded-[2rem] p-5 sm:p-8 lg:p-10">
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">Legal</p>
          <h1 className="display-title mt-3 text-4xl font-bold leading-tight text-white sm:text-6xl">Terms of Service</h1>
          <p className="mt-4 text-white/50">Last updated: June 2026</p>
          <p className="mt-6 leading-8 text-white/70">By using Craft Your Message (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, please do not use the Service.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">1. Entertainment Purpose Only</h2>
          <p className="mt-4 leading-8 text-white/70">Craft Your Message is a fun, entertainment-only platform for creating interactive messages. It does <strong className="text-white">not</strong> provide:</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-white/70">
            <li>Relationship advice, counseling, or psychological assessment</li>
            <li>Compatibility or loyalty testing</li>
            <li>Proof of anyone&apos;s real feelings, intentions, or honesty</li>
            <li>Legal, medical, or professional advice of any kind</li>
          </ul>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">2. Allowed Use</h2>
          <p className="mt-4 leading-8 text-white/70">You may use the Service to create and share:</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-white/70">
            <li>Personal confessions, apologies, and emotional reveals</li>
            <li>Birthday wishes, appreciation notes, and friendship messages</li>
            <li>Playful roasts, jokes, and funny interactions</li>
            <li>Mysterious or surprise messages with consenting recipients</li>
            <li>Any other respectful, non-harmful interactive content</li>
          </ul>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">3. Prohibited Use</h2>
          <p className="mt-4 leading-8 text-white/70">You must <strong className="text-white">not</strong> use the Service to:</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-white/70">
            <li>Harass, threaten, intimidate, or bully any individual</li>
            <li>Impersonate another person or entity</li>
            <li>Manipulate, pressure, or coerce anyone emotionally</li>
            <li>Expose private information (doxing) or share non-consensual content</li>
            <li>Create or distribute harmful, hateful, or illegal content</li>
            <li>Violate any applicable local, national, or international law</li>
          </ul>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">4. Content Responsibility</h2>
          <p className="mt-4 leading-8 text-white/70">You are solely responsible for the content you create and share through the Service. We do not pre-screen or moderate generated experiences, but we reserve the right to remove content that violates these terms or is reported through our abuse system.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">5. Intellectual Property</h2>
          <p className="mt-4 leading-8 text-white/70">The Service, including its UI, template designs, animations, copy, and underlying code, is owned by Craft Your Message. You may not copy, modify, distribute, or reverse-engineer the Service beyond personal use. The content you create (your custom messages) belongs to you.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">6. Limitation of Liability</h2>
          <p className="mt-4 leading-8 text-white/70">The Service is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages, emotional distress, or misunderstandings arising from the use of generated links. Use the Service at your own discretion.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">7. Reporting Abuse</h2>
          <p className="mt-4 leading-8 text-white/70">If you believe a generated experience violates these terms or contains harmful content, please <a className="text-white underline underline-offset-2 hover:text-white/80" href="/report">report it here</a> or <a className="text-white underline underline-offset-2 hover:text-white/80" href="/contact">contact us</a>.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">8. Changes to Terms</h2>
          <p className="mt-4 leading-8 text-white/70">We may update these terms at any time. Changes are effective immediately upon posting. Continued use of the Service after changes constitutes acceptance.</p>
        </section>
      </article>
    </>
  );
}
