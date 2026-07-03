/**
 * Our Story Universe - API Route: Create/Read/Update/Delete Universes
 */

import { NextRequest, NextResponse } from 'next/server';
import { Universe, UniverseMetadata, Chapter, ChapterType } from '@/lib/universe-types';
import { universeAI } from '@/lib/universe-ai-service';

// In-memory storage (replace with database in production)
const universes = new Map<string, Universe>();

/**
 * GET: Fetch universe by ID or list user's universes
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universeId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (universeId) {
      const universe = universes.get(universeId);
      if (!universe) {
        return NextResponse.json(
          { error: 'Universe not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(universe);
    }

    if (userId) {
      const userUniverses = Array.from(universes.values()).filter(
        (u) => u.metadata.userId === userId
      );
      return NextResponse.json(userUniverses);
    }

    return NextResponse.json(
      { error: 'Provide id or userId parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create new universe with generated story
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      heroName,
      partnerName,
      heroPhoto,
      partnerPhoto,
      theme,
      tone,
      favoriteMemory,
      partnerTraits,
      promise,
    } = body;

    // Validate required fields
    if (!userId || !heroName || !partnerName || !theme || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate universe ID
    const universeId = `universe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create metadata
    const metadata: UniverseMetadata = {
      userId,
      title: `${heroName} & ${partnerName}'s Story Universe`,
      theme,
      tone,
      hero: { name: heroName, photoUrl: heroPhoto },
      partner: { name: partnerName, photoUrl: partnerPhoto },
      favoriteMemory,
      partnerTraits,
      promise,
      createdAt: new Date(),
      updatedAt: new Date(),
      playCount: 0,
      isPublished: false,
      isShared: false,
    };

    // Generate all chapters
    const chapters: Chapter[] = [];
    const chapterTypes = [
      ChapterType.COVER,
      ChapterType.DEDICATION,
      ChapterType.CHAPTER_1,
      ChapterType.CHAPTER_2,
      ChapterType.CHAPTER_3,
      ChapterType.CHAPTER_4,
      ChapterType.CHAPTER_5,
      ChapterType.FINAL,
    ];

    for (const chapterType of chapterTypes) {
      const response = await universeAI.generateChapter({
        universeId,
        hero: { name: heroName },
        partner: { name: partnerName },
        theme,
        tone,
        favoriteMemory,
        partnerTraits,
        promise,
        chapterType,
      });

      if (response.success) {
        chapters.push({
          id: response.chapterId,
          universeId,
          type: chapterType,
          title: getTitleForChapter(chapterType),
          pages: response.pages,
          generatedContent: {
            timestamp: new Date(),
            model: 'gpt-4-turbo',
            prompt: `Generate ${chapterType} for love story`,
          },
        });
      }
    }

    // Create variants
    const variants = [
      {
        id: `variant-${universeId}-manga`,
        parentUniverseId: universeId,
        variantType: 'manga' as const,
        isLocked: false,
        preview: 'Experience your story in manga style',
        description: 'Our Manga Version',
      },
      {
        id: `variant-${universeId}-comedy`,
        parentUniverseId: universeId,
        variantType: 'comedy' as const,
        isLocked: true,
        preview: 'A hilarious take on your love story',
        description: 'Our Comedy Version',
      },
      {
        id: `variant-${universeId}-what-if`,
        parentUniverseId: universeId,
        variantType: 'what-if' as const,
        isLocked: true,
        preview: 'What if you never met?',
        description: 'What If We Never Met?',
      },
      {
        id: `variant-${universeId}-future`,
        parentUniverseId: universeId,
        variantType: 'future' as const,
        isLocked: true,
        preview: '10 years into your beautiful future',
        description: 'Our Future',
      },
    ];

    // Create universe
    const universe: Universe = {
      id: universeId,
      metadata,
      chapters,
      variants,
      userChoices: {},
      currentChapterIndex: 0,
      currentPageIndex: 0,
      isPlaying: false,
      playProgress: 0,
      settings: {
        animationIntensity: 'medium',
        musicEnabled: true,
        soundEffectsEnabled: true,
        autoAdvance: false,
        autoAdvanceDelay: 3000,
        textSize: 'medium',
        enableVoiceOver: false,
        enableSubtitles: false,
      },
    };

    universes.set(universeId, universe);

    return NextResponse.json(
      { success: true, universeId, universe },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create universe' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update universe
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { universeId, updates } = body;

    if (!universeId) {
      return NextResponse.json(
        { error: 'Universe ID required' },
        { status: 400 }
      );
    }

    const universe = universes.get(universeId);
    if (!universe) {
      return NextResponse.json(
        { error: 'Universe not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (updates.metadata) {
      universe.metadata = {
        ...universe.metadata,
        ...updates.metadata,
        updatedAt: new Date(),
      };
    }

    if (updates.chapters) {
      universe.chapters = updates.chapters;
    }

    if (updates.settings) {
      universe.settings = { ...universe.settings, ...updates.settings };
    }

    universes.set(universeId, universe);

    return NextResponse.json({ success: true, universe });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update universe' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete universe
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const universeId = searchParams.get('id');

    if (!universeId) {
      return NextResponse.json(
        { error: 'Universe ID required' },
        { status: 400 }
      );
    }

    if (!universes.has(universeId)) {
      return NextResponse.json(
        { error: 'Universe not found' },
        { status: 404 }
      );
    }

    universes.delete(universeId);

    return NextResponse.json({ success: true, message: 'Universe deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete universe' },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTitleForChapter(chapterType: ChapterType): string {
  const titles: Record<ChapterType, string> = {
    [ChapterType.COVER]: 'Cover',
    [ChapterType.DEDICATION]: 'Dedication',
    [ChapterType.CHAPTER_1]: 'How Fate Began',
    [ChapterType.CHAPTER_2]: 'The Moment Everything Changed',
    [ChapterType.CHAPTER_3]: 'Little Things I Love',
    [ChapterType.CHAPTER_4]: 'The Memory Time Kept',
    [ChapterType.CHAPTER_5]: 'The Promise',
    [ChapterType.FINAL]: 'Our Universe',
  };

  return titles[chapterType];
}
