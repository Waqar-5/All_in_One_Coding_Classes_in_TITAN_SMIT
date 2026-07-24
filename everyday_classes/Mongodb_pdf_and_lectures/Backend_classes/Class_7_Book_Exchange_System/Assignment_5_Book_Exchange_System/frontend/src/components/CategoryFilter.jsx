export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        onClick={() => onChange("All")}
        className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-200
          ${
            active === "All"
              ? "border-moss-600 bg-moss-600 text-paper-50"
              : "border-ink-200 dark:border-paper-400/20 text-ink-500 dark:text-paper-300 hover:border-moss-500 hover:text-moss-600"
          }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-200
            ${
              active === cat
                ? "border-moss-600 bg-moss-600 text-paper-50"
                : "border-ink-200 dark:border-paper-400/20 text-ink-500 dark:text-paper-300 hover:border-moss-500 hover:text-moss-600"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
