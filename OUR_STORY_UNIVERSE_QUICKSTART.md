# 🌌 Our Story Universe - Quick Start Guide

Complete setup guide from zero to launched in 15 minutes.

---

## ⚡ 1-Minute Overview

**Our Story Universe** is a production-ready interactive love story platform with:
- AI-powered story generation (Azure OpenAI)
- Cinematic animations & interactive mechanics
- Mobile-first 9:16 layout
- 8 auto-generated chapters
- Theme system with particle effects
- Story editor & multiple variants

**Core Flow**: Onboarding (names, theme) → Story Generation (8 chapters) → Player (read with interactions) → Editor (customize)

---

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Azure OpenAI API key
- ~5 minutes

---

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd "c:\Users\91869\Downloads\New Project"
npm install
```

### Step 2: Create Environment File
Create `.env.local` in project root:
```env
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-turbo

# Optional: User ID (hardcoded for demo)
NEXT_PUBLIC_USER_ID=user-123
```

### Step 3: Start Development Server
```bash
npm run dev
```

Output:
```
> next dev
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local
  
✓ Ready in 1.2s
```

### Step 4: Open in Browser
- Library: http://localhost:3000/universes
- Create New: http://localhost:3000/universes/create

---

## 💻 Code Examples

### Example 1: Create a Universe Programmatically

```typescript
// pages/api/test-create-universe.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch('http://localhost:3000/api/universes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-123',
        heroName: 'John',
        partnerName: 'Sarah',
        theme: 'classic-romance',
        tone: 'romantic',
        favoriteMemory: 'Our first kiss under the stars',
        partnerTraits: 'Kind, funny, loves to dance',
        promise: 'I promise to love you forever',
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

**Usage**:
```bash
curl http://localhost:3000/api/test-create-universe
```

---

### Example 2: Fetch & Display Universe

```typescript
// components/UniverseViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Universe } from '@/lib/universe-types';

export function UniverseViewer({ universeId }: { universeId: string }) {
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/universes?id=${universeId}`)
      .then((res) => res.json())
      .then(setUniverse)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [universeId]);

  if (loading) return <div>Loading...</div>;
  if (!universe) return <div>Not found</div>;

  return (
    <div>
      <h1>{universe.metadata.title}</h1>
      <p>Hero: {universe.metadata.hero.name}</p>
      <p>Partner: {universe.metadata.partner.name}</p>
      <p>Theme: {universe.metadata.theme}</p>
      <p>Chapters: {universe.chapters.length}</p>
    </div>
  );
}
```

---

### Example 3: Custom Onboarding

```typescript
// pages/custom-onboarding.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomOnboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    heroName: '',
    partnerName: '',
    theme: 'classic-romance',
    tone: 'romantic',
    memory: '',
    traits: '',
    promise: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/universes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-123',
        heroName: formData.heroName,
        partnerName: formData.partnerName,
        theme: formData.theme,
        tone: formData.tone,
        favoriteMemory: formData.memory,
        partnerTraits: formData.traits,
        promise: formData.promise,
      }),
    });

    const { universeId } = await res.json();
    router.push(`/universes/${universeId}/play`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <input
        name="heroName"
        placeholder="Your name"
        value={formData.heroName}
        onChange={(e) =>
          setFormData({ ...formData, heroName: e.target.value })
        }
        required
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        name="partnerName"
        placeholder="Partner name"
        value={formData.partnerName}
        onChange={(e) =>
          setFormData({ ...formData, partnerName: e.target.value })
        }
        required
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        name="memory"
        placeholder="Your favorite memory"
        value={formData.memory}
        onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        type="submit"
        className="w-full p-3 bg-pink-400 text-white rounded hover:bg-pink-500"
      >
        Create Universe ✨
      </button>
    </form>
  );
}
```

---

### Example 4: Customize Story Generation

```typescript
// lib/custom-universe-service.ts
import { UniverseAIService } from './universe-ai-service';
import { AIStoryGenerationRequest } from './universe-types';

