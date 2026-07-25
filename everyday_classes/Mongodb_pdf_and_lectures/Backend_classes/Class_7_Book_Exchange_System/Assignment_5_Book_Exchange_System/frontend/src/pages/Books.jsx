import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import useBooks from "../hooks/useBooks";
import useDebounce from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import FilterSelect from "../components/FilterSelect";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import PageTransition from "../components/PageTransition";
import { CATEGORY_OPTIONS, CONDITION_OPTIONS, STATUS_OPTIONS } from "../utils/validators";

const LANGUAGE_OPTIONS = ["English", "Urdu", "Arabic", "French", "Spanish", "Other"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
  { value: "updated", label: "Recently updated" },
];

const initialFilters = {
  category: "All",
  condition: "",
  language: "",
  status: "",
  city: "",
  sort: "newest",
};

export default function Books() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const debouncedSearch = useDebounce(search, 350);
  const debouncedCity = useDebounce(filters.city, 350);

  // Server-side query — the backend does the actual filtering/sorting/search.
  const serverFilters = useMemo(
    () => ({
      search: debouncedSearch,
      category: filters.category === "All" ? "" : filters.category,
      condition: filters.condition,
      language: filters.language,
      status: filters.status,
      city: debouncedCity,
      sort: filters.sort,
    }),
    [debouncedSearch, debouncedCity, filters]
  );

  const { books, page, totalPages, totalBooks, loading, error, goToPage, refetch } = useBooks({
    limit: 12,
    filters: serverFilters,
  });

  const setFilter = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));

  const hasActiveFilters =
    search ||
    filters.category !== "All" ||
    filters.condition ||
    filters.language ||
    filters.status ||
    filters.city ||
    filters.sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setFilters(initialFilters);
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">The full catalog</p>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">Browse the shelves</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-400 dark:text-paper-300">
            {totalBooks > 0
              ? `${totalBooks} ${totalBooks === 1 ? "title" : "titles"} match your search.`
              : "Search across every listed title, or narrow things down by category."}
          </p>
        </div>

        <div className="mb-6 sm:max-w-md">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title, author, ISBN, tag, or owner…"
          />
        </div>

        <div className="mb-6">
          <CategoryFilter categories={CATEGORY_OPTIONS} active={filters.category} onChange={setFilter("category")} />
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          <FilterSelect label="Condition" value={filters.condition} onChange={setFilter("condition")} options={CONDITION_OPTIONS} allLabel="Any condition" />
          <FilterSelect label="Language" value={filters.language} onChange={setFilter("language")} options={LANGUAGE_OPTIONS} allLabel="Any language" />
          <FilterSelect label="Status" value={filters.status} onChange={setFilter("status")} options={STATUS_OPTIONS} allLabel="Available only" />
          <input
            type="text"
            value={filters.city}
            onChange={(e) => setFilter("city")(e.target.value)}
            placeholder="City"
            aria-label="Filter by city"
            className="w-28 rounded-full border border-ink-200 dark:border-paper-400/20 bg-paper-50 dark:bg-ink-700/60
              px-3 py-1.5 text-xs font-semibold text-ink-600 dark:text-paper-200 outline-none placeholder:text-ink-300
              dark:placeholder:text-paper-400/60 focus:border-moss-500"
          />
          <FilterSelect label="Sort" value={filters.sort} onChange={setFilter("sort")} options={SORT_OPTIONS} allLabel="Newest" />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-clay-500 hover:underline"
            >
              <FiX aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : books.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              title="No matches"
              description="Try a different search term, or clear your filters to see everything."
            />
          ) : (
            <EmptyState
              title="The shelves are bare"
              description="No one has catalogued a book yet. Be the first to list one for the community."
              actionLabel="List the first book"
              actionTo="/add"
            />
          )
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book, i) => (
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
