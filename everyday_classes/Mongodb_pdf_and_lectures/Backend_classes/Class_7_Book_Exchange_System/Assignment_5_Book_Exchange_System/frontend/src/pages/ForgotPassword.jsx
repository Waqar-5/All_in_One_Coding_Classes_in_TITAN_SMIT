import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSend, FiMail, FiArrowLeft } from "react-icons/fi";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email.");
      return;
    }
    setError("");

    setSubmitting(true);
    try {
      const result = await forgotPassword(email);
      toast.success(result.message);
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Couldn't send the reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-moss-600 text-paper-50">
            <FiMail className="text-xl" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-medium text-ink-700 dark:text-paper-50">Reset your password</h1>
          <p className="mt-1.5 text-sm text-ink-400 dark:text-paper-300">
            We'll email you a link to get back into your account.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 text-center shadow-card">
            <p className="text-sm text-ink-600 dark:text-paper-200">
              If an account exists for <span className="font-semibold">{email}</span>, a reset link is on its way.
              Check your inbox (and spam folder) — the link expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
          >
            <FormInput
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />

            <Button type="submit" variant="primary" icon={FiSend} loading={submitting} className="w-full">
              Send reset link
            </Button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-moss-600 dark:text-brass-400 hover:underline"
        >
          <FiArrowLeft aria-hidden="true" /> Back to log in
        </Link>
      </section>
    </PageTransition>
  );
}