export class CustomUniverseService extends UniverseAIService {
  async generateChapter(request: AIStoryGenerationRequest) {
    // Add custom logic before generating
    console.log(`Generating ${request.chapterType} for ${request.hero.name}`);

    // Call parent implementation
    const result = await super.generateChapter(request);

    // Add custom post-processing
    if (result.success && result.pages) {
      result.pages = result.pages.map((page) => ({
        ...page,
        mainText: `[${request.theme}] ${page.mainText}`,
      }));
    }

    return result;
  }
}

export const customUniverseAI = new CustomUniverseService();
```

---

### Example 5: Add Custom Theme

```typescript
// lib/custom-themes.ts
import { UniverseTheme, THEME_COLORS } from './universe-animations';

export const CUSTOM_THEMES = {
  ...THEME_COLORS,
  'vintage-nostalgia': {
    primary: '#d4a574',
    secondary: '#e6c9a8',
    accent: '#8b6f47',
    background: 'linear-gradient(135deg, #e6c9a8, #d4a574)',
    textColor: '#5c4620',
    glow: 'rgba(212, 165, 116, 0.6)',
    particle: 'sparkles',
  },
};

// Use in components:
// const theme = CUSTOM_THEMES['vintage-nostalgia'];
```

---

### Example 6: Track Analytics

```typescript
// pages/api/analytics/track.ts
import { NextApiRequest, NextApiResponse } from 'next';

const events: any[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { universeId, userId, eventType, data } = req.body;

    events.push({
      universeId,
      userId,
      eventType,
      data,
      timestamp: new Date(),
    });

    // In production: save to database
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    const { universeId } = req.query;

    const universeEvents = universeId
      ? events.filter((e) => e.universeId === universeId)
      : events;

    res.status(200).json(universeEvents);
  }
}
```

**Usage in StoryPlayer**:
```typescript
const trackEvent = async (eventType: string) => {
  await fetch('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify({
      universeId,
      userId: 'user-123',
      eventType,
      data: { chapterIndex, pageIndex },
    }),
  });
};
```

---

### Example 7: Export to JSON

```typescript
// pages/api/export.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { universeId } = req.query;

  const universeRes = await fetch(
    `http://localhost:3000/api/universes?id=${universeId}`
  );
  const universe = await universeRes.json();

  // Set headers for download
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${universe.metadata.title}.json"`
  );

  res.status(200).json(universe);
}
```

---

### Example 8: Mobile Responsive Player

```typescript
// components/ResponsiveStoryPlayer.tsx
'use client';

import { StoryPlayer } from './universe/StoryPlayer';
import { Universe } from '@/lib/universe-types';

interface ResponsivePlayerProps {
  universe: Universe;
}

export function ResponsiveStoryPlayer({ universe }: ResponsivePlayerProps) {
  return (
    <div className="w-full h-screen max-w-md mx-auto relative">
      {/* Mobile 9:16 aspect ratio container */}
      <div
        className="w-full"
        style={{
          aspectRatio: '9 / 16',
        }}
      >
        <StoryPlayer universe={universe} />
      </div>
    </div>
  );
}
```

---

### Example 9: Real-time Multi-Player Editing

```typescript
// lib/realtime-sync.ts
import { Universe } from './universe-types';

export class RealtimeSync {
  private ws: WebSocket;
  private universeId: string;

  constructor(universeId: string) {
    this.universeId = universeId;
    this.ws = new WebSocket(
      `wss://localhost:3000/ws/universes/${universeId}`
    );
  }

  onUniverseUpdate(callback: (universe: Universe) => void) {
    this.ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'universe-updated') {
        callback(data);
      }
    };
  }

  updateUniverse(updates: Partial<Universe>) {
    this.ws.send(
      JSON.stringify({
        type: 'update-universe',
        universeId: this.universeId,
        updates,
      })
    );
  }
}
```

---

### Example 10: Share Universe Link

```typescript
// lib/share-universe.ts
export async function createShareLink(
  universeId: string,
  expiresIn: number = 7 * 24 * 60 * 60 // 7 days
): Promise<string> {
  const shareCode = Math.random().toString(36).substring(7);

  // Save to database
  await fetch('/api/share', {
    method: 'POST',
    body: JSON.stringify({
      universeId,
      shareCode,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    }),
  });

  return `${window.location.origin}/share/${shareCode}`;
}

