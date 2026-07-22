import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 dark:border-paper-400/20
          text-ink-500 dark:text-paper-200 transition-colors hover:border-moss-500 hover:text-moss-600
          disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-500"
      >
        <FiChevronLeft />
      </button>

      <span className="mx-2 font-mono text-xs text-ink-400 dark:text-paper-300">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 dark:border-paper-400/20
          text-ink-500 dark:text-paper-200 transition-colors hover:border-moss-500 hover:text-moss-600
          disabled:opacity-40 disabled:hover:border-ink-200 disabled:hover:text-ink-500"
      >
        <FiChevronRight />
      </button>
    </nav>
  );
}
