"use client";

import type { Tone } from "@/lib/types";
import { playWarmTap, playBrightTap, playSoftTap, playSharpTap, playWarmDing, playBrightDing, playSoftDing, playSharpDing, playError } from "@/lib/sounds";

let audioCtx: AudioContext | null = null;
let activeNodes: any[] = [];

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function createGain(ctx: AudioContext, volume: number, fadeIn = 0.3): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + fadeIn);
  gain.connect(ctx.destination);
  return gain;
}

function wrapNode(node: AudioNode): { stop: () => void } {
  return { stop: () => { try { node.disconnect(); } catch { /* */ } } };
}

function createFilter(ctx: AudioContext, type: BiquadFilterType, freq: number, q = 1): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freq, ctx.currentTime);
  filter.Q.setValueAtTime(q, ctx.currentTime);
  return filter;
}

function startOsc(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  gain: GainNode,
  filter?: BiquadFilterNode
): OscillatorNode {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (filter) {
    osc.connect(filter);
    filter.connect(gain);
  } else {
    osc.connect(gain);
  }
  osc.start();
  return osc;
}

function scheduleLFO(
  ctx: AudioContext,
  target: AudioParam,
  freq: number,
  amount: number
): OscillatorNode {
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(freq, ctx.currentTime);
  lfoGain.gain.setValueAtTime(amount, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(target);
  lfo.start();
  return lfo;
}

function scheduleEcho(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  count: number,
  delay: number,
  volume: number
) {
  const now = ctx.currentTime;
  for (let i = 0; i < count; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, now + i * delay);
    gain.gain.linearRampToValueAtTime(volume, now + i * delay + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + i * delay + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    const stopTime = now + i * delay + 0.3;
    osc.start(now + i * delay);
    osc.stop(stopTime);
    activeNodes.push(osc);
    activeNodes.push(gain);
  }
}

export function playMoodAmbient(tone: Tone) {
  stopMoodAmbient();
  const ctx = getCtx();
  const now = ctx.currentTime;
  const nodes: any[] = [];

  switch (tone) {
    case "Romantic": {
      const gain = createGain(ctx, 0.04);
      const filter = createFilter(ctx, "lowpass", 800);
      filter.frequency.linearRampToValueAtTime(2000, now + 4);
      filter.frequency.linearRampToValueAtTime(800, now + 8);
      [261.63, 329.63, 392].forEach((f) => {
        nodes.push(startOsc(ctx, f, "sine", gain, filter));
      });
      gain.connect(ctx.destination);
      nodes.push(gain, filter);
      break;
    }
    case "Funny": {
      const gain = createGain(ctx, 0.06);
      const notes = [261.63, 329.63, 392, 523.25];
      let noteIdx = 0;
      const interval = setInterval(() => {
        try {
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.06, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          g.connect(ctx.destination);
          const osc = ctx.createOscillator();
          osc.type = "square";
          osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);
          osc.connect(g);
          osc.start();
          osc.stop(ctx.currentTime + 0.1);
          noteIdx++;
        } catch { /* */ }
      }, 150);
      const timerId = { stop: () => clearInterval(interval) };
      nodes.push(timerId);
      break;
    }
    case "Sorry": {
      const gain = createGain(ctx, 0.05);
      const seq = [110, 82.41, 73.42];
      seq.forEach((f, i) => {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now + i * 1.2);
        g.gain.linearRampToValueAtTime(0.05, now + i * 1.2 + 0.3);
        g.gain.linearRampToValueAtTime(0, now + i * 1.2 + 1.5);
        g.connect(ctx.destination);
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + i * 1.2);
        osc.connect(g);
        osc.start(now + i * 1.2);
        osc.stop(now + i * 1.2 + 1.5);
        nodes.push(osc, g);
      });
      gain.connect(ctx.destination);
      nodes.push(gain);
      break;
    }
    case "Savage": {
      const gain = createGain(ctx, 0.08);
      const filter = createFilter(ctx, "lowpass", 200);
      const osc = startOsc(ctx, 55, "sawtooth", gain, filter);
      const lfo = scheduleLFO(ctx, filter.frequency, 2, 100);
      gain.connect(ctx.destination);
      nodes.push(osc, gain, filter, lfo);
      break;
    }
    case "Emotional": {
      const gain = createGain(ctx, 0.04);
      const freqs = [220, 329.63, 440];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f + i * 0.5, now);
        const lfo = scheduleLFO(ctx, osc.frequency, 0.3, 2);
        osc.connect(gain);
        osc.start();
        nodes.push(osc, lfo);
      });
      gain.connect(ctx.destination);
      nodes.push(gain);
      break;
    }
    case "Mystery": {
      const gain = createGain(ctx, 0.03);
      const filter = createFilter(ctx, "highpass", 1500);
      const osc = startOsc(ctx, 2000, "triangle", gain, filter);
      const reverbGain = createGain(ctx, 0.015);
      scheduleEcho(ctx, 2000, "triangle", 6, 0.2, 0.015);
      gain.connect(ctx.destination);
      reverbGain.connect(ctx.destination);
      nodes.push(osc, gain, filter, reverbGain);
      break;
    }
    case "Birthday": {
      const gain = createGain(ctx, 0.06);
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now + i * 0.4);
        g.gain.linearRampToValueAtTime(0.06, now + i * 0.4 + 0.1);
        g.gain.linearRampToValueAtTime(0, now + i * 0.4 + 0.8);
        g.connect(ctx.destination);
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + i * 0.4);
        osc.connect(g);
        osc.start(now + i * 0.4);
        osc.stop(now + i * 0.4 + 0.8);
        nodes.push(osc, g);
      });
      gain.connect(ctx.destination);
      nodes.push(gain);
      break;
    }
    case "Friendship": {
      const gain = createGain(ctx, 0.04);
      const filter = createFilter(ctx, "lowpass", 1200);
      [261.63, 329.63, 392].forEach((f) => {
        nodes.push(startOsc(ctx, f, "sine", gain, filter));
      });
      [130.81, 164.81, 196].forEach((f) => {
        const subOsc = ctx.createOscillator();
        subOsc.type = "triangle";
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.02, now);
        subOsc.frequency.setValueAtTime(f, now);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start();
        nodes.push(subOsc, subGain);
      });
      gain.connect(ctx.destination);
      nodes.push(gain, filter);
      break;
    }
  }

  activeNodes = nodes;
}

