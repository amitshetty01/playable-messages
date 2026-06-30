"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent } from "react";

import OceanScene from "./ocean/OceanScene";
import { useOceanAudio } from "./ocean/useOceanAudio";
import { CLUE_LABELS, REQUIRED_CLUES } from "./ocean/world";
import type { ChestStatus, CreatureId, GamePhase, InteractionPulses, NearbyTarget, SwimControls } from "./ocean/types";

const DEFAULT_PASSWORD = "OCEAN";
const DEFAULT_MESSAGE = "You found the light I hid beneath the sea.";

const EMPTY_PULSES: InteractionPulses = {
  turtle: 0,
  dolphin: 0,
  jellyfish: 0,
  octopus: 0,
  whale: 0,
};

const CLUE_COPY: Record<CreatureId, string> = {
  turtle: "The turtle revealed a cave glyph.",
  dolphin: "The dolphins marked the hidden current.",
  jellyfish: "The jellyfish lit the ancient symbols.",
  octopus: "The octopus opened a stone passage.",
  whale: "The whale song broke the abyssal wall.",
};

function createDefaultControls(): SwimControls {
  return {
    forward: 0,
    strafe: 0,
    vertical: 0,
    boost: false,
    yaw: 0,
    pitch: -0.08,
  };
}

function normalizePassword(value: string) {
  return value.trim().toUpperCase();
}

function isCreatureTarget(target: NearbyTarget | null): target is NearbyTarget & { id: CreatureId } {
  return target?.kind === "creature";
}

