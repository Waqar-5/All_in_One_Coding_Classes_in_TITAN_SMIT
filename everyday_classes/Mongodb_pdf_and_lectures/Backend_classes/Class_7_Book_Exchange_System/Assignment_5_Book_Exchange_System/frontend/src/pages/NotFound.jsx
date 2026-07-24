import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import PageTransition from "../components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <section className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center">
        <p className="font-display text-7xl font-medium text-moss-600 dark:text-brass-400">404</p>
        <h1 className="mt-4 font-display text-2xl font-medium text-ink-700 dark:text-paper-50">
          This shelf doesn&apos;t exist
        </h1>
        <p className="mt-2 text-sm text-ink-400 dark:text-paper-300">
          The page you're looking for was never catalogued, or has since been removed.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-moss-600 px-6 py-3 text-sm font-semibold text-paper-50 shadow-card hover:bg-moss-700"
        >
          <FiArrowLeft aria-hidden="true" /> Back home
        </Link>
      </section>
    </PageTransition>
  );
}
