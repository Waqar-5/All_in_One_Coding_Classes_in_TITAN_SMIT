import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiRepeat, FiUsers, FiMapPin, FiBookOpen } from "react-icons/fi";
import { getBooks } from "../api/books";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import PageTransition from "../components/PageTransition";

const STEPS = [
  {
    icon: FiBookOpen,
    title: "Catalogue your shelf",
    text: "List the books you've finished with a title, author, and category — takes less than a minute.",
  },
  {
    icon: FiUsers,
    title: "Find a fellow reader",
    text: "Browse what your community is offering and see who owns each copy.",
  },
  {
    icon: FiRepeat,
    title: "Exchange in person",
    text: "Arrange a swap, mark the book as exchanged, and let someone else discover it.",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getBooks()
      .then((data) => {
        if (mounted) setFeatured((Array.isArray(data) ? data : []).slice(0, 4));
      })
      .catch(() => mounted && setFeatured([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 dark:border-paper-400/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-moss-200 dark:border-moss-500/30 bg-moss-50 dark:bg-moss-500/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">
              <FiMapPin aria-hidden="true" /> A library with no walls
            </span>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] text-ink-700 dark:text-paper-50 sm:text-6xl">
              Let your books
              <br />
              <span className="italic text-moss-600 dark:text-brass-400">find their next reader.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-500 dark:text-paper-200">
              Chapter &amp; Verse is a community catalog for trading the books you've finished
              for the ones you haven't. No shipping, no fees — just readers exchanging with readers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/books"
                className="inline-flex items-center gap-2 rounded-full bg-moss-600 px-7 py-3.5 text-sm font-semibold text-paper-50 shadow-card transition-all duration-200 hover:bg-moss-700 hover:shadow-card-hover active:scale-[0.98]"
              >
                Browse the shelves <FiArrowRight aria-hidden="true" />
              </Link>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 dark:border-paper-400/20 px-7 py-3.5 text-sm font-semibold text-ink-700 dark:text-paper-100 transition-colors duration-200 hover:border-moss-500 hover:text-moss-600 dark:hover:text-brass-400"
              >
                List a book
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/60 p-7 shadow-card-hover">
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
                Card Catalog · Est. Today
              </p>
              <h3 className="mt-3 font-display text-2xl font-medium text-ink-700 dark:text-paper-50">
                The Night Circus
              </h3>
              <p className="mt-1 text-sm italic text-ink-400 dark:text-paper-300">by Erin Morgenstern</p>
              <div className="catalog-rule my-5 text-ink-300 dark:text-paper-400" />
              <div className="flex items-center justify-between text-sm text-ink-500 dark:text-paper-200">
                <span>Fantasy</span>
                <span className="rounded-sm border-2 border-moss-600 px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-moss-600" style={{ transform: "rotate(-3deg)" }}>
                  Available
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 -z-10 h-full w-full rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-100 dark:bg-ink-700/30" />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink-700 dark:text-paper-50">
            Three steps, no middleman.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-moss-50 dark:bg-moss-500/10 font-mono text-sm font-semibold text-moss-600 dark:text-brass-400">
                <step.icon aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-medium text-ink-700 dark:text-paper-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400 dark:text-paper-300">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured books */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">Fresh on the shelf</p>
            <h2 className="mt-2 font-display text-3xl font-medium text-ink-700 dark:text-paper-50">Recently catalogued</h2>
          </div>
          <Link
            to="/books"
            className="hidden items-center gap-1.5 text-sm font-semibold text-moss-600 dark:text-brass-400 hover:underline sm:inline-flex"
          >
            View all <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-ink-400 dark:text-paper-300">
            No books catalogued yet — be the first to{" "}
            <Link to="/add" className="font-semibold text-moss-600 underline dark:text-brass-400">
              list one
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((book, i) => (
              <BookCard key={book._id} book={book} index={i} />
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}
