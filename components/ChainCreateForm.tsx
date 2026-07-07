"use client";

type Props = {
  chainTarget: number;
  onChange: (target: number) => void;
};

export function ChainCreateForm({ chainTarget, onChange }: Props) {
  return (
    <div className="animate-section-fade rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4">
      <p className="text-xs font-bold tracking-[0.08em] text-white/40">👥 GROUP CARD</p>
      <div>
        <label className="block text-sm font-bold text-white/90 mb-1.5">
          How many people should contribute?
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={2}
            max={10}
            value={chainTarget}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 accent-blush"
          />
          <span className="text-lg font-bold text-white min-w-[2ch] text-center">{chainTarget}</span>
        </div>
        <p className="mt-1 text-xs text-white/40">
          {chainTarget} {chainTarget === 1 ? "person" : "people"} will contribute before it reaches the recipient.
        </p>
      </div>
    </div>
  );
}
