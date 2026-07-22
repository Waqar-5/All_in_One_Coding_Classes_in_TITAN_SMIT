import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiEdit3, FiTrash2, FiUser, FiTag, FiCalendar } from "react-icons/fi";
import { getBookById, deleteBook } from "../api/books";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { formatDate } from "../utils/formatDate";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookById(id);
      setBook(data);
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBook(id);
      toast.success("Book removed from the catalog.");
      navigate("/books");
    } catch (err) {
      toast.error(err.message || "Couldn't delete the book.");
      setDeleting(false);
      setModalOpen(false);
    }
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
              <div className="border-b border-dashed border-ink-100 dark:border-paper-400/10 p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
                    Catalog No. {String(book._id).slice(-6).toUpperCase()}
                  </span>
                  <StatusBadge status={book.status} />
                </div>
                <h1 className="mt-5 font-display text-4xl font-medium leading-tight text-ink-700 dark:text-paper-50">
                  {book.title}
                </h1>
                <p className="mt-2 text-lg italic text-ink-400 dark:text-paper-300">by {book.author}</p>
              </div>

              <div className="grid gap-6 p-8 sm:grid-cols-3 sm:p-10">
                <DetailItem icon={FiTag} label="Category" value={book.category} />
                <DetailItem icon={FiUser} label="Owner" value={book.owner} />
                <DetailItem icon={FiCalendar} label="Catalogued" value={formatDate(book.createdAt)} />
              </div>

              <div className="flex flex-col gap-3 border-t border-dashed border-ink-100 dark:border-paper-400/10 p-8 sm:flex-row sm:justify-end sm:p-10">
                <Button
                  variant="outline"
                  icon={FiEdit3}
                  onClick={() => navigate(`/edit/${book._id}`)}
                >
                  Edit details
                </Button>
                <Button variant="danger" icon={FiTrash2} onClick={() => setModalOpen(true)}>
                  Delete book
                </Button>
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
