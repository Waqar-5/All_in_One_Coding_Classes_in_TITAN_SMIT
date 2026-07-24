import { forwardRef } from "react";
import { FiLoader } from "react-icons/fi";

const VARIANTS = {
  primary:
    "bg-moss-600 text-paper-50 hover:bg-moss-700 active:bg-moss-700 shadow-card hover:shadow-card-hover disabled:hover:bg-moss-600",
  brass:
    "bg-brass-500 text-ink-800 hover:bg-brass-600 shadow-card hover:shadow-card-hover disabled:hover:bg-brass-500",
  outline:
    "bg-transparent border border-ink-300 dark:border-paper-400/40 text-ink-700 dark:text-paper-100 hover:border-moss-500 hover:text-moss-600 dark:hover:text-brass-400",
  ghost:
    "bg-transparent text-ink-600 dark:text-paper-200 hover:bg-ink-50 dark:hover:bg-paper-100/10",
  danger:
    "bg-clay-500 text-paper-50 hover:bg-clay-600 shadow-card hover:shadow-card-hover disabled:hover:bg-clay-500",
};

const SIZES = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const Button = forwardRef(function Button(
  { children, variant = "primary", size = "md", icon: Icon, loading = false, className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold tracking-wide
        transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed
        disabled:shadow-none active:scale-[0.98]
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <FiLoader className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="text-base" aria-hidden="true" />
      )}
      {children}
    </button>
  );
});

export default Button;
