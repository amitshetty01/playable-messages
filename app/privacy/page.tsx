import type { Metadata } from "next";
import { buildMetadata, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Craft Your Message. Learn how we handle your data, generated messages, and analytics when you create interactive shareable links.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy — Craft Your Message",
            description: "How Craft Your Message collects, stores, and protects your data when you create and share interactive messages.",
            url: "https://craftyourmessage.com/privacy",
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
          <h1 className="display-title mt-3 text-4xl font-bold leading-tight text-white sm:text-6xl">Privacy Policy</h1>
          <p className="mt-4 text-white/50">Last updated: June 2026</p>
          <p className="mt-6 leading-8 text-white/70">Craft Your Message (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our interactive message generator.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">1. Information We Store</h2>
          <p className="mt-4 leading-8 text-white/70">When you create a generated experience, we store the following data to render the interactive message link:</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-white/70">
            <li>Creator name and receiver nickname (you provide these)</li>
            <li>Selected template, category, tone, and theme</li>
            <li>Custom messages, step-by-step content, and final reveal message</li>
            <li>Creation timestamp and a unique 14-character experience ID</li>
            <li>Optional link expiry time if you set one</li>
            <li>Minimal analytics (opens, completions, selected choices, CTA clicks)</li>
          </ul>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">2. How We Use Your Data</h2>
          <p className="mt-4 leading-8 text-white/70">We use stored data only to:</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-white/70">
            <li>Render the interactive experience when someone opens your shared link</li>
            <li>Track basic engagement metrics (opens, completions) shown on your dashboard</li>
            <li>Improve our template library and user experience based on aggregate patterns</li>
          </ul>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">3. What We Do Not Collect</h2>
          <p className="mt-4 leading-8 text-white/70">We do <strong className="text-white">not</strong> collect or store:</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-white/70">
            <li>Phone numbers, email addresses, or physical addresses</li>
            <li>Exact location data or IP addresses tied to specific experiences</li>
            <li>Private chat logs, relationship status, or psychological assessments</li>
            <li>Passwords, login credentials, or authentication data (login is not required)</li>
            <li>Payment information or credit card details</li>
          </ul>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">4. Public Links</h2>
          <p className="mt-4 leading-8 text-white/70">Generated experiences are publicly accessible to anyone who has the unique link. You should not include private or sensitive information unless you understand that the link can be forwarded or shared. We recommend sharing links only with trusted recipients.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">5. Data Retention</h2>
          <p className="mt-4 leading-8 text-white/70">Generated experiences are stored indefinitely unless you delete them or set an expiry date. If you would like us to manually remove a specific experience, please contact us with the experience ID. Analytics data may be retained in aggregate after individual experiences are deleted.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">6. Third-Party Services</h2>
          <p className="mt-4 leading-8 text-white/70">We use Supabase as our database provider. Your data is stored in Supabase&apos;s infrastructure. Supabase is SOC 2 compliant and follows industry-standard security practices. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">7. Changes to This Policy</h2>
          <p className="mt-4 leading-8 text-white/70">We may update this privacy policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section className="glass rounded-[2rem] p-5 sm:p-8">
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white">8. Contact</h2>
          <p className="mt-4 leading-8 text-white/70">If you have questions about this privacy policy or would like to request deletion of your data, please visit our <a className="text-white underline underline-offset-2 hover:text-white/80" href="/contact">contact page</a>.</p>
        </section>
      </article>
    </>
  );
}
