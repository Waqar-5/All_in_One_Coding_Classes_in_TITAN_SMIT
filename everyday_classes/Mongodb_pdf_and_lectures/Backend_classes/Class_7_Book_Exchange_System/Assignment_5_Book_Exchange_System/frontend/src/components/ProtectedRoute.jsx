import { FiLock, FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";
import Button from "./Button";
import PageTransition from "./PageTransition";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-50 dark:bg-moss-500/10 text-moss-600 dark:text-brass-400">
            <FiLock className="text-2xl" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-medium text-ink-700 dark:text-paper-50">
            You need a library card for this
          </h1>
          <p className="mt-2 max-w-xs text-sm text-ink-400 dark:text-paper-300">
            Log in or create a free account to continue.
          </p>
          <Button variant="primary" icon={FiLogIn} className="mt-6" onClick={() => openLogin()}>
            Log in / Sign up
          </Button>
        </section>
      </PageTransition>
    );
  }

  return children;
}
