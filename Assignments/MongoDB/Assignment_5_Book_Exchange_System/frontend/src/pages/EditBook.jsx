import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PageTransition from "../components/PageTransition";
import { getBookById, updateBook } from "../api/books";
import { validateBookForm, CATEGORY_OPTIONS, STATUS_OPTIONS } from "../utils/validators";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookById(id);
      setForm({
        title: data.title || "",
        author: data.author || "",
        category: data.category || CATEGORY_OPTIONS[0],
        owner: data.owner || "",
        status: data.status || "Available",
      });
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

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateBookForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      await updateBook(id, form);
      toast.success("Book updated.");
      navigate(`/books/${id}`);
    } catch (err) {
      toast.error(err.message || "Couldn't update the book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-2xl px-5 py-14">
        <Link
          to={`/books/${id}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-moss-600 dark:text-paper-300 dark:hover:text-brass-400"
        >
          <FiArrowLeft aria-hidden="true" /> Back to details
        </Link>

        <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">Editing entry</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">Update this book</h1>

        {loading ? (
          <LoadingSpinner label="Loading the entry…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchBook} />
        ) : (
          form && (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-10 space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
            >
              <FormInput
                id="title"
                label="Title"
                value={form.title}
                onChange={handleChange("title")}
                error={errors.title}
              />
              <FormInput
                id="author"
                label="Author"
                value={form.author}
                onChange={handleChange("author")}
                error={errors.author}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  id="category"
                  label="Category"
                  as="select"
                  options={CATEGORY_OPTIONS}
                  value={form.category}
                  onChange={handleChange("category")}
                  error={errors.category}
                />
                <FormInput
                  id="status"
                  label="Status"
                  as="select"
                  options={STATUS_OPTIONS}
                  value={form.status}
                  onChange={handleChange("status")}
                  error={errors.status}
                />
              </div>

              <FormInput
                id="owner"
                label="Owner"
                value={form.owner}
                onChange={handleChange("owner")}
                error={errors.owner}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => navigate(`/books/${id}`)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" icon={FiCheck} loading={submitting}>
                  Save changes
                </Button>
              </div>
            </form>
          )
        )}
      </section>
    </PageTransition>
  );
}
