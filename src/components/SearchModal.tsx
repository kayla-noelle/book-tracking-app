'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, BookOpen, Plus, Loader2 } from 'lucide-react';
import { GoogleBookVolume, searchBooks, volumeToBook } from '@/lib/googleBooks';
import { Book } from '@/types/book';

interface Props {
  onClose: () => void;
  onAdd: (book: Book) => void;
  existingIds: Set<string>;
}

export default function SearchModal({ onClose, onAdd, existingIds }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBookVolume[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await searchBooks(query);
    setResults(res);
    setLoading(false);
  }

  function handleAdd(volume: GoogleBookVolume, status: Book['status']) {
    onAdd(volumeToBook(volume, status));
    setRecentlyAdded(prev => new Set(prev).add(volume.id));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" style={{ borderColor: '#D4C9B5' }}>

        {/* Header / Search bar */}
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: '#D4C9B5' }}>
          <Search size={18} style={{ color: '#8B6914' }} />
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="flex-1 outline-none text-sm"
              style={{ color: '#2C2416' }}
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#F4B942', color: '#3D3228' }}
            >
              Search
            </button>
          </form>
          <button onClick={onClose} style={{ color: '#6B5A44' }} className="hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin" style={{ color: '#8B6914' }} />
            </div>
          )}
          {!loading && results.length === 0 && !query && (
            <p className="text-center py-8 text-sm" style={{ color: '#6B5A44' }}>
              Search for a book to add to your library.
            </p>
          )}
          {!loading && results.length === 0 && query && (
            <p className="text-center py-8 text-sm" style={{ color: '#6B5A44' }}>No results found.</p>
          )}
          {results.map((vol) => {
            const info = vol.volumeInfo;
            const thumb = info.imageLinks?.thumbnail?.replace('http:', 'https:');
            const inLibrary = existingIds.has(vol.id);
            const justAdded = recentlyAdded.has(vol.id);

            return (
              <div
                key={vol.id}
                className="flex gap-3 p-3 rounded-xl border transition-colors"
                style={{ borderColor: '#D4C9B5' }}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={info.title}
                    className="rounded flex-shrink-0 object-cover"
                    style={{ width: 48, height: 72 }}
                  />
                ) : (
                  <div
                    className="rounded flex-shrink-0 flex items-center justify-center"
                    style={{ width: 48, height: 72, backgroundColor: '#8B6914' }}
                  >
                    <BookOpen size={16} className="text-white opacity-40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight" style={{ color: '#2C2416' }}>
                    {info.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B5A44' }}>
                    {info.authors?.join(', ') ?? 'Unknown Author'}
                  </p>
                  {info.categories && (
                    <p className="text-xs mt-0.5" style={{ color: '#8B6914' }}>
                      {info.categories[0]}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 self-center flex-shrink-0">
                  {inLibrary || justAdded ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                      In library
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAdd(vol, 'want-to-read')}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity whitespace-nowrap"
                        style={{ backgroundColor: '#EEE8DD', color: '#3D3228' }}
                      >
                        <Plus size={10} /> Want to Read
                      </button>
                      <button
                        onClick={() => handleAdd(vol, 'reading')}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity whitespace-nowrap"
                        style={{ backgroundColor: '#4A7C6F', color: 'white' }}
                      >
                        <Plus size={10} /> Reading
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
