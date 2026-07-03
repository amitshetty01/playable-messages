import { NextRequest, NextResponse } from 'next/server';
import { BookStatus, Book } from '@/lib/book-types';

// In-memory storage for demo (replace with database)
let books: Map<string, Book> = new Map();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get('id');
  const userId = searchParams.get('userId');

  if (bookId) {
    const book = books.get(bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json(book);
  }

  if (userId) {
    const userBooks = Array.from(books.values()).filter(b => b.userId === userId);
    return NextResponse.json(userBooks);
  }

  return NextResponse.json(Array.from(books.values()));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, genre, writingStyle, userId, templateId, targetWordCount } = body;

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      );
    }

    const book: Book = {
      id: `book-${Date.now()}`,
      userId,
      title,
      description: '',
      genre: genre || 'fiction',
      writingStyle: writingStyle || 'commercial',
      status: 'draft' as BookStatus,
      templateId,
      targetWordCount: targetWordCount || 80000,
      currentWordCount: 0,
      chapters: [],
      characters: [],
      outline: {
        id: `outline-${Date.now()}`,
        bookId: `book-${Date.now()}`,
        plotStructure: 'three-act',
        acts: [],
        themes: [],
        conflicts: { internal: [], external: [] },
        climax: '',
        resolution: '',
      },
      branchPoints: [],
      settings: [],
      aiContext: {
        tone: 'neutral',
        voiceGuidelines: '',
        contentWarnings: [],
        targetAudience: 'general',
      },
      metadata: {
        keywords: [],
      },
      stats: {
        readingTime: 0,
        chapterCount: 0,
        sceneCount: 0,
        averageChapterLength: 0,
        completionPercentage: 0,
      },
      versions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    books.set(book.id, book);
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const existingBook = books.get(id);
    if (!existingBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const updatedBook = {
      ...existingBook,
      ...updateData,
      updatedAt: new Date(),
    };

    books.set(id, updatedBook);
    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get('id');

  if (!bookId) {
    return NextResponse.json({ error: 'Book ID required' }, { status: 400 });
  }

  if (!books.has(bookId)) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  books.delete(bookId);
  return NextResponse.json({ message: 'Book deleted' });
}
