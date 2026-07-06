# Craft Your Message - Project Summary

Share this document with other AI tools so they can understand and work on the project without needing the actual source code.

---

## 1. Overview

"Interactive Message Templates" -- a Next.js web app that lets users create and share interactive messages (love confessions, birthday surprises, apology games, etc.) as shareable links. The recipient opens the link and experiences a gamified reveal.

- Domain: craftyourmessage.com (production), *.vercel.app (staging, noindexed)
- Deployment: Vercel (auto-deploys on main branch push)
- Git: https://github.com/amitshetty01/playable-messages.git
- Branch: main (production)

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Language | TypeScript 5.6 (strict mode) |
| React | React 19.2.7 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Database | Supabase (Postgres) |
| Fonts | Fraunces (display), Nunito Sans (body) via next/font |
| 3D | Three.js, @react-three/fiber, @react-three/drei |
| Animation | framer-motion 12, CSS keyframes, IntersectionObserver |
| Analytics | @vercel/analytics, Google Analytics (consent-gated) |
| Ads | Adsterra ad network |
| I18n | Custom lightweight i18n with LanguageProvider context |
| Auth | None - hardcoded user-123 placeholder |
| Testing | None |

---

## 3. Directory Structure

```
/
  app/                    Next.js App Router pages
    layout.tsx            Root layout (fonts, theme, header, footer, GA, ads, cookie banner)
    page.tsx              Homepage - server component with JSON-LD
    loading.tsx           Global loading skeleton
    error.tsx             Global error boundary
    not-found.tsx         Custom 404
    robots.ts             Dynamic robots.txt
    sitemap.ts            Dynamic sitemap.xml (658 entries)
    opengraph-image.tsx   Dynamic OG image generator
    globals.css           Tailwind + .glass, .premium-button, .ghost-button, etc.

    about/                Static about page
    contact/              Contact form page
    faq/                  FAQ page with JSON-LD
    privacy/              Privacy policy
    terms/                Terms of service
    templates/            SSG listing + [slug] pages (53 templates)
    create/               Create page + [templateId] dynamic
    explore/              Explore hub
    experience/[id]       Dynamic: renders interactive experience (the shared link)
    edit/[id]             Edit existing experience
    messages/             Message content listing + [slug] (370+)
    collections/          Collection listing + [slug]
    generator/            AI generator listing + [slug]
    games/                Game listing + [slug]
    seasonal/             Seasonal listing + [slug]
    images/               Image listing + [slug]
    mood/[slug]           Templates by mood (SSG)
    category/[slug]       Templates by category (SSG)
    use-cases/[slug]      SEO content pages (SSG)
    demo/[templateId]     Preview demos
    demo/phone/[templateId] Phone-frame demo
    books/                [CLIENT] Storybook dashboard
    books/[id]            [CLIENT] Book editor
    books/create/         [CLIENT] AI book creation
    universes/            [CLIENT] Universe dashboard
    universes/create/     [CLIENT] Create universe
    universes/[id]/play/  [CLIENT] Story reader
    universes/[id]/edit/  [CLIENT] Edit universe
    reminders/            [CLIENT] Occasion reminders (localStorage)
    chat/                 [CLIENT] Secret Room (Supabase realtime)
    our-memories/         [CLIENT] Love story page (localStorage)
    our-story-universe/   [CLIENT] Storybook universe
    my-experiences/       [CLIENT] User's experiences (localStorage)
    ocean-dive/           3D ocean diving (Three.js)
    surprise/[id]         Surprise experience player
    game/[id]             Game player
    report/               Report form
    whatsapp-preview/     WhatsApp preview helper
    api/                  API route handlers
      books/              CRUD for books
      universes/          CRUD for universes
      experiences/        CRUD for experiences
      chat/               Messages + rooms (Supabase realtime)
      ai/book             AI generation
      export/             Export experiences
      country/            Geolocation
    og/                   Legacy OG image route

  components/             Shared React components
    Header.tsx            Sticky nav with theme toggle, language, CTA
    Footer.tsx            Site footer
    CreateForm.tsx        Main creation form
    ExperiencePlayer.tsx  Routes to correct game component
    SeoArticle.tsx        SEO content layout
    HomePageContent.tsx   Homepage client component
    TemplateCard.tsx      Template card
    CookieBanner.tsx      GDPR consent
    SoundToggle.tsx       Ambient sound
    ResponsiveBannerAd.tsx Ad placement
    GameAdapter.tsx       Maps template IDs to game components
    SceneEngine.tsx       Multi-step scene engine
    experience/           30+ game experience components
    games/                30+ game components (TreasureMapGame, FateCardsGame, etc.)
    scenes/               Scene engine components
    our-story-universe/   Story universe components
    universe/             Universe player
    games/ocean/          3D Ocean (Three.js)

  lib/                    Shared utilities and data
    types.ts              Core types (Template, ExperienceRecord, Tone, ThemeName)
    data.ts               Template + category + mood data (~800 lines)
    messages-data.ts      Messages, collections, generators, games data (large)
    seo-content.ts        SEO content (useCasePages array, ~600 lines)
    seo.ts                buildMetadata(), jsonLd(), siteName, defaultOgImage
    structured-data.ts    JSON-LD schema generators
    utils.ts              cn(), absoluteUrl()
    supabase.ts           Supabase client init
    experiences.ts        Supabase CRUD for experiences
    my-experiences.ts     localStorage experiences
    api-guard.ts          API origin validation
    validation.ts         Input validation
    compressImage.ts      Client-side image compression
    theme.ts              Theme utilities
    use-reminders.ts      Reminder hook
    use-favorites.ts      Favorites hook
    use-auto-save.ts      Auto-save hook
    i18n/                 Internationalization
      context.tsx         LanguageProvider
      translations.ts     Translation strings
      index.ts            t() function
    theme/
      context.tsx         ThemeProvider (dark/light)

  proxy.ts                Edge proxy: CSP headers, security, noindex vercel.app
  tailwind.config.ts      Tailwind config (colors, shadows, fonts, animations)
  tsconfig.json           strict: true, paths: @/ -> ./
  package.json            Scripts: dev, build, start, lint, typecheck
```

