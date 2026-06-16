import { themes } from "@/lib/data";
import type { ThemeName } from "@/lib/types";

export function ThemeSelector({ value, onChange }: { value: ThemeName; onChange: (theme: ThemeName) => void }) {
  return (
    <div className="grid min-w-0 gap-2">
      <label className="text-sm font-bold text-white/90" htmlFor="theme">Theme selection</label>
      <select id="theme" className="input" value={value} onChange={(event) => onChange(event.target.value as ThemeName)}>
        {themes.map((theme) => <option className="bg-ink" key={theme} value={theme}>{theme}</option>)}
      </select>
    </div>
  );
}
