"use client";

import { useEffect, useRef } from "react";

const AD_KEYS = {
  native: {
    key: "7ac926808937b014ea818a1f0dceadf2",
    src: "https://pl29827411.effectivecpmnetwork.com/7ac926808937b014ea818a1f0dceadf2/invoke.js",
  },
  square: {
    key: "0b5011ee65a3dd233687d2fd48d23fb5",
    src: "https://www.highperformanceformat.com/0b5011ee65a3dd233687d2fd48d23fb5/invoke.js",
  },
  rectangle: {
    key: "4325688d299d71bc93ad520c92ef88c0",
    src: "https://www.highperformanceformat.com/4325688d299d71bc93ad520c92ef88c0/invoke.js",
    mobileKey: "e3c30deb4664de4d59b562ebcbde57cd",
    mobileSrc: "https://www.highperformanceformat.com/e3c30deb4664de4d59b562ebcbde57cd/invoke.js",
  },
};

type AdType = "square" | "rectangle";

export function AdsterraAd({ type, className = "" }: { type: AdType; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cfg = AD_KEYS[type];

    if (type === "rectangle") {
      const isDesktop = window.innerWidth >= 768;
      const key = isDesktop ? cfg.key : (cfg as typeof AD_KEYS.rectangle).mobileKey;
      const src = isDesktop ? cfg.src : (cfg as typeof AD_KEYS.rectangle).mobileSrc;
      const height = isDesktop ? 90 : 50;
      const width = isDesktop ? 728 : 320;

      const boot = document.createElement("script");
      boot.textContent = `
        window.atOptions = {
          key: "${key}",
          format: "iframe",
          height: ${height},
          width: ${width},
          params: {}
        };
        var s = document.createElement("script");
        s.src = "${src}";
        s.async = true;
        document.currentScript.parentNode.appendChild(s);
      `;
      ref.current?.appendChild(boot);
    } else {
      const boot = document.createElement("script");
      boot.textContent = `
        window.atOptions = {
          key: "${cfg.key}",
          format: "iframe",
          height: 250,
          width: 300,
          params: {}
        };
        var s = document.createElement("script");
        s.src = "${cfg.src}";
        s.async = true;
        document.currentScript.parentNode.appendChild(s);
      `;
      ref.current?.appendChild(boot);
    }
  }, [type]);

  return <div ref={ref} className={`flex justify-center ${className}`} />;
}
