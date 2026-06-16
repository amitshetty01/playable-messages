"use client";

import { useEffect, useState, useRef } from "react";

export function StepTransition({ step, children }: { step: number; children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [rendered, setRendered] = useState(children);
  const prevStep = useRef(step);

  useEffect(() => {
    if (prevStep.current !== step) {
      setVisible(false);
      const timeout = setTimeout(() => {
        setRendered(children);
        setVisible(true);
        prevStep.current = step;
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setRendered(children);
    }
  }, [step, children]);

  return (
    <div
      className="transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      {rendered}
    </div>
  );
}
