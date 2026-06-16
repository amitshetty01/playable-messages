"use client";

import { useEffect, useState } from "react";

export function AutoMovingSlider({ onLock }: { onLock: (value: number) => void }) {
  const [value, setValue] = useState(54);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setValue((current) => Math.max(0, Math.min(100, current + Math.round(Math.random() * 10 - 5))));
    }, 650);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto mt-8 max-w-xl text-center">
      <input className="w-full accent-blush" min={0} max={100} type="range" value={value} onChange={(event) => setValue(Number(event.target.value))} />
      <strong className="display-title mt-5 block text-5xl font-bold tracking-[-0.04em] sm:text-6xl">{value}%</strong>
      <p className="mt-2 text-sm text-white/60">The slider may be slightly dramatic.</p>
      <button className="premium-button mt-6" type="button" onClick={() => onLock(value)}>Lock answer</button>
    </div>
  );
}
