import { useCallback, useRef, useState } from "react";
import { FiUploadCloud, FiFile, FiX, FiRefreshCw, FiAlertCircle } from "react-icons/fi";

const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

/**
 * Drag & drop / click-to-browse PDF uploader for a book's readable file.
 * Optional — books work fine without one.
 *
 * Props mirror ImageUpload: file, existingFileUrl, existingFileName,
 * onFileSelect(file|null), onRemoveExisting(), error.
 */
export default function PdfUpload({
  file,
  existingFileUrl,
  existingFileName = "book.pdf",
  onFileSelect,
  onRemoveExisting,
  error,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const hasFile = !!(file || existingFileUrl);
  const displayName = file ? file.name : existingFileName;

  const validateAndSet = useCallback(
    (selected) => {
      if (!selected) return;

      if (selected.type !== "application/pdf") {
        setLocalError("Only PDF files are allowed.");
        return;
      }

      if (selected.size > MAX_SIZE_BYTES) {
        setLocalError("PDF must be smaller than 15 MB.");
        return;
      }

      setLocalError("");
      onFileSelect(selected);
    },
    [onFileSelect]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const handleBrowse = (e) => {
    validateAndSet(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleRemove = () => {
    setLocalError("");
    if (file) onFileSelect(null);
    else if (existingFileUrl) onRemoveExisting?.();
  };

  const displayError = error || localError;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-ink-500 dark:text-paper-200">
        Book PDF <span className="font-normal text-ink-300 dark:text-paper-400/60">(optional)</span>
      </label>

      {hasFile ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 dark:border-paper-400/20 bg-paper-50 dark:bg-ink-700/60 px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-sm text-ink-600 dark:text-paper-200">
            <FiFile className="shrink-0 text-moss-600 dark:text-brass-400" aria-hidden="true" />
            <span className="truncate">{displayName}</span>
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Replace PDF"
              className="rounded-full p-1.5 text-ink-400 hover:bg-ink-50 hover:text-moss-600 dark:text-paper-300 dark:hover:bg-paper-400/10"
            >
              <FiRefreshCw className="text-sm" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove PDF"
              className="rounded-full p-1.5 text-ink-400 hover:bg-clay-50 hover:text-clay-500 dark:text-paper-300 dark:hover:bg-clay-500/10"
            >
              <FiX className="text-sm" />
            </button>
          </div>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={handleBrowse} className="hidden" />
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-6 py-6 text-center transition-colors duration-200
            ${
              dragActive
                ? "border-moss-500 bg-moss-50 dark:bg-moss-500/10"
                : displayError
                ? "border-clay-400 bg-clay-50/40 dark:bg-clay-500/5"
                : "border-ink-200 dark:border-paper-400/20 hover:border-moss-400 hover:bg-moss-50/40 dark:hover:bg-moss-500/5"
            }`}
        >
          <FiUploadCloud className="text-lg text-moss-600 dark:text-brass-400" aria-hidden="true" />
          <p className="text-sm text-ink-600 dark:text-paper-200">
            Drag &amp; drop a PDF, or <span className="text-moss-600 dark:text-brass-400 underline">browse</span>
          </p>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={handleBrowse} className="hidden" />
        </div>
      )}

      {displayError && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-clay-500" role="alert">
          <FiAlertCircle aria-hidden="true" /> {displayError}
        </p>
      )}
    </div>
  );
}
