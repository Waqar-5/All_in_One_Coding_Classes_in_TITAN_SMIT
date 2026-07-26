import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiMapPin, FiPhone, FiBookOpen, FiRepeat, FiUser } from "react-icons/fi";
import { getUserDetailsAdmin } from "../api/admin";
import BookCard from "../components/BookCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";
import { getImageUrl } from "../utils/image";
import { formatDate } from "../utils/formatDate";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserDetailsAdmin(id);
      setUser(data.user);
      setBooks(data.books || []);
      setStats(data.stats);
    } catch (err) {
      setError(err.message || "Couldn't load this user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <PageTransition>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-moss-600 dark:text-paper-300 dark:hover:text-brass-400"
        >
          <FiArrowLeft aria-hidden="true" /> Back to control room
        </Link>

        {loading ? (
          <LoadingSpinner label="Loading this member…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchDetails} />
        ) : (
          user && (
            <>
              <div className="flex flex-col gap-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card sm:flex-row sm:items-center">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-moss-50 dark:bg-moss-500/10 font-display text-2xl font-semibold text-moss-600 dark:text-brass-400">
                  {getImageUrl(user.profileImage) ? (
                    <img src={getImageUrl(user.profileImage)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase() || <FiUser />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-medium text-ink-700 dark:text-paper-50">{user.name}</h1>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        user.role === "Admin"
                          ? "bg-brass-50 dark:bg-brass-500/10 text-brass-600 dark:text-brass-400"
                          : "bg-paper-100 dark:bg-paper-400/10 text-ink-400 dark:text-paper-300"
                      }`}
                    >
                      {user.role}
                    </span>
                    {user.isBlocked && (
                      <span className="rounded-full bg-clay-50 dark:bg-clay-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-clay-500">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-400 dark:text-paper-300">{user.email}</p>
                  {user.bio && <p className="mt-2 text-sm text-ink-500 dark:text-paper-200">{user.bio}</p>}

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-400 dark:text-paper-300">
                    <span className="inline-flex items-center gap-1.5"><FiCalendar aria-hidden="true" /> Member since {formatDate(user.createdAt)}</span>
                    {user.city && <span className="inline-flex items-center gap-1.5"><FiMapPin aria-hidden="true" /> {user.city}</span>}
                    {user.phone && <span className="inline-flex items-center gap-1.5"><FiPhone aria-hidden="true" /> {user.phone}</span>}
                    <span className="inline-flex items-center gap-1.5">
                      <FiBookOpen aria-hidden="true" /> Book limit: {user.bookLimit === null || user.bookLimit === undefined ? "Default" : user.bookLimit}
                    </span>
                  </div>
                </div>
              </div>

              {stats && (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-5 text-center shadow-card">
                    <FiBookOpen className="mx-auto mb-2 text-xl text-moss-600 dark:text-brass-400" aria-hidden="true" />
                    <p className="font-display text-2xl font-medium text-ink-700 dark:text-paper-50">{stats.totalBooks}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-ink-300 dark:text-paper-400/70">Total Books</p>
                  </div>
                  <div className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-5 text-center shadow-card">
                    <FiBookOpen className="mx-auto mb-2 text-xl text-moss-600 dark:text-brass-400" aria-hidden="true" />
                    <p className="font-display text-2xl font-medium text-ink-700 dark:text-paper-50">{stats.activeBooks}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-ink-300 dark:text-paper-400/70">Active Listings</p>
                  </div>
                  <div className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-5 text-center shadow-card">
                    <FiRepeat className="mx-auto mb-2 text-xl text-moss-600 dark:text-brass-400" aria-hidden="true" />
                    <p className="font-display text-2xl font-medium text-ink-700 dark:text-paper-50">{stats.exchangedBooks}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-ink-300 dark:text-paper-400/70">Exchanged</p>
                  </div>
                </div>
              )}

              <h2 className="mb-5 mt-10 font-display text-xl font-medium text-ink-700 dark:text-paper-50">
                Books listed by {user.name}
              </h2>

              {books.filter((b) => !b.isDeleted).length === 0 ? (
                <EmptyState title="No active books" description="This member hasn't got any active listings right now." />
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {books
                    .filter((b) => !b.isDeleted)
                    .map((book, i) => (
                      <BookCard key={book._id} book={book} index={i} />
                    ))}
                </div>
              )}
            </>
          )
        )}
      </section>
    </PageTransition>
  );
}
