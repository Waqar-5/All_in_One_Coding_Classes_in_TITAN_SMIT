import { useCallback, useEffect, useState } from "react";
import { getBooks } from "../api/books";

/**
 * Fetches a page of the book catalog, with optional server-side
 * search/filter/sort. The backend paginates server-side, so this hook
 * tracks page/limit alongside the returned books and pagination metadata.
 *
 * `filters` can include: search, category, condition, language, status,
 * city, sort — see Backend controllers/bookController.js's getAllBooks
 * for the exact query params it accepts.
 */
export default function useBooks({ limit = 12, filters = {} } = {}) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stable string form so the effect below doesn't refire on every render
  // just because the caller passed a fresh object literal.
  const filtersKey = JSON.stringify(filters);

  const fetchBooks = useCallback(
    async (targetPage) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBooks({ page: targetPage, limit, ...filters });
        setBooks(Array.isArray(data.books) ? data.books : []);
        setTotalPages(data.totalPages || 1);
        setTotalBooks(data.totalBooks || 0);
        setPage(data.currentPage || targetPage);
      } catch (err) {
        setError(err.message || "Couldn't load the shelves. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [limit, filtersKey] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Any filter change resets back to page 1.
  useEffect(() => {
    fetchBooks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, filtersKey]);

  return {
    books,
    page,
    totalPages,
    totalBooks,
    loading,
    error,
    goToPage: (p) => fetchBooks(p),
    refetch: () => fetchBooks(page),
  };
}
