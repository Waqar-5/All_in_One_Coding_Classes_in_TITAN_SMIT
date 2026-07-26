import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import FormInput from "../components/FormInput";
import ImageUpload from "../components/ImageUpload";
import PdfUpload from "../components/PdfUpload";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { createBook } from "../api/books";
import { buildBookFormData } from "../utils/buildBookFormData";
import { validateBookForm, CATEGORY_OPTIONS, CONDITION_OPTIONS, STATUS_OPTIONS } from "../utils/validators";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  author: "",
  category: CATEGORY_OPTIONS[0],
  description: "",
  condition: "Good",
  status: "Available",
  language: "English",
  publisher: "",
  publishedYear: "",
  isbn: "",
  location: "",
  tags: "",
  readLink: "",
};

export default function AddBook() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleImageSelect = (file) => {
    setImageFile(file);
    if (errors.image) setErrors((er) => ({ ...er, image: undefined }));
  };

  const handlePdfSelect = (file) => {
    setPdfFile(file);
    if (errors.pdf) setErrors((er) => ({ ...er, pdf: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateBookForm(form);
    if (!imageFile) {
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
      const formData = buildBookFormData(form, imageFile, { pdfFile });
      await createBook(formData, setProgress);
      toast.success("Book added to the catalog!");
      navigate("/my-books");
    } catch (err) {
      toast.error(err.message || "Couldn't add the book. Please try again.");
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-2xl px-5 py-14">
        <Link
          to="/books"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-moss-600 dark:text-paper-300 dark:hover:text-brass-400"
        >
          <FiArrowLeft aria-hidden="true" /> Back to shelves
        </Link>

        <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">New entry</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">List a book</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-400 dark:text-paper-300">
          Add a title to the community catalog so other readers can find it. It'll be listed under your account.
        </p>
        {user?.bookLimit !== null && user?.bookLimit !== undefined && (
          <p className="mt-2 max-w-md text-xs font-medium text-brass-600 dark:text-brass-400">
            Your account can list up to {user.bookLimit} book{user.bookLimit === 1 ? "" : "s"}.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
        >
          <ImageUpload
            file={imageFile}
            onFileSelect={handleImageSelect}
            error={errors.image}
            progress={progress}
          />

          <PdfUpload
            file={pdfFile}
            onFileSelect={handlePdfSelect}
            error={errors.pdf}
          />

          <FormInput
            id="title"
            label="Title"
            placeholder="e.g. The Night Circus"
            value={form.title}
            onChange={handleChange("title")}
            error={errors.title}
          />
          <FormInput
            id="author"
            label="Author"
            placeholder="e.g. Erin Morgenstern"
            value={form.author}
            onChange={handleChange("author")}
            error={errors.author}
          />

          <FormInput
            id="description"
            label="Description"
            as="textarea"
            placeholder="A short note about the book — condition details, why you loved it, anything a swapper should know."
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

          <div className="grid gap-5 sm:grid-cols-2">
            <FormInput
              id="owner"
              label="Owner"
              value={user?.name || ""}
              readOnly
              disabled
              hint="Set from your account — you're always the owner of what you list."
            />
            <FormInput
              id="status"
              label="Status"
              as="select"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={handleChange("status")}
              hint="New listings are usually Available."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormInput
              id="publisher"
              label="Publisher"
              placeholder="Optional"
              value={form.publisher}
              onChange={handleChange("publisher")}
            />
            <FormInput
              id="publishedYear"
              label="Published year"
              type="number"
              placeholder="Optional"
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
              placeholder="Optional"
              value={form.isbn}
              onChange={handleChange("isbn")}
            />
          </div>

          <FormInput
            id="location"
            label="Your city / area"
            placeholder="e.g. Sukkur"
            value={form.location}
            onChange={handleChange("location")}
          />

          <FormInput
            id="tags"
            label="Tags"
            placeholder="comma, separated, keywords"
            value={form.tags}
            onChange={handleChange("tags")}
            hint="Helps other readers find this book when searching."
          />

          <FormInput
            id="readLink"
            label="Read online link"
            type="url"
            placeholder="https://example.com/read-this-book (optional)"
            value={form.readLink}
            onChange={handleChange("readLink")}
            hint="A link where readers can preview or read the book online."
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(initialForm);
                setImageFile(null);
                setPdfFile(null);
              }}
              disabled={submitting}
            >
              Reset
            </Button>
            <Button type="submit" variant="primary" icon={FiCheck} loading={submitting}>
              Add to catalog
            </Button>
          </div>
        </form>
      </section>
    </PageTransition>
  );
}
