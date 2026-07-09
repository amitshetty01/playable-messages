import { z } from "zod";

export const AIConceptSceneSchema = z.object({
  heading: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
  interaction: z.string().min(1).max(50),
});

export const AIMediaSlotSchema = z.object({
  label: z.string().min(1).max(100),
  type: z.literal("image"),
  description: z.string().min(1).max(300),
});

export const AIConceptSchema = z.object({
  id: z.string().min(1).max(100),
  title: z.string().min(1).max(100),
  vibe: z.string().min(1).max(200),
  templateType: z.string().min(1).max(100),
  visualStyle: z.string().min(1).max(100),
  shortDescription: z.string().min(1).max(300),
  scenes: z.array(AIConceptSceneSchema).min(1).max(10),
  finalMessage: z.string().min(1).max(500),
  mediaSlots: z.array(AIMediaSlotSchema).max(20),
});

export const AIAssistantResponseSchema = z.object({
  rewritten: z.string().min(1).max(2000),
});

export const AIGameBuilderResponseSchema = z.object({
  concepts: z.array(AIConceptSchema).min(1).max(6),
});

export const AISurpriseResponseSchema = z.object({
  concepts: z.array(AIConceptSchema).min(1).max(6),
});

export const AIRegenerateResponseSchema = z.object({
  concept: AIConceptSchema,
});

export function getSchemaForMode(mode: string): z.ZodTypeAny {
  switch (mode) {
    case "message_assist":
      return AIAssistantResponseSchema;
    case "game_builder":
      return AIGameBuilderResponseSchema;
    case "surprise_me":
      return AISurpriseResponseSchema;
    case "regenerate_concept":
      return AIRegenerateResponseSchema;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}
