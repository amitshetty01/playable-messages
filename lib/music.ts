"use client";

let audioCtx: AudioContext | null = null;
let activeNodes: { stop: () => void }[] = [];

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function createGain(ctx: AudioContext, start: number, duration: number, peak = 0.06): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.3);
  gain.gain.setValueAtTime(peak, start + duration - 1);
  gain.gain.linearRampToValueAtTime(0, start + duration);
  gain.connect(ctx.destination);
  return gain;
}

export function playMusic(theme: string) {
  stopMusic();
  const ctx = getCtx();
  const now = ctx.currentTime;
  const duration = 12;
  const nodes: { stop: () => void }[] = [];

  const themeConfigs: Record<string, () => void> = {
    "Dark Romantic": () => {
      const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.setValueAtTime(110, now);
      const g1 = createGain(ctx, now, duration, 0.04); o1.connect(g1); o1.start(now); o1.stop(now + duration);
      nodes.push(o1);
      const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.setValueAtTime(165, now);
      const g2 = createGain(ctx, now, duration, 0.02); o2.connect(g2); o2.start(now); o2.stop(now + duration);
      nodes.push(o2);
    },
    "Soft Pastel": () => {
      const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.setValueAtTime(262, now);
      const g1 = createGain(ctx, now, duration, 0.03); o1.connect(g1); o1.start(now); o1.stop(now + duration);
      nodes.push(o1);
    },
    "Minimal Black": () => {
      const o1 = ctx.createOscillator(); o1.type = "triangle"; o1.frequency.setValueAtTime(80, now);
      const g1 = createGain(ctx, now, duration, 0.03); o1.connect(g1); o1.start(now); o1.stop(now + duration);
      nodes.push(o1);
    },
    "Cute Pink": () => {
      const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.setValueAtTime(330, now);
      const g1 = createGain(ctx, now, duration, 0.03); o1.connect(g1); o1.start(now); o1.stop(now + duration);
      nodes.push(o1);
      const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.setValueAtTime(440, now);
      const g2 = createGain(ctx, now, duration, 0.015); o2.connect(g2); o2.start(now); o2.stop(now + duration);
      nodes.push(o2);
    },
    "Neon Glitch": () => {
      const o1 = ctx.createOscillator(); o1.type = "sawtooth"; o1.frequency.setValueAtTime(55, now);
      const g1 = createGain(ctx, now, duration, 0.02); o1.connect(g1); o1.start(now); o1.stop(now + duration);
      nodes.push(o1);
      const o2 = ctx.createOscillator(); o2.type = "square"; o2.frequency.setValueAtTime(220, now);
      o2.frequency.linearRampToValueAtTime(180, now + duration);
      const g2 = createGain(ctx, now, duration, 0.015); o2.connect(g2); o2.start(now); o2.stop(now + duration);
      nodes.push(o2);
    },
    "Cinematic Purple": () => {
      const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.setValueAtTime(73, now);
      const g1 = createGain(ctx, now, duration, 0.04); o1.connect(g1); o1.start(now); o1.stop(now + duration);
      nodes.push(o1);
    },
    "Clean White": () => {
      const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.setValueAtTime(196, now);
      const g1 = createGain(ctx, now, duration, 0.02); o1.connect(g1); o1.start(now); o1.stop(now + duration);
      nodes.push(o1);
    }
  };

  const play = themeConfigs[theme] ?? themeConfigs["Dark Romantic"];
  if (play) play();
  activeNodes = nodes;
}

export function stopMusic() {
  activeNodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } });
  activeNodes = [];
}