export function stopMoodAmbient() {
  activeNodes.forEach((n) => {
    try {
      if (typeof (n as any).stop === "function") (n as any).stop();
      else if (typeof (n as any).disconnect === "function") (n as any).disconnect();
    } catch { /* already stopped */ }
  });
  activeNodes = [];
}

const TONE_UI_SOUND: Record<Tone, { tap: string; ding: string; success: string; error: string }> = {
  Romantic: { tap: "WarmTap", ding: "WarmDing", success: "WarmDing", error: "error" },
  Funny: { tap: "BrightTap", ding: "BrightDing", success: "BrightDing", error: "error" },
  Sorry: { tap: "SoftTap", ding: "SoftDing", success: "SoftDing", error: "error" },
  Savage: { tap: "SharpTap", ding: "SharpDing", success: "SharpDing", error: "error" },
  Emotional: { tap: "WarmTap", ding: "WarmDing", success: "WarmDing", error: "error" },
  Mystery: { tap: "SharpTap", ding: "SharpDing", success: "SharpDing", error: "error" },
  Birthday: { tap: "BrightTap", ding: "BrightDing", success: "BrightDing", error: "error" },
  Friendship: { tap: "BrightTap", ding: "BrightDing", success: "BrightDing", error: "error" },
};

const UI_SOUND_FN: Record<string, () => void> = {
  WarmTap: playWarmTap,
  WarmDing: playWarmDing,
  BrightTap: playBrightTap,
  BrightDing: playBrightDing,
  SoftTap: playSoftTap,
  SoftDing: playSoftDing,
  SharpTap: playSharpTap,
  SharpDing: playSharpDing,
  error: playError,
};

export function playUISound(action: "step" | "complete" | "success" | "error", tone: Tone) {
  if (typeof window === "undefined") return;
  const pref = localStorage.getItem("craft-message-sound");
  if (pref === "off") return;

  const map = TONE_UI_SOUND[tone];
  if (!map) return;

  let soundKey: string;
  switch (action) {
    case "step":
      soundKey = map.tap;
      break;
    case "complete":
    case "success":
      soundKey = map.ding;
      break;
    case "error":
      soundKey = "error";
      break;
  }

  UI_SOUND_FN[soundKey]?.();
}
