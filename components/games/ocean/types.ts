import type { MutableRefObject } from "react";

export type GamePhase = "surface" | "dive" | "explore" | "password" | "reveal";

export type CreatureId = "turtle" | "dolphin" | "jellyfish" | "octopus" | "whale";

export type InteractionId = CreatureId | "temple" | "chest";

export type ChestStatus = "sealed" | "wrong" | "unlocking" | "open";

export interface SwimControls {
  forward: number;
  strafe: number;
  vertical: number;
  boost: boolean;
  yaw: number;
  pitch: number;
}

export type SwimControlsRef = MutableRefObject<SwimControls>;

export interface OceanTarget {
  id: InteractionId;
  kind: "creature" | "temple" | "chest";
  label: string;
  prompt: string;
  detail: string;
  position: [number, number, number];
  radius: number;
  clueId?: CreatureId;
  clueLabel?: string;
}

export interface NearbyTarget extends OceanTarget {
  distance: number;
  disabled?: boolean;
}

export type InteractionPulses = Record<CreatureId, number>;
