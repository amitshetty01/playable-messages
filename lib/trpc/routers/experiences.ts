import { z } from "zod";
import { publicProcedure, router } from "@/lib/trpc/trpc";
import {
  createExperience as createExperienceService,
  getExperience as getExperienceService,
  updateExperience as updateExperienceService,
  trackExperienceEvent,
  setExperienceReaction,
} from "@/lib/experiences";
import type { AnalyticsPayload } from "@/lib/types";

const analyticsPayloadSchema = z.object({
  eventType: z.enum([
    "experience_opened",
    "experience_completed",
    "selected_mood_choice",
    "final_cta_clicked",
    "template_used",
  ]),
  templateId: z.string().max(80).optional(),
  choice: z.string().max(80).optional(),
}) satisfies z.ZodType<AnalyticsPayload>;

export const experiencesRouter = router({
  getExperience: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      return getExperienceService(input.id);
    }),

  createExperience: publicProcedure
    .input(z.record(z.unknown()))
    .mutation(async ({ input }) => {
      return createExperienceService(input);
    }),

  updateExperience: publicProcedure
    .input(z.object({ id: z.string().min(1), body: z.record(z.unknown()) }))
    .mutation(async ({ input }) => {
      return updateExperienceService({ ...input.body, id: input.id });
    }),

  trackEvent: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        payload: analyticsPayloadSchema,
      })
    )
    .mutation(async ({ input }) => {
      return trackExperienceEvent(input.id, input.payload);
    }),

  setReaction: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        reaction: z.string().min(1).max(10),
      })
    )
    .mutation(async ({ input }) => {
      return setExperienceReaction(input.id, input.reaction);
    }),
});