---

## 4. Route Map (44 route groups)

### Static / SSG Pages
- `/` - Homepage with JSON-LD
- `/about`, `/contact`, `/faq`, `/privacy`, `/terms` - Static info pages
- `/templates` + `/templates/[slug]` (53) - Template listing + SEO pages
- `/create` + `/create/[templateId]` (12) - Create pages
- `/explore` - Explore hub
- `/messages` + `/messages/[slug]` (370+) - Message content
- `/collections` + `/collections/[slug]` (8) - Collections
- `/generator` + `/generator/[slug]` (13) - AI generators
- `/games` + `/games/[slug]` (12) - Games
- `/seasonal` + `/seasonal/[slug]` (10) - Seasonal
- `/images` + `/images/[slug]` (13) - Images
- `/mood/[slug]` (7) - Mood filtered
- `/category/[slug]` (6) - Category filtered
- `/use-cases/[slug]` (8) - SEO content
- `/demo/[templateId]` + `/demo/phone/[templateId]` (53 each) - Demos

### Dynamic Pages
- `/experience/[id]` - Main shared link destination
- `/edit/[id]` - Edit experience
- `/surprise/[id]` - Surprise player
- `/game/[id]` - Game player
- `/report` - Report form
- `/ocean-dive` - 3D ocean

### Client-Only Pages (noindex)
- `/books`, `/books/[id]`, `/books/create`
- `/universes`, `/universes/create`, `/universes/[id]/play`, `/universes/[id]/edit`
- `/reminders`, `/chat`, `/our-memories`, `/our-story-universe`, `/my-experiences`

---

## 5. SEO System

### Metadata Builder (lib/seo.ts)
```
buildMetadata({ title, description, path, image?, noIndex? })
```
Returns: title (with "| Craft Your Message"), description, canonical URL, OG tags, Twitter card.

### Structured Data (lib/structured-data.ts)
Generator functions:
- `faqSchema(items)` -> FAQPage
- `breadcrumbSchema(items)` -> BreadcrumbList
- `articleSchema(title, desc, path, date?)` -> Article
- `webpageSchema(title, desc, path)` -> WebPage
- `howToSchema(name, desc, steps)` -> HowTo
- `creativeWorkSchema(title, desc, path)` -> CreativeWork
- `combinedSchema(...schemas)` -> @graph wrapper

### Robots.txt
Disallowed: /api/, /edit/, /my-experiences/, /reminders/, /books/, /universes/, /chat/, /surprise/, /report/, /demo/, /whatsapp-preview/
Crawl-Delay: 10

### Sitemap (658 entries)
Priorities: Home=1.0, Templates=0.85, Moods/Categories=0.8, Indexes=0.8, Use cases=0.7, Static=0.7, Messages=0.65

---

## 6. Theme & Styling

### Dark/Light mode
- Default: dark class on <html>
- Toggled via ThemeProvider context, stored in localStorage
- Uses .dark and .light CSS selectors

### Key CSS Classes (globals.css)
- .glass - Frosted glass card (backdrop-blur, border, shadow)
- .premium-button - Gradient button with hover shine
- .ghost-button - Outlined button with hover sweep
- .input - Text input styling
- .display-title - Fraunces serif heading
- .skeleton - Shimmer loading placeholder
- .spinner-ring - Spinning ring loader
- .lift - Hover lift
- .card-sheen - Card hover sheen
- .gradient-border - Animated gradient border
- .badge-premium - Premium pill badge
- .link-underline - Animated underline
- .tap - Scale-down click feedback
- .page-enter - Fade + slide entrance

