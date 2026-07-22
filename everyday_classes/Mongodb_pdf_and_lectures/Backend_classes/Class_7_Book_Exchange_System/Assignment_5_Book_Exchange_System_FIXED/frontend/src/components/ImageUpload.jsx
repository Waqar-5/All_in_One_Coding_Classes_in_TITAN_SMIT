import { useCallback, useRef, useState } from "react";
import { FiUploadCloud, FiX, FiImage, FiRefreshCw, FiAlertCircle } from "react-icons/fi";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Drag & drop / click-to-browse book cover uploader.
 *
 * Props:
 * - file: the currently selected File (or null)
 * - existingImageUrl: an already-uploaded image URL to show when editing (no new file picked yet)
 * - onFileSelect(file): called with a validated File, or null when cleared
 * - onRemoveExisting(): called when the user removes an existing (already-saved) image, distinct
 *   from just clearing a newly-picked file — lets the parent send a "removeImage" flag
 * - error: external validation error string (e.g. "Image is required")
 * - progress: 0-100 upload progress while submitting, or null when idle
 */
export default function ImageUpload({
  file,
  existingImageUrl,
  onFileSelect,
  onRemoveExisting,
  error,
  progress = null,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  const previewUrl = file ? URL.createObjectURL(file) : existingImageUrl;

  const validateAndSet = useCallback(
    (selected) => {
      if (!selected) return;

      if (!ALLOWED_TYPES.includes(selected.type)) {
        setLocalError("Only JPG, JPEG, PNG, and WEBP images are allowed.");
        return;
      }

      if (selected.size > MAX_SIZE_BYTES) {
        setLocalError("Image must be smaller than 5 MB.");
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
    const dropped = e.dataTransfer.files?.[0];
    validateAndSet(dropped);
  };

  const handleBrowse = (e) => {
    const picked = e.target.files?.[0];
    validateAndSet(picked);
    e.target.value = ""; // allow re-selecting the same file after removing it
  };

  const handleRemove = () => {
    setLocalError("");
    if (file) {
      onFileSelect(null);
    } else if (existingImageUrl) {
      onRemoveExisting?.();
    }
  };

  const displayError = error || localError;
  const uploading = progress !== null && progress < 100;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-ink-500 dark:text-paper-200">Book cover</label>

      {previewUrl ? (
        <div className="group relative overflow-hidden rounded-xl border border-ink-200 dark:border-paper-400/20">
          <img
            src={previewUrl}
            alt="Book cover preview"
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/60 backdrop-blur-sm">
              <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-paper-50/30">
                <div
                  className="h-full rounded-full bg-brass-400 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-xs text-paper-50">Uploading… {progress}%</span>
            </div>
          )}

          {!uploading && (
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-ink-900/70 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full bg-paper-50/90 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-paper-50"
              >
                <FiRefreshCw className="text-sm" aria-hidden="true" /> Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 rounded-full bg-clay-500/90 px-3 py-1.5 text-xs font-semibold text-paper-50 hover:bg-clay-500"
              >
                <FiX className="text-sm" aria-hidden="true" /> Remove
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleBrowse}
            className="hidden"
          />
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
          className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-200
            ${
              dragActive
                ? "border-moss-500 bg-moss-50 dark:bg-moss-500/10"
                : displayError
                ? "border-clay-400 bg-clay-50/40 dark:bg-clay-500/5"
                : "border-ink-200 dark:border-paper-400/20 hover:border-moss-400 hover:bg-moss-50/40 dark:hover:bg-moss-500/5"
            }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-50 dark:bg-moss-500/10 text-moss-600 dark:text-brass-400">
            {dragActive ? <FiImage className="text-xl" /> : <FiUploadCloud className="text-xl" />}
          </span>
          <p className="text-sm font-medium text-ink-600 dark:text-paper-200">
            Drag &amp; drop a cover image, or <span className="text-moss-600 dark:text-brass-400 underline">browse</span>
          </p>
          <p className="text-xs text-ink-300 dark:text-paper-400/70">JPG, PNG, or WEBP · up to 5 MB</p>

          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleBrowse}
            className="hidden"
          />
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
