export default function LoadingSpinner({ label = "Loading", size = "md" }) {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-[3px]", lg: "h-12 w-12 border-4" };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <span
        className={`${sizes[size]} animate-spin rounded-full border-moss-200 border-t-moss-600 dark:border-paper-400/20 dark:border-t-brass-400`}
      />
      <span className="text-sm font-medium text-ink-400 dark:text-paper-300">{label}</span>
    </div>
  );
}
