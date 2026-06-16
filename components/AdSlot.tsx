export function AdSlot({ label = "Sponsor space" }: { label?: string }) {
  return (
    <aside className="rounded-[1.5rem] border border-dashed border-white/20 bg-white/[0.04] p-6 text-center text-sm text-white/50" aria-label="Advertisement placeholder">
      <p className="font-bold tracking-[0.08em]">{label}</p>
      <p className="mt-2">Reserved for relevant creative tools. Ads never appear inside the emotional experience flow.</p>
    </aside>
  );
}
