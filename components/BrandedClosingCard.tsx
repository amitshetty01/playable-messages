import Link from "next/link";

export function BrandedClosingCard({ templateId, creatorName }: { templateId: string; creatorName?: string }) {
  return (
    <div className="mx-auto mt-8 w-full max-w-3xl text-center">
      <div className="rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 shadow-glow backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blush via-violet to-neon shadow-lg">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <p className="text-xs font-bold tracking-[0.08em] text-white/40">
          Made with <span className="text-white/70">Craft Your Message</span>
        </p>
        <p className="mt-2 text-sm text-white/50">
          {creatorName ? `${creatorName} made this for you.` : "Someone made this for you."}
          {" "}Now it&apos;s your turn.
        </p>
        <Link
          href={`/create/${templateId}`}
          className="premium-button mt-5 inline-flex items-center gap-2"
        >
          Make your own
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
      <p className="mt-3 text-[10px] font-bold tracking-[0.08em] text-white/30">
        Craft Your Message · Turn words into experiences
      </p>
    </div>
  );
}
