import { siteName } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

type FaqItem = { question: string; answer: string };
type BreadcrumbItem = { name: string; path: string };

export function jsonLdScript(data: unknown) {
  const str = JSON.stringify(data).replace(/</g, "\\u003c");
  return { __html: str };
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(title: string, description: string, path: string, datePublished?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: siteName },
    publisher: { "@type": "Organization", name: siteName },
    datePublished: datePublished || new Date().toISOString().split("T")[0],
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    image: absoluteUrl("/opengraph-image"),
  };
}

export function webpageSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    publisher: { "@type": "Organization", name: siteName },
  };
}

export function howToSchema(name: string, description: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((stepText, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: stepText,
    })),
  };
}

export function creativeWorkSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url: absoluteUrl(path),
    publisher: { "@type": "Organization", name: siteName },
  };
}

export function combinedSchema(...schemas: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}
