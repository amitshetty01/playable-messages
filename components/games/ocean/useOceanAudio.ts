"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { CreatureId, GamePhase } from "./types";

interface OceanAudioEngine {
  context: AudioContext;
  master: GainNode;
  waterFilter: BiquadFilterNode;
  ambienceGain: GainNode;
  bassGain: GainNode;
  noiseSource: AudioBufferSourceNode;
  bassOscillator: OscillatorNode;
}

const CREATURE_TONES: Record<CreatureId, [number, number]> = {
  turtle: [220, 330],
  dolphin: [660, 990],
  jellyfish: [440, 880],
  octopus: [180, 270],
  whale: [58, 116],
};

function createNoiseBuffer(context: AudioContext) {
  const length = context.sampleRate * 3;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;

  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    previous = previous * 0.96 + white * 0.04;
    data[i] = previous * 0.8;
  }

  return buffer;
}

function getAudioContextConstructor() {
  return window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

function stopEngine(engine: OceanAudioEngine | null) {
  if (!engine) return;

  try {
    engine.noiseSource.stop();
    engine.bassOscillator.stop();
    void engine.context.close();
  } catch {
    // Audio nodes may already be stopped during hot reload.
  }
}

export function useOceanAudio(phase: GamePhase) {
  const engineRef = useRef<OceanAudioEngine | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const [isAudioStarted, setIsAudioStarted] = useState(false);

  const playTone = useCallback((frequency: number, duration: number, gain = 0.05, type: OscillatorType = "sine") => {
    const engine = engineRef.current;
    if (!engine) return;

    const { context, master } = engine;
    const oscillator = context.createOscillator();
    const toneGain = context.createGain();
    const now = context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    toneGain.gain.setValueAtTime(0.0001, now);
    toneGain.gain.exponentialRampToValueAtTime(gain, now + 0.04);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(toneGain);
    toneGain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
  }, []);

  const startAudio = useCallback(() => {
    if (engineRef.current || typeof window === "undefined") return;

    const AudioContextConstructor = getAudioContextConstructor();
    if (!AudioContextConstructor) return;

    const context = new AudioContextConstructor();
    const master = context.createGain();
    const waterFilter = context.createBiquadFilter();
    const ambienceGain = context.createGain();
    const bassGain = context.createGain();
    const noiseSource = context.createBufferSource();
    const bassOscillator = context.createOscillator();

    master.gain.value = 0.34;
    master.connect(context.destination);

    waterFilter.type = "lowpass";
    waterFilter.frequency.value = 1400;
    waterFilter.Q.value = 0.7;

    ambienceGain.gain.value = 0.18;
    noiseSource.buffer = createNoiseBuffer(context);
    noiseSource.loop = true;
    noiseSource.connect(waterFilter);
    waterFilter.connect(ambienceGain);
    ambienceGain.connect(master);

    bassOscillator.type = "sine";
    bassOscillator.frequency.value = 52;
    bassGain.gain.value = 0.025;
    bassOscillator.connect(bassGain);
    bassGain.connect(master);

    noiseSource.start();
    bassOscillator.start();

    engineRef.current = {
      context,
      master,
      waterFilter,
      ambienceGain,
      bassGain,
      noiseSource,
      bassOscillator,
    };
    setIsAudioStarted(true);
  }, []);

  const playCreatureCue = useCallback((id: CreatureId) => {
    const [low, high] = CREATURE_TONES[id];
    playTone(low, id === "whale" ? 2.4 : 0.9, id === "whale" ? 0.12 : 0.05, id === "whale" ? "sine" : "triangle");
    window.setTimeout(() => playTone(high, 0.7, 0.035, "sine"), id === "whale" ? 500 : 120);
  }, [playTone]);

  const playWrongPassword = useCallback(() => {
    playTone(92, 0.6, 0.08, "sawtooth");
    window.setTimeout(() => playTone(70, 0.5, 0.07, "sawtooth"), 120);
  }, [playTone]);

  const playUnlock = useCallback(() => {
    [220, 330, 550, 880].forEach((frequency, index) => {
      window.setTimeout(() => playTone(frequency, 1.2, 0.06, "triangle"), index * 150);
    });
    window.setTimeout(() => playTone(48, 2.5, 0.14, "sine"), 350);
  }, [playTone]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const now = engine.context.currentTime;
    const underwater = phase !== "surface";
    const reveal = phase === "reveal";

    engine.waterFilter.frequency.setTargetAtTime(underwater ? 620 : 4800, now, 0.55);
    engine.ambienceGain.gain.setTargetAtTime(reveal ? 0.24 : underwater ? 0.2 : 0.12, now, 0.55);
    engine.bassGain.gain.setTargetAtTime(reveal ? 0.06 : underwater ? 0.035 : 0.018, now, 0.7);
    engine.master.gain.setTargetAtTime(reveal ? 0.42 : 0.34, now, 0.7);
  }, [phase, isAudioStarted]);

  useEffect(() => {
    if (!isAudioStarted) return;

    bubbleTimerRef.current = window.setInterval(() => {
      if (phase === "surface") return;
      const frequency = 720 + Math.random() * 700;
      playTone(frequency, 0.12 + Math.random() * 0.14, 0.012, "sine");
    }, 850);

    return () => {
      if (bubbleTimerRef.current !== null) {
        window.clearInterval(bubbleTimerRef.current);
        bubbleTimerRef.current = null;
      }
    };
  }, [isAudioStarted, phase, playTone]);

  useEffect(() => {
    return () => stopEngine(engineRef.current);
  }, []);

  return {
    isAudioStarted,
    playCreatureCue,
    playUnlock,
    playWrongPassword,
    startAudio,
  };
}
