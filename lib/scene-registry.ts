import type { SceneFlow, SceneContext } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";
import { movingButtonScenes } from "@/components/scenes/MovingButtonScenes";
import { birthdayJourneyScenes } from "@/components/scenes/BirthdayJourneyScenes";
import { memoryJourneyScenes } from "@/components/scenes/MemoryJourneyScenes";
import { secretLetterScenes } from "@/components/scenes/SecretLetterScenes";
import { lastDeletedMessageScenes } from "@/components/scenes/LastDeletedMessageScenes";
import { surpriseRoomScenes } from "@/components/scenes/SurpriseRoomScenes";
import { dontSmileChallengeScenes } from "@/components/scenes/DontSmileChallengeScenes";
import { roastToRespectScenes } from "@/components/scenes/RoastToRespectScenes";
import { loveChaseScenes } from "@/components/scenes/LoveChaseScenes";

export const SCENE_ENGINE_TEMPLATES = [
  "the-final-button",
  "birthday-surprise-journey",
  "memory-journey",
  "secret-letter",
  "the-last-deleted-message",
  "surprise-room",
  "dont-smile-challenge",
  "roast-to-respect",
];

const ALIASES: Record<string, string> = {
  "memory-maze": "memory-journey",
  "the-secret-room": "surprise-room",
};

const REGISTRY: Record<string, (experience: ExperienceRecord) => SceneFlow> = {
  "the-final-button": movingButtonScenes,
  "birthday-surprise-journey": birthdayJourneyScenes,
  "memory-journey": memoryJourneyScenes,
  "secret-letter": secretLetterScenes,
  "the-last-deleted-message": lastDeletedMessageScenes,
  "surprise-room": surpriseRoomScenes,
  "dont-smile-challenge": dontSmileChallengeScenes,
  "roast-to-respect": roastToRespectScenes,
  "love-chase": loveChaseScenes,
};

export function getSceneFlow(templateId: string, experience: ExperienceRecord): SceneFlow | null {
  const resolved = ALIASES[templateId] || templateId;
  const builder = REGISTRY[resolved];
  if (!builder) return null;
  return builder(experience);
}

export function buildSceneContext(experience: ExperienceRecord, onComplete: () => void, onTrack: (action: string) => void): SceneContext {
  return {
    step: 0,
    total: 0,
    customMessages: experience.customMessages,
    finalMessage: experience.finalMessage,
    receiverName: experience.receiverName,
    tone: experience.tone,
    onComplete,
    onTrack,
  };
}
