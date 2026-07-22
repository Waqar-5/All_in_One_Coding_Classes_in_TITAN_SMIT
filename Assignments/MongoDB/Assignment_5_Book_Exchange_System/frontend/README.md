# Chapter & Verse — Book Exchange Frontend

A premium React (Vite) frontend for a Book Exchange System, built on top of the
existing Express + MongoDB backend.

## Design

A "library card catalog" visual identity: warm paper background, deep forest-ink
text, brass and moss accents, a `Fraunces` display serif paired with `Public Sans`
body copy and `JetBrains Mono` for catalog numbers/dates. Book cards render as
catalog cards with a dog-eared corner and a rubber-stamped status badge.

## Stack

- React 18 + Vite
- React Router DOM v6
- Axios (with a thin `src/api/books.js` service layer)
- Tailwind CSS (custom token system in `tailwind.config.js`)
- Framer Motion (page transitions, card/modal animation)
- react-hot-toast (notifications)
- react-icons

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if your backend isn't on :3000
npm run dev
```

Make sure your Express backend (from the prompt) is running on
`http://localhost:3000` with CORS enabled — it already is, via `app.use(cors())`.

## Folder structure

```
src/
 ├── api/           axios instance + books.js service layer
 ├── components/    Navbar, Footer, BookCard, SearchBar, CategoryFilter,
 │                  LoadingSpinner, SkeletonCard, ErrorMessage, EmptyState,
 │                  FormInput, Button, ConfirmModal, StatusBadge, PageTransition
 ├── pages/         Home, Books, AddBook, BookDetails, EditBook, NotFound
 ├── routes/        AppRoutes.jsx (animated route switch)
 ├── hooks/         useBooks, useDebounce
 ├── context/       ThemeContext (dark/light mode)
 ├── utils/         formatDate, validators
 ├── App.jsx
 └── main.jsx
```

## Pages

- **Home** — hero, "how it works", featured/recent books
- **Books** — search + category filter + full listing, loading/empty/error states
- **Add Book** — validated form, toast on success, redirects to `/books`
- **Book Details** — full record, edit/delete actions, delete confirmation modal
- **Edit Book** — pre-filled validated form, updates and redirects back

## Notes

- All backend errors are normalized in `src/api/axios.js` so every page can
  show a consistent, human-readable message.
- Dark mode preference is persisted to `localStorage` and respects the
  system preference on first visit.
- Reduced-motion users get instant transitions (see `@media (prefers-reduced-motion)`
  in `src/index.css`).
