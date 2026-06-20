import type { SceneFlow, SceneContext } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";
import { movingButtonScenes } from "@/components/scenes/MovingButtonScenes";
import { loveChaseScenes } from "@/components/scenes/LoveChaseScenes";
import { birthdayJourneyScenes } from "@/components/scenes/BirthdayJourneyScenes";
import { dontSmileChallengeScenes } from "@/components/scenes/DontSmileChallengeScenes";
import { lastDeletedMessageScenes } from "@/components/scenes/LastDeletedMessageScenes";
import { memoryJourneyScenes } from "@/components/scenes/MemoryJourneyScenes";
import { roastToRespectScenes } from "@/components/scenes/RoastToRespectScenes";
import { secretLetterScenes } from "@/components/scenes/SecretLetterScenes";
import { surpriseRoomScenes } from "@/components/scenes/SurpriseRoomScenes";

export const SCENE_ENGINE_TEMPLATES = [
  "the-final-button",
  "love-chase",
  "birthday-journey",
  "dont-smile-scenes",
  "deleted-drafts",
  "memory-scenes",
  "roast-scenes",
  "secret-letter-scenes",
  "surprise-room-scenes",
];

const ALIASES: Record<string, string> = {
};

const REGISTRY: Record<string, (experience: ExperienceRecord) => SceneFlow> = {
  "the-final-button": movingButtonScenes,
  "love-chase": loveChaseScenes,
  "birthday-journey": birthdayJourneyScenes,
  "dont-smile-scenes": dontSmileChallengeScenes,
  "deleted-drafts": lastDeletedMessageScenes,
  "memory-scenes": memoryJourneyScenes,
  "roast-scenes": roastToRespectScenes,
  "secret-letter-scenes": secretLetterScenes,
  "surprise-room-scenes": surpriseRoomScenes,
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
