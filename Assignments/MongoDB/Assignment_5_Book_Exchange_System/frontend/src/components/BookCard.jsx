import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiUser, FiTag } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { formatDueStamp } from "../utils/formatDate";

// Signature element: each book renders as a library catalog card —
// shelf-mark number, dog-eared corner, and a stamped "date added" mark.
export default function BookCard({ book, index = 0 }) {
  const shelfMark = String(book._id || "").slice(-4).toUpperCase() || String(index + 1).padStart(4, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04, ease: "easeOut" }}
    >
      <Link
        to={`/books/${book._id}`}
        className="dog-ear group relative block h-full rounded-2xl border border-ink-100 dark:border-paper-400/10
          bg-paper-50 dark:bg-ink-700/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-widest text-ink-300 dark:text-paper-400/70">
            NO. {shelfMark}
          </span>
          <StatusBadge status={book.status} />
        </div>

        <h3 className="font-display text-xl font-medium leading-snug text-ink-700 dark:text-paper-50 line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-1 font-body text-sm italic text-ink-400 dark:text-paper-300">by {book.author}</p>

        <div className="catalog-rule my-4 text-ink-300 dark:text-paper-400" />

        <div className="flex flex-col gap-2 text-sm text-ink-500 dark:text-paper-200">
          <span className="inline-flex items-center gap-2">
            <FiTag className="text-moss-500 dark:text-brass-400" aria-hidden="true" />
            {book.category}
          </span>
          <span className="inline-flex items-center gap-2">
            <FiUser className="text-moss-500 dark:text-brass-400" aria-hidden="true" />
            {book.owner}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-dashed border-ink-100 dark:border-paper-400/10 pt-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-300 dark:text-paper-400/60">
            Catalogued
          </span>
          <span className="font-mono text-[11px] font-medium text-ink-400 dark:text-paper-300">
            {formatDueStamp(book.createdAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
