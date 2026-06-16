"use client";

import { useState, useEffect, useRef, createElement } from "react";

export function useSceneAnimation(delayMs = 0) {
  const [show, setShow] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const timer = setTimeout(() => {
      if (mounted.current) setShow(true);
    }, delayMs);
    return () => {
      mounted.current = false;
      clearTimeout(timer);
    };
  }, [delayMs]);

  return show;
}

type AnimatedStyleProps = {
  delay?: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
};

export function AnimatedText({
  delay = 0,
  duration = 600,
  distance = 30,
  children,
  className = "",
  style,
  as = "span",
}: AnimatedStyleProps) {
  const show = useSceneAnimation(delay);

  return createElement(
    as,
    {
      className,
      style: {
        ...style,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      },
    },
    children,
  );
}