export function OceanDiveGame() {
  const controlsRef = useRef<SwimControls>(createDefaultControls());
  const keysRef = useRef(new Set<string>());
  const joystickRef = useRef({ x: 0, y: 0 });
  const verticalButtonRef = useRef(0);
  const boostButtonRef = useRef(false);
  const lookDragRef = useRef({ active: false, pointerId: -1, x: 0, y: 0 });
  const interactRef = useRef<() => void>(() => undefined);

  const [phase, setPhase] = useState<GamePhase>("surface");
  const [clues, setClues] = useState<CreatureId[]>([]);
  const [interactionPulses, setInteractionPulses] = useState<InteractionPulses>(EMPTY_PULSES);
  const [nearbyTarget, setNearbyTarget] = useState<NearbyTarget | null>(null);
  const [chestStatus, setChestStatus] = useState<ChestStatus>("sealed");
  const [wrongPulse, setWrongPulse] = useState(0);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [guidance, setGuidance] = useState("The cliff wind circles around you. Press Dive when you are ready.");
  const [finalFade, setFinalFade] = useState(false);
  const [config, setConfig] = useState({ password: DEFAULT_PASSWORD, message: DEFAULT_MESSAGE });

  const { isAudioStarted, playCreatureCue, playUnlock, playWrongPassword, startAudio } = useOceanAudio(phase);
  const collectedCount = clues.length;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const password = normalizePassword(params.get("password") || DEFAULT_PASSWORD);
    const message = params.get("message")?.trim() || DEFAULT_MESSAGE;
    setConfig({ password, message }); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const syncMovementControls = useCallback(() => {
    const keys = keysRef.current;
    const forwardFromKeys = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
    const strafeFromKeys = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
    const verticalFromKeys = (keys.has("Space") || keys.has("KeyR") ? 1 : 0) - (keys.has("KeyC") || keys.has("KeyF") ? 1 : 0);

    controlsRef.current.forward = Math.max(-1, Math.min(1, forwardFromKeys + joystickRef.current.y));
    controlsRef.current.strafe = Math.max(-1, Math.min(1, strafeFromKeys + joystickRef.current.x));
    controlsRef.current.vertical = Math.max(-1, Math.min(1, verticalFromKeys + verticalButtonRef.current));
    controlsRef.current.boost = keys.has("ShiftLeft") || keys.has("ShiftRight") || boostButtonRef.current;
  }, []);

  useEffect(() => {
    const canSwim = phase === "explore" || phase === "reveal";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canSwim || event.repeat) return;
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyR", "KeyC", "KeyF", "ShiftLeft", "ShiftRight"].includes(event.code)) {
        event.preventDefault();
        keysRef.current.add(event.code);
        syncMovementControls();
      }
      if (event.code === "KeyE") {
        event.preventDefault();
        interactRef.current();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.code);
      syncMovementControls();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [phase, syncMovementControls]);

  useEffect(() => {
    if (phase !== "reveal") {
      setFinalFade(false); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    const fadeTimer = window.setTimeout(() => setFinalFade(true), 11500);
    return () => window.clearTimeout(fadeTimer);
  }, [phase]);

  const handleDive = useCallback(() => {
    startAudio();
    setGuidance("Run. Jump. Slow motion. Splash. The sound of the world folds underwater.");
    setPhase("dive");
  }, [startAudio]);

  const handlePhaseChange = useCallback((nextPhase: GamePhase) => {
    setPhase(nextPhase);
    if (nextPhase === "explore") {
      setGuidance("Swim freely. Light, creatures, and landmarks will guide you without forcing a path.");
    }
  }, []);

  const handleInteract = useCallback(() => {
    const target = nearbyTarget;
    if (!target || target.disabled) return;

    if (isCreatureTarget(target)) {
      if (clues.includes(target.id)) return;

      setInteractionPulses((current) => ({ ...current, [target.id]: current[target.id] + 1 }));
      setClues((current) => (current.includes(target.id) ? current : [...current, target.id]));
      setGuidance(CLUE_COPY[target.id]);
      playCreatureCue(target.id);
      return;
    }

    if (target.id === "chest") {
      setPasswordValue("");
      setPasswordError("");
      setPhase("password");
      setGuidance("The password field is part of the chest magic. Enter the preview password to open it.");
    }
  }, [clues, nearbyTarget, playCreatureCue]);

  useEffect(() => {
    interactRef.current = handleInteract;
  }, [handleInteract]);

  const handlePasswordSubmit = useCallback(() => {
    if (normalizePassword(passwordValue) !== config.password) {
      setPasswordError("The chains tighten. Try again.");
      setChestStatus("wrong");
      setWrongPulse((value) => value + 1);
      playWrongPassword();
      window.setTimeout(() => setChestStatus("sealed"), 900);
      return;
    }

    setPasswordError("");
    setChestStatus("unlocking");
    setGuidance("The temple shakes. Chains split. Gold light floods the chamber.");
    playUnlock();
    window.setTimeout(() => {
      setChestStatus("open");
      setPhase("reveal");
    }, 1800);
  }, [config.password, passwordValue, playUnlock, playWrongPassword]);

  const cancelPassword = useCallback(() => {
    setPasswordError("");
    setPasswordValue("");
    setPhase("explore");
  }, []);

  const onRootPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (phase !== "explore" && phase !== "reveal") return;
    if ((event.target as HTMLElement).closest("[data-ocean-ui]")) return;

    lookDragRef.current = {
      active: true,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [phase]);

  const onRootPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = lookDragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    drag.x = event.clientX;
    drag.y = event.clientY;
    controlsRef.current.yaw += dx * 0.003;
    controlsRef.current.pitch = Math.max(-1.05, Math.min(0.85, controlsRef.current.pitch - dy * 0.0025));
  }, []);

  const endRootPointer = useCallback((event: PointerEvent<HTMLElement>) => {
    if (lookDragRef.current.pointerId === event.pointerId) {
      lookDragRef.current.active = false;
    }
  }, []);

  const clueSymbols = useMemo(() => REQUIRED_CLUES.map((id) => ({ id, label: CLUE_LABELS[id], active: clues.includes(id) })), [clues]);
  const canShowSwimControls = phase === "explore" || phase === "reveal";

  return (
    <main
      className="fixed inset-0 overflow-hidden bg-black text-white"
      onPointerCancel={endRootPointer}
      onPointerDown={onRootPointerDown}
      onPointerLeave={endRootPointer}
      onPointerMove={onRootPointerMove}
      onPointerUp={endRootPointer}
    >
      <OceanScene
        chestStatus={chestStatus}
        clues={clues}
        controlsRef={controlsRef}
        interactionPulses={interactionPulses}
        onPhaseChange={handlePhaseChange}
        onTargetChange={setNearbyTarget}
        phase={phase}
        revealMessage={config.message}
        wrongPulse={wrongPulse}
      />

      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_20%,rgba(143,210,255,0.12),transparent_38%),linear-gradient(180deg,transparent,rgba(0,8,22,0.2))]" />

      {phase === "surface" && (
        <section data-ocean-ui className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-5 pb-8 sm:pb-12">
          <div className="max-w-2xl rounded-[2rem] border border-white/15 bg-slate-950/35 p-6 text-center shadow-2xl shadow-sky-950/40 backdrop-blur-2xl sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.42em] text-cyan-100/60">Ocean Expedition</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">Dive below the living sea</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-cyan-50/72 sm:text-base">
              A continuous 3D preview of the underwater adventure. Explore freely, collect five magical symbols, wake the temple, and unlock the chest.
            </p>
            <button
              className="mt-6 rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 px-9 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-950 shadow-[0_0_45px_rgba(251,191,36,0.38)] transition hover:scale-105 active:scale-95"
              onClick={handleDive}
            >
              Dive
            </button>
            <p className="mt-4 text-xs text-cyan-50/45">Preview password: <span className="font-bold text-amber-200">{config.password}</span></p>
          </div>
        </section>
      )}

      {phase === "dive" && (
        <div data-ocean-ui className="absolute inset-x-0 top-8 z-30 flex justify-center px-4 text-center">
          <div className="rounded-full border border-white/10 bg-black/30 px-5 py-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-50/70 backdrop-blur-xl">
            Run / Jump / Splash / Descend
          </div>
        </div>
      )}

      {phase !== "surface" && phase !== "dive" && (
        <div data-ocean-ui className="absolute inset-x-0 top-0 z-30 p-3 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-100/45">Symbols</p>
              <div className="mt-2 flex gap-2">
                {clueSymbols.map((symbol, index) => (
                  <div
                    key={symbol.id}
                    className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-black transition ${
                      symbol.active
                        ? "border-cyan-200/70 bg-cyan-300/20 text-cyan-100 shadow-[0_0_18px_rgba(103,232,249,0.4)]"
                        : "border-white/10 bg-white/5 text-white/25"
                    }`}
                    title={symbol.label}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-[52vw] rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-right shadow-xl shadow-black/20 backdrop-blur-xl sm:max-w-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-100/45">Expedition</p>
              <p className="mt-1 text-xs leading-5 text-cyan-50/72 sm:text-sm">{guidance}</p>
              <p className="mt-1 text-[10px] text-cyan-50/35">{isAudioStarted ? "Audio engine active" : "Audio starts after Dive"} / {collectedCount}/5 symbols</p>
            </div>
          </div>
        </div>
      )}

      {nearbyTarget && phase === "explore" && (
        <div data-ocean-ui className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-4 sm:bottom-8">
          <div className="max-w-md rounded-3xl border border-cyan-200/20 bg-slate-950/55 p-4 text-center shadow-[0_0_50px_rgba(8,145,178,0.22)] backdrop-blur-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-100/50">Nearby / {Math.max(1, Math.round(nearbyTarget.distance))}m</p>
            <h2 className="mt-1 text-lg font-black text-white">{nearbyTarget.label}</h2>
            <p className="mt-1 text-xs leading-5 text-cyan-50/65">{nearbyTarget.detail}</p>
            {nearbyTarget.disabled ? (
              <p className="mt-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-cyan-50/45">{nearbyTarget.prompt}</p>
            ) : (
              <button
                className="mt-3 rounded-full bg-cyan-200 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_0_25px_rgba(103,232,249,0.32)] transition hover:scale-105 active:scale-95"
                onClick={handleInteract}
              >
                {nearbyTarget.prompt} <span className="hidden sm:inline">(E)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "password" && (
        <div data-ocean-ui className="absolute inset-0 z-40 grid place-items-center bg-slate-950/40 px-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-amber-200/30 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.22),transparent_42%),rgba(2,6,23,0.72)] p-6 text-center shadow-[0_0_80px_rgba(251,191,36,0.26)] backdrop-blur-2xl">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-amber-100/65">Chest Seal</p>
            <h2 className="mt-2 text-2xl font-black text-white">Speak the password</h2>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-amber-50/58">This is the local preview seal. Use the password shown on the intro card, or pass your own with <span className="text-amber-100">?password=</span>.</p>
            <input
              autoFocus
              className={`mt-5 w-full rounded-2xl border bg-white/8 px-4 py-4 text-center text-xl font-black uppercase tracking-[0.35em] text-amber-100 outline-none transition ${passwordError ? "border-rose-300/70 shadow-[0_0_30px_rgba(251,113,133,0.25)]" : "border-amber-200/25 shadow-[0_0_30px_rgba(251,191,36,0.12)] focus:border-amber-100/70"}`}
              maxLength={18}
              onChange={(event) => setPasswordValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handlePasswordSubmit();
                if (event.key === "Escape") cancelPassword();
              }}
              value={passwordValue}
            />
            {passwordError && <p className="mt-3 text-xs font-bold text-rose-200">{passwordError}</p>}
            <div className="mt-5 flex gap-3">
              <button className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-white/60 transition hover:bg-white/10" onClick={cancelPassword}>
                Swim Back
              </button>
              <button className="flex-1 rounded-full bg-gradient-to-r from-amber-200 to-orange-400 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:scale-105 active:scale-95" onClick={handlePasswordSubmit}>
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {canShowSwimControls && (
        <MobileSwimControls
          controlsRef={controlsRef}
          boostButtonRef={boostButtonRef}
          joystickRef={joystickRef}
          syncMovementControls={syncMovementControls}
          verticalButtonRef={verticalButtonRef}
        />
      )}

      <div
        className={`pointer-events-none absolute inset-0 z-50 bg-white transition-opacity duration-[2600ms] ${finalFade ? "opacity-100" : "opacity-0"}`}
      />
    </main>
  );
}

interface MobileSwimControlsProps {
  boostButtonRef: MutableRefObject<boolean>;
  controlsRef: MutableRefObject<SwimControls>;
  joystickRef: MutableRefObject<{ x: number; y: number }>;
  syncMovementControls: () => void;
  verticalButtonRef: MutableRefObject<number>;
}

function MobileSwimControls({ boostButtonRef, controlsRef, joystickRef, syncMovementControls, verticalButtonRef }: MobileSwimControlsProps) {
  const [stick, setStick] = useState({ x: 0, y: 0 });

  const updateStick = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const max = rect.width * 0.34;
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const length = Math.max(1, Math.hypot(dx, dy));
    const limited = Math.min(max, length);
    const x = (dx / length) * limited;
    const y = (dy / length) * limited;

    setStick({ x, y });
    joystickRef.current = { x: x / max, y: -y / max };
    syncMovementControls();
  }, [joystickRef, syncMovementControls]);

  const resetStick = useCallback(() => {
    setStick({ x: 0, y: 0 });
    joystickRef.current = { x: 0, y: 0 };
    syncMovementControls();
  }, [joystickRef, syncMovementControls]);

  const setVertical = useCallback((value: number) => {
    verticalButtonRef.current = value;
    syncMovementControls();
  }, [syncMovementControls, verticalButtonRef]);

  const setBoost = useCallback((value: boolean) => {
    boostButtonRef.current = value;
    controlsRef.current.boost = value;
  }, [boostButtonRef, controlsRef]);

  return (
    <div data-ocean-ui className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 p-4 sm:hidden">
      <div
        className="pointer-events-auto relative h-28 w-28 rounded-full border border-cyan-100/15 bg-slate-950/35 shadow-2xl shadow-black/30 backdrop-blur-xl"
        onPointerCancel={resetStick}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateStick(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons > 0) updateStick(event);
        }}
        onPointerUp={resetStick}
      >
        <div
          className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full border border-cyan-100/25 bg-cyan-200/35 shadow-[0_0_28px_rgba(103,232,249,0.35)]"
          style={{ transform: `translate(calc(-50% + ${stick.x}px), calc(-50% + ${stick.y}px))` }}
        />
      </div>

      <div className="pointer-events-auto flex flex-col gap-2">
        <button className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-3 text-xs font-black text-cyan-50/80 backdrop-blur-xl" onPointerDown={() => setVertical(1)} onPointerUp={() => setVertical(0)}>
          Up
        </button>
        <button className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-3 text-xs font-black text-cyan-50/80 backdrop-blur-xl" onPointerDown={() => setVertical(-1)} onPointerUp={() => setVertical(0)}>
          Down
        </button>
        <button className="rounded-full bg-cyan-200 px-4 py-3 text-xs font-black text-slate-950 shadow-[0_0_24px_rgba(103,232,249,0.32)]" onPointerDown={() => setBoost(true)} onPointerUp={() => setBoost(false)}>
          Glide
        </button>
      </div>
    </div>
  );
}
