'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORY_TEMPLATES, GENRE_TEMPLATES, WRITING_STYLE_PRESETS } from '@/lib/templates';
import { BookGenre, WritingStyle } from '@/lib/book-types';

export default function CreateBook() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    genre: 'fiction' as BookGenre,
    writingStyle: 'commercial' as WritingStyle,
    description: '',
    targetWordCount: 80000,
    templateId: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetWordCount' ? parseInt(value) : value,
    }));
  };

  const handleCreateBook = async () => {
    if (!formData.title) {
      alert('Please enter a book title');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          genre: formData.genre,
          writingStyle: formData.writingStyle,
          description: formData.description,
          targetWordCount: formData.targetWordCount,
          templateId: formData.templateId,
          userId: 'user-123', // In production, get from auth
        }),
      });

      if (!response.ok) throw new Error('Failed to create book');

      const book = await response.json();
      router.push(`/books/${book.id}`);
    } catch (error) {
      alert('Failed to create book');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Book</h1>
          <p className="text-gray-600">Start your writing journey with AI assistance</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`flex-1 h-1 mx-1 rounded-full ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 3</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Step 1: Book Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your book title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your book"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="fiction">Fiction</option>
                    <option value="romance">Romance</option>
                    <option value="mystery">Mystery</option>
                    <option value="sci-fi">Sci-Fi</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="thriller">Thriller</option>
                    <option value="literary">Literary</option>
                    <option value="memoir">Memoir</option>
                    <option value="business">Business</option>
                    <option value="self-help">Self-Help</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Writing Style</label>
                  <select
                    name="writingStyle"
                    value={formData.writingStyle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="literary">Literary</option>
                    <option value="young-adult">Young Adult</option>
                    <option value="children">Children</option>
                    <option value="technical">Technical</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Word Count: {formData.targetWordCount.toLocaleString()}
                </label>
                <input
                  type="range"
                  name="targetWordCount"
                  value={formData.targetWordCount}
                  onChange={handleInputChange}
                  min="20000"
                  max="200000"
                  step="5000"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>20K (Short)</span>
                  <span>80K (Standard)</span>
                  <span>200K (Epic)</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Story Structure */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Story Structure</h2>
                <div className="grid grid-cols-1 gap-4">
                  {Object.values(STORY_TEMPLATES).map(template => (
                    <button
                      key={template.id}
                      onClick={() =>
                        setFormData(prev => ({ ...prev, templateId: template.id }))
                      }
                      className={`p-4 border-2 rounded-lg text-left transition ${
                        formData.templateId === template.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {template.chapters.slice(0, 3).map((ch, i) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {ch.title}
                          </span>
                        ))}
                        {template.chapters.length > 3 && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            +{template.chapters.length - 3} more
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.templateId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Template Overview</h3>
                  <p className="text-sm text-blue-800">
                    {STORY_TEMPLATES[formData.templateId]?.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: AI Configuration */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Writing Assistant</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">✨ AI Features Enabled</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>✓ Chapter generation from outlines</li>
                      <li>✓ Real-time writing suggestions</li>
                      <li>✓ Character consistency checking</li>
                      <li>✓ Plot hole detection</li>
                      <li>✓ Tone and style adjustments</li>
                      <li>✓ Dialogue generation</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">📊 Additional Features</h3>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>✓ Multi-format export (PDF, EPUB, MOBI, DOCX)</li>
                      <li>✓ Direct publishing to Amazon KDP</li>
                      <li>✓ AI-generated book covers</li>
                      <li>✓ Reader analytics dashboard</li>
                      <li>✓ Collaboration tools for beta readers</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">📝 Your Book Configuration</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>Title:</strong> {formData.title}</p>
                      <p><strong>Genre:</strong> {formData.genre}</p>
                      <p><strong>Style:</strong> {formData.writingStyle}</p>
                      <p><strong>Target:</strong> {formData.targetWordCount.toLocaleString()} words</p>
                      <p><strong>Structure:</strong> {STORY_TEMPLATES[formData.templateId]?.name || 'Custom'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateBook}
                disabled={loading}
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Book'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
