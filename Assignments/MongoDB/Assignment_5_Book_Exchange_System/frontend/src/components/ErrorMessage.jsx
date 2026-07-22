import { FiAlertTriangle } from "react-icons/fi";
import Button from "./Button";

export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-clay-400/30 bg-clay-50 dark:bg-clay-500/10 px-6 py-14 text-center">
      <FiAlertTriangle className="text-3xl text-clay-500" aria-hidden="true" />
      <div>
        <p className="font-display text-lg font-medium text-ink-700 dark:text-paper-100">
          The shelf won&apos;t open
        </p>
        <p className="mt-1 text-sm text-ink-400 dark:text-paper-300">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
