/**
 * Our Story Universe - Main Page / Dashboard
 * Shows all user's created universes and entry point
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Universe } from '@/lib/universe-types';

export default function UniversesPage() {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('user-123'); // In production, get from auth

  useEffect(() => {
    const fetchUniverses = async () => {
      try {
        const res = await fetch(`/api/universes?userId=${userId}`);
        const data = await res.json();
        setUniverses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch universes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniverses();
  }, [userId]);

  const handleDelete = async (universeId: string) => {
    if (!confirm('Delete this story universe forever?')) return;

    try {
      await fetch(`/api/universes?id=${universeId}`, { method: 'DELETE' });
      setUniverses((prev) => prev.filter((u) => u.id !== universeId));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-light text-white mb-2">
                ✨ Our Story Universe
              </h1>
              <p className="text-white/60">
                Your collection of love stories turned into living worlds
              </p>
            </div>
            <Link
              href="/universes/create"
              className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-400/50 transition-all transform hover:scale-105"
            >
              ✨ Create New Universe
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white/60">Loading your universes...</div>
          </div>
        ) : universes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl text-white mb-4">No universes yet</h2>
            <p className="text-white/60 mb-8">
              Create your first love story universe and watch it come to life
            </p>
            <Link
              href="/universes/create"
              className="inline-block px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              Begin Our Story ✨
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universes.map((universe) => (
              <UniverseCard
                key={universe.id}
                universe={universe}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

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
      `}</style>
    </div>
  );
}

// ============================================================================
// UNIVERSE CARD COMPONENT
// ============================================================================

interface UniverseCardProps {
  universe: Universe;
  onDelete: (id: string) => void;
}

function UniverseCard({ universe, onDelete }: UniverseCardProps) {
  const { metadata, chapters, id } = universe;
  const progress = (chapters.length / 8) * 100;
  const playCount = metadata.playCount;

  return (
    <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-pink-400/50 transition-all hover:shadow-xl hover:shadow-pink-400/20 hover:-translate-y-1">
      {/* Card Header with gradient */}
      <div
        className="h-40 bg-gradient-to-br p-6 text-white flex flex-col justify-between"
        style={{
          backgroundImage: `linear-gradient(135deg, #ff1493, #ff69b4)`,
        }}
      >
        <div>
          <h3 className="text-xl font-medium truncate">{metadata.hero.name}</h3>
          <p className="text-sm text-white/80 truncate">
            💕 {metadata.partner.name}
          </p>
        </div>
        <p className="text-xs text-white/60">
          Theme: {metadata.theme.replace(/-/g, ' ')}
        </p>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div>
            <p className="text-2xl font-light text-white">{chapters.length}</p>
            <p className="text-xs text-white/60">Chapters</p>
          </div>
          <div>
            <p className="text-2xl font-light text-white">{playCount}</p>
            <p className="text-xs text-white/60">Reads</p>
          </div>
          <div>
            <p className="text-2xl font-light text-white">
              {metadata.isPublished ? '✓' : '◯'}
            </p>
            <p className="text-xs text-white/60">
              {metadata.isPublished ? 'Public' : 'Private'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <p className="text-xs text-white/60 mb-2">Story Progress</p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-white/50 mb-4">
          Created {formatDate(new Date(metadata.createdAt))}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/universes/${id}/play`}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-400/20 to-purple-400/20 hover:from-pink-400/40 hover:to-purple-400/40 text-white text-sm rounded-lg border border-white/20 transition-all text-center"
          >
            Read 📖
          </Link>
          <Link
            href={`/universes/${id}/edit`}
            className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-sm rounded-lg border border-blue-400/20 transition-all text-center"
          >
            Edit ✏️
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 text-sm rounded-lg border border-red-400/20 transition-all"
          >
            Delete 🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
