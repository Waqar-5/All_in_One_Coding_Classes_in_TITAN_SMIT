import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useEffect, useRef } from "react";
import Button from "./Button";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="w-full max-w-sm rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700 p-6 shadow-card-hover outline-none"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clay-50 dark:bg-clay-500/10">
                <FiAlertTriangle className="text-xl text-clay-500" aria-hidden="true" />
              </div>
              <button
                onClick={onCancel}
                aria-label="Close dialog"
                className="rounded-full p-1.5 text-ink-300 hover:bg-ink-50 dark:hover:bg-paper-400/10 dark:text-paper-400"
              >
                <FiX />
              </button>
            </div>

            <h2 id="confirm-modal-title" className="mt-4 font-display text-xl font-medium text-ink-700 dark:text-paper-100">
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 text-sm text-ink-400 dark:text-paper-300">{description}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
