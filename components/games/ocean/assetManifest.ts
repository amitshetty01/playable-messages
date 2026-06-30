export type OceanAssetKey =
  | "cliff"
  | "turtle"
  | "dolphin"
  | "jellyfish"
  | "octopus"
  | "whale"
  | "manta"
  | "shipwreck"
  | "temple"
  | "treasureChest";

interface OceanModelAsset {
  key: OceanAssetKey;
  path: string;
  ready: boolean;
  note: string;
}

export const OCEAN_MODEL_ASSETS: Record<OceanAssetKey, OceanModelAsset> = {
  cliff: {
    key: "cliff",
    path: "/models/ocean/cliff.glb",
    ready: false,
    note: "Surface cliff, grass, and player dive start.",
  },
  turtle: {
    key: "turtle",
    path: "/models/ocean/sea-turtle.glb",
    ready: false,
    note: "Rigged turtle with idle, look, and lead animations.",
  },
  dolphin: {
    key: "dolphin",
    path: "/models/ocean/dolphin.glb",
    ready: false,
    note: "Rigged dolphin used by the escort pod.",
  },
  jellyfish: {
    key: "jellyfish",
    path: "/models/ocean/jellyfish.glb",
    ready: false,
    note: "Translucent jellyfish with emissive glow animation.",
  },
  octopus: {
    key: "octopus",
    path: "/models/ocean/octopus.glb",
    ready: false,
    note: "Rigged octopus that can push the stone door.",
  },
  whale: {
    key: "whale",
    path: "/models/ocean/whale.glb",
    ready: false,
    note: "Large whale cinematic entrance model.",
  },
  manta: {
    key: "manta",
    path: "/models/ocean/manta-ray.glb",
    ready: false,
    note: "Manta ray ambient creature model.",
  },
  shipwreck: {
    key: "shipwreck",
    path: "/models/ocean/shipwreck.glb",
    ready: false,
    note: "Broken shipwreck landmark with swim-through openings.",
  },
  temple: {
    key: "temple",
    path: "/models/ocean/ancient-temple.glb",
    ready: false,
    note: "Massive Atlantis-inspired temple shell and rune door.",
  },
  treasureChest: {
    key: "treasureChest",
    path: "/models/ocean/treasure-chest.glb",
    ready: false,
    note: "Animated chained treasure chest with opening lid.",
  },
};
