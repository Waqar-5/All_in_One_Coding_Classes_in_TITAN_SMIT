import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiSend, FiX } from "react-icons/fi";
import Button from "./Button";

export default function ExchangeModal({ open, bookTitle, loading, onSubmit, onCancel }) {
  const [message, setMessage] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setMessage("");
      return;
    }
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="exchange-modal-title"
            className="w-full max-w-sm rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700 p-6 shadow-card-hover outline-none"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300 dark:text-paper-400/60">
                  Exchange request
                </p>
                <h2 id="exchange-modal-title" className="mt-1 font-display text-xl font-medium text-ink-700 dark:text-paper-100">
                  {bookTitle}
                </h2>
              </div>
              <button
                onClick={onCancel}
                aria-label="Close dialog"
                className="rounded-full p-1.5 text-ink-300 hover:bg-ink-50 dark:hover:bg-paper-400/10 dark:text-paper-400"
              >
                <FiX />
              </button>
            </div>

            <label htmlFor="exchange-message" className="mt-4 block text-sm font-semibold text-ink-500 dark:text-paper-200">
              Message to the owner (optional)
            </label>
            <textarea
              id="exchange-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Let them know what you'd offer in return, or when you're free to meet up."
              className="mt-1.5 w-full resize-none rounded-xl border border-ink-200 dark:border-paper-400/20 bg-paper-50 dark:bg-ink-700/60
                px-4 py-3 text-sm text-ink-700 dark:text-paper-100 outline-none placeholder:text-ink-300 dark:placeholder:text-paper-400/60 focus:border-moss-500"
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={FiSend} onClick={() => onSubmit(message)} loading={loading}>
                Send request
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
