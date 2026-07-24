import { FiBookOpen, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function EmptyState({
  title = "This shelf is empty",
  description = "No books here yet.",
  actionLabel,
  actionTo,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-ink-200 dark:border-paper-400/20 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-50 dark:bg-moss-500/10">
        <FiBookOpen className="text-2xl text-moss-600 dark:text-brass-400" aria-hidden="true" />
      </div>
      <div>
        <p className="font-display text-xl font-medium text-ink-700 dark:text-paper-100">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-400 dark:text-paper-300">{description}</p>
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-1 inline-flex items-center gap-2 rounded-full bg-brass-500 px-5 py-2.5 text-sm
            font-semibold text-ink-800 shadow-card transition-all duration-200 hover:bg-brass-600 hover:shadow-card-hover active:scale-[0.98]"
        >
          <FiPlus aria-hidden="true" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
