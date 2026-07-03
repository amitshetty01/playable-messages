/**
 * Our Story Universe - Animation Utilities
 * Cinematic animations, transitions, and particle effects
 */

import { AnimationType, ParticleEffect, UniverseTheme, StoryTone } from './universe-types';

// ============================================================================
// ANIMATION CONFIGS
// ============================================================================

export const ANIMATION_CONFIGS = {
  PAGE_TURN: {
    duration: 0.8,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    perspective: 1200,
  },
  FADE: {
    duration: 0.6,
    easing: 'ease-in-out',
  },
  SLIDE: {
    duration: 0.7,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  ZOOM: {
    duration: 0.9,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  GLOW: {
    duration: 1.2,
    easing: 'ease-in-out',
  },
};

// ============================================================================
// PARTICLE EFFECT CONFIGS
// ============================================================================

export const PARTICLE_CONFIGS: Record<ParticleEffect, any> = {
  [ParticleEffect.PETALS]: {
    particleCount: 15,
    particleSize: { min: 8, max: 16 },
    duration: 6,
    gravity: 0.8,
    windForce: 0.3,
    color: ['#ff69b4', '#ff1493', '#ffb6c1'],
    opacity: 0.7,
    rotation: true,
  },
  [ParticleEffect.RAIN]: {
    particleCount: 40,
    particleSize: { min: 2, max: 4 },
    duration: 3,
    gravity: 3,
    windForce: 0.5,
    color: ['#87ceeb', '#add8e6'],
    opacity: 0.6,
    rotation: false,
  },
  [ParticleEffect.STARS]: {
    particleCount: 20,
    particleSize: { min: 3, max: 8 },
    duration: 8,
    gravity: 0,
    windForce: 0.1,
    color: ['#ffeb3b', '#ffd700', '#fffacd'],
    opacity: 0.8,
    rotation: true,
    twinkle: true,
  },
  [ParticleEffect.FIREFLIES]: {
    particleCount: 12,
    particleSize: { min: 4, max: 8 },
    duration: 10,
    gravity: 0.1,
    windForce: 0.2,
    color: ['#ffd700', '#ffff00', '#fff44f'],
    opacity: 0.9,
    rotation: true,
    glow: true,
    glowColor: 'rgba(255, 215, 0, 0.5)',
  },
  [ParticleEffect.SNOWFLAKES]: {
    particleCount: 25,
    particleSize: { min: 6, max: 14 },
    duration: 7,
    gravity: 0.5,
    windForce: 0.4,
    color: ['#ffffff', '#f0ffff'],
    opacity: 0.8,
    rotation: true,
  },
  [ParticleEffect.SPARKLES]: {
    particleCount: 30,
    particleSize: { min: 3, max: 6 },
    duration: 2,
    gravity: 0.5,
    windForce: 0.2,
    color: ['#ff69b4', '#ffb6c1', '#ffd700', '#ffeb3b'],
    opacity: 0.9,
    rotation: true,
    glow: true,
  },
  [ParticleEffect.CONFETTI]: {
    particleCount: 50,
    particleSize: { min: 4, max: 12 },
    duration: 3,
    gravity: 1.5,
    windForce: 0.8,
    color: [
      '#ff69b4',
      '#00bfff',
      '#ffeb3b',
      '#00ff00',
      '#ff6347',
      '#9370db',
    ],
    opacity: 0.8,
    rotation: true,
  },
  [ParticleEffect.NONE]: {
    particleCount: 0,
  },
};

// ============================================================================
// THEME-BASED COLOR SCHEMES
// ============================================================================

export const THEME_COLORS: Record<UniverseTheme, any> = {
  'classic-romance': {
    primary: '#ff69b4',
    secondary: '#ffb6c1',
    accent: '#ff1493',
    background: 'linear-gradient(135deg, #ffe4e1 0%, #ffc0cb 100%)',
    textColor: '#8b0000',
    glow: 'rgba(255, 105, 180, 0.6)',
    particle: ParticleEffect.PETALS,
  },
  'dark-fantasy': {
    primary: '#8b00ff',
    secondary: '#4b0082',
    accent: '#ff00ff',
    background: 'linear-gradient(135deg, #1a0033 0%, #330066 100%)',
    textColor: '#e6b3ff',
    glow: 'rgba(139, 0, 255, 0.6)',
    particle: ParticleEffect.SPARKLES,
  },
  manga: {
    primary: '#ff1493',
    secondary: '#ff69b4',
    accent: '#ffb6c1',
    background: 'linear-gradient(135deg, #fff8f3 0%, #ffe4e1 100%)',
    textColor: '#000000',
    glow: 'rgba(255, 20, 147, 0.5)',
    particle: ParticleEffect.SPARKLES,
  },
  comedy: {
    primary: '#ffeb3b',
    secondary: '#ffd700',
    accent: '#ff6347',
    background: 'linear-gradient(135deg, #fffacd 0%, #ffeaa7 100%)',
    textColor: '#ff6347',
    glow: 'rgba(255, 235, 59, 0.6)',
    particle: ParticleEffect.CONFETTI,
  },
  'royal-kingdom': {
    primary: '#daa520',
    secondary: '#ffd700',
    accent: '#ff1493',
    background: 'linear-gradient(135deg, #2c1810 0%, #8b4513 100%)',
    textColor: '#ffd700',
    glow: 'rgba(218, 165, 32, 0.6)',
    particle: ParticleEffect.SPARKLES,
  },
  'sci-fi': {
    primary: '#00bfff',
    secondary: '#00ffff',
    accent: '#0099ff',
    background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 100%)',
    textColor: '#00ffff',
    glow: 'rgba(0, 191, 255, 0.6)',
    particle: ParticleEffect.SPARKLES,
  },
  cyberpunk: {
    primary: '#ff006e',
    secondary: '#8338ec',
    accent: '#00f5ff',
    background: 'linear-gradient(135deg, #0d0221 0%, #1d0b69 100%)',
    textColor: '#ff006e',
    glow: 'rgba(255, 0, 110, 0.8)',
    particle: ParticleEffect.SPARKLES,
  },
  horror: {
    primary: '#8b0000',
    secondary: '#ff0000',
    accent: '#000000',
    background: 'linear-gradient(135deg, #1a0000 0%, #330000 100%)',
    textColor: '#ff6347',
    glow: 'rgba(139, 0, 0, 0.6)',
    particle: ParticleEffect.SPARKLES,
  },
  mystery: {
    primary: '#4b0082',
    secondary: '#8b008b',
    accent: '#9932cc',
    background: 'linear-gradient(135deg, #1a0033 0%, #330066 100%)',
    textColor: '#dda0dd',
    glow: 'rgba(75, 0, 130, 0.6)',
    particle: ParticleEffect.SPARKLES,
  },
  'pirate-adventure': {
    primary: '#8b4513',
    secondary: '#d2691e',
    accent: '#ffeb3b',
    background: 'linear-gradient(135deg, #2c1810 0%, #4a3728 100%)',
    textColor: '#ffe4b5',
    glow: 'rgba(139, 69, 19, 0.6)',
    particle: ParticleEffect.SPARKLES,
  },
  'slice-of-life': {
    primary: '#ff69b4',
    secondary: '#ffb6c1',
    accent: '#ffd700',
    background: 'linear-gradient(135deg, #fff8f3 0%, #fffacd 100%)',
    textColor: '#8b0000',
    glow: 'rgba(255, 105, 180, 0.5)',
    particle: ParticleEffect.PETALS,
  },
  'time-travel': {
    primary: '#00bfff',
    secondary: '#1e90ff',
    accent: '#daa520',
    background: 'linear-gradient(135deg, #0a0e27 0%, #2c1810 100%)',
    textColor: '#00ffff',
    glow: 'rgba(0, 191, 255, 0.6)',
    particle: ParticleEffect.STARS,
  },
};

// ============================================================================
// TONE-BASED MUSIC & SFX
// ============================================================================

export const TONE_AUDIO: Record<StoryTone, any> = {
  romantic: {
    ambientMusic: 'soft-piano-love',
    soundEffects: ['page-turn-soft', 'heart-pulse', 'whisper'],
    voicePace: 'slow',
    emotionalIntensity: 'high',
  },
  emotional: {
    ambientMusic: 'cinematic-strings',
    soundEffects: ['page-turn-dramatic', 'sigh', 'tender-moment'],
    voicePace: 'moderate',
    emotionalIntensity: 'very-high',
  },
  funny: {
    ambientMusic: 'upbeat-whimsical',
    soundEffects: ['page-turn-playful', 'laugh', 'playful-ding'],
    voicePace: 'fast',
    emotionalIntensity: 'low',
  },
  dramatic: {
    ambientMusic: 'dramatic-orchestral',
    soundEffects: ['page-turn-heavy', 'thunder', 'intense-moment'],
    voicePace: 'slow',
    emotionalIntensity: 'very-high',
  },
  mysterious: {
    ambientMusic: 'suspenseful-ambient',
    soundEffects: ['page-turn-creepy', 'whisper', 'mystery-reveal'],
    voicePace: 'moderate',
    emotionalIntensity: 'high',
  },
  cute: {
    ambientMusic: 'cute-cheerful',
    soundEffects: ['page-turn-cute', 'sparkle', 'happy-ding'],
    voicePace: 'fast',
    emotionalIntensity: 'medium',
  },
  'dark-comedy': {
    ambientMusic: 'dark-comedic',
    soundEffects: ['page-turn-dark', 'mischievous-laugh', 'crash'],
    voicePace: 'moderate',
    emotionalIntensity: 'medium',
  },
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Generate CSS keyframes for page turn animation
 */
export function getPageTurnKeyframes(direction: 'forward' | 'backward') {
  return `
    @keyframes pageTurn${direction} {
      0% {
        transform: rotateY(0deg);
        opacity: 1;
      }
      50% {
        transform: rotateY(${direction === 'forward' ? 90 : -90}deg);
        opacity: 0.5;
      }
      100% {
        transform: rotateY(${direction === 'forward' ? 180 : -180}deg);
        opacity: 1;
      }
    }
  `;
}

/**
 * Generate particle animation keyframes
 */
export function getParticleKeyframes(
  duration: number,
  gravity: number,
  windForce: number
) {
  const fallDistance = 500 * gravity;
  const driftDistance = 300 * windForce;

  return `
    @keyframes particleFall {
      0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translate(${driftDistance}px, ${fallDistance}px) rotate(360deg);
        opacity: 0;
      }
    }
  `;
}

/**
 * Get animation class based on animation type
 */
export function getAnimationClass(animationType: AnimationType): string {
  const classMap: Record<AnimationType, string> = {
    [AnimationType.PAGE_TURN]: 'animate-page-turn',
    [AnimationType.FADE]: 'animate-fade-in',
    [AnimationType.SLIDE]: 'animate-slide-up',
    [AnimationType.ZOOM]: 'animate-zoom-in',
    [AnimationType.GLOW]: 'animate-glow-pulse',
    [AnimationType.PARTICLE]: 'animate-particles',
    [AnimationType.FLOATING]: 'animate-float',
  };

  return classMap[animationType] || '';
}

/**
 * Calculate text reveal animation delays
 */
export function getTextRevealDelays(
  wordCount: number,
  intensity: 'low' | 'medium' | 'high'
) {
  const baseDelay =
    intensity === 'low' ? 30 : intensity === 'medium' ? 50 : 80;
  const delays: number[] = [];

  for (let i = 0; i < wordCount; i++) {
    delays.push(i * baseDelay);
  }

  return delays;
}

/**
 * Generate glowing text SVG filter
 */
export function getGlowingTextFilter(color: string, intensity: number) {
  return `
    <defs>
      <filter id="glow-${intensity}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${intensity}" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;
}

/**
 * Get interactive element animation variants
 */
export const INTERACTIVE_ELEMENT_ANIMATIONS = {
  tap: {
    initial: { scale: 1, opacity: 0.6 },
    hover: { scale: 1.1, opacity: 1 },
    tap: { scale: 0.95 },
  },
  hold: {
    initial: { scale: 1, opacity: 0.5 },
    hold: { scale: 1.15, opacity: 1 },
  },
  scratch: {
    initial: { opacity: 0.3 },
    scratching: { opacity: 0.7 },
    revealed: { opacity: 1 },
  },
  doubleTap: {
    initial: { scale: 1, rotate: 0 },
    tap: { scale: 1.2, rotate: 5 },
  },
};

/**
 * Generate smooth scroll animation
 */
export const SMOOTH_SCROLL = {
  duration: 1,
  ease: [0.25, 0.46, 0.45, 0.94],
};

/**
 * Cinematic fade transition
 */
export const CINEMATIC_TRANSITION = {
  duration: 0.8,
  ease: 'easeInOut',
  stagger: 0.1,
};
