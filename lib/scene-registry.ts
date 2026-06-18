import type { SceneFlow, SceneContext } from "@/lib/scene-types";
import type { ExperienceRecord } from "@/lib/types";
import { movingButtonScenes } from "@/components/scenes/MovingButtonScenes";
import { loveChaseScenes } from "@/components/scenes/LoveChaseScenes";

export const SCENE_ENGINE_TEMPLATES = [
  "the-final-button",
];

const ALIASES: Record<string, string> = {
};

const REGISTRY: Record<string, (experience: ExperienceRecord) => SceneFlow> = {
  "the-final-button": movingButtonScenes,
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
