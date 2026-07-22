import { useMemo, useState } from "react";
import useBooks from "../hooks/useBooks";
import useDebounce from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";

export default function Books() {
  const { books, loading, error, refetch } = useBooks();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const debouncedSearch = useDebounce(search, 250);

  const categories = useMemo(
    () => [...new Set(books.map((b) => b.category).filter(Boolean))].sort(),
    [books]
  );

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return books.filter((b) => {
      const matchesCategory = category === "All" || b.category === category;
      const matchesQuery =
        !query ||
        b.title?.toLowerCase().includes(query) ||
        b.author?.toLowerCase().includes(query) ||
        b.owner?.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [books, debouncedSearch, category]);

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">The full catalog</p>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">Browse the shelves</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-400 dark:text-paper-300">
            Search across every listed title, or narrow things down by category.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="sm:max-w-md sm:flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-10">
            <CategoryFilter categories={categories} active={category} onChange={setCategory} />
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          books.length === 0 ? (
            <EmptyState
              title="The shelves are bare"
              description="No one has catalogued a book yet. Be the first to list one for the community."
              actionLabel="List the first book"
              actionTo="/add"
            />
          ) : (
            <EmptyState
              title="No matches on this shelf"
              description="Try a different search term or clear the category filter."
            />
          )
        ) : (
          <>
            <p className="mb-5 text-xs font-medium uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
              {filtered.length} {filtered.length === 1 ? "title" : "titles"} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((book, i) => (
                <BookCard key={book._id} book={book} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </PageTransition>
  );
}
