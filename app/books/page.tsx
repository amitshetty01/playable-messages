'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/book-types';

export default function BooksLibrary() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books?userId=user-123'); // In production, get real user ID
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/books?id=${bookId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete book');
      setBooks(books.filter(b => b.id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
              <p className="text-gray-600 mt-1">{books.length} book{books.length !== 1 ? 's' : ''}</p>
            </div>
            <Link
              href="/books/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              + New Book
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No books yet</h2>
            <p className="text-gray-600 mb-6">Start creating your first book with AI assistance</p>
            <Link
              href="/books/create"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Create Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
              >
                {/* Cover Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center group-hover:brightness-110 transition">
                  <div className="text-white text-center">
                    <div className="text-5xl mb-2">📕</div>
                    <p className="text-sm opacity-75">{book.genre}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {Math.round(
                            (book.currentWordCount / book.targetWordCount) * 100
                          )}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${getProgressColor(
                            (book.currentWordCount / book.targetWordCount) * 100
                          )}`}
                          style={{
                            width: `${Math.min(
                              (book.currentWordCount / book.targetWordCount) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Words</p>
                        <p className="font-medium text-gray-900">
                          {(book.currentWordCount / 1000).toFixed(1)}K
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Chapters</p>
                        <p className="font-medium text-gray-900">{book.chapters.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        book.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : book.status === 'editing'
                          ? 'bg-blue-100 text-blue-800'
                          : book.status === 'review'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/books/${book.id}`}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
