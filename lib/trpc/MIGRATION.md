# Migrating REST API Routes to tRPC

This guide explains how to gradually migrate existing Next.js API routes (`app/api/...`) to tRPC procedures.

## Benefits

- **End-to-end type safety** — Types flow from server procedures to client queries/mutations automatically.
- **No manual validation boilerplate** — Zod schemas define validation once, used on both sides.
- **Single endpoint** — All RPC calls go through `/api/trpc` instead of many individual routes.
- **Automatic batching** — `httpBatchLink` combines multiple requests into one HTTP call.
- **SuperJSON** — Handles `Date`, `Map`, `Set`, and other non-JSON types seamlessly.

## Step-by-step migration

### 1. Identify a REST endpoint to migrate

Pick one endpoint, e.g. `POST /api/experiences` (create experience).

### 2. Define a Zod schema for input validation

```ts
// lib/trpc/routers/experiences.ts
import { z } from "zod";

const createExperienceSchema = z.object({
  templateId: z.string().min(1).max(80),
  finalMessage: z.string().min(1).max(520),
  creatorName: z.string().max(80).optional(),
  receiverName: z.string().max(80).optional(),
  // ... remaining fields
});
```

### 3. Add a tRPC procedure (or update existing one)

```ts
// Inside experiencesRouter
createExperience: publicProcedure
  .input(createExperienceSchema)
  .mutation(async ({ input }) => {
    return createExperienceService(input as Record<string, unknown>);
  }),
```

### 4. Replace client-side fetch calls

**Before (REST):**
```ts
const res = await fetch("/api/experiences", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const data = await res.json();
```

**After (tRPC):**
```ts
import { api } from "@/lib/trpc/client";

const { data, error } = await api.experiences.createExperience.useMutation();
// or in a component:
const mutation = api.experiences.createExperience.useMutation();
mutation.mutate(payload);
```

### 5. Remove the old API route file

Delete `app/api/experiences/route.ts` once all callers have migrated.

### 6. For data fetching (GET) routes

**Before:**
```ts
const res = await fetch(`/api/experiences/${id}`);
const data = await res.json();
```

**After:**
```ts
const { data } = api.experiences.getExperience.useQuery({ id });
```

### 7. For server components

Use the server caller pattern to call tRPC procedures directly:

```ts
import { createCallerFactory } from "@trpc/server";
import { appRouter } from "@/lib/trpc/routers/_app";
import { createContext } from "@/lib/trpc/context";

const createCaller = createCallerFactory(appRouter);
const caller = createCaller(await createContext());

// Now call any procedure directly:
const result = await caller.experiences.getExperience({ id });
```

## Migration order (recommended)

| Route | tRPC procedure | Priority |
|---|---|---|
| `POST /api/experiences` | `experiences.createExperience` | High |
| `GET /api/experiences/[id]` | `experiences.getExperience` | High |
| `PUT /api/experiences/[id]` | `experiences.updateExperience` | High |
| `POST /api/experiences/[id]/analytics` | `experiences.trackEvent` | Medium |
| `POST /api/experiences/[id]/reaction` | `experiences.setReaction` | Low |
| `POST /api/experiences/[id]/reply` | _future_ | Low |
| `GET /api/books` | _future_ | Low |

## Existing tRPC routers

- `experiences` — `getExperience`, `createExperience`, `updateExperience`, `trackEvent`, `setReaction`
- `templates` — `listTemplates`, `getTemplate`

Add new routers in `lib/trpc/routers/` and merge them into `lib/trpc/routers/_app.ts`.
