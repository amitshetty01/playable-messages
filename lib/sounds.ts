"use client";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType, volume: number, ramp?: { to: number; time: number }) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (ramp) osc.frequency.exponentialRampToValueAtTime(ramp.to, ctx.currentTime + ramp.time);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* audio not supported */ }
}

function playChord(freqs: number[], duration: number, volume: number) {
  try {
    const ctx = getCtx();
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(volume / freqs.length, ctx.currentTime + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime + i * 0.02);
      osc.stop(ctx.currentTime + duration);
    });
  } catch { /* audio not supported */ }
}

export function playClick() { playTone(800, 0.1, "sine", 0.12, { to: 400, time: 0.08 }); }
export function playWhoosh() {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch { /* audio not supported */ }
}
export function playDing() { playChord([523, 659, 784], 0.4, 0.1); }
export function playGlitch() {
  try {
    const ctx = getCtx();
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(40 + Math.random() * 80, ctx.currentTime + i * 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.03);
      osc.start(ctx.currentTime + i * 0.04);
      osc.stop(ctx.currentTime + i * 0.04 + 0.03);
    }
  } catch { /* audio not supported */ }
}
export function playError() { playTone(200, 0.15, "square", 0.08, { to: 100, time: 0.15 }); }

/* ─── Tone-friendly sounds ─── */
export function playWarmTap() { playTone(660, 0.08, "sine", 0.07, { to: 440, time: 0.06 }); }
export function playWarmDing() { playChord([440, 554, 659], 0.35, 0.08); }
export function playWarmWhoosh() { playTone(180, 0.2, "sine", 0.04, { to: 600, time: 0.18 }); }

export function playBrightTap() { playTone(1200, 0.06, "sine", 0.08, { to: 800, time: 0.04 }); }
export function playBrightDing() { playChord([784, 988, 1175], 0.3, 0.09); }
export function playBrightWhoosh() {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch { /* audio not supported */ }
}

export function playSharpTap() { playTone(900, 0.04, "triangle", 0.1); }
export function playSharpDing() { playTone(1000, 0.15, "triangle", 0.08, { to: 1400, time: 0.1 }); }
export function playSharpWhoosh() { playTone(300, 0.15, "sawtooth", 0.04, { to: 800, time: 0.12 }); }

export function playSoftTap() { playTone(500, 0.06, "sine", 0.05, { to: 350, time: 0.04 }); }
export function playSoftDing() { playChord([350, 440, 523], 0.3, 0.06); }
export function playSoftWhoosh() { playTone(150, 0.25, "sine", 0.03, { to: 400, time: 0.2 }); }
