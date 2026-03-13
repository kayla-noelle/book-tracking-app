'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { BookOpen, Star } from 'lucide-react';
import Link from 'next/link';

const COVER_COLORS = [
  '#fd601a', '#4A7C6F', '#3d7a5e', '#5a9a82', '#6b9a5a',
  '#6b9a3d', '#3d9a6b', '#7a9a3d', '#4A8B6B', '#4a7a5a',
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % COVER_COLORS.length;
  }
  return Math.abs(hash);
}

function getCoverColor(id: string) {
  return COVER_COLORS[hashId(id)];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          style={{
            color: star <= rating ? '#f5c518' : '#cccccc',
            fill: star <= rating ? '#f5c518' : 'none',
          }}
        />
      ))}
    </div>
  );
}

const DEFAULT_BOOKS: Book[] = [
  { id: '3', title: 'Dune', author: 'Frank Herbert', status: 'completed', genres: ['Science Fiction'], dateAdded: '2024-01-01', rating: 5 },
  { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'completed', genres: ['Fantasy'], dateAdded: '2023-12-15', rating: 5 },
  { id: '7', title: 'The Shining', author: 'Stephen King', status: 'completed', genres: ['Horror'], dateAdded: '2023-11-01', rating: 4 },
];

export default function CompletedPage() {
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);

  useEffect(() => {
    const stored = localStorage.getItem('pageturner-books');
    if (stored) {
      try { setBooks(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const completed = books.filter(b => b.status === 'completed');

  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <nav style={{ backgroundColor: '#1c1c1c' }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen style={{ color: '#fd601a' }} size={24} />
              <span className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: 'var(--font-bodoni), serif' }}>PageTurner</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'My Books', href: '/' },
                { label: 'Browse', href: '#' },
                { label: 'Community', href: '#' },
                { label: 'My Stats', href: '/stats' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-bold transition-colors hover:opacity-80"
                  style={{ color: '#ffffff' }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-sm hover:underline" style={{ color: '#555555' }}>My Books</Link>
          <span style={{ color: '#cccccc' }}>/</span>
          <span className="text-sm font-semibold" style={{ color: '#1c1c1c' }}>Read</span>
        </div>

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1c1c1c', fontFamily: 'var(--font-bodoni), serif' }}>
          Read
        </h1>

        {completed.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: '#1c1c1c' }}>
            <BookOpen size={40} className="mx-auto mb-3 opacity-20" style={{ color: '#1c1c1c' }} />
            <p className="text-sm" style={{ color: '#555555' }}>No completed books yet. Head back to <Link href="/" className="underline" style={{ color: '#fd601a' }}>My Books</Link> to track your reading!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completed.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl border p-4 flex gap-4"
                style={{ borderColor: '#1c1c1c' }}
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt="Book cover"
                    className="rounded-md flex-shrink-0 object-cover"
                    style={{ width: 48, height: 72 }}
                  />
                ) : (
                  <div
                    className="rounded-md flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: getCoverColor(book.id), width: 48, height: 72 }}
                  >
                    <BookOpen size={16} className="text-white opacity-40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-sm" style={{ color: '#1c1c1c' }}>{book.title}</h2>
                  <p className="text-xs mb-2" style={{ color: '#555555' }}>{book.author}</p>
                  {book.rating !== undefined && <StarRating rating={book.rating} />}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{ backgroundColor: '#EEE8DD', color: '#555555' }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full whitespace-nowrap">
                    Read
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
