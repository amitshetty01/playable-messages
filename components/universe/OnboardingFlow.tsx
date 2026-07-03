/**
 * Our Story Universe - Onboarding Flow Component
 * Magical multi-step storyteller-style form asking questions one by one
 */

'use client';

import React, { useState, useCallback } from 'react';
import { OnboardingData, UniverseTheme, StoryTone } from '@/lib/universe-types';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const THEME_OPTIONS = [
    { label: 'Classic Romance', value: UniverseTheme.CLASSIC_ROMANCE, emoji: '💕' },
    { label: 'Dark Fantasy', value: UniverseTheme.DARK_FANTASY, emoji: '🌙' },
    { label: 'Manga', value: UniverseTheme.MANGA, emoji: '✨' },
    { label: 'Comedy', value: UniverseTheme.COMEDY, emoji: '😄' },
    { label: 'Royal Kingdom', value: UniverseTheme.ROYAL_KINGDOM, emoji: '👑' },
    { label: 'Sci-Fi', value: UniverseTheme.SCI_FI, emoji: '🚀' },
    { label: 'Cyberpunk', value: UniverseTheme.CYBERPUNK, emoji: '⚡' },
    { label: 'Horror', value: UniverseTheme.HORROR, emoji: '👻' },
    { label: 'Mystery', value: UniverseTheme.MYSTERY, emoji: '🔮' },
    { label: 'Pirate Adventure', value: UniverseTheme.PIRATE_ADVENTURE, emoji: '⚓' },
    { label: 'Slice of Life', value: UniverseTheme.SLICE_OF_LIFE, emoji: '🌸' },
    { label: 'Time Travel', value: UniverseTheme.TIME_TRAVEL, emoji: '⏰' },
  ];

  const TONE_OPTIONS = [
    { label: 'Romantic', value: StoryTone.ROMANTIC, emoji: '💗' },
    { label: 'Emotional', value: StoryTone.EMOTIONAL, emoji: '💔' },
    { label: 'Funny', value: StoryTone.FUNNY, emoji: '😂' },
    { label: 'Dramatic', value: StoryTone.DRAMATIC, emoji: '🎭' },
    { label: 'Mysterious', value: StoryTone.MYSTERIOUS, emoji: '🌙' },
    { label: 'Cute', value: StoryTone.CUTE, emoji: '🥰' },
    { label: 'Dark Comedy', value: StoryTone.DARK_COMEDY, emoji: '😈' },
  ];

  const questions = [
    {
      question: 'Before I begin writing your destiny…',
      subQuestion: 'Tell me, who is our hero?',
      emoji: '🌟',
      type: 'text' as const,
      field: 'heroName',
      placeholder: 'Your name...',
    },
    {
      question: 'Who changed their world forever?',
      subQuestion: 'Your partner\'s name...',
      emoji: '💕',
      type: 'text' as const,
      field: 'partnerName',
      placeholder: 'Their name...',
    },
    {
      question: 'Show me the faces of the heroes.',
      subQuestion: '(Optional, but recommended)',
      emoji: '📸',
      type: 'photo' as const,
      field: 'heroPhoto',
    },
    {
      question: 'And your partner\'s photo?',
      emoji: '📷',
      type: 'photo' as const,
      field: 'partnerPhoto',
    },
    {
      question: 'What kind of universe should your story live in?',
      emoji: '🌍',
      type: 'select' as const,
      field: 'theme',
      options: THEME_OPTIONS,
    },
    {
      question: 'What should the story feel like?',
      emoji: '✨',
      type: 'select' as const,
      field: 'tone',
      options: TONE_OPTIONS,
    },
    {
      question: 'Tell me the memory that time should never erase.',
      subQuestion: 'Your favorite moment together...',
      emoji: '📖',
      type: 'textarea' as const,
      field: 'favoriteMemory',
      placeholder: 'The day we... the moment when...',
    },
    {
      question: 'What little things make your partner unforgettable?',
      subQuestion: 'Habits, personality, cute things, inside jokes...',
      emoji: '💫',
      type: 'textarea' as const,
      field: 'partnerTraits',
      placeholder: 'The way they... their laugh... when they...',
    },
    {
      question: 'What promise should live forever in this story?',
      emoji: '💍',
      type: 'textarea' as const,
      field: 'promise',
      placeholder: 'I promise you... forever we will...',
    },
  ];

  const currentQuestion = questions[step];

  const handleNext = useCallback(() => {
    if (step < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete(data as OnboardingData);
    }
  }, [step, data, onComplete, questions.length]);

  const handlePrevious = useCallback(() => {
    if (step > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [step]);

  const handleTextInput = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (field: string, file: File) => {
    setData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSelectOption = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setTimeout(handleNext, 500);
  };

  const isStepValid = () => {
    const field = currentQuestion.field as keyof OnboardingData;
    if (currentQuestion.type === 'photo') return true;
    if (!data[field]) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex gap-1 mb-4">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <p className="text-white/60 text-sm text-center">
            Step {step + 1} of {questions.length}
          </p>
        </div>

        {/* Content card */}
        <div
          className={`bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 transition-all duration-500 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Emoji and question */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-4 animate-bounce">
              {currentQuestion.emoji}
            </div>
            <h2 className="text-2xl font-light text-white mb-2">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subQuestion && (
              <p className="text-white/70 text-sm">{currentQuestion.subQuestion}</p>
            )}
          </div>

          {/* Input fields */}
          <div className="mb-8">
            {currentQuestion.type === 'text' && (
              <input
                type="text"
                placeholder={currentQuestion.placeholder}
                value={(data[currentQuestion.field as keyof OnboardingData] as string) || ''}
                onChange={(e) =>
                  handleTextInput(currentQuestion.field, e.target.value)
                }
                onKeyPress={(e) => e.key === 'Enter' && isStepValid() && handleNext()}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors"
                autoFocus
              />
            )}

            {currentQuestion.type === 'textarea' && (
              <textarea
                placeholder={currentQuestion.placeholder}
                value={(data[currentQuestion.field as keyof OnboardingData] as string) || ''}
                onChange={(e) =>
                  handleTextInput(currentQuestion.field, e.target.value)
                }
                className="w-full h-32 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-400 transition-colors resize-none"
                autoFocus
              />
            )}

            {currentQuestion.type === 'photo' && (
              <div className="flex flex-col gap-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-pink-400 transition-colors bg-white/5">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 text-white/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-white/70">Click to upload photo</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handlePhotoUpload(currentQuestion.field, file);
                      }
                    }}
                  />
                </label>
                {data[currentQuestion.field as keyof OnboardingData] && (
                  <p className="text-green-400 text-sm text-center">
                    ✓ Photo uploaded
                  </p>
                )}
              </div>
            )}

            {currentQuestion.type === 'select' && (
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(currentQuestion.field, option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      data[currentQuestion.field as keyof OnboardingData] === option.value
                        ? 'bg-pink-400/20 border-pink-400 scale-105'
                        : 'bg-white/10 border-white/20 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div className="text-white text-xs font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl bg-white/10 text-white border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepValid() && currentQuestion.type !== 'photo'}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-pink-400/50 transition-all transform hover:scale-105"
            >
              {step === questions.length - 1 ? '✨ Begin Our Story' : 'Next →'}
            </button>
          </div>

          {/* Skip option */}
          {onSkip && step === 0 && (
            <button
              onClick={onSkip}
              className="w-full mt-4 text-white/50 text-sm hover:text-white/70 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>

        {/* Magical footer */}
        <div className="text-center mt-8 text-white/40 text-sm">
          ✨ Crafting your universe...
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;