// Usage
const link = await createShareLink(universeId);
console.log(`Share this link: ${link}`);
```

---

## 🎨 Customization Tips

### Change Button Colors
Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#ff1493',
      secondary: '#ff69b4',
    },
  },
}
```

### Adjust Animation Speed
Edit `lib/universe-animations.ts`:
```typescript
export const ANIMATION_CONFIGS = {
  PAGE_TURN: {
    duration: 0.6, // Faster (was 0.8)
    easing: 'cubic-bezier(...)',
  },
};
```

### Add More Chapters
Edit `app/api/universes/route.ts`:
```typescript
const chapterTypes = [
  // Add more ChapterType values
  ChapterType.BONUS_1,
  ChapterType.BONUS_2,
];
```

---

## 📊 Common Queries

### Get all universes for a user
```bash
curl "http://localhost:3000/api/universes?userId=user-123"
```

### Get specific universe
```bash
curl "http://localhost:3000/api/universes?id=universe-xyz"
```

### Update universe metadata
```bash
curl -X PUT "http://localhost:3000/api/universes" \
  -H "Content-Type: application/json" \
  -d '{
    "universeId": "universe-xyz",
    "updates": {
      "metadata": {
        "promise": "New promise text"
      }
    }
  }'
```

### Delete universe
```bash
curl -X DELETE "http://localhost:3000/api/universes?id=universe-xyz"
```

---

## 🧪 Testing

### Test Story Generation
```bash
# Test creating a universe
curl -X POST "http://localhost:3000/api/universes" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "heroName": "Alice",
    "partnerName": "Bob",
    "theme": "classic-romance",
    "tone": "romantic",
    "favoriteMemory": "Our first dance",
    "partnerTraits": "Kind and thoughtful",
    "promise": "Forever with you"
  }'
```

### Verify TypeScript
```bash
npx tsc --noEmit
```

### Check Linting
```bash
npx eslint . --max-warnings=0
```

---

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Add Our Story Universe"
git push origin main

# 2. Connect to Vercel
# https://vercel.com/new

# 3. Add environment variables in Vercel dashboard
AZURE_OPENAI_API_KEY=xxx
AZURE_OPENAI_ENDPOINT=xxx
AZURE_OPENAI_DEPLOYMENT_NAME=xxx

# 4. Deploy
# Automatic on push
```

---

## ✅ Checklist Before Launch

- [ ] Environment variables configured
- [ ] Development server runs without errors
- [ ] Can create new universe via /universes/create
- [ ] Story generates all 8 chapters
- [ ] Player works smoothly with animations
- [ ] Interactive elements respond to clicks
- [ ] Edit page saves changes
- [ ] Mobile layout looks good (9:16)
- [ ] No console errors
- [ ] Database backup configured (if using production DB)

---

## 🎯 Next Steps

1. **Customize**: Update colors, themes, and copy
2. **Integrate Auth**: Add NextAuth.js for real users
3. **Setup Database**: Migrate from in-memory to PostgreSQL
4. **Add Features**: Variants, sharing, export
5. **Launch**: Deploy to Vercel or self-host

---

## 📞 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Stories not generating | Check Azure OpenAI credentials in .env.local |
| 404 on /universes/[id]/play | Universe ID may not exist, check /universes page |
| Animations lag | Reduce animation intensity in settings |
| Types not compiling | Run `npm install` to install dependencies |
| Env vars not loading | Restart dev server after updating .env.local |

---

**Built with ❤️ for CraftYourMessage**

Ready to launch? Start at http://localhost:3000/universes 🌌✨
