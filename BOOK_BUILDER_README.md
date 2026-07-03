# 📚 Advanced AI-Powered Book Builder Platform

A comprehensive, production-ready book building platform with AI-powered content generation, multiple story structures, branching narratives, and multi-format publishing capabilities.

## ✨ Features

### 1. **Interactive Story Builder**
- Visual chapter/scene editor with rich text support
- Branching narrative support for interactive stories
- Character arc tracking and consistency checking
- Scene composition with timing and pacing analysis
- Reader journey analytics for engagement tracking

### 2. **AI-Powered Content Generation**
- **Chapter Generator**: Auto-generate full chapters from outlines
- **Smart Editor**: Real-time suggestions (tone, grammar, consistency)
- **Character Intelligence**: Auto-maintain character voice consistency
- **Dialogue Generator**: Context-aware conversation drafting
- **Plot Hole Detector**: Flag timeline/continuity issues
- **Pacing Analyzer**: Optimal chapter/scene length recommendations

### 3. **Template System**
- **Story Structures**:
  - Hero's Journey (12 acts)
  - Three-Act Structure
  - Save the Cat (15 beat sheet)
  - Custom structures
  
- **Genre Templates**: Pre-configured for Fiction, Romance, Mystery, Sci-Fi, Fantasy, Thriller, Literary, Memoir, Business, Self-Help

- **Writing Styles**: Literary, Commercial, Young Adult, Children, Technical, Casual

### 4. **Publishing & Distribution**
- **Multi-Format Export**: PDF, EPUB, MOBI, DOCX, HTML
- **Direct Publishing**: Amazon KDP, Smashwords, Draft2Digital, Web
- **AI Cover Generation**: Auto-create book covers
- **Metadata Optimization**: SEO-optimized keywords and descriptions
- **Print-Ready Formats**: Professional formatting options

### 5. **Collaboration Features**
- Multi-user editing
- Beta reader feedback portal
- Version control and change tracking
- Collaborative commenting

## 🏗️ Project Structure

```
book-builder/
├── app/
│   ├── api/
│   │   ├── books/route.ts           # Book CRUD operations
│   │   ├── ai/book/route.ts         # AI content generation
│   │   └── export/[format]/route.ts # Export functionality
│   ├── books/
│   │   ├── page.tsx                 # Books library
│   │   ├── create/page.tsx          # Create book wizard
│   │   └── [id]/page.tsx            # Book editor
│   └── layout.tsx
├── components/
│   └── BookEditor.tsx               # Main editor component
├── lib/
│   ├── book-types.ts                # Type definitions
│   ├── book-ai-service.ts           # AI integration
│   ├── book-export-service.ts       # Export services
│   └── templates.ts                 # Template definitions
└── public/

```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
AZURE_OPENAI_API_KEY=your-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment
```

## 📖 Usage Guide

### Creating a Book

1. **Navigate to** `/books/create`
2. **Enter book details**:
   - Title
   - Genre
   - Writing style
   - Target word count
   - Description

3. **Select a story structure**:
   - Choose from pre-built templates (Hero's Journey, Three-Act, Save the Cat)
   - Customize the structure as needed

4. **Configure AI settings**:
   - Set writing tone
   - Define target audience
   - Enable/disable AI features

5. **Start editing**!

### Using the Editor

#### Main Features
- **Chapters Panel** (Left): Navigate between chapters
- **Scene Editor** (Center): Write and edit scenes
- **AI Assistant** (Right): Get real-time suggestions
- **Toolbar**: Quick access to AI tools and export

#### AI Tools

```typescript
// Generate a full chapter
await bookAI.generateChapter(book, outline, wordCount);

// Improve existing scene
await bookAI.improveScene(scene, feedback);

// Fix tone/style
await bookAI.fixTone(content, desiredTone);

// Expand scene to target length
await bookAI.expandScene(scene, targetLength);

// Check character consistency
await bookAI.checkCharacterConsistency(book, character, scenes);

// Detect plot holes
await bookAI.checkPlotConsistency(book, proposedScene);

// Generate dialogue
await bookAI.generateDialogue(characters, situation, tone);
```

### Exporting Your Book

```typescript
import { bookExport } from '@/lib/book-export-service';

// Export to PDF
await bookExport.downloadFile(book, 'pdf');

// Export to EPUB
await bookExport.downloadFile(book, 'epub');

// Generate print-ready version
const printReady = await bookExport.generatePrintReady(book);

