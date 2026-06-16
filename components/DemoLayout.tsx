import Link from "next/link";
import type { Template } from "@/lib/types";

export function DemoLayout({ template, children }: { template: Template; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-5 sm:p-8">
        <p className="text-xs font-bold tracking-[0.08em] text-white/50">Playable demo</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-title text-4xl font-bold leading-tight sm:text-6xl">{template.title}</h1>
            <p className="mt-4 max-w-3xl text-white/70">{template.description}</p>
          </div>
          <Link className="premium-button" href={`/create/${template.id}`}>Create your own version</Link>
        </div>
      </section>
      {children}
    </div>
  );
}
