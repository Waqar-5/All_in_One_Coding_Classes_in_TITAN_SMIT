import { useCallback, useEffect, useState } from "react";
import { getBooks } from "../api/books";

/**
 * Fetches and holds the full book collection.
 * Returns everything a list page needs: data, loading/error state, and a refetch fn.
 */
export default function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Couldn't load the shelves. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks, setBooks };
}
