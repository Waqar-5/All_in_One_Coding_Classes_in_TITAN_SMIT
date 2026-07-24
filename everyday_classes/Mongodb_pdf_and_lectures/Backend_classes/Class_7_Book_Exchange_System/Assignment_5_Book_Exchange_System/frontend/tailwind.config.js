/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Reading-room palette — inspired by library card catalogs & brass fittings
        ink: {
          DEFAULT: "#16231C",
          50: "#F1F4F2",
          100: "#DCE3DE",
          200: "#B4C2B9",
          300: "#7E9587",
          400: "#4A5A52",
          500: "#2B3A32",
          600: "#1F2E26",
          700: "#16231C",
          800: "#101A14",
          900: "#0A110D",
        },
        paper: {
          DEFAULT: "#F1ECDD",
          50: "#FBF9F3",
          100: "#F1ECDD",
          200: "#E8E0CB",
          300: "#DCD0B4",
          400: "#CBBB94",
        },
        moss: {
          DEFAULT: "#3F6B4F",
          50: "#EEF4F0",
          100: "#D3E3D8",
          400: "#4F7F5F",
          500: "#3F6B4F",
          600: "#325640",
          700: "#274332",
        },
        brass: {
          DEFAULT: "#B8863B",
          50: "#FAF3E7",
          100: "#F0DFB9",
          400: "#C9974C",
          500: "#B8863B",
          600: "#98692C",
          700: "#7A5423",
        },
        clay: {
          DEFAULT: "#9C4221",
          50: "#F7E9E2",
          400: "#B25330",
          500: "#9C4221",
          600: "#7E351A",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Public Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,35,28,0.06), 0 8px 24px -8px rgba(22,35,28,0.18)",
        "card-hover": "0 4px 10px rgba(22,35,28,0.08), 0 20px 40px -12px rgba(22,35,28,0.28)",
        stamp: "inset 0 0 0 1.5px currentColor",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(22,35,28,0.06) 1px, transparent 0)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "stamp-in": {
          "0%": { opacity: 0, transform: "scale(1.4) rotate(-8deg)" },
          "60%": { opacity: 1 },
          "100%": { opacity: 1, transform: "scale(1) rotate(-8deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "stamp-in": "stamp-in 0.4s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [],
};
