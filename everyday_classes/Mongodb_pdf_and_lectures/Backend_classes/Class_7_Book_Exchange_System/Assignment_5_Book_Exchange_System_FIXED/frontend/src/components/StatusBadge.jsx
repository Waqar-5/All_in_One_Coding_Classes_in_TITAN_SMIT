const STYLES = {
  Available: "text-moss-600 dark:text-moss-400",
  Requested: "text-brass-600 dark:text-brass-400",
  Reserved: "text-ink-500 dark:text-paper-300",
  Exchanged: "text-clay-500 dark:text-clay-400",
};

export default function StatusBadge({ status, className = "" }) {
  const colorClass = STYLES[status] || "text-ink-400";
  return (
    <span
      className={`inline-flex select-none items-center rounded-sm border-2 px-2.5 py-0.5 font-display text-[11px]
        font-semibold uppercase tracking-[0.18em] shadow-stamp ${colorClass} ${className}`}
      style={{ transform: "rotate(-3deg)" }}
    >
      {status || "Unknown"}
    </span>
  );
}
