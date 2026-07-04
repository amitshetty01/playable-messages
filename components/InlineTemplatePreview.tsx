"use client";

import { useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { templates, getTemplate } from "@/lib/data";
import { createDemoExperience } from "@/lib/demo";

const ExperiencePlayer = dynamic(
  () => import("@/components/ExperiencePlayer").then((m) => ({ default: m.ExperiencePlayer })),
  { ssr: false }
);

const TEMPLATE_PREVIEW_INFO: Record<string, { label: string }> = {
  "love-chase": { label: "Catch My Heart" },
  "birthday-surprise-journey": { label: "Blow Out the Candles" },
  "love-contract": { label: "Love Contract" },
  "kitty-apology": { label: "Kitty Apology" },
  "sorry-maze": { label: "Sorry Maze" },
  "escape-me": { label: "Escape Me" },
  "our-memories": { label: "Our Memories" },
  "the-final-button": { label: "Moving Button" },
};

export function InlineTemplatePreview({ templateId }: { templateId: string | null }) {
  const info = templateId ? TEMPLATE_PREVIEW_INFO[templateId] : null;
  const template = templateId ? getTemplate(templateId) : null;
  const experience = useMemo(() => {
    if (!template) return null;
    return createDemoExperience(template);
  }, [template]);

  if (!info || !template || !experience) return null;

  return (
    <section className="glass rounded-[2rem] p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.08em] text-white/50">Try this template</p>
          <h2 className="display-title mt-2 text-2xl font-bold leading-tight sm:text-4xl">{info.label}</h2>
          <p className="mt-1 text-sm text-white/60">{template.hook}</p>
        </div>
        <Link
          href={`/create/${templateId}`}
          className="premium-button shrink-0 text-xs"
        >
          Create Yours
        </Link>
      </div>
      <div className="mx-auto flex justify-center">
        <div className="relative w-[280px]">
          <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.5rem] border-[3px] border-white/15 shadow-2xl" />
          <div className="pointer-events-none absolute -top-1 left-1/2 z-20 h-1 w-16 -translate-x-1/2 rounded-full bg-black" />
          <div className="overflow-hidden rounded-[2.35rem] bg-black">
            <div className="aspect-[9/16] w-full overflow-hidden bg-zinc-950" style={{ transform: "translateZ(0)" }}>
              <ExperiencePlayer
                template={template}
                experience={experience}
                mode="demo"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link
          href={`/templates/${template.slug}`}
          className="text-sm font-bold text-white/50 underline underline-offset-4 transition-colors hover:text-white/70"
        >
          Learn more about {info.label}
        </Link>
      </div>
    </section>
  );
}