// Get format recommendations
const recommendations = await bookExport.getFormatRecommendations(book);
```

### Publishing

```typescript
// Publish to Amazon KDP
await bookExport.publishToAmazonKDP(book, {
  title: 'My Book',
  description: 'Description',
  author: 'Your Name',
  keywords: ['keyword1', 'keyword2'],
  price: 9.99,
});

// Publish to web
const url = await bookExport.publishToWeb(book, config);
```

## 🤖 AI Integration

### Azure OpenAI Setup

The platform uses Azure OpenAI for intelligent content generation:

```typescript
// Example: Custom AI request
const response = await bookAI.makeRequest('generate-chapter', {
  book: currentBook,
  instruction: 'Generate a chapter about...',
  parameters: {
    temperature: 0.7,
    maxTokens: 2000
  }
});
```

### Supported AI Operations

1. **Content Generation**
   - Chapter generation
   - Dialogue creation
   - Scene expansion

2. **Content Analysis**
   - Plot consistency checking
   - Character voice analysis
   - Tone detection
   - Pacing suggestions

3. **Writing Assistance**
   - Grammar corrections
   - Style improvements
   - Tone adjustments
   - Real-time suggestions

## 📊 Data Models

### Book
```typescript
{
  id: string;
  userId: string;
  title: string;
  genre: BookGenre;
  writingStyle: WritingStyle;
  status: BookStatus;
  chapters: Chapter[];
  characters: Character[];
  targetWordCount: number;
  currentWordCount: number;
  // ... and more
}
```

### Chapter
```typescript
{
  id: string;
  bookId: string;
  title: string;
  scenes: Scene[];
  wordCount: number;
  plotPoints: string[];
  themes: string[];
  // ... and more
}
```

### Scene
```typescript
{
  id: string;
  chapterId: string;
  title: string;
  type: SceneType;
  content: string;
  wordCount: number;
  pov: string;
  charactersInvolved: string[];
  aiSuggestions?: AIAnalysis;
  // ... and more
}
```

## 🔧 API Endpoints

### Books API
```
GET    /api/books                    # List all books
GET    /api/books?id={id}            # Get specific book
GET    /api/books?userId={userId}    # Get user's books
POST   /api/books                    # Create new book
PUT    /api/books                    # Update book
DELETE /api/books?id={id}            # Delete book
```

### AI API
```
POST   /api/ai/book                  # AI content generation
       Types: generate-chapter, improve-scene, fix-tone,
              expand-scene, character-check, plot-consistency
```

### Export API
```
POST   /api/export/pdf               # Export to PDF
POST   /api/export/epub              # Export to EPUB
POST   /api/export/mobi              # Export to MOBI
POST   /api/export/docx              # Export to DOCX
POST   /api/export/html              # Export to HTML
```

## 🎨 Customization

### Adding Custom Templates

```typescript
// In lib/templates.ts
export const CUSTOM_TEMPLATES = {
  'my-template': {
    id: 'my-template',
    name: 'My Custom Template',
    chapters: [
      {
        title: 'Chapter 1',
        description: 'First chapter',
        suggestedLength: 3000,
        keyPoints: ['Point 1', 'Point 2']
      },
      // ... more chapters
    ],
    // ... more config
  }
};
```

### Customizing AI Behavior

```typescript
// Override AI service methods
class CustomBookAIService extends BookAIService {
  async generateChapter(book, outline, wordCount) {
    // Custom implementation
    return super.generateChapter(book, outline, wordCount);
  }
}
```

## 🔒 Security Considerations

- Implement user authentication (NextAuth.js recommended)
- Validate all user inputs server-side
- Use proper CORS headers
- Store sensitive data encrypted
- Implement rate limiting for AI API calls
- Use environment variables for secrets

## 📈 Performance Tips

1. **Pagination**: Implement for large book libraries
2. **Caching**: Cache frequently accessed templates
3. **Lazy Loading**: Load chapters on demand
4. **Compression**: Compress export files
5. **CDN**: Serve static assets from CDN

## 🐛 Troubleshooting

### AI Service Not Responding
- Check Azure OpenAI credentials
- Verify API key hasn't expired
- Check rate limiting quota

### Export Failures
- Ensure file permissions are correct
- Check available disk space
- Verify format-specific libraries installed

### Performance Issues
- Monitor database queries
- Implement query pagination
- Clear old temporary files

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service/)
- [EPUB Format Guide](https://idpf.org/epub/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use in commercial projects

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Community marketplace
- [ ] Audio book generation
- [ ] Multiple language support
- [ ] Advanced AI models integration
- [ ] Blockchain-based rights management

## 💬 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@bookbuilder.dev
- Discord: [Join our community]

---

**Built with ❤️ using Next.js, TypeScript, and AI**
