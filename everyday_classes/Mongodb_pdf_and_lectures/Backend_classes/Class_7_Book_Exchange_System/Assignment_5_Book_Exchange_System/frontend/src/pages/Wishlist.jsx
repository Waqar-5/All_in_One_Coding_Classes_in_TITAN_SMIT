import { useEffect, useState } from "react";
import { getMyFavorites } from "../api/favorites";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";

export default function Wishlist() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyFavorites();
      setBooks(data || []);
    } catch (err) {
      setError(err.message || "Couldn't load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">Saved for later</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">Your wishlist</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-400 dark:text-paper-300">
          Books you've bookmarked to come back to. Tap the heart on any book to remove it from here.
        </p>

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchFavorites} />
          ) : books.length === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              description="Browse the shelves and tap the heart on a book to save it here."
              actionLabel="Browse the shelves"
              actionTo="/books"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book, i) => (
                <BookCard key={book._id} book={book} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
