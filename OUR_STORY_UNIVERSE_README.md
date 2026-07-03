# 🌌 Our Story Universe

**Premium Interactive Love Story Platform** — Transform relationships into living, animated worlds.

---

## 📖 Overview

**Our Story Universe** is a premium web experience that lets couples create interactive, animated storybooks of their relationship. Unlike static PDF ebooks, Our Story Universe creates **living worlds** with:

- ✨ Cinematic page-turn animations
- 🎨 Theme-based visual effects (petals, rain, stars, fireflies)
- 🤖 AI-generated personalized chapters
- 🎭 Interactive choice mechanics
- 💫 Tappable, holdable, scratchable elements
- 🎵 Ambient music and sound design
- 📱 Mobile-first 9:16 aspect ratio
- 🎁 Multiple story variants (manga, comedy, what-if)

---

## 🚀 Features

### Core Experience
- **Magical Onboarding**: Multi-step storyteller-style wizard (not a boring form)
- **8 Auto-Generated Chapters**: Cover, Dedication, How Fate Began, The Moment Everything Changed, Little Things I Love, The Memory Time Kept, The Promise, Our Universe
- **Interactive Mechanics**: Tap to reveal, hold to reveal, scratch, double-tap, drag elements
- **Cinematic Animations**: Page turns, fades, slides, zooms, glows, floating text
- **Particle Effects**: Petals, rain, stars, fireflies, snowflakes, sparkles, confetti
- **Theme System**: 12 themes (Classic Romance, Dark Fantasy, Manga, Comedy, Royal Kingdom, Sci-Fi, Cyberpunk, Horror, Mystery, Pirate Adventure, Slice of Life, Time Travel)
- **Story Tones**: Romantic, Emotional, Funny, Dramatic, Mysterious, Cute, Dark Comedy

### Creator Features
- **Story Editor**: Edit any chapter's text, customize page duration, adjust themes
- **Metadata Management**: Update names, photos, memories, traits, promises
- **Settings Control**: Animation intensity, music, sound effects, text size
- **Playback Analytics**: Track play count, favorite chapters, user interactions

### Engagement Features
- **Story Variants**: Locked variant suggestions (Manga, Comedy, What-If, Future, Royal, Alternate Ending)
- **Share & Export**: Share with partners, export functionality
- **Collection**: View all created universes, progress tracking

---

## 📁 Project Structure

```
lib/
  ├─ universe-types.ts         # Complete TypeScript type definitions
  ├─ universe-animations.ts    # Animation configs & particle effects
  └─ universe-ai-service.ts    # AI story generation service

components/universe/
  ├─ OnboardingFlow.tsx        # Magical multi-step wizard
  ├─ StoryPlayer.tsx           # Main story experience (9:16)
  ├─ InteractiveElements.tsx   # Tappable/holdable objects
  └─ (future components for editor, variants, etc)

app/universes/
  ├─ page.tsx                  # Library dashboard
  ├─ create/page.tsx           # Onboarding entry point
  ├─ [id]/
  │  ├─ play/page.tsx          # Story player
  │  └─ edit/page.tsx          # Story editor
  └─ api/
     └─ route.ts               # CRUD operations

styles/
  └─ globals.css               # Tailwind configuration
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Next.js 14, TypeScript |
| Styling | Tailwind CSS + custom animations |
| AI Content | Azure OpenAI (GPT-4-Turbo) |
| State | React Hooks (useState, useEffect, useCallback) |
| Animations | CSS animations + Framer Motion (optional) |
| Storage | In-memory (production: PostgreSQL + Prisma) |
| Auth | Demo: hardcoded userId (production: NextAuth.js) |

---

## 📋 Installation & Setup

### 1. Prerequisites
```bash
# Node.js 18+ required
node --version
npm --version
```

### 2. Install Dependencies
```bash
# From project root
npm install
```

### 3. Environment Configuration
Create `.env.local` in project root:
```env
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-turbo
```

### 4. Run Development Server
```bash
npm run dev
# Opens http://localhost:3000
```

### 5. Access Pages
- Library: http://localhost:3000/universes
- Create New: http://localhost:3000/universes/create
- Play Story: http://localhost:3000/universes/[id]/play
- Edit Story: http://localhost:3000/universes/[id]/edit

---

## 🎨 Key Components

### OnboardingFlow.tsx
**Magical multi-step storyteller interface**
```typescript
<OnboardingFlow
  onComplete={(data) => createUniverse(data)}
  onSkip={() => router.push('/universes')}
