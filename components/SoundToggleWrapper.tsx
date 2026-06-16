"use client";

import { SoundToggle, useSound } from "@/components/SoundToggle";

export function SoundToggleWrapper() {
  const { enabled, toggle } = useSound();
  return <SoundToggle enabled={enabled} onToggle={toggle} />;
}
