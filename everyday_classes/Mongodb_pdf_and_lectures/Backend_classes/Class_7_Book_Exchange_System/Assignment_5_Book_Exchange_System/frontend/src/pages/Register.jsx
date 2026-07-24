import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUserPlus, FiBookOpen } from "react-icons/fi";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { validateRegisterForm } from "../utils/validators";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to Chapter & Verse, ${user.name.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brass-500 text-ink-800">
            <FiBookOpen className="text-xl" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-3xl font-medium text-ink-700 dark:text-paper-50">Get your library card</h1>
          <p className="mt-1.5 text-sm text-ink-400 dark:text-paper-300">
            Join the catalog and start trading books with your community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300 dark:text-paper-400/60">
            New Membership
          </p>

          <FormInput
            id="name"
            label="Full name"
            autoComplete="name"
            placeholder="Jordan Reyes"
            value={form.name}
            onChange={handleChange("name")}
            error={errors.name}
          />
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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
          />

          <Button type="submit" variant="brass" icon={FiUserPlus} loading={submitting} className="w-full">
            Create my card
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400 dark:text-paper-300">
          Already a member?{" "}
          <Link to="/login" className="font-semibold text-moss-600 dark:text-brass-400 hover:underline">
            Log in
          </Link>
        </p>
      </section>
    </PageTransition>
  );
}
