import { FiShieldOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import PageTransition from "./PageTransition";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === "Admin" ? (
        children
      ) : (
        <PageTransition>
          <section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-50 dark:bg-clay-500/10 text-clay-500">
              <FiShieldOff className="text-2xl" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-medium text-ink-700 dark:text-paper-50">
              Admins only
            </h1>
            <p className="mt-2 max-w-xs text-sm text-ink-400 dark:text-paper-300">
              Your account doesn't have access to this page.
            </p>
          </section>
        </PageTransition>
      )}
    </ProtectedRoute>
  );
}
