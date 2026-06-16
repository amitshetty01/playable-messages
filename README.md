# Playable Messages

Create playable messages people can't ignore.

Playable Messages is a Next.js, TypeScript, Tailwind CSS, and Supabase MVP for creating public interactive message experiences. Users choose a category, try demos, customize a template, generate a public Supabase-backed link, and share it with a receiver.

## MVP Features

- Working homepage, categories, category detail, templates, template detail, demos, create flow, generated experience links, privacy, terms, and report pages.
- `The Final Button` is fully functional with mood branches, moving button, catch-card interaction, breathing screen, playful slider, suspense reveal, final share/reply/create actions, watermark, and report action.
- Remaining requested templates have polished demo placeholders, cards, routes, descriptions, and customization entry points.
- Generated experiences are stored in Supabase, not localStorage.
- Minimal analytics: opened, completed, selected mood/choice, final CTA clicked, and template used.
- No login required for MVP.

## Routes

- `/`
- `/categories`
- `/category/[slug]`
- `/templates`
- `/template/[slug]`
- `/demo/[templateId]`
- `/create`
- `/create/[templateId]`
- `/experience/[id]`
- `/game/[id]` redirects to `/experience/[id]`
- `/privacy`
- `/terms`
- `/report`

## Setup

1. Install dependencies with `npm install`.
2. Create a Supabase project.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Copy `.env.example` to `.env.local` and fill in the values.
5. Run `npm run dev`.

## Supabase Notes

The MVP uses these tables:

- `generated_experiences`
- `analytics_events`

Use `SUPABASE_SERVICE_ROLE_KEY` on the server for reliable inserts and analytics updates. Keep it secret.

## Safety

This website is for fun and entertainment only. It does not provide relationship advice, psychological assessment, or proof of anyone's feelings. Do not use it to harass, threaten, pressure, impersonate, or manipulate anyone.
