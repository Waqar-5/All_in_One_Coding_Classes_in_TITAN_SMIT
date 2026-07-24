import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiUser, FiTag, FiMapPin, FiBook } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import { formatDueStamp } from "../utils/formatDate";
import { getImageUrl } from "../utils/image";

// Signature element: each book renders as a library catalog card —
// cover image up top, shelf-mark number and stamped status overlaid on it,
// dog-eared corner, and a "date added" stamp at the foot of the card.
export default function BookCard({ book, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const shelfMark = String(book._id || "").slice(-4).toUpperCase() || String(index + 1).padStart(4, "0");
  const ownerName = typeof book.owner === "object" ? book.owner?.name : null;
  const imageUrl = getImageUrl(book.coverImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={`/books/${book._id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 dark:border-paper-400/10
          bg-paper-50 dark:bg-ink-700/60 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      >
        <div className="dog-ear relative h-44 w-full overflow-hidden bg-paper-100 dark:bg-ink-800">
          {imageUrl && !imageFailed ? (
            <img
              src={imageUrl}
              alt={`${book.title} cover`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-200 dark:text-paper-400/30">
              <FiBook className="text-4xl" aria-hidden="true" />
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-ink-900/60 px-2.5 py-1 font-mono text-[10px] tracking-widest text-paper-50 backdrop-blur-sm">
            NO. {shelfMark}
          </span>
          <div className="absolute right-3 top-3">
            <StatusBadge status={book.status} className="bg-paper-50/90 dark:bg-ink-800/90 backdrop-blur-sm" />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-medium leading-snug text-ink-700 dark:text-paper-50 line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-1 font-body text-sm italic text-ink-400 dark:text-paper-300">by {book.author}</p>

          <div className="catalog-rule my-4 text-ink-300 dark:text-paper-400" />

          <div className="flex flex-1 flex-col gap-2 text-sm text-ink-500 dark:text-paper-200">
            <span className="inline-flex items-center gap-2">
              <FiTag className="shrink-0 text-moss-500 dark:text-brass-400" aria-hidden="true" />
              {book.category}
              {book.condition && (
                <span className="text-ink-300 dark:text-paper-400/60">· {book.condition}</span>
              )}
            </span>
            {ownerName && (
              <span className="inline-flex items-center gap-2">
                <FiUser className="shrink-0 text-moss-500 dark:text-brass-400" aria-hidden="true" />
                {ownerName}
              </span>
            )}
            {book.location && (
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="shrink-0 text-moss-500 dark:text-brass-400" aria-hidden="true" />
                {book.location}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-dashed border-ink-100 dark:border-paper-400/10 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-300 dark:text-paper-400/60">
              Catalogued
            </span>
            <span className="font-mono text-[11px] font-medium text-ink-400 dark:text-paper-300">
              {formatDueStamp(book.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
