import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiClock, FiRepeat, FiArrowRight } from "react-icons/fi";
import { getBookStats, getBooks } from "../api/books";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import CategoryDonut from "../components/CategoryDonut";
import ErrorMessage from "../components/ErrorMessage";
import PageTransition from "../components/PageTransition";

const STAT_CARDS = [
  { key: "total", label: "Total Books", icon: FiBookOpen, tone: "text-moss-600 dark:text-brass-400" },
  { key: "Available", label: "Available", icon: FiCheckCircle, tone: "text-moss-600 dark:text-moss-400" },
  { key: "Requested", label: "Requested", icon: FiClock, tone: "text-brass-600 dark:text-brass-400" },
  { key: "Exchanged", label: "Exchanged", icon: FiRepeat, tone: "text-clay-500 dark:text-clay-400" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, booksData] = await Promise.all([
        getBookStats(),
        getBooks({ page: 1, limit: 4 }),
      ]);
      setStats(statsData);
      setRecent(booksData.books || []);
    } catch (err) {
      setError(err.message || "Couldn't load the dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">Overview</p>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">Catalog Dashboard</h1>
          <p className="mt-2 text-sm text-ink-400 dark:text-paper-300">
            A snapshot of the whole community catalog, updated live.
          </p>
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={fetchAll} />
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-paper-100 dark:bg-paper-400/10" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STAT_CARDS.map((card, i) => {
                const value = card.key === "total" ? stats.totalBooks : stats.byStatus[card.key] ?? 0;
                return (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-6 shadow-card"
                  >
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper-100 dark:bg-paper-400/10 ${card.tone}`}>
                      <card.icon aria-hidden="true" />
                    </div>
                    <p className="font-display text-3xl font-medium text-ink-700 dark:text-paper-50">{value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
                      {card.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-5">
              <div className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card lg:col-span-2">
                <h2 className="font-display text-lg font-medium text-ink-700 dark:text-paper-50">By category</h2>
                <div className="mt-5">
                  {stats.byCategory?.length > 0 ? (
                    <CategoryDonut data={stats.byCategory} />
                  ) : (
                    <p className="text-sm text-ink-400 dark:text-paper-300">No books catalogued yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card lg:col-span-3">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-display text-lg font-medium text-ink-700 dark:text-paper-50">Recently catalogued</h2>
                  <Link
                    to="/books"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-moss-600 dark:text-brass-400 hover:underline"
                  >
                    View all <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>

                {recent.length === 0 ? (
                  <p className="text-sm text-ink-400 dark:text-paper-300">
                    No books yet —{" "}
                    <Link to="/add" className="font-semibold text-moss-600 dark:text-brass-400 underline">
                      list the first one
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {recent.map((book, i) => (
                      <BookCard key={book._id} book={book} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </PageTransition>
  );
}
