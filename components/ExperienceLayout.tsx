import { cn } from "@/lib/utils";
import type { ThemeName } from "@/lib/types";
import { themeClasses } from "@/lib/theme";

export function ExperienceLayout({ theme, kicker, title, titleAs = "h1", children }: { theme: ThemeName; kicker: string; title: string; titleAs?: "h1" | "h2"; children: React.ReactNode }) {
  const TitleTag = titleAs;

  return (
    <section className={cn("relative min-w-0 overflow-hidden rounded-[1.6rem] border border-white/15 bg-gradient-to-br p-3 shadow-glow sm:rounded-[2rem] sm:p-6 lg:p-8", themeClasses[theme])}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgba(255,255,255,.14),transparent_22rem)]" />
      <div className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.08em] opacity-60">{kicker}</p>
            <TitleTag className="display-title mt-2 text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">{title}</TitleTag>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
