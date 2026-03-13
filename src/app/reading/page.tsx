'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { BookOpen } from 'lucide-react';
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

const DEFAULT_BOOKS: Book[] = [
  { id: '1', title: 'The Name of the Wind', author: 'Patrick Rothfuss', status: 'reading', genres: ['Fantasy', 'Adventure'], dateAdded: '2024-01-15' },
  { id: '2', title: 'Project Hail Mary', author: 'Andy Weir', status: 'reading', genres: ['Science Fiction', 'Thriller'], dateAdded: '2024-02-01' },
];

const DEFAULT_PROGRESS: Record<string, number> = { '1': 42, '2': 67 };

export default function CurrentlyReadingPage() {
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);
  const [progress] = useState<Record<string, number>>(DEFAULT_PROGRESS);

  useEffect(() => {
    const stored = localStorage.getItem('pageturner-books');
    if (stored) {
      try { setBooks(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const currentlyReading = books.filter(b => b.status === 'reading');

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
          <span className="text-sm font-semibold" style={{ color: '#1c1c1c' }}>Currently Reading</span>
        </div>

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1c1c1c', fontFamily: 'var(--font-bodoni), serif' }}>
          Currently Reading
        </h1>

        {currentlyReading.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: '#1c1c1c' }}>
            <BookOpen size={40} className="mx-auto mb-3 opacity-20" style={{ color: '#1c1c1c' }} />
            <p className="text-sm" style={{ color: '#555555' }}>No books in progress. Head back to <Link href="/" className="underline" style={{ color: '#fd601a' }}>My Books</Link> to start one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentlyReading.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl border p-5 flex gap-5"
                style={{ borderColor: '#1c1c1c' }}
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt="Book cover"
                    className="rounded-md flex-shrink-0 object-cover"
                    style={{ width: 72, height: 108 }}
                  />
                ) : (
                  <div
                    className="rounded-md flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: getCoverColor(book.id), width: 72, height: 108 }}
                  >
                    <BookOpen size={24} className="text-white opacity-40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg" style={{ color: '#1c1c1c' }}>{book.title}</h2>
                  <p className="text-sm mb-3" style={{ color: '#555555' }}>{book.author}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
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
                  {progress[book.id] !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: '#555555' }}>
                        <span>Reading progress</span>
                        <span className="font-semibold">{progress[book.id]}%</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ backgroundColor: '#EEE8DD' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${progress[book.id]}%`, backgroundColor: '#4A7C6F' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
