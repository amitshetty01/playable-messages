import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description: "This Craft Your Message page could not be found.",
  path: "/404",
  noIndex: true
});

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[50vh] max-w-2xl place-items-center text-center">
      <div className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-sm font-bold tracking-[0.08em] text-white/50">Not found</p>
        <h1 className="display-title mt-3 text-4xl font-bold sm:text-5xl">This experience disappeared.</h1>
        <p className="mt-4 text-white/70">The page may have moved, or the link may be incomplete.</p>
        <Link className="premium-button mt-6" href="/templates">Explore experiences</Link>
      </div>
    </div>
  );
}
