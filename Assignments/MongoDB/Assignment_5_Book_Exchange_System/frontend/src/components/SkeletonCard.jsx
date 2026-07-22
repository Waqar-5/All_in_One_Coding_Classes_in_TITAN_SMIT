export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/50 p-6">
      <div className="mb-4 h-3 w-16 rounded-full bg-ink-100 dark:bg-paper-400/20" />
      <div className="mb-2 h-5 w-3/4 rounded bg-ink-100 dark:bg-paper-400/20" />
      <div className="mb-6 h-3 w-1/2 rounded bg-ink-100 dark:bg-paper-400/20" />
      <div className="mb-1 h-2.5 w-full rounded bg-ink-50 dark:bg-paper-400/10" />
      <div className="mb-1 h-2.5 w-5/6 rounded bg-ink-50 dark:bg-paper-400/10" />
      <div className="mt-6 flex items-center justify-between">
        <div className="h-5 w-20 rounded-sm bg-ink-100 dark:bg-paper-400/20" />
        <div className="h-3 w-16 rounded bg-ink-50 dark:bg-paper-400/10" />
      </div>
    </div>
  );
}
