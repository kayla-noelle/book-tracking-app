export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: 'reading' | 'completed' | 'want-to-read';
  genres: string[];
  rating?: number;
  review?: string;
  dateAdded: string;
  dateStarted?: string;
  dateFinished?: string;
}

export interface BookList {
  id: string;
  name: string;
  books: Book[];
}