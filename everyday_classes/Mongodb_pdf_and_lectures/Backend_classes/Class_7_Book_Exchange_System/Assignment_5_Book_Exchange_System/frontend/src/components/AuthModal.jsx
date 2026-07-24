import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiX, FiLogIn, FiUserPlus, FiBookOpen } from "react-icons/fi";
import FormInput from "./FormInput";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import { validateLoginForm, validateRegisterForm } from "../utils/validators";

const emptyLogin = { email: "", password: "" };
const emptyRegister = { name: "", email: "", password: "" };

export default function AuthModal() {
  const { open, mode, onSuccess, close, openLogin, openRegister } = useAuthModal();
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setLoginForm(emptyLogin);
    setRegisterForm(emptyRegister);
    const onKeyDown = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  if (!open) return null;

  const isLogin = mode === "login";

  const handleLoginChange = (field) => (e) => {
    setLoginForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleRegisterChange = (field) => (e) => {
    setRegisterForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = isLogin ? validateLoginForm(loginForm) : validateRegisterForm(registerForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const user = isLogin ? await login(loginForm) : await register(registerForm);
      toast.success(isLogin ? `Welcome back, ${user.name.split(" ")[0]}.` : `Welcome to Chapter & Verse, ${user.name.split(" ")[0]}!`);
      close();
      onSuccess?.(user);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      >
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="w-full max-w-sm rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700 p-7 shadow-card-hover outline-none"
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss-600 text-paper-50">
              <FiBookOpen className="text-lg" aria-hidden="true" />
            </span>
            <button
              onClick={close}
              aria-label="Close dialog"
              className="rounded-full p-1.5 text-ink-300 hover:bg-ink-50 dark:hover:bg-paper-400/10 dark:text-paper-400"
            >
              <FiX />
            </button>
          </div>

          <h2 id="auth-modal-title" className="mt-4 font-display text-2xl font-medium text-ink-700 dark:text-paper-50">
            {isLogin ? "Welcome back" : "Get your library card"}
          </h2>
          <p className="mt-1 text-sm text-ink-400 dark:text-paper-300">
            {isLogin ? "Log in to keep trading books." : "Join the catalog and start trading."}
          </p>

          {/* Tabs */}
          <div className="mt-5 flex gap-1 rounded-full bg-paper-100/70 dark:bg-paper-400/5 p-1">
            <button
              onClick={() => openLogin(onSuccess)}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                isLogin ? "bg-paper-50 dark:bg-ink-700 text-moss-600 dark:text-brass-400 shadow-card" : "text-ink-400 dark:text-paper-300"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => openRegister(onSuccess)}
              className={`flex-1 rounded-full py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                !isLogin ? "bg-paper-50 dark:bg-ink-700 text-moss-600 dark:text-brass-400 shadow-card" : "text-ink-400 dark:text-paper-300"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
            {isLogin ? (
              <>
                <FormInput
                  id="modal-email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  onChange={handleLoginChange("email")}
                  error={errors.email}
                />
                <FormInput
                  id="modal-password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={handleLoginChange("password")}
                  error={errors.password}
                />
              </>
            ) : (
              <>
                <FormInput
                  id="modal-name"
                  label="Full name"
                  autoComplete="name"
                  placeholder="Jordan Reyes"
                  value={registerForm.name}
                  onChange={handleRegisterChange("name")}
                  error={errors.name}
                />
                <FormInput
                  id="modal-reg-email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={registerForm.email}
                  onChange={handleRegisterChange("email")}
                  error={errors.email}
                />
                <FormInput
                  id="modal-reg-password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={registerForm.password}
                  onChange={handleRegisterChange("password")}
                  error={errors.password}
                />
              </>
            )}

            <Button
              type="submit"
              variant={isLogin ? "primary" : "brass"}
              icon={isLogin ? FiLogIn : FiUserPlus}
              loading={submitting}
              className="w-full"
            >
              {isLogin ? "Log in" : "Create my card"}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
