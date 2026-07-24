import React from 'react';
import { motion } from 'framer-motion';
import { FaClipboardCheck, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Sticky top navigation bar with brand logo and dark/light mode toggle.
 */
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      className="app-navbar no-print"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between" style={{ maxWidth: 1400 }}>
        <a href="/" className="brand-logo text-decoration-none">
          <span className="brand-icon-wrap">
            <FaClipboardCheck />
          </span>
          <span className="brand-text">
            Attendance<span style={{ color: '#8b5cf6' }}>Pro</span>
          </span>
        </a>

        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-md-flex flex-column text-end me-2">
            <small className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
              Admin Dashboard
            </small>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Manage student attendance
            </small>
          </div>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
