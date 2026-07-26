import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLock, FiKey } from "react-icons/fi";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!form.newPassword) validationErrors.newPassword = "Required.";
    else if (form.newPassword.length < 6) validationErrors.newPassword = "Must be at least 6 characters.";
    if (form.confirmPassword !== form.newPassword) validationErrors.confirmPassword = "Passwords don't match.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await resetPassword(token, form.newPassword);
      toast.success(result.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "This reset link is invalid or has expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brass-500 text-ink-800">
            <FiKey className="text-xl" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-medium text-ink-700 dark:text-paper-50">Choose a new password</h1>
          <p className="mt-1.5 text-sm text-ink-400 dark:text-paper-300">
            Make it something you haven't used before.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
        >
          <FormInput
            id="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.newPassword}
            onChange={handleChange("newPassword")}
            error={errors.newPassword}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" icon={FiLock} loading={submitting} className="w-full">
            Reset password
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400 dark:text-paper-300">
          Remembered it after all?{" "}
          <Link to="/login" className="font-semibold text-moss-600 dark:text-brass-400 hover:underline">
            Log in
          </Link>
        </p>
      </section>
    </PageTransition>
  );
}
