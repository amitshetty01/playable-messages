export type DeviceTier = "low" | "medium" | "high";

export type DeviceCapability = {
  tier: DeviceTier;
  ram: number;
  cores: number;
  hasWebGL: boolean;
  isTouch: boolean;
  reducedMotion: boolean;
};

export function detectDeviceCapability(): DeviceCapability {
  const nav = typeof navigator === "undefined" ? null : navigator;

  const ram = (nav as any)?.deviceMemory ?? 4;
  const cores = nav?.hardwareConcurrency ?? 4;
  const reducedMotion = nav
    ? nav?.userAgent.includes("Android") || nav?.userAgent.includes("iPhone")
      ? false
      : false
    : false;

  let hasWebGL = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    hasWebGL = !!gl;
  } catch {
    hasWebGL = false;
  }

  const preference = nav ? matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  let tier: DeviceTier;
  if (ram < 2 || cores < 2 || !hasWebGL || preference) {
    tier = "low";
  } else if (ram < 4 || cores < 4) {
    tier = "medium";
  } else {
    tier = "high";
  }

  return {
    tier,
    ram,
    cores,
    hasWebGL,
    isTouch: nav ? "ontouchstart" in window : false,
    reducedMotion: preference,
  };
}
