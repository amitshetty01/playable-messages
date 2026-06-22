import type { TemplateConfig } from "@/lib/types";

const templateConfigs: Record<string, TemplateConfig> = {
  "the-final-button": {
    id: "the-final-button",
    name: "Moving Button",
    editableFields: [],
  },
  "memory-maze": {
    id: "memory-maze",
    name: "Heart Vault",
    editableFields: [
      {
        key: "photos",
        label: "Memory Photos",
        type: "image",
        required: false,
        helpText: "Upload photos of your memories together",
        imageCount: 6,
      },
      {
        key: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "Enter a secret password",
        helpText: "Set a password the recipient must enter",
      },
      {
        key: "passwordQuestion",
        label: "Password Question",
        type: "text",
        required: false,
        placeholder: "Only one person has permission to go inside",
        helpText: "Optional question before the password",
      },
      {
        key: "passwordHint",
        label: "Password Hint",
        type: "text",
        required: false,
        placeholder: "A clue to help them remember",
        helpText: "Optional hint for the password",
      },
      {
        key: "startDate",
        label: "Together Since Date",
        type: "date",
        required: false,
        helpText: "When did your journey begin?",
      },
      {
        key: "startTime",
        label: "Together Since Time",
        type: "time",
        required: false,
        helpText: "What time did you meet?",
      },
    ],
  },
  "birthday-surprise-journey": {
    id: "birthday-surprise-journey",
    name: "Blow Out the Candles",
    editableFields: [
      {
        key: "photos",
        label: "Birthday Photos",
        type: "image",
        required: false,
        imageCount: 6,
        helpText: "Upload photos to display in the birthday experience",
      },
    ],
  },
  "memory-journey": {
    id: "memory-journey",
    name: "Braid a Bracelet",
    editableFields: [],
  },
  "love-chase": {
    id: "love-chase",
    name: "Catch My Heart",
    editableFields: [],
  },
  "kitty-apology": {
    id: "kitty-apology",
    name: "Kitty Apology",
    editableFields: [],
  },
  "come-closer": {
    id: "come-closer",
    name: "Come Closer Prank",
    editableFields: [],
  },
  "birthday-cake": {
    id: "birthday-cake",
    name: "Cut the Cake",
    editableFields: [],
  },
  "dont-smile-scenes": {
    id: "dont-smile-scenes",
    name: "Don't You Smile",
    editableFields: [],
  },
  "deleted-drafts": {
    id: "deleted-drafts",
    name: "Deleted Drafts",
    editableFields: [
      {
        key: "drafts",
        label: "Fake Drafts (one per line)",
        type: "textarea",
        required: false,
        placeholder: "I was gonna say...&#10;Actually never mind...&#10;But here's the truth...",
        helpText: "Each line is a fake draft shown before the real message",
      },
    ],
  },
  "birthday-journey": {
    id: "birthday-journey",
    name: "Birthday Journey",
    editableFields: [],
  },
  "escape-me": {
    id: "escape-me",
    name: "Escape Me",
    editableFields: [],
  },
  "the-risk-button": {
    id: "the-risk-button",
    name: "Fate Cards",
    editableFields: [],
  },
  "glitch-truth": {
    id: "glitch-truth",
    name: "Frozen in Ice",
    editableFields: [],
  },
  "dont-smile-challenge": {
    id: "dont-smile-challenge",
    name: "Shake for an Answer",
    editableFields: [],
  },
  "choose-my-punishment": {
    id: "choose-my-punishment",
    name: "Calm the Storm",
    editableFields: [],
  },
  "mood-repair-machine": {
    id: "mood-repair-machine",
    name: "Tug of War",
    editableFields: [],
  },
  "the-secret-room": {
    id: "the-secret-room",
    name: "Treasure Map",
    editableFields: [],
  },
  "roast-to-respect": {
    id: "roast-to-respect",
    name: "Climb the Mountain",
    editableFields: [],
  },
  "secret-letter": {
    id: "secret-letter",
    name: "Snow Globe",
    editableFields: [],
  },
  "surprise-room": {
    id: "surprise-room",
    name: "Scratch Card",
    editableFields: [],
  },
  "type-or-else": {
    id: "type-or-else",
    name: "Domino Chain",
    editableFields: [],
  },
  "the-trust-scale": {
    id: "the-trust-scale",
    name: "Paper Airplane",
    editableFields: [],
  },
  "inkblot": {
    id: "inkblot",
    name: "Photo Booth",
    editableFields: [
      {
        key: "photos",
        label: "Photo Strips",
        type: "image",
        required: false,
        imageCount: 4,
        helpText: "Upload photos for the booth strip",
      },
    ],
  },
  "two-lies-one-truth": {
    id: "two-lies-one-truth",
    name: "Fortune Cookie",
    editableFields: [],
  },
  "the-closer-you-get": {
    id: "the-closer-you-get",
    name: "Message in the Sand",
    editableFields: [],
  },
  "spin-to-reveal": {
    id: "spin-to-reveal",
    name: "Party Popper",
    editableFields: [],
  },
  "love-beats": {
    id: "love-beats",
    name: "Scratch Card",
    editableFields: [],
  },
  "sorry-puzzle": {
    id: "sorry-puzzle",
    name: "Puzzle Pieces",
    editableFields: [],
  },
  "funny-slots": {
    id: "funny-slots",
    name: "Slot Machine",
    editableFields: [],
  },
  "secret-decoder": {
    id: "secret-decoder",
    name: "Redacted Decoder",
    editableFields: [],
  },
  "roast-wheel": {
    id: "roast-wheel",
    name: "Spin the Wheel",
    editableFields: [],
  },
  "memory-flip": {
    id: "memory-flip",
    name: "Flip & Match",
    editableFields: [],
  },
  "mystery-fog": {
    id: "mystery-fog",
    name: "Flashlight in the Fog",
    editableFields: [],
  },
  "heartbeat-sync": {
    id: "heartbeat-sync",
    name: "Heartbeat Sync",
    editableFields: [],
  },
  "polaroid-stack": {
    id: "polaroid-stack",
    name: "Polaroid Stack",
    editableFields: [
      {
        key: "photos",
        label: "Polaroid Photos",
        type: "image",
        required: false,
        imageCount: 5,
        helpText: "Upload photos for the polaroid stack",
      },
    ],
  },
  "scratch-card": {
    id: "scratch-card",
    name: "Scratch Card",
    editableFields: [],
  },
  "tilt-maze": {
    id: "tilt-maze",
    name: "Tilt Maze",
    editableFields: [],
  },
  "morse-code": {
    id: "morse-code",
    name: "Morse Code",
    editableFields: [],
  },
  "dissolve-wall": {
    id: "dissolve-wall",
    name: "Dissolve Wall",
    editableFields: [],
  },
  "lock-pick": {
    id: "lock-pick",
    name: "Lock Pick",
    editableFields: [],
  },
  "gravity-flip": {
    id: "gravity-flip",
    name: "Gravity Flip",
    editableFields: [],
  },
  "echo-chamber": {
    id: "echo-chamber",
    name: "Echo Chamber",
    editableFields: [],
  },
  "balance-scale": {
    id: "balance-scale",
    name: "Balance Scale",
    editableFields: [],
  },
  "candle-countdown": {
    id: "candle-countdown",
    name: "Candle Countdown",
    editableFields: [],
  },
  "memory-scenes": {
    id: "memory-scenes",
    name: "Memory Lane",
    editableFields: [
      {
        key: "photos",
        label: "Memory Photos",
        type: "image",
        required: false,
        imageCount: 6,
        helpText: "Upload photos for the memory journey",
      },
    ],
  },
  "roast-scenes": {
    id: "roast-scenes",
    name: "Roast to Respect",
    editableFields: [],
  },
  "secret-letter-scenes": {
    id: "secret-letter-scenes",
    name: "Secret Letter",
    editableFields: [],
  },
  "surprise-room-scenes": {
    id: "surprise-room-scenes",
    name: "Surprise Room",
    editableFields: [],
  },
};

export function getTemplateConfig(templateId: string): TemplateConfig {
  return templateConfigs[templateId] ?? {
    id: templateId,
    name: "Template",
    editableFields: [],
  };
}

export function getTemplateConfigOrNull(templateId: string): TemplateConfig | null {
  return templateConfigs[templateId] ?? null;
}