/>
```

- 9 questions with emojis and magical styling
- Photo uploads for both partners (optional but recommended)
- Theme/Tone selection with grid UI
- Smooth transitions between steps
- Progress indicator with animated background

### StoryPlayer.tsx
**Main 9:16 mobile-first story experience**
```typescript
<StoryPlayer
  universe={universe}
  onEdit={() => router.push(`/edit`)}
  onShare={() => handleShare()}
/>
```

- Page turn animations with perspective
- Particle effects based on theme
- Interactive elements on each page
- Choice mechanics with branching
- End screen with variant previews
- Keyboard navigation (arrow keys)

### InteractiveElements.tsx
**Tappable/holdable/scratchable objects**
```typescript
<InteractiveElements
  elements={pageInteractiveElements}
  onInteract={(id, type) => trackInteraction(id)}
/>
```

- Tap to reveal (with sparkle animation)
- Hold to reveal (1 second hold + haptic feedback)
- Double tap (rotating heart animation)
- Scratch effect (canvas-based progressive reveal)
- Contextual instructions

---

## 🤖 AI Integration

### Azure OpenAI Configuration

1. **Get Azure OpenAI Access**:
   - Create Azure resource: https://portal.azure.com
   - Deploy GPT-4-Turbo model
   - Copy API key, endpoint, deployment name

2. **Update Environment**:
```env
AZURE_OPENAI_API_KEY=sk-xyz...
AZURE_OPENAI_ENDPOINT=https://resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-turbo
```

3. **Story Generation** (in `lib/universe-ai-service.ts`):
```typescript
// Replace mock responses with real API calls
const response = await fetch(
  `${endpoint}/openai/deployments/${deploymentName}/chat/completions`,
  {
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
  }
);
```

---

## 💾 Database Setup (Production)

### 1. PostgreSQL Schema (via Prisma)

```prisma
model User {
  id        String    @id
  email     String    @unique
  universes Universe[]
}

