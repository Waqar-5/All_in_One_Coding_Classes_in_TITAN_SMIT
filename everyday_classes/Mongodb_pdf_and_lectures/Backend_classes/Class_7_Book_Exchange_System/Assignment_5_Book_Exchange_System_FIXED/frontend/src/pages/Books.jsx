import { useMemo, useState } from "react";
import useBooks from "../hooks/useBooks";
import useDebounce from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import PageTransition from "../components/PageTransition";
import { CATEGORY_OPTIONS } from "../utils/validators";

export default function Books() {
  // The backend paginates server-side (12 per page here), so search/category
  // filtering happens over whatever page is currently loaded.
  const { books, page, totalPages, totalBooks, loading, error, goToPage, refetch } = useBooks({ limit: 12 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const debouncedSearch = useDebounce(search, 250);

  const activeCategories = useMemo(
    () => CATEGORY_OPTIONS.filter((cat) => books.some((b) => b.category === cat)),
    [books]
  );

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return books.filter((b) => {
      const matchesCategory = category === "All" || b.category === category;
      const ownerName = typeof b.owner === "object" ? b.owner?.name : "";
      const matchesQuery =
        !query ||
        b.title?.toLowerCase().includes(query) ||
        b.author?.toLowerCase().includes(query) ||
        ownerName?.toLowerCase().includes(query);
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
            {totalBooks > 0
              ? `${totalBooks} available ${totalBooks === 1 ? "title" : "titles"} across the community.`
              : "Search across every listed title, or narrow things down by category."}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="sm:max-w-md sm:flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        {activeCategories.length > 0 && (
          <div className="mb-10">
            <CategoryFilter categories={activeCategories} active={category} onChange={setCategory} />
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
              title="No matches on this page"
              description="Try a different search term, clear the category filter, or check another page."
            />
          )
        ) : (
          <>
            <p className="mb-5 text-xs font-medium uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
              Showing {filtered.length} of {books.length} on this page
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((book, i) => (
                <BookCard key={book._id} book={book} index={i} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
          </>
        )}
      </section>
    </PageTransition>
  );
}
