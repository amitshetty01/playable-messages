"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NativeAd } from "@/components/NativeAd";
import { SoundWelcome } from "@/components/SoundWelcome";
import { SoundToggleWrapper } from "@/components/SoundToggleWrapper";
import { CookieBanner } from "@/components/CookieBanner";

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = pathname === "/our-memories";

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <NativeAd />
      <main id="content" className="mx-auto min-h-[calc(100svh-220px)] w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
      <Footer />
      <SoundWelcome />
      <SoundToggleWrapper />
      <CookieBanner />
    </>
  );
}