### Tailwind Custom Colors
ink (#15101f), muted (#d9cfdd), neon (#97dadf), blush (#f6b1c9), violet (#b8a5ff), rose (#ff5fb7), gold (#ffd166), cream (#fff8f1), ember (#ff6b8a), dusk (#7c5cff)

---

## 7. Data Flow

### Interactive Messages (core feature)
1. User picks template on /create/[templateId]
2. CreateForm collects custom messages, tone, theme
3. POST to /api/experiences -> Supabase experiences table
4. Shareable link: /experience/{id}
5. Recipient opens -> ExperiencePlayer -> matching game component
6. Game renders steps -> final reveal message
7. Analytics via PUT /api/experiences/[id]/analytics

### Templates (lib/data.ts)
- Static array of 53 Template objects
- Each has: id, slug, title, hook, categorySlugs, tone, theme, status, formula, description
- getTemplate() resolves by slug or id
- getTemplateSeoSlug() returns SEO slug (e.g., "secret-room" for id "the-secret-room")
- "sorry-maze" redirects to /sorry-maze.html

### Storage
- Published: Supabase experiences table via API
- Drafts: localStorage under __experiences
- Auth: hardcoded "user-123" placeholder

---

## 8. Environment Variables

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PRIVATE_CHAT_PASSWORD=your-secret-password
```

---

## 9. Fixes Applied - Session 1 (Code Review)

Commit f7714f6 - 31 issues, 26 files, +417/-432 lines

### CRITICAL (4)
- Passwords: plain-text -> bcryptjs hashing
- API: no origin validation -> lib/api-guard.ts
- GDPR: no consent gate -> consent check before GA/ads
- Data loss: no auto-save -> localStorage auto-save + restore

### HIGH (6)
- CSP too restrictive for ad networks -> expanded
- Missing aria-labels on buttons -> added
- Color contrast below WCAG -> adjusted opacities
- Missing key props -> added
- Stored XSS via innerHTML -> sanitized
- No loading states -> spinners + disabled buttons

### MEDIUM (12)
- Hardcoded GA ID -> env var
- Intermittent white bg on dark mode -> fixed
- Chat localStorage on every render -> debounced
- Missing video preload="metadata" -> added
- Service worker interference -> unregister script
- Mailto without encoding -> fixed
- Unused imports -> removed
- Missing null checks -> optional chaining
- Fragment keys -> fixed
- console.log -> removed
- Magic numbers -> named constants
- innerHTML sanitization -> added

### LOW (9)
- Missing loading="lazy" -> added
- Missing alt text -> added
- Missing preconnect -> added
- Missing target="_blank" rel -> added
- Hardcoded English -> i18n keys
- Inconsistent quotes -> normalized
- Trailing whitespace -> cleaned
- Missing semicolons -> fixed
- `any` types -> proper interfaces

---

## 10. Fixes Applied - Session 2 (SEO)

Commit 6d27adb - 15 files, +351/-46 lines

- Added metadata layouts for 5 client pages (books, universes, reminders, chat, our-memories)
- Fixed our-story-universe: added canonical, OG, Twitter
- Fixed experience/[id]: OG/Twitter fallback to defaultOgImage
- Fixed create/[templateId]: canonical uses templateId, not SEO slug
- Fixed explore page: template links use getTemplateSeoSlug()
- Fixed proxy.ts: renamed middleware to proxy (Next.js 16 requirement)
- Updated robots.txt: 10 more disallowed paths + Crawl-Delay
- Removed <meta charset> from body (invalid HTML)
- Deleted orphaned page.tsx.backup
- Enhanced globals.css: custom scrollbar, selection, button shine, skeleton shimmer, spinner, card sheen, gradient border
- Upgraded loading.tsx: skeleton shimmer with staggered delays

---

## 11. Coding Conventions

### Naming
- Files: PascalCase for components, kebab-case for routes
- Exports: named for components, default for pages
- Variables: camelCase
- Types: PascalCase
- CSS: kebab-case

### Patterns
- Server components for SEO pages; "use client" for interactive only
- Tailwind utilities + custom CSS in globals.css
- Static data in lib/data.ts, Supabase for user content
- Custom hooks in lib/ (files prefixed use-)
- i18n: t("key") from useLanguage() hook

### Important Gotchas
- "use client" pages cannot export metadata - use layout.tsx wrapper instead
- Some templates have special slug handling via getTemplateSeoSlug()
- "sorry-maze" redirects to /sorry-maze.html, excluded from sitemap
- proxy.ts replaces middleware.ts - must export function proxy()
- All API routes are dynamic
- Do NOT put <meta charset> in body - Next.js handles it

---

## 12. Deployment

- Provider: Vercel, auto-deploy on push to main
- Build command: next build (Turbopack)
- Staging: *.vercel.app automatically noindexed via proxy.ts
- Custom domain: craftyourmessage.com
