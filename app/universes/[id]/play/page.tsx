/**
 * Our Story Universe - Story Player Page
 * Display and play the interactive animated story
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Universe } from '@/lib/universe-types';
import StoryPlayer from '@/components/universe/StoryPlayer';

export default function PlayUniversePage() {
  const params = useParams();
  const router = useRouter();
  const universeId = params.id as string;

  const [universe, setUniverse] = useState<Universe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniverse = async () => {
      try {
        const res = await fetch(`/api/universes?id=${universeId}`);

        if (!res.ok) {
          throw new Error('Universe not found');
        }

        const data = await res.json();
        setUniverse(data);

        // Update play count
        await fetch('/api/universes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            universeId,
            updates: {
              metadata: {
                playCount: (data.metadata.playCount || 0) + 1,
              },
            },
          }),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load universe');
      } finally {
        setLoading(false);
      }
    };

    fetchUniverse();
  }, [universeId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">📖</div>
          <p className="text-white">Opening your universe...</p>
        </div>
      </div>
    );
  }

  if (error || !universe) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-white mb-4">{error || 'Universe not found'}</p>
          <button
            onClick={() => router.push('/universes')}
            className="px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <StoryPlayer
      universe={universe}
      onEdit={() => router.push(`/universes/${universeId}/edit`)}
      onShare={() => {
        // Handle share
        alert('Share functionality coming soon!');
      }}
    />
  );
}
