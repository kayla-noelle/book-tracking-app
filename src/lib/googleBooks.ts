import { Book } from '@/types/book';

export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    description?: string;
    publishedDate?: string;
  };
}

export async function searchBooks(query: string): Promise<GoogleBookVolume[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12&printType=books`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

export function volumeToBook(volume: GoogleBookVolume, status: Book['status']): Book {
  const info = volume.volumeInfo;
  const thumbnail = info.imageLinks?.thumbnail;
  return {
    id: volume.id,
    title: info.title,
    author: info.authors?.[0] ?? 'Unknown Author',
    coverUrl: thumbnail ? thumbnail.replace('http:', 'https:') : undefined,
    genres: info.categories ?? [],
    status,
    dateAdded: new Date().toISOString().split('T')[0],
  };
}
