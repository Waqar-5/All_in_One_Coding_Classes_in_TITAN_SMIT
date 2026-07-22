import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import FormInput from "../components/FormInput";
import ImageUpload from "../components/ImageUpload";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PageTransition from "../components/PageTransition";
import { getBookById, updateBook } from "../api/books";
import { buildBookFormData } from "../utils/buildBookFormData";
import { getImageUrl } from "../utils/image";
import {
  validateBookForm,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  STATUS_OPTIONS,
  tagsToString,
} from "../utils/validators";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(null);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookById(id);
      setForm({
        title: data.title || "",
        author: data.author || "",
        category: data.category || CATEGORY_OPTIONS[0],
        description: data.description || "",
        condition: data.condition || "Good",
        language: data.language || "English",
        publisher: data.publisher || "",
        publishedYear: data.publishedYear || "",
        isbn: data.isbn || "",
        status: data.status || "Available",
        location: data.location || "",
        tags: tagsToString(data.tags),
      });
      setExistingImageUrl(getImageUrl(data.coverImage));
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

  const handleImageSelect = (file) => {
    setImageFile(file);
    setImageRemoved(false);
    if (errors.image) setErrors((er) => ({ ...er, image: undefined }));
  };

  const handleRemoveExisting = () => {
    setExistingImageUrl(null);
    setImageRemoved(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateBookForm(form);
    if (!imageFile && !existingImageUrl) {
      validationErrors.image = "A book cover image is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setProgress(0);
    try {
      const formData = buildBookFormData(form, imageFile, { removeImage: imageRemoved });
      await updateBook(id, formData, setProgress);
      toast.success("Book updated.");
      navigate(`/books/${id}`);
    } catch (err) {
      toast.error(err.message || "Couldn't update the book.");
    } finally {
      setSubmitting(false);
      setProgress(null);
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
              <ImageUpload
                file={imageFile}
                existingImageUrl={existingImageUrl}
                onFileSelect={handleImageSelect}
                onRemoveExisting={handleRemoveExisting}
                error={errors.image}
                progress={progress}
              />

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

              <FormInput
                id="description"
                label="Description"
                as="textarea"
                value={form.description}
                onChange={handleChange("description")}
                error={errors.description}
                hint={`${form.description.length}/1000`}
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
                  id="condition"
                  label="Condition"
                  as="select"
                  options={CONDITION_OPTIONS}
                  value={form.condition}
                  onChange={handleChange("condition")}
                />
              </div>

              <FormInput
                id="status"
                label="Status"
                as="select"
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={handleChange("status")}
                hint="Update manually if you've arranged a swap outside a request."
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  id="publisher"
                  label="Publisher"
                  value={form.publisher}
                  onChange={handleChange("publisher")}
                />
                <FormInput
                  id="publishedYear"
                  label="Published year"
                  type="number"
                  value={form.publishedYear}
                  onChange={handleChange("publishedYear")}
                  error={errors.publishedYear}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                  id="language"
                  label="Language"
                  value={form.language}
                  onChange={handleChange("language")}
                />
                <FormInput
                  id="isbn"
                  label="ISBN"
                  value={form.isbn}
                  onChange={handleChange("isbn")}
                />
              </div>

              <FormInput
                id="location"
                label="Your city / area"
                value={form.location}
                onChange={handleChange("location")}
              />

              <FormInput
                id="tags"
                label="Tags"
                placeholder="comma, separated, keywords"
                value={form.tags}
                onChange={handleChange("tags")}
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
