import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiRotateCcw,
  FiTrash2,
  FiShield,
  FiUserX,
  FiUserCheck,
  FiSearch,
} from "react-icons/fi";
import {
  getAllBooksAdmin,
  restoreBook,
  permanentlyDeleteBook,
  getAllUsers,
  updateUserRole,
  toggleUserDeleted,
} from "../api/admin";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import PageTransition from "../components/PageTransition";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "books", label: "Manage Books" },
  { key: "users", label: "Manage Users" },
];

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [tab, setTab] = useState("books");

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-500">Admin only</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">Control room</h1>
        <p className="mt-2 text-sm text-ink-400 dark:text-paper-300">
          Moderate listings and manage member accounts.
        </p>

        <div className="mb-8 mt-8 flex flex-wrap gap-2 border-b border-ink-100 dark:border-paper-400/10 pb-px">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative -mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "border-moss-600 text-moss-600 dark:border-brass-400 dark:text-brass-400"
                  : "border-transparent text-ink-400 hover:text-moss-600 dark:text-paper-300 dark:hover:text-brass-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "books" ? <BooksTab /> : <UsersTab currentUser={currentUser} />}
      </section>
    </PageTransition>
  );
}

// ======================================================
// Books Tab
// ======================================================

function BooksTab() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [actingId, setActingId] = useState(null);

  const fetchBooks = useCallback(async (targetPage = 1, searchTerm = search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBooksAdmin({ page: targetPage, search: searchTerm });
      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || targetPage);
    } catch (err) {
      setError(err.message || "Couldn't load books.");
    } finally {
      setLoading(false);
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchBooks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(1, search);
  };

  const handleRestore = async (id) => {
    setActingId(id);
    try {
      await restoreBook(id);
      toast.success("Book restored.");
      fetchBooks(page);
    } catch (err) {
      toast.error(err.message || "Couldn't restore the book.");
    } finally {
      setActingId(null);
    }
  };

  const handlePermanentDelete = async () => {
    setActingId(pendingDelete);
    try {
      await permanentlyDeleteBook(pendingDelete);
      toast.success("Book permanently deleted.");
      setPendingDelete(null);
      fetchBooks(page);
    } catch (err) {
      toast.error(err.message || "Couldn't delete the book.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="mb-6 flex max-w-sm items-center gap-2">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 dark:text-paper-400/70" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, author, ISBN…"
            className="w-full rounded-full border border-ink-200 dark:border-paper-400/20 bg-paper-50 dark:bg-ink-700/60
              py-2.5 pl-10 pr-4 text-sm text-ink-700 dark:text-paper-100 outline-none focus:border-moss-500"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">Search</Button>
      </form>

      {loading ? (
        <LoadingSpinner label="Loading books…" />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchBooks(page)} />
      ) : books.length === 0 ? (
        <EmptyState title="No books found" description="Try a different search term." />
      ) : (
        <>
          <div className="divide-y divide-dashed divide-ink-100 dark:divide-paper-400/10 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40">
            {books.map((book) => (
              <div key={book._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/books/${book._id}`} className="font-display text-lg font-medium text-ink-700 hover:text-moss-600 dark:text-paper-50 dark:hover:text-brass-400">
                      {book.title}
                    </Link>
                    {book.isDeleted && (
                      <span className="rounded-full bg-clay-50 dark:bg-clay-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-clay-500">
                        Deleted
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-400 dark:text-paper-300">
                    by {book.author} · Owner: {book.owner?.name || "Unknown"} · {formatDate(book.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={book.status} />
                  {book.isDeleted ? (
                    <Button size="sm" variant="outline" icon={FiRotateCcw} loading={actingId === book._id} onClick={() => handleRestore(book._id)}>
                      Restore
                    </Button>
                  ) : (
                    <Button size="sm" variant="danger" icon={FiTrash2} onClick={() => setPendingDelete(book._id)}>
                      Delete forever
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchBooks(p)} />
        </>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="Permanently delete this book?"
        description="This removes it from the database entirely, including its cover image. This can't be undone."
        confirmLabel="Delete forever"
        loading={!!actingId}
        onConfirm={handlePermanentDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

// ======================================================
// Users Tab
// ======================================================

function UsersTab({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  const fetchUsers = useCallback(async (targetPage = 1, searchTerm = search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers({ page: targetPage, search: searchTerm });
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || targetPage);
    } catch (err) {
      setError(err.message || "Couldn't load users.");
    } finally {
      setLoading(false);
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handleRoleToggle = async (targetUser) => {
    const nextRole = targetUser.role === "Admin" ? "User" : "Admin";
    setActingId(targetUser._id);
    try {
      const result = await updateUserRole(targetUser._id, nextRole);
      toast.success(result.message);
      fetchUsers(page);
    } catch (err) {
      toast.error(err.message || "Couldn't update role.");
    } finally {
      setActingId(null);
    }
  };

  const handleDeleteToggle = async (targetUser) => {
    setActingId(targetUser._id);
    try {
      const result = await toggleUserDeleted(targetUser._id);
      toast.success(result.message);
      fetchUsers(page);
    } catch (err) {
      toast.error(err.message || "Couldn't update this user.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="mb-6 flex max-w-sm items-center gap-2">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 dark:text-paper-400/70" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="w-full rounded-full border border-ink-200 dark:border-paper-400/20 bg-paper-50 dark:bg-ink-700/60
              py-2.5 pl-10 pr-4 text-sm text-ink-700 dark:text-paper-100 outline-none focus:border-moss-500"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">Search</Button>
      </form>

      {loading ? (
        <LoadingSpinner label="Loading users…" />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchUsers(page)} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <>
          <div className="divide-y divide-dashed divide-ink-100 dark:divide-paper-400/10 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40">
            {users.map((u) => {
              const isSelf = u._id === currentUser?._id;
              return (
                <div key={u._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-lg font-medium text-ink-700 dark:text-paper-50">
                        {u.name} {isSelf && <span className="text-xs font-normal text-ink-300 dark:text-paper-400/60">(you)</span>}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          u.role === "Admin"
                            ? "bg-brass-50 dark:bg-brass-500/10 text-brass-600 dark:text-brass-400"
                            : "bg-paper-100 dark:bg-paper-400/10 text-ink-400 dark:text-paper-300"
                        }`}
                      >
                        {u.role}
                      </span>
                      {u.isDeleted && (
                        <span className="rounded-full bg-clay-50 dark:bg-clay-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-clay-500">
                          Deactivated
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-ink-400 dark:text-paper-300">
                      {u.email} · Member since {formatDate(u.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={FiShield}
                      loading={actingId === u._id}
                      disabled={isSelf}
                      onClick={() => handleRoleToggle(u)}
                    >
                      {u.role === "Admin" ? "Demote" : "Promote"}
                    </Button>
                    <Button
                      size="sm"
                      variant={u.isDeleted ? "outline" : "danger"}
                      icon={u.isDeleted ? FiUserCheck : FiUserX}
                      loading={actingId === u._id}
                      disabled={isSelf}
                      onClick={() => handleDeleteToggle(u)}
                    >
                      {u.isDeleted ? "Restore" : "Deactivate"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => fetchUsers(p)} />
        </>
      )}
    </div>
  );
}
