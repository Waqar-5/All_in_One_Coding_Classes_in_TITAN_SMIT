import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { createBook } from "../api/books";
import { validateBookForm, CATEGORY_OPTIONS, STATUS_OPTIONS } from "../utils/validators";

const initialForm = {
  title: "",
  author: "",
  category: CATEGORY_OPTIONS[0],
  owner: "",
  status: "Available",
};

export default function AddBook() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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
      await createBook(form);
      toast.success("Book added to the catalog!");
      navigate("/books");
    } catch (err) {
      toast.error(err.message || "Couldn't add the book. Please try again.");
    } finally {
      setSubmitting(false);
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
          Add a title to the community catalog so other readers can find it.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
        >
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
            placeholder="Your name"
            value={form.owner}
            onChange={handleChange("owner")}
            error={errors.owner}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setForm(initialForm)} disabled={submitting}>
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
