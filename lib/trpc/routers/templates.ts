import { z } from "zod";
import { publicProcedure, router } from "@/lib/trpc/trpc";
import { templates, getTemplate } from "@/lib/data";

export const templatesRouter = router({
  listTemplates: publicProcedure.query(async () => {
    return templates;
  }),

  getTemplate: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      return getTemplate(input.id) ?? null;
    }),
});
