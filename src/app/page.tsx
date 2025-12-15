import { Book } from '@/types/book';

export default function Home() {
  // Mock data - we'll replace this with real data later
  const currentlyReading: Book[] = [
  {
    id: '1',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    status: 'reading' as const,  // Add "as const" here
    genres: ['Fantasy', 'Adventure'],
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    status: 'reading' as const,  // Add "as const" here
    genres: ['Science Fiction', 'Thriller'],
    dateAdded: '2024-02-01',
  },
];

  const booksByGenre: Record<string, Book[]> = {
  'Science Fiction': [
    { id: '3', title: 'Dune', author: 'Frank Herbert', status: 'completed', genres: ['Science Fiction'], dateAdded: '2024-01-01' },
    { id: '4', title: 'Foundation', author: 'Isaac Asimov', status: 'want-to-read', genres: ['Science Fiction'], dateAdded: '2024-01-10' },
  ],
  'Fantasy': [
    { id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', status: 'completed', genres: ['Fantasy'], dateAdded: '2023-12-15' },
    { id: '6', title: 'Mistborn', author: 'Brandon Sanderson', status: 'want-to-read', genres: ['Fantasy'], dateAdded: '2024-01-20' },
  ],
  'Horror': [
    { id: '7', title: 'The Shining', author: 'Stephen King', status: 'completed', genres: ['Horror'], dateAdded: '2023-11-01' },
    { id: '8', title: 'Bird Box', author: 'Josh Malerman', status: 'want-to-read', genres: ['Horror'], dateAdded: '2024-02-05' },
  ],
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Book Tracker</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Currently Reading Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Currently Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentlyReading.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-3">{book.author}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {book.genres.map((genre) => (
                      <span key={genre} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Books by Genre Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Genre</h2>
          
          {Object.entries(booksByGenre).map(([genre, books]) => (
            <div key={genre} className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{genre}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {books.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                    <h4 className="font-semibold text-gray-900 mb-1">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      book.status === 'completed' ? 'bg-green-100 text-green-800' :
                      book.status === 'reading' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {book.status === 'want-to-read' ? 'Want to Read' : 
                       book.status === 'reading' ? 'Reading' : 'Completed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}