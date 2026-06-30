import type { CreatureId, OceanTarget } from "./types";

export const REQUIRED_CLUES: CreatureId[] = ["turtle", "dolphin", "jellyfish", "octopus", "whale"];

export const CLUE_LABELS: Record<CreatureId, string> = {
  turtle: "Cave glyph",
  dolphin: "Current glyph",
  jellyfish: "Light glyph",
  octopus: "Door glyph",
  whale: "Song glyph",
};

export const CLUE_TARGETS: OceanTarget[] = [
  {
    id: "turtle",
    kind: "creature",
    label: "Ancient sea turtle",
    prompt: "Let the turtle show you the cave",
    detail: "It pauses, studies you, then turns toward a blue-lit opening in the reef.",
    position: [-28, -9, -20],
    radius: 8,
    clueId: "turtle",
    clueLabel: CLUE_LABELS.turtle,
  },
  {
    id: "dolphin",
    kind: "creature",
    label: "Dolphin escort",
    prompt: "Follow the playful circle",
    detail: "The pod circles you, clicks softly, and breaks formation toward a hidden current.",
    position: [6, -10, -54],
    radius: 10,
    clueId: "dolphin",
    clueLabel: CLUE_LABELS.dolphin,
  },
  {
    id: "jellyfish",
    kind: "creature",
    label: "Glowing jellyfish bloom",
    prompt: "Let the bloom illuminate the symbols",
    detail: "Their bells brighten until old markings appear across the stone wall.",
    position: [30, -16, -38],
    radius: 9,
    clueId: "jellyfish",
    clueLabel: CLUE_LABELS.jellyfish,
  },
  {
    id: "octopus",
    kind: "creature",
    label: "Hidden octopus",
    prompt: "Coax it from the rocks",
    detail: "It slips from the cave and pushes a sealed stone slab aside.",
    position: [-34, -20, -78],
    radius: 8,
    clueId: "octopus",
    clueLabel: CLUE_LABELS.octopus,
  },
  {
    id: "whale",
    kind: "creature",
    label: "Abyssal whale",
    prompt: "Listen to the low song",
    detail: "The song rolls through the ruin and breaks open an ancient tunnel.",
    position: [42, -24, -106],
    radius: 15,
    clueId: "whale",
    clueLabel: CLUE_LABELS.whale,
  },
];

export const TEMPLE_TARGET: OceanTarget = {
  id: "temple",
  kind: "temple",
  label: "Sealed temple door",
  prompt: "Collect every symbol to wake the temple",
  detail: "The blue runes remain dim. The door will not open until all five glyphs are lit.",
  position: [0, -28, -136],
  radius: 18,
};

export const CHEST_TARGET: OceanTarget = {
  id: "chest",
  kind: "chest",
  label: "Chained treasure chest",
  prompt: "Unlock the chest",
  detail: "Gold light leaks through the coral-wrapped lid. The password interface is waiting.",
  position: [0, -26.5, -149],
  radius: 9,
};

export const PLAYER_START: [number, number, number] = [0, -6, 12];
