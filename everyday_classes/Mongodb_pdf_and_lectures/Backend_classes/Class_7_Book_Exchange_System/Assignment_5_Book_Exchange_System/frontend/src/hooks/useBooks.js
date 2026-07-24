import { useCallback, useEffect, useState } from "react";
import { getBooks } from "../api/books";

/**
 * Fetches a page of the public (Available) book catalog.
 * The backend paginates server-side, so this hook tracks page/limit
 * alongside the returned books and pagination metadata.
 */
export default function useBooks({ limit = 12 } = {}) {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(
    async (targetPage = page) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBooks({ page: targetPage, limit });
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
    [limit] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    fetchBooks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

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
