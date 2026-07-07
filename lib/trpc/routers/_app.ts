import { router } from "@/lib/trpc/trpc";
import { experiencesRouter } from "./experiences";
import { templatesRouter } from "./templates";

export const appRouter = router({
  experiences: experiencesRouter,
  templates: templatesRouter,
});

export type AppRouter = typeof appRouter;
