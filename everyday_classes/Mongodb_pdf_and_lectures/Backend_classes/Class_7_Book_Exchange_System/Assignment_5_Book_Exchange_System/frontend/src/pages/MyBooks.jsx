import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiEdit3, FiTrash2, FiCheck, FiX, FiInbox, FiSend, FiBook } from "react-icons/fi";
import { getMyBooks, deleteBook } from "../api/books";
import { getSentRequests, getReceivedRequests, respondToExchange, cancelExchange } from "../api/exchange";
import { getImageUrl } from "../utils/image";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import PageTransition from "../components/PageTransition";
import { formatDate } from "../utils/formatDate";

const TABS = [
  { key: "listings", label: "My Listings" },
  { key: "received", label: "Requests Received" },
  { key: "sent", label: "Requests Sent" },
];

export default function MyBooks() {
  const [tab, setTab] = useState("listings");
  const [books, setBooks] = useState([]);
  const [failedImages, setFailedImages] = useState(new Set());
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actingId, setActingId] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [booksData, receivedData, sentData] = await Promise.all([
        getMyBooks(),
        getReceivedRequests(),
        getSentRequests(),
      ]);
      setBooks(booksData.books || []);
      setReceived(receivedData || []);
      setSent(sentData || []);
    } catch (err) {
      setError(err.message || "Couldn't load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(pendingDeleteId);
      toast.success("Book removed.");
      setBooks((b) => b.filter((book) => book._id !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch (err) {
      toast.error(err.message || "Couldn't delete the book.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRespond = async (id, action) => {
    setActingId(id);
    try {
      await respondToExchange(id, action);
      toast.success(action === "accept" ? "Request accepted." : "Request declined.");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Couldn't update the request.");
    } finally {
      setActingId(null);
    }
  };

  const handleCancel = async (id) => {
    setActingId(id);
    try {
      await cancelExchange(id);
      toast.success("Request cancelled.");
      fetchAll();
    } catch (err) {
      toast.error(err.message || "Couldn't cancel the request.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">Your desk</p>
            <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">My library card</h1>
          </div>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-semibold text-ink-800 shadow-card transition-all duration-200 hover:bg-brass-600 hover:shadow-card-hover"
          >
            <FiPlus aria-hidden="true" /> List a book
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-ink-100 dark:border-paper-400/10 pb-px">
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
              {t.key === "received" && received.filter((r) => r.status === "Pending").length > 0 && (
                <span className="ml-2 rounded-full bg-clay-500 px-1.5 py-0.5 text-[10px] font-bold text-paper-50">
                  {received.filter((r) => r.status === "Pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner label="Loading your dashboard…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchAll} />
        ) : tab === "listings" ? (
          books.length === 0 ? (
            <EmptyState
              title="You haven't listed anything yet"
              description="Add the books you're ready to trade — it only takes a minute."
              actionLabel="List your first book"
              actionTo="/add"
            />
          ) : (
            <div className="divide-y divide-dashed divide-ink-100 dark:divide-paper-400/10 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40">
              {books.map((book) => (
                <div key={book._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <Link
                      to={`/books/${book._id}`}
                      className="h-14 w-11 shrink-0 overflow-hidden rounded-md border border-ink-100 dark:border-paper-400/10 bg-paper-100 dark:bg-ink-800"
                    >
                      {getImageUrl(book.coverImage) && !failedImages.has(book._id) ? (
                        <img
                          src={getImageUrl(book.coverImage)}
                          alt={`${book.title} cover`}
                          loading="lazy"
                          onError={() =>
                            setFailedImages((prev) => new Set(prev).add(book._id))
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink-200 dark:text-paper-400/30">
                          <FiBook />
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0">
                      <Link to={`/books/${book._id}`} className="font-display text-lg font-medium text-ink-700 hover:text-moss-600 dark:text-paper-50 dark:hover:text-brass-400">
                        {book.title}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-400 dark:text-paper-300">
                        {book.category} · Catalogued {formatDate(book.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={book.status} />
                    <Link
                      to={`/edit/${book._id}`}
                      aria-label={`Edit ${book.title}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50 hover:text-moss-600 dark:text-paper-300 dark:hover:bg-paper-400/10"
                    >
                      <FiEdit3 />
                    </Link>
                    <button
                      aria-label={`Delete ${book.title}`}
                      onClick={() => setPendingDeleteId(book._id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 hover:bg-clay-50 hover:text-clay-500 dark:text-paper-300 dark:hover:bg-clay-500/10"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === "received" ? (
          received.length === 0 ? (
            <EmptyState title="No requests yet" description="When someone wants one of your books, it'll show up here." />
          ) : (
            <div className="space-y-3">
              {received.map((req) => (
                <div key={req._id} className="flex flex-col gap-3 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-medium text-ink-700 dark:text-paper-50">{req.book?.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-400 dark:text-paper-300">
                      <FiInbox className="shrink-0" /> Requested by {req.requester?.name}
                      {req.requester?.city ? ` · ${req.requester.city}` : ""}
                    </p>
                    {req.message && (
                      <p className="mt-2 max-w-md rounded-lg bg-paper-100/60 dark:bg-paper-400/5 px-3 py-2 text-sm text-ink-500 dark:text-paper-200">
                        “{req.message}”
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === "Pending" ? (
                      <>
                        <Button size="sm" variant="primary" icon={FiCheck} loading={actingId === req._id} onClick={() => handleRespond(req._id, "accept")}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" icon={FiX} loading={actingId === req._id} onClick={() => handleRespond(req._id, "reject")}>
                          Decline
                        </Button>
                      </>
                    ) : (
                      <StatusBadge status={req.status === "Accepted" ? "Exchanged" : "Requested"} className="opacity-80" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : sent.length === 0 ? (
          <EmptyState
            title="You haven't requested anything"
            description="Browse the shelves and request a swap for a book you'd like."
            actionLabel="Browse the shelves"
            actionTo="/books"
          />
        ) : (
          <div className="space-y-3">
            {sent.map((req) => (
              <div key={req._id} className="flex flex-col gap-3 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link to={`/books/${req.book?._id}`} className="font-display text-lg font-medium text-ink-700 hover:text-moss-600 dark:text-paper-50 dark:hover:text-brass-400">
                    {req.book?.title}
                  </Link>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-400 dark:text-paper-300">
                    <FiSend className="shrink-0" /> Sent to {req.owner?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-widest text-ink-400 dark:text-paper-300">
                    {req.status}
                  </span>
                  {req.status === "Pending" && (
                    <Button size="sm" variant="ghost" loading={actingId === req._id} onClick={() => handleCancel(req._id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmModal
          open={!!pendingDeleteId}
          title="Remove this book?"
          description="This book will be permanently removed from the catalog. This can't be undone."
          confirmLabel="Delete book"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      </section>
    </PageTransition>
  );
}
