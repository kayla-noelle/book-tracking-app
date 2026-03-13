'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import Link from 'next/link';
import { BookOpen, Search, Star, ChevronRight, User, Menu, X } from 'lucide-react';
import SearchModal from '@/components/SearchModal';

// Warm palette for placeholder book covers
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

function BookCover({ id, coverUrl, size = 'md' }: { id: string; coverUrl?: string; size?: 'sm' | 'md' }) {
  const dims = size === 'sm'
    ? { width: 48, height: 72, iconSize: 16 }
    : { width: 64, height: 96, iconSize: 22 };

  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt="Book cover"
        className="rounded-md flex-shrink-0 object-cover"
        style={{ width: dims.width, height: dims.height }}
      />
    );
  }

  return (
    <div
      className="rounded-md flex-shrink-0 flex items-center justify-center"
      style={{ backgroundColor: getCoverColor(id), width: dims.width, height: dims.height }}
    >
      <BookOpen size={dims.iconSize} className="text-white opacity-40" />
    </div>
  );
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

const DEFAULT_PROGRESS: Record<string, number> = { '1': 42, '2': 67 };

const genres = ['Fantasy', 'Science Fiction', 'Horror', 'Non-Fiction', 'Romance', 'Mystery', 'Thriller', 'Literary Fiction'];

