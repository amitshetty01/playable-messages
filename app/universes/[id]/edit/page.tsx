/**
 * Our Story Universe - Universe Editor Page
 * Edit story content, names, photos, and other details
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Universe, PageContent } from '@/lib/universe-types';

export default function EditUniversePage() {
  const params = useParams();
  const router = useRouter();
  const universeId = params.id as string;

  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'story' | 'metadata' | 'settings'>(
    'story'
  );
  const [editingPageText, setEditingPageText] = useState<string>('');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniverse = async () => {
      try {
        const res = await fetch(`/api/universes?id=${universeId}`);
        if (!res.ok) throw new Error('Universe not found');
        const data = await res.json();
        setUniverse(data);
      } catch (error) {
        console.error('Error fetching universe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniverse();
  }, [universeId]);

  const handleSaveChanges = async () => {
    if (!universe) return;

    setSaving(true);
    try {
      const res = await fetch('/api/universes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universeId,
          updates: universe,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      alert('Changes saved!');
    } catch (error) {
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPageText = (pageId: string, newText: string) => {
    if (!universe) return;

    const updatedChapters = universe.chapters.map((chapter) => ({
      ...chapter,
      pages: chapter.pages.map((page) =>
        page.id === pageId ? { ...page, mainText: newText } : page
      ),
    }));

    setUniverse({ ...universe, chapters: updatedChapters });
  };

  const handleUpdateMetadata = (field: string, value: any) => {
    if (!universe) return;

    setUniverse({
      ...universe,
      metadata: { ...universe.metadata, [field]: value },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading editor...</p>
      </div>
    );
  }

  if (!universe) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Universe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-light text-white">
            Edit: {universe.metadata.title}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-6 border-t border-white/10">
          {(['story', 'metadata', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-pink-400 border-pink-400'
                  : 'text-white/60 border-transparent hover:text-white/80'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'story' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Chapter List */}
            <div className="col-span-1">
              <h2 className="text-lg font-light text-white mb-4">Chapters</h2>
              <div className="space-y-2">
                {universe.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedPageId(chapter.pages[0]?.id || null)}
                    className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                  >
                    {chapter.title}
                    <span className="text-white/60 text-xs ml-2">
                      ({chapter.pages.length} pages)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Page Editor */}
            <div className="col-span-2">
              {selectedPageId ? (
                (() => {
                  const page = universe.chapters
                    .flatMap((c) => c.pages)
                    .find((p) => p.id === selectedPageId);

                  if (!page) return <p className="text-white">Page not found</p>;

                  return (
                    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
                      <h3 className="text-lg font-light text-white mb-4">
                        {page.title || 'Untitled Page'}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/60 text-sm mb-2">
                            Page Text
                          </label>
                          <textarea
                            value={editingPageText || page.mainText}
                            onChange={(e) => {
                              setEditingPageText(e.target.value);
                              handleEditPageText(selectedPageId, e.target.value);
                            }}
                            className="w-full h-32 bg-white/20 border border-white/30 rounded-lg p-3 text-white focus:outline-none focus:border-pink-400"
                          />
                        </div>

                        <div>
                          <label className="block text-white/60 text-sm mb-2">
                            Page Duration (seconds)
                          </label>
                          <input
                            type="number"
                            value={page.duration}
                            onChange={(e) => {
                              const updatedChapters = universe.chapters.map(
                                (chapter) => ({
                                  ...chapter,
                                  pages: chapter.pages.map((p) =>
                                    p.id === selectedPageId
                                      ? {
                                          ...p,
                                          duration: parseInt(e.target.value),
                                        }
                                      : p
                                  ),
                                })
                              );
                              setUniverse({
                                ...universe,
                                chapters: updatedChapters,
                              });
                            }}
                            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-400"
                          />
                        </div>

                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/60 text-xs">
                            Word count: {page.mainText.split(/\s+/).length}
                          </p>
                          <p className="text-white/60 text-xs">
                            Animation: {page.animation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-white/60">
                  Select a chapter to edit
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="max-w-2xl">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 space-y-6">
              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Hero Name
                </label>
                <input
                  type="text"
                  value={universe.metadata.hero.name}
                  onChange={(e) => {
                    const newHero = {
                      ...universe.metadata.hero,
                      name: e.target.value,
                    };
                    handleUpdateMetadata('hero', newHero);
                  }}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Partner Name
                </label>
                <input
                  type="text"
                  value={universe.metadata.partner.name}
                  onChange={(e) => {
                    const newPartner = {
                      ...universe.metadata.partner,
                      name: e.target.value,
                    };
                    handleUpdateMetadata('partner', newPartner);
                  }}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Favorite Memory
                </label>
                <textarea
                  value={universe.metadata.favoriteMemory}
                  onChange={(e) =>
                    handleUpdateMetadata('favoriteMemory', e.target.value)
                  }
                  className="w-full h-24 bg-white/20 border border-white/30 rounded-lg p-3 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Partner Traits
                </label>
                <textarea
                  value={universe.metadata.partnerTraits}
                  onChange={(e) =>
                    handleUpdateMetadata('partnerTraits', e.target.value)
                  }
                  className="w-full h-24 bg-white/20 border border-white/30 rounded-lg p-3 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Promise
                </label>
                <textarea
                  value={universe.metadata.promise}
                  onChange={(e) =>
                    handleUpdateMetadata('promise', e.target.value)
                  }
                  className="w-full h-24 bg-white/20 border border-white/30 rounded-lg p-3 text-white focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-white">Music Enabled</label>
                <input
                  type="checkbox"
                  checked={universe.settings.musicEnabled}
                  onChange={(e) => {
                    setUniverse({
                      ...universe,
                      settings: {
                        ...universe.settings,
                        musicEnabled: e.target.checked,
                      },
                    });
                  }}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-white">Sound Effects Enabled</label>
                <input
                  type="checkbox"
                  checked={universe.settings.soundEffectsEnabled}
                  onChange={(e) => {
                    setUniverse({
                      ...universe,
                      settings: {
                        ...universe.settings,
                        soundEffectsEnabled: e.target.checked,
                      },
                    });
                  }}
                  className="w-5 h-5"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Animation Intensity
                </label>
                <select
                  value={universe.settings.animationIntensity}
                  onChange={(e) => {
                    setUniverse({
                      ...universe,
                      settings: {
                        ...universe.settings,
                        animationIntensity: e.target.value as any,
                      },
                    });
                  }}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">
                  Text Size
                </label>
                <select
                  value={universe.settings.textSize}
                  onChange={(e) => {
                    setUniverse({
                      ...universe,
                      settings: {
                        ...universe.settings,
                        textSize: e.target.value as any,
                      },
                    });
                  }}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pink-400"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
