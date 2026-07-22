import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={handleClick}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full
            bg-moss-600 text-paper-50 shadow-card-hover transition-colors hover:bg-moss-700
            dark:bg-brass-500 dark:text-ink-800 dark:hover:bg-brass-600"
        >
          <FiArrowUp aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
