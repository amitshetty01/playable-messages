'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Book } from '@/lib/book-types';
import { BookEditor } from '@/components/BookEditor';

export default function BookEditorPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books?id=${bookId}`);
      if (!response.ok) throw new Error('Failed to fetch book');
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedBook: Book) => {
    try {
      const response = await fetch('/api/books', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) throw new Error('Failed to save book');
      const savedBook = await response.json();
      setBook(savedBook);
      alert('Book saved successfully');
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book not found</h1>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <BookEditor book={book} onSave={handleSave} />;
}