const recentActivity = [
  { color: '#4A7C6F', text: 'Started', book: 'Project Hail Mary', suffix: '', when: '2 weeks ago' },
  { color: '#fd601a', text: 'Finished', book: 'Dune', suffix: '', when: '1 month ago' },
  { color: '#3d9a6b', text: 'Added', book: 'Atomic Habits', suffix: 'to Want to Read', when: '1 month ago' },
  { color: '#fd601a', text: 'Finished', book: 'The Hobbit', suffix: '', when: '2 months ago' },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);
  const [progress] = useState<Record<string, number>>(DEFAULT_PROGRESS);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pageturner-books');
    if (stored) {
      try { setBooks(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('pageturner-books', JSON.stringify(books));
    }
  }, [books, hydrated]);

  function addBook(book: Book) {
    setBooks(prev => prev.some(b => b.id === book.id) ? prev : [book, ...prev]);
  }

  const currentlyReading = books.filter(b => b.status === 'reading');
  const wantToRead = books.filter(b => b.status === 'want-to-read');
  const completed = books.filter(b => b.status === 'completed');
  const existingIds = new Set(books.map(b => b.id));

  return (
    <div className="min-h-screen">

      {/* ── Navbar ── */}
      <nav style={{ backgroundColor: '#1c1c1c' }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden text-white hover:opacity-80 transition-opacity"
              onClick={() => setShowMobileMenu(prev => !prev)}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <BookOpen style={{ color: '#fd601a' }} size={24} />
              <span className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: 'var(--font-bodoni), serif' }}>PageTurner</span>
            </div>
            <div className="hidden md:flex items-center gap-6 ml-4">
              {[
                { label: 'My Books', href: '/' },
                { label: 'Browse', href: '#' },
                { label: 'Community', href: '#' },
                { label: 'My Stats', href: '/stats' },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{ color: label === 'My Books' ? '#fd601a' : '#ffffff' }} className="hover:opacity-80 transition-opacity text-sm font-bold">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              style={{ color: '#cccccc' }}
              className="hover:text-white transition-colors"
              onClick={() => setShowSearch(true)}
            >
              <Search size={20} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EEE8DD' }}>
              <User size={16} style={{ color: '#1c1c1c' }} />
            </div>
          </div>
        </div>

        {/* Mobile full-screen menu */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-40 flex flex-col px-8 pt-24 pb-12" style={{ backgroundColor: '#1c1c1c' }}>
            {[
              { label: 'My Books', href: '/' },
              { label: 'Browse', href: '#' },
              { label: 'Community', href: '#' },
              { label: 'My Stats', href: '/stats' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="block text-3xl font-bold py-5 border-b hover:opacity-70 transition-opacity"
                style={{ color: label === 'My Books' ? '#fd601a' : '#ffffff', borderColor: '#333333' }}
                onClick={() => setShowMobileMenu(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stats Bar ── */}
        <div
          className="bg-white rounded-xl border p-5 mb-8 flex flex-wrap gap-6 items-center"
          style={{ borderColor: '#1c1c1c' }}
        >
          {[
            { value: completed.length, label: 'Books Read' },
            { value: currentlyReading.length, label: 'Currently Reading' },
            { value: wantToRead.length, label: 'Want to Read' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6">
              {i > 0 && <div className="hidden md:block w-px h-10" style={{ backgroundColor: '#cccccc' }} />}
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#1c1c1c' }}>{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: '#555555' }}>{stat.label}</div>
              </div>
            </div>
          ))}
          <div className="flex-1 hidden md:block min-w-40">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: '#555555' }}>Reading Goal</span>
              <span className="text-xs font-semibold" style={{ color: '#1c1c1c' }}>{completed.length} / 12 books</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: '#EEE8DD' }}>
              <div className="h-2 rounded-full" style={{ width: `${Math.min(100, (completed.length / 12) * 100)}%`, backgroundColor: '#fd601a' }} />
            </div>
          </div>
          <button
            className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1c1c1c', color: '#ffffff' }}
            onClick={() => setShowSearch(true)}
          >
            + Add Book
          </button>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content (2/3 width) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Currently Reading */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#1c1c1c' }}>Currently Reading</h2>
                <Link href="/reading" className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#1c1c1c' }}>
                  See all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {currentlyReading.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl border p-4 flex gap-4 cursor-pointer"
                    style={{ borderColor: '#1c1c1c' }}
                  >
                    <BookCover id={book.id} coverUrl={book.coverUrl} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base" style={{ color: '#1c1c1c' }}>{book.title}</h3>
                      <p className="text-sm mb-2" style={{ color: '#555555' }}>{book.author}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
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
                          <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#EEE8DD' }}>
                            <div
                              className="h-1.5 rounded-full"
                              style={{ width: `${progress[book.id]}%`, backgroundColor: '#4A7C6F' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {currentlyReading.length === 0 && (
                  <p className="text-sm" style={{ color: '#555555' }}>No books in progress. Search for one to start reading!</p>
                )}
              </div>
            </section>

            {/* Want to Read */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#1c1c1c' }}>Want to Read</h2>
                <Link href="/want-to-read" className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#1c1c1c' }}>
                  See all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                        style={{ height: 112 }}
                      />
                    ) : (
                      <div
                        className="h-28 flex items-center justify-center"
                        style={{ backgroundColor: getCoverColor(book.id) }}
                      >
                        <BookOpen size={28} className="text-white opacity-40" />
                      </div>
                    )}
                    <div className="p-2.5">
                      <h4 className="font-semibold text-xs leading-tight" style={{ color: '#1c1c1c' }}>{book.title}</h4>
                      <p className="text-xs mt-0.5" style={{ color: '#555555' }}>{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Read / Completed */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#1c1c1c' }}>Read</h2>
                <Link href="/completed" className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#1c1c1c' }}>
                  See all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {completed.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl border p-4 flex gap-4 cursor-pointer"
                    style={{ borderColor: '#1c1c1c' }}
                  >
                    <BookCover id={book.id} coverUrl={book.coverUrl} size="sm" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm" style={{ color: '#1c1c1c' }}>{book.title}</h3>
                      <p className="text-xs mb-1.5" style={{ color: '#555555' }}>{book.author}</p>
                      {book.rating !== undefined && <StarRating rating={book.rating} />}
                    </div>
                    <div className="flex items-start">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full whitespace-nowrap">
                        Read
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ── Sidebar (1/3 width) ── */}
          <div className="space-y-6">

            {/* Genre Browser */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#1c1c1c' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: '#1c1c1c' }}>Browse by Genre</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className="px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: '#EEE8DD', color: '#1c1c1c', border: '1px solid #1c1c1c' }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#1c1c1c' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: '#1c1c1c' }}>Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs" style={{ color: '#1c1c1c' }}>
                        {item.text}{' '}
                        <span className="font-semibold">{item.book}</span>
                        {item.suffix ? ` ${item.suffix}` : ''}
                      </p>
                      <p className="text-xs" style={{ color: '#555555' }}>{item.when}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Challenge */}
            <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#1c1c1c' }}>
              <h3 className="font-bold text-base mb-1" style={{ color: '#1c1c1c' }}>Reading Challenge</h3>
              <p className="text-xs mb-3" style={{ color: '#555555' }}>{completed.length} of 12 books complete</p>
              <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: '#EEE8DD' }}>
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${Math.min(100, (completed.length / 12) * 100)}%`, backgroundColor: '#fd601a' }}
                />
              </div>
              <p className="text-xs" style={{ color: '#555555' }}>
                {Math.round((completed.length / 12) * 100)}% of goal
              </p>
            </div>

          </div>
        </div>
      </main>

      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onAdd={addBook}
          existingIds={existingIds}
        />
      )}
    </div>
  );
}
