import { FiBookOpen, FiGithub, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-paper-400/10 bg-paper-100/60 dark:bg-ink-800">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 font-display text-lg font-semibold text-ink-700 dark:text-paper-50">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss-600 text-paper-50">
                <FiBookOpen aria-hidden="true" />
              </span>
              Chapter &amp; Verse
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-400 dark:text-paper-300">
              A neighborhood-scale library where every finished book finds its next reader.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-300 dark:text-paper-400/70">Explore</p>
              <ul className="flex flex-col gap-2 text-sm text-ink-500 dark:text-paper-200">
                <li><a href="/books" className="hover:text-moss-600 dark:hover:text-brass-400">Browse shelves</a></li>
                <li><a href="/add" className="hover:text-moss-600 dark:hover:text-brass-400">List a book</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-300 dark:text-paper-400/70">Contact</p>
              <ul className="flex flex-col gap-2 text-sm text-ink-500 dark:text-paper-200">
                <li className="flex items-center gap-2"><FiMail aria-hidden="true" /> hello@chapterverse.app</li>
                <li className="flex items-center gap-2"><FiGithub aria-hidden="true" /> chapter-verse</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="catalog-rule mt-10 text-ink-300 dark:text-paper-400" />
        <p className="mt-4 text-center font-mono text-xs text-ink-300 dark:text-paper-400/70">
          © {new Date().getFullYear()} Chapter &amp; Verse. Built for readers, by readers.
        </p>
      </div>
    </footer>
  );
}
