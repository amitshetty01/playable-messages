import { NextRequest, NextResponse } from 'next/server';
import { Book, ExportOptions } from '@/lib/book-types';

// Simple HTML to PDF conversion (in production, use proper library)
function generatePDF(html: string): Buffer {
  // In production, use a library like puppeteer, pdfkit, or external service
  const buffer = Buffer.from(html);
  return buffer;
}

// Generate EPUB structure
function generateEPUB(book: Book): Buffer {
  // In production, use proper EPUB library
  const epubContent = `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf">
  <metadata>
    <title>${book.title}</title>
    <author>${book.userId}</author>
    <language>en</language>
  </metadata>
  <spine>
    ${book.chapters.map(ch => `<itemref idref="chapter-${ch.id}"/>`).join('\n')}
  </spine>
</package>`;
  return Buffer.from(epubContent);
}

// Generate HTML content
function generateHTML(book: Book, options: ExportOptions): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${book.title}</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.8rem; margin-top: 2rem; margin-bottom: 1rem; }
    h3 { font-size: 1.3rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    p { margin-bottom: 1rem; }
    .chapter { page-break-before: always; }
    .metadata { color: #666; font-size: 0.9rem; margin: 2rem 0; }
  </style>
</head>
<body>
  <h1>${book.title}</h1>
  ${
    options.includeMetadata
      ? `<div class="metadata">
    <p><strong>Author:</strong> ${book.userId}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Word Count:</strong> ${book.currentWordCount}</p>
    ${book.metadata.subtitle ? `<p><strong>Subtitle:</strong> ${book.metadata.subtitle}</p>` : ''}
  </div>`
      : ''
  }
  
  ${book.chapters
    .map(
      chapter => `
    <div class="chapter">
      <h2>${chapter.title}</h2>
      <p>${chapter.description}</p>
      ${chapter.scenes.map(scene => `<h3>${scene.title}</h3><p>${scene.content}</p>`).join('')}
    </div>
  `
    )
    .join('')}
</body>
</html>
  `;
}

// Generate DOCX (simplified - in production use docx library)
function generateDOCX(book: Book): Buffer {
  // In production, use a library like 'docx' or 'node-docx'
  const docContent = `
${book.title}

${book.chapters.map(ch => `${ch.title}\n${ch.description}\n${ch.scenes.map(s => `${s.title}\n${s.content}`).join('\n')}`).join('\n\n')}
  `;
  return Buffer.from(docContent);
}

export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const format = pathname.split('/').pop();

  try {
    const body = await req.json();
    const { book, options } = body as { book: Book; options: ExportOptions };

    let buffer: Buffer;
    let mimeType: string;
    let filename: string;

    switch (format) {
      case 'html':
        const html = generateHTML(book, options);
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `attachment; filename="${book.title}.html"`,
          },
        });

      case 'pdf':
        buffer = generatePDF(generateHTML(book, options));
        mimeType = 'application/pdf';
        filename = `${book.title}.pdf`;
        break;

      case 'epub':
        buffer = generateEPUB(book);
        mimeType = 'application/epub+zip';
        filename = `${book.title}.epub`;
        break;

      case 'docx':
        buffer = generateDOCX(book);
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = `${book.title}.docx`;
        break;

      case 'mobi':
        buffer = generatePDF(generateHTML(book, options)); // Simplified
        mimeType = 'application/x-mobipocket-ebook';
        filename = `${book.title}.mobi`;
        break;

      default:
        return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
