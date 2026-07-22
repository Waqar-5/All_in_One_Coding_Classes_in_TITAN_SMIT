import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiMoon, FiSun, FiPlus, FiBookOpen, FiLogOut, FiUser } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

const GUEST_LINKS = [
  { to: "/", label: "Home" },
  { to: "/books", label: "Browse" },
  { to: "/dashboard", label: "Dashboard" },
];

const AUTH_LINKS = [
  { to: "/", label: "Home" },
  { to: "/books", label: "Browse" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/my-books", label: "My Books" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { openLogin, openRegister } = useAuthModal();
  const navigate = useNavigate();

  const links = isAuthenticated ? AUTH_LINKS : GUEST_LINKS;

  const linkClasses = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-semibold tracking-wide transition-colors duration-200
     ${isActive ? "text-moss-600 dark:text-brass-400" : "text-ink-500 dark:text-paper-200 hover:text-moss-600 dark:hover:text-brass-400"}`;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 dark:border-paper-400/10 bg-paper-50/85 dark:bg-ink-800/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink-700 dark:text-paper-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-moss-600 text-paper-50">
            <FiBookOpen aria-hidden="true" />
          </span>
          Chapter &amp; Verse
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 dark:border-paper-400/20 text-ink-500 dark:text-paper-200 transition-colors hover:border-moss-500 hover:text-moss-600"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/add"
                className="inline-flex items-center gap-2 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-semibold text-ink-800 shadow-card transition-all duration-200 hover:bg-brass-600 hover:shadow-card-hover active:scale-[0.98]"
              >
                <FiPlus aria-hidden="true" />
                List a Book
              </NavLink>
              <div className="flex items-center gap-2 rounded-full border border-ink-200 dark:border-paper-400/20 py-1 pl-1 pr-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss-50 dark:bg-moss-500/10 font-display text-sm font-semibold text-moss-600 dark:text-brass-400">
                  {user?.name?.charAt(0)?.toUpperCase() || <FiUser />}
                </span>
                <span className="max-w-[100px] truncate text-sm font-medium text-ink-600 dark:text-paper-200">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="ml-1 text-ink-300 hover:text-clay-500 dark:text-paper-400"
                >
                  <FiLogOut />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => openLogin()}
                className="px-3 py-2 text-sm font-semibold text-ink-600 dark:text-paper-200 hover:text-moss-600 dark:hover:text-brass-400"
              >
                Log in
              </button>
              <button
                onClick={() => openRegister()}
                className="inline-flex items-center gap-2 rounded-full bg-moss-600 px-5 py-2.5 text-sm font-semibold text-paper-50 shadow-card transition-all duration-200 hover:bg-moss-700 hover:shadow-card-hover active:scale-[0.98]"
              >
                Join free
              </button>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 dark:text-paper-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-800 px-5 pb-5 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-semibold ${
                    isActive ? "bg-moss-50 text-moss-600 dark:bg-moss-500/10 dark:text-brass-400" : "text-ink-600 dark:text-paper-200"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <NavLink to="/add" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-ink-600 dark:text-paper-200">
                  List a Book
                </NavLink>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-clay-500">
                  <FiLogOut /> Log out ({user?.name})
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                    openLogin();
                  }}
                  className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-ink-600 dark:text-paper-200"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    openRegister();
                  }}
                  className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-moss-600 dark:text-brass-400"
                >
                  Join free
                </button>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="mt-2 flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-ink-600 dark:text-paper-200"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
