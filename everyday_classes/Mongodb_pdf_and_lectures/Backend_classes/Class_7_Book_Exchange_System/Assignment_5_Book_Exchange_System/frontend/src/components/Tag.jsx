export default function Tag({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-ink-200 dark:border-paper-400/20
        bg-paper-100/60 dark:bg-paper-400/5 px-2.5 py-1 text-[11px] font-medium text-ink-500 dark:text-paper-300 ${className}`}
    >
      {children}
    </span>
  );
}
