import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLogIn, FiBookOpen } from "react-icons/fi";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm } from "../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      navigate(user.role === "Admin" ? "/admin" : location.state?.from || "/");
    } catch (err) {
      toast.error(err.message || "Couldn't log you in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-moss-600 text-paper-50">
            <FiBookOpen className="text-xl" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-medium text-ink-700 dark:text-paper-50">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-400 dark:text-paper-300">
            Log in to your library card to keep trading books.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300 dark:text-paper-400/60">
            Member Sign-In
          </p>

          <FormInput
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
          />
          <Link
            to="/forgot-password"
            className="-mt-3 inline-block text-xs font-semibold text-moss-600 dark:text-brass-400 hover:underline"
          >
            Forgot password?
          </Link>

          <Button type="submit" variant="primary" icon={FiLogIn} loading={submitting} className="w-full">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400 dark:text-paper-300">
          New to Chapter &amp; Verse?{" "}
          <Link to="/register" className="font-semibold text-moss-600 dark:text-brass-400 hover:underline">
            Create a library card
          </Link>
        </p>
      </section>
    </PageTransition>
  );
}
