'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Book, Chapter, Scene, Character, AIAssistantResponse } from '@/lib/book-types';
import { bookAI } from '@/lib/book-ai-service';
import { bookExport } from '@/lib/book-export-service';

interface BookEditorProps {
  book: Book;
  onSave: (book: Book) => void;
  onPublish?: () => void;
}

export const BookEditor: React.FC<BookEditorProps> = ({ book, onSave, onPublish }) => {
  const [currentBook, setCurrentBook] = useState<Book>(book);
  const [activeChapterId, setActiveChapterId] = useState<string>(book.chapters[0]?.id || '');
  const [activeSceneId, setActiveSceneId] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIAssistantResponse | null>(null);
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  useEffect(() => {
    if (book.chapters.length > 0 && !activeChapterId) {
      setActiveChapterId(book.chapters[0].id);
      if (book.chapters[0].scenes.length > 0) {
        setActiveSceneId(book.chapters[0].scenes[0].id);
      }
    }
  }, [book.chapters, activeChapterId]);

  const activeChapter = currentBook.chapters.find(c => c.id === activeChapterId);
  const activeScene = activeChapter?.scenes.find(s => s.id === activeSceneId);

  const updateScene = useCallback((updatedScene: Scene) => {
    setCurrentBook(prev => ({
      ...prev,
      chapters: prev.chapters.map(c =>
        c.id === activeChapterId
          ? {
              ...c,
              scenes: c.scenes.map(s => (s.id === activeSceneId ? updatedScene : s)),
            }
          : c
      ),
    }));
  }, [activeChapterId, activeSceneId]);

  const addScene = useCallback(() => {
    if (!activeChapter) return;

    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      chapterId: activeChapterId,
      title: 'New Scene',
      type: 'description',
      content: '',
      wordCount: 0,
      pov: currentBook.characters[0]?.name || 'Unknown',
      setting: '',
      timeline: { timeOfDay: '', date: '', duration: '' },
      charactersInvolved: [],
      emotionalTone: '',
      pacing: 'normal',
      order: activeChapter.scenes.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCurrentBook(prev => ({
      ...prev,
      chapters: prev.chapters.map(c =>
        c.id === activeChapterId
          ? { ...c, scenes: [...c.scenes, newScene], wordCount: c.wordCount + 0 }
          : c
      ),
    }));

    setActiveSceneId(newScene.id);
  }, [activeChapter, activeChapterId, currentBook.characters]);

  const generateChapter = async () => {
    setAiLoading(true);
    try {
      const response = await bookAI.generateChapter(
        currentBook,
        activeChapter?.description || '',
        3000
      );
      setAiResponse(response);

      if (response.success && response.data?.content && activeChapter) {
        const newScene: Scene = {
          id: `scene-${Date.now()}`,
          chapterId: activeChapterId,
          title: `Generated Scene - ${new Date().toLocaleDateString()}`,
          type: 'description',
          content: response.data.content,
          wordCount: response.data.content.split(' ').length,
          pov: currentBook.characters[0]?.name || 'Unknown',
          setting: activeChapter.description || '',
          timeline: { timeOfDay: '', date: '', duration: '' },
          charactersInvolved: currentBook.characters.slice(0, 2).map(c => c.name),
          emotionalTone: currentBook.aiContext.tone,
          pacing: 'normal',
          order: activeChapter.scenes.length,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setCurrentBook(prev => ({
          ...prev,
          chapters: prev.chapters.map(c =>
            c.id === activeChapterId
              ? { ...c, scenes: [...c.scenes, newScene], wordCount: c.wordCount + newScene.wordCount }
              : c
          ),
        }));
      }
    } finally {
      setAiLoading(false);
    }
  };

  const improveScene = async () => {
    if (!activeScene) return;

    setAiLoading(true);
    try {
      const response = await bookAI.improveScene(activeScene, 'Improve writing quality and flow');
      setAiResponse(response);

      if (response.success && response.data?.content) {
        updateScene({ ...activeScene, content: response.data.content });
      }
    } finally {
      setAiLoading(false);
    }
  };

  const expandScene = async () => {
    if (!activeScene) return;

    setAiLoading(true);
    try {
      const response = await bookAI.expandScene(activeScene, 1500);
      setAiResponse(response);

      if (response.success && response.data?.content) {
        updateScene({ ...activeScene, content: response.data.content });
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'epub' | 'docx') => {
    try {
      await bookExport.downloadFile(currentBook, format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleSave = () => {
    onSave(currentBook);
  };

  return (
    <div className="flex h-screen bg-ink">
      {/* Sidebar */}
      <div className="w-64 bg-white/5 overflow-y-auto border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">{currentBook.title}</h2>
          <p className="text-sm text-white/50 mt-1">{currentBook.currentWordCount} words</p>
        </div>

        {/* Chapters */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-white/60 mb-3">Chapters</h3>
          {currentBook.chapters.map(chapter => (
            <button
              key={chapter.id}
              onClick={() => {
                setActiveChapterId(chapter.id);
                setActiveSceneId(chapter.scenes[0]?.id || '');
              }}
              className={`w-full text-left px-3 py-2 rounded mb-2 text-sm transition ${
                activeChapterId === chapter.id
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/50 hover:bg-white/10'
              }`}
            >
              {chapter.order}. {chapter.title}
            </button>
          ))}
        </div>

        {/* Characters */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowCharacterPanel(!showCharacterPanel)}
            className="w-full text-left text-sm font-semibold text-white/60 hover:text-white/80 py-2"
          >
            {showCharacterPanel ? '▼' : '▶'} Characters ({currentBook.characters.length})
          </button>
          {showCharacterPanel && (
            <div className="mt-3 space-y-2">
              {currentBook.characters.map(char => (
                <div
                  key={char.id}
                  className="p-2 bg-white/5 rounded text-xs border border-white/10"
                >
                  <p className="font-medium text-white/80">{char.name}</p>
                  <p className="text-white/50">{char.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white/5 border-b border-white/10 p-4 flex gap-2">
          <button
            onClick={generateChapter}
            disabled={aiLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {aiLoading ? '⟳ Generating...' : '✨ Generate Chapter'}
          </button>
          <button
            onClick={improveScene}
            disabled={!activeScene || aiLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
          >
            🎯 Improve Scene
          </button>
          <button
            onClick={expandScene}
            disabled={!activeScene || aiLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
          >
            📝 Expand
          </button>
          <button
            onClick={addScene}
            className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 text-sm font-medium"
          >
            + Scene
          </button>

          {/* Export Menu */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
            >
              📄 PDF
            </button>
            <button
              onClick={() => handleExport('epub')}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm font-medium"
            >
              📖 EPUB
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm font-medium"
            >
              📋 Word
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
            >
              💾 Save
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex gap-4 p-6 overflow-hidden">
          {/* Scene Editor */}
          <div className="flex-1 flex flex-col bg-white/5 rounded-lg shadow overflow-hidden">
            {activeScene ? (
              <>
                <div className="border-b border-white/10 p-4">
                  <input
                    type="text"
                    value={activeScene.title}
                    onChange={e =>
                      updateScene({ ...activeScene, title: e.target.value })
                    }
                    className="text-2xl font-bold w-full outline-none bg-transparent text-white"
                    placeholder="Scene Title"
                  />
                  <div className="flex gap-4 mt-3 text-sm text-white/50">
                    <span>📍 {activeScene.setting}</span>
                    <span>🎭 {activeScene.pov}</span>
                    <span>⚡ {activeScene.pacing}</span>
                  </div>
                </div>

                <textarea
                  value={activeScene.content}
                  onChange={e =>
                    updateScene({
                      ...activeScene,
                      content: e.target.value,
                      wordCount: e.target.value.split(/\s+/).length,
                    })
                  }
                  className="flex-1 p-4 outline-none resize-none font-mono text-sm bg-transparent text-white"
                  placeholder="Start writing your scene..."
                />

                <div className="border-t border-white/10 p-4 bg-white/5 text-sm text-white/50">
                  <span>{activeScene.wordCount} words</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white/40">
                <p>Select a scene to edit</p>
              </div>
            )}
          </div>

          {/* Right Panel - Scenes List & AI Suggestions */}
          <div className="w-80 flex flex-col gap-4 overflow-y-auto">
            {/* Scenes in Chapter */}
            <div className="bg-white/5 rounded-lg shadow overflow-hidden">
              <div className="bg-white/10 p-3 border-b border-white/10">
                <h3 className="font-semibold text-sm text-white/80">
                  Scenes ({activeChapter?.scenes.length || 0})
                </h3>
              </div>
              <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                {activeChapter?.scenes.map(scene => (
                  <button
                    key={scene.id}
                    onClick={() => setActiveSceneId(scene.id)}
                    className={`w-full text-left px-3 py-2 text-sm transition ${
                      activeSceneId === scene.id
                        ? 'bg-white/10 border-l-2 border-blue-400'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <p className="font-medium text-white/80">{scene.title}</p>
                    <p className="text-xs text-white/40 mt-1">{scene.wordCount} words</p>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            {aiResponse && (
              <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-blue-300 mb-2">AI Suggestions</h3>
                {aiResponse.success ? (
                  <div className="text-xs text-blue-200 space-y-2">
                    {aiResponse.data?.suggestions?.map((s, i) => (
                      <p key={i}>• {s}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-red-400">{aiResponse.error}</p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white/5 rounded-lg shadow p-4">
              <h3 className="font-semibold text-sm text-white/80 mb-3">Book Stats</h3>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex justify-between">
                  <span>Total Words:</span>
                  <span className="font-medium text-white">{currentBook.currentWordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-medium text-white">{currentBook.targetWordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span className="font-medium text-white">
                    {Math.round(
                      (currentBook.currentWordCount / currentBook.targetWordCount) * 100
                    )}%
                  </span>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (currentBook.currentWordCount / currentBook.targetWordCount) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
