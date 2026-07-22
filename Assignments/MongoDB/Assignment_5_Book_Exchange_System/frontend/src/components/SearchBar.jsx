import { FiSearch, FiX } from "react-icons/fi";

export default function SearchBar({ value, onChange, placeholder = "Search by title, author, or owner…" }) {
  return (
    <div className="relative w-full">
      <FiSearch
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 dark:text-paper-400/70"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search books"
        className="w-full rounded-full border border-ink-200 dark:border-paper-400/20 bg-paper-50 dark:bg-ink-700/60
          py-3 pl-11 pr-10 text-sm text-ink-700 dark:text-paper-100 outline-none transition-colors duration-200
          placeholder:text-ink-300 dark:placeholder:text-paper-400/60 focus:border-moss-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-300 hover:bg-ink-50 dark:hover:bg-paper-400/10 dark:text-paper-400"
        >
          <FiX />
        </button>
      )}
    </div>
  );
}