model Universe {
  id         String   @id
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  title      String
  theme      String
  tone       String
  heroName   String
  partnerName String
  chapters   Chapter[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Chapter {
  id         String   @id
  universeId String
  universe   Universe @relation(fields: [universeId], references: [id])
  type       String
  title      String
  pages      Page[]
}

model Page {
  id        String  @id
  chapterId String
  chapter   Chapter @relation(fields: [chapterId], references: [id])
  content   String
  order     Int
}
```

### 2. Setup Commands
```bash
# Install Prisma
npm install @prisma/client prisma

# Initialize
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

---

## 🔐 Authentication (Production)

### NextAuth.js Setup

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const handler = NextAuth(authOptions);
```

Update `app/universes/page.tsx`:
```typescript
import { useSession } from 'next-auth/react';

export default function UniversesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  // ... rest of component
}
```

---

## 🎯 Usage Examples

### Create a New Universe
```bash
1. Navigate to /universes/create
2. Answer 9 magical questions
3. Select theme & tone
4. Watch story generate in real-time
5. Story automatically redirects to player
```

### Play a Story
```bash
1. Open /universes/[id]/play
2. Read through 8 chapters with animations
3. Tap interactive elements to reveal hidden text
4. Make choices that affect story tone
5. Explore variant universes at the end
```

### Edit a Story
```bash
1. Click "Edit" on any universe card
2. Switch between "Story", "Metadata", "Settings" tabs
3. Edit chapter text directly
4. Update names, memories, traits
5. Save changes (updates all chapters)
```

---

## 🎨 Customization

### Change Theme Colors
Edit `lib/universe-animations.ts`:
```typescript
export const THEME_COLORS = {
  'custom-theme': {
    primary: '#ff1493',
    secondary: '#ff69b4',
    accent: '#ffb6c1',
    background: 'linear-gradient(...)',
    textColor: '#8b0000',
    glow: 'rgba(255, 105, 180, 0.6)',
    particle: ParticleEffect.PETALS,
  },
};
```

### Add New Particle Effect
```typescript
export const PARTICLE_CONFIGS = {
  [ParticleEffect.CUSTOM]: {
    particleCount: 20,
    particleSize: { min: 4, max: 8 },
    duration: 5,
    gravity: 0.5,
    windForce: 0.3,
    color: ['#ff69b4', '#ffb6c1'],
    opacity: 0.8,
    rotation: true,
  },
};
```

### Modify Animation Timing
```typescript
export const ANIMATION_CONFIGS = {
  PAGE_TURN: {
    duration: 1.0, // Increase for slower turns
    easing: 'cubic-bezier(...)',
    perspective: 1200,
  },
};
```

---

## 📊 Analytics & Tracking

### Track Play Events
```typescript
// In StoryPlayer.tsx
const trackPlayEvent = async (eventType: string) => {
  await fetch('/api/analytics/events', {
    method: 'POST',
    body: JSON.stringify({
      universeId,
      userId,
      eventType,
      timestamp: new Date(),
    }),
  });
};
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# 1. Connect GitHub repo
# 2. Add environment variables in Vercel dashboard
# 3. Deploy automatically on push
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t our-story-universe .
docker run -p 3000:3000 our-story-universe
```

### Self-Hosted
```bash
npm run build
npm start
# Runs on http://localhost:3000
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Onboarding flow completes successfully
- [ ] Story generates all 8 chapters
- [ ] Page turns work smoothly
- [ ] Interactive elements respond to taps/holds/scratches
- [ ] Choices affect story progression
- [ ] Edit page saves changes
- [ ] Delete removes universe

### Unit Tests (Add to project)
```bash
npm install --save-dev jest @testing-library/react
npm test
```

---

## 🐛 Troubleshooting

### Issue: Stories not generating
**Solution**: Check Azure OpenAI credentials in `.env.local`
```bash
# Verify API key
curl -X POST https://[resource].openai.azure.com/openai/deployments/[deployment]/chat/completions \
  -H "api-key: $AZURE_OPENAI_API_KEY"
```

### Issue: Animations not smooth
**Solution**: Reduce animation intensity in settings or upgrade to better device
```typescript
animationIntensity: 'low' // Reduce particle counts
```

### Issue: Page not loading
**Solution**: Clear browser cache and check browser console for errors
```bash
# Clear cache
rm -rf .next
npm run dev
```

---

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Onboarding wizard
- ✅ 8-chapter story generation
- ✅ Interactive player
- ✅ Story editor
- ✅ Basic variants

### Phase 2
- [ ] Real-time collaboration (multiplayer editing)
- [ ] Advanced variants (AI-powered)
- [ ] Export to PDF/EPUB
- [ ] Social sharing features
- [ ] Couple authentication

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Voice narration
- [ ] Custom music uploads
- [ ] Community library
- [ ] Gifting & surprises

---

## 📝 Best Practices

### Performance
- ✅ Lazy load story chapters
- ✅ Optimize images (WEBP format)
- ✅ Cache animations at load time
- ✅ Minimize re-renders with useCallback

### UX
- ✅ Always show progress indicators
- ✅ Provide keyboard alternatives
- ✅ Include haptic feedback for interactions
- ✅ Make animations optional (settings)

### Security
- ✅ Validate all user inputs
- ✅ Sanitize story content
- ✅ Rate limit API endpoints
- ✅ Use HTTPS in production

---

## 📞 Support

For issues or questions:
1. Check console logs for errors
2. Review documentation above
3. Check `/memories/repo/` for notes
4. Inspect network tab for API calls

---

## 📄 License

Built for CraftYourMessage 🎨

---

**Made with ❤️ as an interactive love story platform**
