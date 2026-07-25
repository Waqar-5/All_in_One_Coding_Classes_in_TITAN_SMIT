import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiUser,
  FiTag,
  FiCalendar,
  FiMapPin,
  FiBook,
  FiEye,
  FiRepeat,
  FiHeart,
} from "react-icons/fi";
import { getBookById, deleteBook } from "../api/books";
import { requestExchange } from "../api/exchange";
import { getImageUrl } from "../utils/image";
import StatusBadge from "../components/StatusBadge";
import Tag from "../components/Tag";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ConfirmModal from "../components/ConfirmModal";
import ExchangeModal from "../components/ExchangeModal";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import { useFavorites } from "../context/FavoritesContext";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();
  const { isFavorite, toggle } = useFavorites();

  const [book, setBook] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookById(id);
      setBook(data);
      setImageFailed(false);
    } catch (err) {
      setError(err.message || "This book couldn't be found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOwner = isAuthenticated && book && typeof book.owner === "object" && book.owner?._id === user?._id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(id);
      toast.success("Book removed from the catalog.");
      navigate("/my-books");
    } catch (err) {
      toast.error(err.message || "Couldn't delete the book.");
      setDeleting(false);
      setModalOpen(false);
    }
  };

  const handleExchangeRequest = async (message) => {
    setRequesting(true);
    try {
      await requestExchange(id, message);
      toast.success("Request sent to the owner!");
      setExchangeOpen(false);
      fetchBook();
    } catch (err) {
      toast.error(err.message || "Couldn't send the request.");
    } finally {
      setRequesting(false);
    }
  };

  const handleRequestClick = () => {
    if (!isAuthenticated) {
      openLogin(() => setExchangeOpen(true));
      return;
    }
    setExchangeOpen(true);
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-5 py-14">
        <Link
          to="/books"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-moss-600 dark:text-paper-300 dark:hover:text-brass-400"
        >
          <FiArrowLeft aria-hidden="true" /> Back to shelves
        </Link>

        {loading ? (
          <LoadingSpinner label="Fetching this title…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchBook} />
        ) : (
          book && (
            <div className="overflow-hidden rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 shadow-card-hover">
              <div className="group relative h-72 w-full overflow-hidden bg-paper-100 dark:bg-ink-800 sm:h-96">
                {getImageUrl(book.coverImage) && !imageFailed ? (
                  <img
                    src={getImageUrl(book.coverImage)}
                    alt={`${book.title} cover`}
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-200 dark:text-paper-400/30">
                    <FiBook className="text-6xl" aria-hidden="true" />
                  </div>
                )}
              </div>

              <div className="border-b border-dashed border-ink-100 dark:border-paper-400/10 p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
                    Catalog No. {String(book._id).slice(-6).toUpperCase()}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggle(book._id)}
                      aria-label={isFavorite(book._id) ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={isFavorite(book._id)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 dark:border-paper-400/20 text-ink-500 dark:text-paper-200 transition-colors hover:border-brass-400"
                    >
                      <FiHeart
                        className="text-base"
                        fill={isFavorite(book._id) ? "currentColor" : "none"}
                        color={isFavorite(book._id) ? "#B8863B" : "currentColor"}
                        aria-hidden="true"
                      />
                    </button>
                    <StatusBadge status={book.status} />
                  </div>
                </div>
                <h1 className="mt-5 font-display text-4xl font-medium leading-tight text-ink-700 dark:text-paper-50">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg italic text-ink-400 dark:text-paper-300">by {book.author}</p>

                {book.description && (
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-paper-200">
                    {book.description}
                  </p>
                )}

                {book.tags?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-6 p-8 sm:grid-cols-3 sm:p-10">
                <DetailItem icon={FiTag} label="Category" value={book.category} />
                <DetailItem icon={FiBook} label="Condition" value={book.condition} />
                {book.location && <DetailItem icon={FiMapPin} label="Location" value={book.location} />}
                {book.publisher && <DetailItem icon={FiBook} label="Publisher" value={book.publisher} />}
                {book.publishedYear && <DetailItem icon={FiCalendar} label="Published" value={book.publishedYear} />}
                {book.isbn && <DetailItem icon={FiTag} label="ISBN" value={book.isbn} />}
                <DetailItem icon={FiCalendar} label="Catalogued" value={formatDate(book.createdAt)} />
                <DetailItem icon={FiEye} label="Views" value={book.views ?? 0} />
              </div>

              {typeof book.owner === "object" && book.owner && (
                <div className="mx-8 mb-8 flex items-center gap-3 rounded-xl border border-ink-100 dark:border-paper-400/10 bg-paper-100/50 dark:bg-paper-400/5 p-4 sm:mx-10 sm:mb-10">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-moss-50 dark:bg-moss-500/10 font-display text-sm font-semibold text-moss-600 dark:text-brass-400">
                    {book.owner.name?.charAt(0)?.toUpperCase() || <FiUser />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-700 dark:text-paper-100">{book.owner.name}</p>
                    <p className="truncate text-xs text-ink-400 dark:text-paper-300">
                      {book.owner.city || "Location not shared"}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-dashed border-ink-100 dark:border-paper-400/10 p-8 sm:flex-row sm:justify-end sm:p-10">
                {isOwner ? (
                  <>
                    <Button variant="outline" icon={FiEdit3} onClick={() => navigate(`/edit/${book._id}`)}>
                      Edit details
                    </Button>
                    <Button variant="danger" icon={FiTrash2} onClick={() => setModalOpen(true)}>
                      Delete book
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    icon={FiRepeat}
                    onClick={handleRequestClick}
                    disabled={book.status !== "Available"}
                  >
                    {book.status === "Available" ? "Request exchange" : `Currently ${book.status.toLowerCase()}`}
                  </Button>
                )}
              </div>
            </div>
          )
        )}

        <ConfirmModal
          open={modalOpen}
          title="Remove this book?"
          description={`"${book?.title}" will be permanently removed from the catalog. This can't be undone.`}
          confirmLabel="Delete book"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setModalOpen(false)}
        />

        <ExchangeModal
          open={exchangeOpen}
          bookTitle={book?.title}
          loading={requesting}
          onSubmit={handleExchangeRequest}
          onCancel={() => setExchangeOpen(false)}
        />
      </section>
    </PageTransition>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
        <Icon aria-hidden="true" /> {label}
      </p>
      <p className="mt-1.5 font-body text-base font-medium text-ink-700 dark:text-paper-100">{value}</p>
    </div>
  );
}
