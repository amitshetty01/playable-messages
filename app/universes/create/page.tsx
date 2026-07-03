/**
 * Our Story Universe - Create Flow Page
 * Magical multi-step onboarding to create a new universe
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '@/components/universe/OnboardingFlow';
import { OnboardingData } from '@/lib/universe-types';

export default function CreateUniversePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setIsCreating(true);

    try {
      // Create universe via API
      const res = await fetch('/api/universes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-123', // In production, get from auth
          heroName: data.heroName,
          partnerName: data.partnerName,
          theme: data.theme,
          tone: data.tone,
          favoriteMemory: data.favoriteMemory,
          partnerTraits: data.partnerTraits,
          promise: data.promise,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create universe');
      }

      const { universeId } = await res.json();

      // Redirect to player
      router.push(`/universes/${universeId}/play`);
    } catch (error) {
      console.error('Error creating universe:', error);
      setIsCreating(false);
      alert('Failed to create universe. Please try again.');
    }
  };

  return (
    <>
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">✨</div>
            <p className="text-white text-lg">Creating your universe...</p>
            <p className="text-white/60 text-sm mt-2">
              Weaving your story into infinity
            </p>
          </div>
        </div>
      )}
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </>
  );
}
