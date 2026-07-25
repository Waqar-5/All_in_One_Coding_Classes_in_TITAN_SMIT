export default function FilterSelect({ label, value, onChange, options, allLabel = "All" }) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-ink-400 dark:text-paper-300">
      <span className="hidden sm:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="rounded-full border border-ink-200 dark:border-paper-400/20 bg-paper-50 dark:bg-ink-700/60
          px-3 py-1.5 text-xs font-semibold text-ink-600 dark:text-paper-200 outline-none transition-colors
          focus:border-moss-500"
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}
