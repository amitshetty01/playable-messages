"use client";

import { useState } from "react";

export function SuspenseReveal({ steps, onComplete }: { steps: Array<{ button: string; text: string }>; onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const current = steps[index];

  function next() {
    if (index >= steps.length - 1) onComplete();
    else setIndex((value) => value + 1);
  }

  return (
    <div className="mt-7 text-center">
      <h3 className="display-title text-3xl font-bold leading-tight sm:text-5xl">{current.text}</h3>
      <div className="my-7 flex justify-center gap-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white delay-150" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white delay-300" />
      </div>
      <button className="premium-button" type="button" onClick={next}>{current.button}</button>
    </div>
  );
}
