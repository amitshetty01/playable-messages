import type { Metadata } from "next";
import { buildMetadata, jsonLd } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us — Craft Your Message",
  description: "Get in touch with Craft Your Message. Send us your questions, feedback, suggestions, or partnership inquiries through our contact form.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Us — Craft Your Message",
            description: "Contact the Craft Your Message team with questions, feedback, or suggestions.",
            url: "https://craftyourmessage.com/contact",
            isPartOf: {
              "@type": "WebSite",
              name: "Craft Your Message",
              url: "https://craftyourmessage.com"
            }
          })
        }}
      />
      <div className="mx-auto max-w-4xl">
        <ContactForm />
      </div>
    </>
  );
}
