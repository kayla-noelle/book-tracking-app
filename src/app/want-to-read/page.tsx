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
  { id: '4', title: 'Foundation', author: 'Isaac Asimov', status: 'want-to-read', genres: ['Science Fiction'], dateAdded: '2024-01-10' },
  { id: '6', title: 'Mistborn', author: 'Brandon Sanderson', status: 'want-to-read', genres: ['Fantasy'], dateAdded: '2024-01-20' },
  { id: '8', title: 'Bird Box', author: 'Josh Malerman', status: 'want-to-read', genres: ['Horror'], dateAdded: '2024-02-05' },
  { id: '9', title: 'Atomic Habits', author: 'James Clear', status: 'want-to-read', genres: ['Non-Fiction'], dateAdded: '2024-02-10' },
];

export default function WantToReadPage() {
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);

  useEffect(() => {
    const stored = localStorage.getItem('pageturner-books');
    if (stored) {
      try { setBooks(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const wantToRead = books.filter(b => b.status === 'want-to-read');

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
          <span className="text-sm font-semibold" style={{ color: '#1c1c1c' }}>Want to Read</span>
        </div>

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1c1c1c', fontFamily: 'var(--font-bodoni), serif' }}>
          Want to Read
        </h1>

        {wantToRead.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center" style={{ borderColor: '#1c1c1c' }}>
            <BookOpen size={40} className="mx-auto mb-3 opacity-20" style={{ color: '#1c1c1c' }} />
            <p className="text-sm" style={{ color: '#555555' }}>No books on your list yet. Head back to <Link href="/" className="underline" style={{ color: '#fd601a' }}>My Books</Link> to add some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wantToRead.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl border overflow-hidden cursor-pointer"
                style={{ borderColor: '#1c1c1c' }}
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full object-cover"
                    style={{ height: 160 }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ backgroundColor: getCoverColor(book.id), height: 160 }}
                  >
                    <BookOpen size={32} className="text-white opacity-40" />
                  </div>
                )}
                <div className="p-3">
                  <h4 className="font-semibold text-sm leading-tight" style={{ color: '#1c1c1c' }}>{book.title}</h4>
                  <p className="text-xs mt-0.5" style={{ color: '#555555' }}>{book.author}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-1.5 py-0.5 text-xs rounded-full"
                        style={{ backgroundColor: '#EEE8DD', color: '#555555' }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
