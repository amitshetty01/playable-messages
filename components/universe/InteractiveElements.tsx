/**
 * Our Story Universe - Interactive Elements Component
 * Tappable, holdable, draggable interactive elements on story pages
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  InteractiveElement,
  InteractiveElementType,
} from '@/lib/universe-types';

interface InteractiveElementsProps {
  elements: InteractiveElement[];
  onInteract?: (elementId: string, interactionType: string) => void;
}

export const InteractiveElements: React.FC<InteractiveElementsProps> = ({
  elements,
  onInteract,
}) => {
  const [revealedElements, setRevealedElements] = useState<Set<string>>(
    new Set()
  );
  const [holdingElement, setHoldingElement] = useState<string | null>(null);
  const [scratchProgress, setScratchProgress] = useState<Record<string, number>>(
    {}
  );
  const scratchCanvasRefs = useRef<Record<string, HTMLCanvasElement>>({});

  const handleTapReveal = (element: InteractiveElement) => {
    setRevealedElements((prev) => new Set([...prev, element.id]));
    onInteract?.(element.id, 'tap-reveal');
    playFeedback('tap');
  };

  const handleHoldStart = (element: InteractiveElement) => {
    setHoldingElement(element.id);
    const timer = setTimeout(() => {
      setRevealedElements((prev) => new Set([...prev, element.id]));
      onInteract?.(element.id, 'hold-reveal');
      playFeedback('hold');
      setHoldingElement(null);
    }, 1000);

    const handleHoldEnd = () => {
      clearTimeout(timer);
      setHoldingElement(null);
      document.removeEventListener('mouseup', handleHoldEnd);
      document.removeEventListener('touchend', handleHoldEnd);
    };

    document.addEventListener('mouseup', handleHoldEnd);
    document.addEventListener('touchend', handleHoldEnd);
  };

  const handleDoubleTap = (element: InteractiveElement) => {
    setRevealedElements((prev) => new Set([...prev, element.id]));
    onInteract?.(element.id, 'double-tap');
    playFeedback('double-tap');
  };

  const handleScratchStart = (element: InteractiveElement, e: React.MouseEvent | React.TouchEvent) => {
    const canvas = scratchCanvasRefs.current[element.id];
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleScratch = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = moveEvent instanceof MouseEvent ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const clientY = moveEvent instanceof MouseEvent ? moveEvent.clientY : moveEvent.touches[0].clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.clearRect(x - 20, y - 20, 40, 40);

      const progress = (scratchProgress[element.id] || 0) + 0.02;
      setScratchProgress((prev) => ({ ...prev, [element.id]: progress }));

      if (progress > 0.5) {
        setRevealedElements((prev) => new Set([...prev, element.id]));
        onInteract?.(element.id, 'scratch');
        playFeedback('scratch');
        document.removeEventListener('mousemove', handleScratch);
        document.removeEventListener('touchmove', handleScratch);
      }
    };

    document.addEventListener('mousemove', handleScratch);
    document.addEventListener('touchmove', handleScratch);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleScratch);
      document.removeEventListener('touchmove', handleScratch);
    });
  };

  const playFeedback = (type: string) => {
    // Play haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'tap' ? 10 : type === 'hold' ? [50, 50, 50] : 20);
    }

    // Could add sound effects here
  };

  return (
    <div className="relative w-full h-full">
      {elements.map((element) => {
        const isRevealed = revealedElements.has(element.id);
        const isHolding = holdingElement === element.id;

        return (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              width: `${element.size.width}px`,
              height: `${element.size.height}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* TAP REVEAL */}
            {element.type === InteractiveElementType.TAP_REVEAL && (
              <button
                onClick={() => handleTapReveal(element)}
                className={`w-full h-full rounded-full transition-all duration-300 ${
                  isRevealed
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-70 hover:opacity-100 hover:scale-110 cursor-pointer'
                } bg-white/20 backdrop-blur-sm border border-white/40 hover:border-pink-400 hover:bg-pink-300/20 flex items-center justify-center`}
              >
                <span className="text-2xl animate-pulse">✨</span>
              </button>
            )}

            {/* HOLD REVEAL */}
            {element.type === InteractiveElementType.HOLD_REVEAL && (
              <button
                onMouseDown={() => handleHoldStart(element)}
                onTouchStart={() => handleHoldStart(element)}
                className={`w-full h-full rounded-2xl transition-all duration-300 ${
                  isRevealed
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-60 cursor-pointer'
                } ${
                  isHolding
                    ? 'bg-pink-300/40 scale-110 border-pink-400'
                    : 'bg-white/20 border-white/40'
                } backdrop-blur-sm border flex items-center justify-center`}
              >
                <span className="text-3xl">❤️</span>
              </button>
            )}

            {/* DOUBLE TAP */}
            {element.type === InteractiveElementType.DOUBLE_TAP && (
              <button
                onDoubleClick={() => handleDoubleTap(element)}
                className={`w-full h-full rounded-full transition-all duration-300 ${
                  isRevealed
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-70 hover:opacity-100 cursor-pointer'
                } bg-gradient-to-r from-pink-300/30 to-purple-300/30 backdrop-blur-sm border-2 border-pink-400/50 hover:border-pink-400 hover:from-pink-300/50 hover:to-purple-300/50 flex items-center justify-center`}
              >
                <span className="text-2xl animate-bounce">💗</span>
              </button>
            )}

            {/* SCRATCH */}
            {element.type === InteractiveElementType.SCRATCH && (
              <div className="relative w-full h-full">
                <canvas
                  ref={(ref) => {
                    if (ref) scratchCanvasRefs.current[element.id] = ref;
                  }}
                  width={element.size.width}
                  height={element.size.height}
                  onMouseDown={(e) => handleScratchStart(element, e)}
                  onTouchStart={(e) => handleScratchStart(element, e)}
                  className={`absolute inset-0 rounded-lg cursor-pointer transition-opacity ${
                    isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,105,180,0.5), rgba(200,100,200,0.5))',
                    touchAction: 'none',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-white/50 pointer-events-none text-xs">
                  Scratch to reveal
                </div>
              </div>
            )}

            {/* REVEALED CONTENT */}
            {isRevealed && (
              <div
                className="absolute inset-0 animate-fade-in bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center justify-center text-center"
                style={{
                  animation: 'fadeIn 0.5s ease-in',
                }}
              >
                <p className="text-white text-sm leading-relaxed">
                  {element.hiddenContent}
                </p>
              </div>
            )}

            {/* INSTRUCTION TEXT */}
            {!isRevealed && element.instruction && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs whitespace-nowrap mt-2 animate-pulse">
                {element.instruction}
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveElements;
