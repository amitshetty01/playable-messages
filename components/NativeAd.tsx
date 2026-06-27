"use client";

import Script from "next/script";
import { useBlockedCountry } from "@/lib/useBlockedCountry";

const AD_SRC = "https://pl29827411.effectivecpmnetwork.com/7ac926808937b014ea818a1f0dceadf2/invoke.js";

export function NativeAd() {
  const blocked = useBlockedCountry();

  if (blocked === null) return null;

  return (
    <div className="flex min-h-[90px] w-full items-center justify-center">
      <div id="container-7ac926808937b014ea818a1f0dceadf2" />
      <Script src={AD_SRC} strategy="afterInteractive" data-cfasync="false" />
    </div>
  );
}
