import { tones } from "@/lib/data";
import type { Tone } from "@/lib/types";

export function ToneSelector({ value, onChange }: { value: Tone; onChange: (tone: Tone) => void }) {
  return (
    <div className="grid min-w-0 gap-2">
      <label className="text-sm font-bold text-white/90" htmlFor="tone">Tone selection</label>
      <select id="tone" className="input" value={value} onChange={(event) => onChange(event.target.value as Tone)}>
        {tones.map((tone) => <option className="bg-ink" key={tone} value={tone}>{tone}</option>)}
      </select>
    </div>
  );
}
