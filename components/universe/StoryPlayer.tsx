/**
 * Our Story Universe - Story Player Component
 * Main interactive animated storybook player with page-turn effects and cinematic UI
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Universe,
  Chapter,
  PageContent,
  ParticleEffect,
  UniverseTheme,
  UniverseVariant,
} from '@/lib/universe-types';
import { THEME_COLORS, PARTICLE_CONFIGS } from '@/lib/universe-animations';
import InteractiveElements from './InteractiveElements';

interface StoryPlayerProps {
  universe: Universe;
  onChapterChange?: (chapterIndex: number) => void;
  onEdit?: () => void;
  onShare?: () => void;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  universe,
  onChapterChange,
  onEdit,
  onShare,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [particleKey, setParticleKey] = useState(0);

  const chapters = universe.chapters;
  const currentChapter = chapters[currentChapterIndex];
  const currentPage = currentChapter?.pages[currentPageIndex];
  const themeConfig = THEME_COLORS[universe.metadata.theme];

  // Handle page navigation
  const goToNextPage = useCallback(() => {
    if (!currentPage) return;

    if (currentPageIndex < currentChapter.pages.length - 1) {
      setIsPageTransitioning(true);
      setTimeout(() => {
        setCurrentPageIndex(currentPageIndex + 1);
        setIsPageTransitioning(false);
        setShowChoice(false);
        setParticleKey((k) => k + 1);
      }, 600);
    } else if (currentChapterIndex < chapters.length - 1) {
      // Move to next chapter
      setIsPageTransitioning(true);
      setTimeout(() => {
        setCurrentChapterIndex(currentChapterIndex + 1);
        setCurrentPageIndex(0);
        setIsPageTransitioning(false);
        setShowChoice(false);
        setParticleKey((k) => k + 1);
        onChapterChange?.(currentChapterIndex + 1);
      }, 600);
    } else {
      // Story complete
      setShowEndScreen(true);
    }
  }, [
    currentPageIndex,
    currentChapterIndex,
    currentPage,
    currentChapter,
    chapters.length,
    onChapterChange,
  ]);

  const handlePreviousPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setIsPageTransitioning(true);
      setTimeout(() => {
        setCurrentPageIndex(currentPageIndex - 1);
        setIsPageTransitioning(false);
      }, 600);
    } else if (currentChapterIndex > 0) {
      setIsPageTransitioning(true);
      setTimeout(() => {
        setCurrentChapterIndex(currentChapterIndex - 1);
        const prevChapter = chapters[currentChapterIndex - 1];
        setCurrentPageIndex(prevChapter.pages.length - 1);
        setIsPageTransitioning(false);
      }, 600);
    }
  }, [currentPageIndex, currentChapterIndex, chapters]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextPage();
      if (e.key === 'ArrowLeft') handlePreviousPage();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNextPage, handlePreviousPage]);

  if (!currentPage) {
    return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Loading story...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Story Page Container (9:16 mobile aspect ratio) */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {/* Page Background with Gradient */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            isPageTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background: currentPage.gradient
              ? `linear-gradient(135deg, ${currentPage.gradient.from}, ${currentPage.gradient.to})`
              : themeConfig.background,
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
          </div>
        </div>

        {/* Particle Effects */}
        {currentPage.particleEffect !== ParticleEffect.NONE && (
          <ParticleBackground
            key={particleKey}
            effect={currentPage.particleEffect}
            theme={universe.metadata.theme}
          />
        )}

        {/* Main Story Page */}
        <div
          className={`relative w-full h-full max-w-md flex flex-col items-center justify-center p-8 transition-all duration-700 ${
            isPageTransitioning
              ? 'opacity-0 scale-95'
              : 'opacity-100 scale-100'
          }`}
          style={{ aspectRatio: '9 / 16' }}
        >
          {/* Page Number */}
          <div className="absolute top-6 right-6 text-white/40 text-sm">
            {currentPageIndex + 1} of {currentChapter.pages.length}
          </div>

          {/* Chapter Title */}
          {currentPage.title && (
            <h1
              className="text-4xl font-light text-center mb-8 animate-glow"
              style={{
                color: currentPage.textColor,
                textShadow: `0 0 20px ${themeConfig.glow}`,
              }}
            >
              {currentPage.title}
            </h1>
          )}

          {/* Main Text with Typewriter Effect */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <p
              className="text-lg text-center leading-relaxed animate-fade-in"
              style={{
                color: currentPage.textColor,
                opacity: 0.95,
              }}
            >
              {currentPage.mainText}
            </p>
          </div>

          {/* Interactive Elements */}
          <div className="absolute inset-0 p-8">
            <InteractiveElements
              elements={currentPage.interactiveElements}
              onInteract={(elementId, type) => {
                if (type === 'tap-reveal' || type === 'scratch') {
                  setShowChoice(true);
                }
              }}
            />
          </div>

          {/* Choices Display */}
          {showChoice && currentPage.choices && (
            <div className="absolute bottom-16 left-4 right-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 animate-fade-in">
              <p className="text-white/60 text-xs mb-3 text-center">What happens next?</p>
              <div className="space-y-2">
                {currentPage.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => {
                      goToNextPage();
                      setShowChoice(false);
                    }}
                    className="w-full p-3 bg-gradient-to-r from-pink-400/20 to-purple-400/20 hover:from-pink-400/40 hover:to-purple-400/40 border border-white/20 rounded-lg text-white text-sm transition-all transform hover:scale-105"
                  >
                    {choice.emoji} {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 items-center justify-between">
            <button
              onClick={handlePreviousPage}
              disabled={currentChapterIndex === 0 && currentPageIndex === 0}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>

            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 transition-all"
                >
                  ✏️ Edit
                </button>
              )}
              {onShare && (
                <button
                  onClick={onShare}
                  className="px-3 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 transition-all"
                >
                  📤 Share
                </button>
              )}
            </div>

            <button
              onClick={goToNextPage}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 hover:shadow-lg hover:shadow-pink-400/50 text-white transition-all transform hover:scale-105"
            >
              Next →
            </button>
          </div>

          {/* Page Turn Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/40 text-xs">
            Tap or press → to continue
          </div>
        </div>

        {/* End Screen */}
        {showEndScreen && (
          <EndScreen
            universe={universe}
            onNewVariant={() => {
              setShowEndScreen(false);
              setCurrentChapterIndex(0);
              setCurrentPageIndex(0);
            }}
            onHome={() => {
              // Navigate home
            }}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px currentColor;
          }
          50% {
            text-shadow: 0 0 40px currentColor;
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// PARTICLE BACKGROUND COMPONENT
// ============================================================================

interface ParticleBackgroundProps {
  effect: ParticleEffect;
  theme: UniverseTheme;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ effect, theme }) => {
  const config = PARTICLE_CONFIGS[effect];
  const themeConfig = THEME_COLORS[theme];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: config.particleCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min}px`,
            height: `${Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min}px`,
            background: config.color[Math.floor(Math.random() * config.color.length)],
            borderRadius: effect === ParticleEffect.RAIN ? '0' : '50%',
            opacity: config.opacity,
            animation: `particle-fall ${config.duration}s linear infinite`,
            animationDelay: `${Math.random() * config.duration}s`,
            filter: config.glow ? `drop-shadow(0 0 ${config.particleSize.max}px ${config.glowColor})` : 'none',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes particle-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle-fall 6s linear infinite;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// END SCREEN COMPONENT
// ============================================================================

interface EndScreenProps {
  universe: Universe;
  onNewVariant: () => void;
  onHome: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({
  universe,
  onNewVariant,
  onHome,
}) => {
  const variants = universe.variants;

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-purple-900/80 backdrop-blur-lg flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-white mb-4">
          This was only one universe.
        </h2>
        <p className="text-white/60 mb-8">
          Explore other versions of {universe.metadata.hero.name} and{' '}
          {universe.metadata.partner.name}'s story...
        </p>
      </div>

      {/* Variant Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={onNewVariant}
            disabled={variant.isLocked}
            className={`aspect-square rounded-xl p-4 text-center transition-all ${
              variant.isLocked
                ? 'bg-white/10 opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-br from-pink-400/30 to-purple-400/30 hover:from-pink-400/50 hover:to-purple-400/50 cursor-pointer'
            }`}
          >
            <div className="text-2xl mb-2">{getVariantEmoji(variant.variantType)}</div>
            <p className="text-white text-sm font-medium">{variant.description}</p>
            {variant.isLocked && <p className="text-white/40 text-xs mt-2">🔒 Locked</p>}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full max-w-md">
        <button
          onClick={onHome}
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          ← Home
        </button>
        <button
          onClick={onNewVariant}
          className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium hover:shadow-lg transition-all"
        >
          Create New ✨
        </button>
      </div>
    </div>
  );
};

function getVariantEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    manga: '🎨',
    comedy: '😂',
    'what-if': '🌀',
    future: '🚀',
    royal: '👑',
    'alternate-ending': '✨',
  };
  return emojiMap[type] || '📖';
}

export default StoryPlayer;
