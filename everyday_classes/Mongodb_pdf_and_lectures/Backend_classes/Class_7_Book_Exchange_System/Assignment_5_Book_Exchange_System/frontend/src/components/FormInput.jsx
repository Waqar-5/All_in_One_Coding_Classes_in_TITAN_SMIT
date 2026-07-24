export default function FormInput({
  label,
  id,
  error,
  hint,
  as = "input",
  options = [],
  className = "",
  ...props
}) {
  const baseClasses = `w-full rounded-xl border bg-paper-50 dark:bg-ink-700/60 px-4 py-3 font-body text-ink-700 dark:text-paper-100
    placeholder:text-ink-300 dark:placeholder:text-paper-400/60 outline-none transition-colors duration-200
    disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-ink-400 dark:disabled:bg-paper-400/5 dark:disabled:text-paper-400/60
    ${error ? "border-clay-500 focus:border-clay-500" : "border-ink-200 dark:border-paper-400/20 focus:border-moss-500"}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink-500 dark:text-paper-200">
        {label}
      </label>

      {as === "select" ? (
        <select id={id} className={baseClasses} {...props}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea id={id} rows={4} className={`${baseClasses} resize-none`} {...props} />
      ) : (
        <input id={id} className={baseClasses} {...props} />
      )}

      {hint && !error && (
        <p className="text-xs text-ink-300 dark:text-paper-400/70">{hint}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-clay-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
