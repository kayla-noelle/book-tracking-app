'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import { BookOpen, Star, TrendingUp, BookMarked, Clock } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_BOOKS: Book[] = [
  { id: '1', title: 'The Name of the Wind', author: 'Patrick Rothfuss', status: 'reading', genres: ['Fantasy', 'Adventure'], dateAdded: '2024-01-15' },
  { id: '2', title: 'Project Hail Mary', author: 'Andy Weir', status: 'reading', genres: ['Science Fiction', 'Thriller'], dateAdded: '2024-02-01' },
  { id: '4', title: 'Foundation', author: 'Isaac Asimov', status: 'want-to-read', genres: ['Science Fiction'], dateAdded: '2024-01-10' },
  { id: '6', title: 'Mistborn', author: 'Brandon Sanderson', status: 'want-to-read', genres: ['Fantasy'], dateAdded: '2024-01-20' },
  { id: '8', title: 'Bird Box', author: 'Josh Malerman', status: 'want-to-read', genres: ['Horror'], dateAdded: '2024-02-05' },
  { id: '9', title: 'Atomic Habits', author: 'James Clear', status: 'want-to-read', genres: ['Non-Fiction'], dateAdded: '2024-02-10' },
  { id: '3', title: 'Dune', author: 'Frank Herbert', status: 'completed', genres: ['Science Fiction'], dateAdded: '2024-01-01', rating: 5 },
  { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'completed', genres: ['Fantasy'], dateAdded: '2023-12-15', rating: 5 },
  { id: '7', title: 'The Shining', author: 'Stephen King', status: 'completed', genres: ['Horror'], dateAdded: '2023-11-01', rating: 4 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          style={{
            color: star <= rating ? '#f5c518' : '#cccccc',
            fill: star <= rating ? '#f5c518' : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function StatsPage() {
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);

  useEffect(() => {
    const stored = localStorage.getItem('pageturner-books');
    if (stored) {
      try { setBooks(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const completed = books.filter(b => b.status === 'completed');
  const reading = books.filter(b => b.status === 'reading');
  const wantToRead = books.filter(b => b.status === 'want-to-read');

  // Genre breakdown
  const genreCounts: Record<string, number> = {};
  books.forEach(b => b.genres.forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; }));
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const maxGenreCount = sortedGenres[0]?.[1] ?? 1;

  // Average rating
  const ratedBooks = completed.filter(b => b.rating !== undefined);
  const avgRating = ratedBooks.length
    ? ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBooks.length
    : 0;

  // Reading goal
  const GOAL = 12;
  const goalPct = Math.min(100, Math.round((completed.length / GOAL) * 100));

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
                  style={{ color: label === 'My Stats' ? '#fd601a' : '#ffffff' }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#1c1c1c', fontFamily: 'var(--font-bodoni), serif' }}>
          My Reading Stats
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <BookMarked size={20} style={{ color: '#fd601a' }} />, value: completed.length, label: 'Books Read' },
            { icon: <BookOpen size={20} style={{ color: '#4A7C6F' }} />, value: reading.length, label: 'Currently Reading' },
            { icon: <Clock size={20} style={{ color: '#6b9a5a' }} />, value: wantToRead.length, label: 'Want to Read' },
            { icon: <TrendingUp size={20} style={{ color: '#fd601a' }} />, value: books.length, label: 'Total Books' },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border p-5 flex flex-col gap-2" style={{ borderColor: '#1c1c1c' }}>
              {card.icon}
              <div className="text-3xl font-bold" style={{ color: '#1c1c1c' }}>{card.value}</div>
              <div className="text-xs" style={{ color: '#555555' }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Reading Goal */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#1c1c1c' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1c1c1c' }}>2024 Reading Goal</h2>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-5xl font-bold" style={{ color: '#fd601a' }}>{completed.length}</span>
              <span className="text-xl mb-1" style={{ color: '#555555' }}>/ {GOAL} books</span>
            </div>
            <div className="w-full rounded-full h-4 mb-2" style={{ backgroundColor: '#EEE8DD' }}>
              <div className="h-4 rounded-full transition-all" style={{ width: `${goalPct}%`, backgroundColor: '#fd601a' }} />
            </div>
            <p className="text-sm" style={{ color: '#555555' }}>{goalPct}% of your goal complete</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#1c1c1c' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1c1c1c' }}>Average Rating</h2>
            {ratedBooks.length > 0 ? (
              <>
                <div className="text-5xl font-bold mb-2" style={{ color: '#fd601a' }}>
                  {avgRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(avgRating)} />
                <p className="text-sm mt-3" style={{ color: '#555555' }}>Based on {ratedBooks.length} rated book{ratedBooks.length !== 1 ? 's' : ''}</p>
              </>
            ) : (
              <p className="text-sm" style={{ color: '#555555' }}>No rated books yet.</p>
            )}
          </div>

          {/* Genre Breakdown */}
          <div className="bg-white rounded-xl border p-6 lg:col-span-2" style={{ borderColor: '#1c1c1c' }}>
            <h2 className="text-lg font-bold mb-5" style={{ color: '#1c1c1c' }}>Books by Genre</h2>
            <div className="space-y-3">
              {sortedGenres.map(([genre, count]) => (
                <div key={genre} className="flex items-center gap-3">
                  <span className="text-sm w-36 flex-shrink-0" style={{ color: '#1c1c1c' }}>{genre}</span>
                  <div className="flex-1 rounded-full h-3" style={{ backgroundColor: '#EEE8DD' }}>
                    <div
                      className="h-3 rounded-full"
                      style={{ width: `${(count / maxGenreCount) * 100}%`, backgroundColor: '#fd601a' }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-6 text-right" style={{ color: '#555555' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completed books with ratings */}
          {completed.length > 0 && (
            <div className="bg-white rounded-xl border p-6 lg:col-span-2" style={{ borderColor: '#1c1c1c' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1c1c1c' }}>Books Completed</h2>
              <div className="space-y-3">
                {completed.map(book => (
                  <div key={book.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: '#EEE8DD' }}>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#1c1c1c' }}>{book.title}</p>
                      <p className="text-xs" style={{ color: '#555555' }}>{book.author}</p>
                    </div>
                    {book.rating !== undefined
                      ? <StarRating rating={book.rating} />
                      : <span className="text-xs" style={{ color: '#cccccc' }}>No rating</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
