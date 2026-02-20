import { Book } from '@/types/book';
import { BookOpen, Search, Star, ChevronRight, User } from 'lucide-react';

// Warm palette for placeholder book covers
const COVER_COLORS = [
  '#8B6914', '#4A7C6F', '#6B3D6E', '#4A6B8B', '#8B4A4A',
  '#6B6B3D', '#3D6B8B', '#8B3D6E', '#4A8B6B', '#7C6B4A',
];

function getCoverColor(id: string) {
  return COVER_COLORS[parseInt(id) % COVER_COLORS.length];
}

function BookCover({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' }) {
  const dims = size === 'sm'
    ? { width: 48, height: 72, iconSize: 16 }
    : { width: 64, height: 96, iconSize: 22 };

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
            color: star <= rating ? '#F4B942' : '#D4C9B5',
            fill: star <= rating ? '#F4B942' : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const currentlyReading: Book[] = [
    {
      id: '1',
      title: 'The Name of the Wind',
      author: 'Patrick Rothfuss',
      status: 'reading',
      genres: ['Fantasy', 'Adventure'],
      dateAdded: '2024-01-15',
    },
    {
      id: '2',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      status: 'reading',
      genres: ['Science Fiction', 'Thriller'],
      dateAdded: '2024-02-01',
    },
  ];

  const wantToRead: Book[] = [
    { id: '4', title: 'Foundation', author: 'Isaac Asimov', status: 'want-to-read', genres: ['Science Fiction'], dateAdded: '2024-01-10' },
    { id: '6', title: 'Mistborn', author: 'Brandon Sanderson', status: 'want-to-read', genres: ['Fantasy'], dateAdded: '2024-01-20' },
    { id: '8', title: 'Bird Box', author: 'Josh Malerman', status: 'want-to-read', genres: ['Horror'], dateAdded: '2024-02-05' },
    { id: '9', title: 'Atomic Habits', author: 'James Clear', status: 'want-to-read', genres: ['Non-Fiction'], dateAdded: '2024-02-10' },
  ];

  const completed: Book[] = [
    { id: '3', title: 'Dune', author: 'Frank Herbert', status: 'completed', genres: ['Science Fiction'], dateAdded: '2024-01-01', rating: 5 },
    { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'completed', genres: ['Fantasy'], dateAdded: '2023-12-15', rating: 5 },
    { id: '7', title: 'The Shining', author: 'Stephen King', status: 'completed', genres: ['Horror'], dateAdded: '2023-11-01', rating: 4 },
  ];

  const readingProgress: Record<string, number> = {
    '1': 42,
    '2': 67,
  };

  const genres = ['Fantasy', 'Science Fiction', 'Horror', 'Non-Fiction', 'Romance', 'Mystery', 'Thriller', 'Literary Fiction'];

  const recentActivity = [
    { color: '#4A7C6F', text: 'Started', book: 'Project Hail Mary', suffix: '', when: '2 weeks ago' },
    { color: '#F4B942', text: 'Finished', book: 'Dune', suffix: '', when: '1 month ago' },
    { color: '#6B3D6E', text: 'Added', book: 'Atomic Habits', suffix: 'to Want to Read', when: '1 month ago' },
    { color: '#F4B942', text: 'Finished', book: 'The Hobbit', suffix: '', when: '2 months ago' },
  ];

  return (
    <div className="min-h-screen">

      {/* ── Navbar ── */}
      <nav style={{ backgroundColor: '#3D3228' }} className="sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <BookOpen style={{ color: '#F4B942' }} size={24} />
              <span className="text-white font-bold text-xl tracking-wide">PageTurner</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {['My Books', 'Browse', 'Community', 'Lists'].map((link) => (
                <a key={link} href="#" style={{ color: '#D4C9B5' }} className="hover:text-white transition-colors text-sm">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button style={{ color: '#D4C9B5' }} className="hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F4B942' }}>
              <User size={16} style={{ color: '#3D3228' }} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stats Bar ── */}
        <div
          className="bg-white rounded-xl shadow-sm border p-5 mb-8 flex flex-wrap gap-6 items-center"
          style={{ borderColor: '#D4C9B5' }}
        >
          {[
            { value: 3, label: 'Books Read in 2024' },
            { value: 2, label: 'Currently Reading' },
            { value: 4, label: 'Want to Read' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6">
              {i > 0 && <div className="hidden md:block w-px h-10" style={{ backgroundColor: '#D4C9B5' }} />}
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: '#3D3228' }}>{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: '#6B5A44' }}>{stat.label}</div>
              </div>
            </div>
          ))}
          <div className="flex-1 hidden md:block min-w-40">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: '#6B5A44' }}>2024 Reading Goal</span>
              <span className="text-xs font-semibold" style={{ color: '#3D3228' }}>3 / 12 books</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: '#EEE8DD' }}>
              <div className="h-2 rounded-full" style={{ width: '25%', backgroundColor: '#F4B942' }} />
            </div>
          </div>
          <button
            className="ml-auto px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F4B942', color: '#3D3228' }}
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
                <h2 className="text-xl font-bold" style={{ color: '#3D3228' }}>Currently Reading</h2>
                <a href="#" className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#8B6914' }}>
                  See all <ChevronRight size={14} />
                </a>
              </div>
              <div className="space-y-4">
                {currentlyReading.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm border p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    style={{ borderColor: '#D4C9B5' }}
                  >
                    <BookCover id={book.id} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base" style={{ color: '#2C2416' }}>{book.title}</h3>
                      <p className="text-sm mb-2" style={{ color: '#6B5A44' }}>{book.author}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {book.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{ backgroundColor: '#EEE8DD', color: '#6B5A44' }}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1" style={{ color: '#6B5A44' }}>
                          <span>Reading progress</span>
                          <span className="font-semibold">{readingProgress[book.id]}%</span>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#EEE8DD' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${readingProgress[book.id]}%`, backgroundColor: '#4A7C6F' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Want to Read */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#3D3228' }}>Want to Read</h2>
                <a href="#" className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#8B6914' }}>
                  See all <ChevronRight size={14} />
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {wantToRead.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    style={{ borderColor: '#D4C9B5' }}
                  >
                    <div
                      className="h-28 flex items-center justify-center"
                      style={{ backgroundColor: getCoverColor(book.id) }}
                    >
                      <BookOpen size={28} className="text-white opacity-40" />
                    </div>
                    <div className="p-2.5">
                      <h4 className="font-semibold text-xs leading-tight" style={{ color: '#2C2416' }}>{book.title}</h4>
                      <p className="text-xs mt-0.5" style={{ color: '#6B5A44' }}>{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Read / Completed */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#3D3228' }}>Read</h2>
                <a href="#" className="text-sm flex items-center gap-1 hover:underline" style={{ color: '#8B6914' }}>
                  See all <ChevronRight size={14} />
                </a>
              </div>
              <div className="space-y-3">
                {completed.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl shadow-sm border p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    style={{ borderColor: '#D4C9B5' }}
                  >
                    <BookCover id={book.id} size="sm" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm" style={{ color: '#2C2416' }}>{book.title}</h3>
                      <p className="text-xs mb-1.5" style={{ color: '#6B5A44' }}>{book.author}</p>
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
            <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: '#D4C9B5' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: '#3D3228' }}>Browse by Genre</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className="px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: '#EEE8DD', color: '#3D3228' }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: '#D4C9B5' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: '#3D3228' }}>Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-xs" style={{ color: '#2C2416' }}>
                        {item.text}{' '}
                        <span className="font-semibold">{item.book}</span>
                        {item.suffix ? ` ${item.suffix}` : ''}
                      </p>
                      <p className="text-xs" style={{ color: '#6B5A44' }}>{item.when}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Challenge */}
            <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: '#D4C9B5' }}>
              <h3 className="font-bold text-base mb-1" style={{ color: '#3D3228' }}>2024 Reading Challenge</h3>
              <p className="text-xs mb-3" style={{ color: '#6B5A44' }}>3 of 12 books complete</p>
              <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: '#EEE8DD' }}>
                <div className="h-3 rounded-full" style={{ width: '25%', backgroundColor: '#F4B942' }} />
              </div>
              <p className="text-xs" style={{ color: '#6B5A44' }}>25% of goal — you&apos;re on track!</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
