# Chapter & Verse — Book Exchange Frontend

A premium React (Vite) frontend for a Book Exchange System, built on top of the
Express + MongoDB backend in `../Backend`.

## Design

A "library card catalog" visual identity: warm paper background, deep forest-ink
text, brass and moss accents, a `Fraunces` display serif paired with `Public Sans`
body copy and `JetBrains Mono` for catalog numbers/dates. Book cards render as
catalog cards with a dog-eared corner and a rubber-stamped status badge. Login/
Register carry the same idea through as a "library membership card."

## Stack

- React 18 + Vite
- React Router DOM v6 (with `ProtectedRoute` for private pages)
- Axios (JWT bearer auth via request interceptor, normalized errors)
- Tailwind CSS (custom token system in `tailwind.config.js`)
- Framer Motion (page transitions, card/modal animation)
- react-hot-toast (notifications)
- react-icons

## Getting started

```bash
npm install
cp .env.example .env   # points at http://localhost:5000/api by default
npm run dev
```

Start the backend first (`cd ../Backend && npm run dev`) — it listens on port
`5000` and mounts everything under `/api`.

## Folder structure

```
src/
 ├── api/           axios instance, auth.js, books.js, exchange.js
 ├── components/    Navbar, Footer, BookCard, SearchBar, CategoryFilter,
 │                  Pagination, LoadingSpinner, SkeletonCard, ErrorMessage,
 │                  EmptyState, FormInput, Button, Tag, ConfirmModal,
 │                  ExchangeModal, StatusBadge, PageTransition, ProtectedRoute
 ├── pages/         Home, Books, AddBook, BookDetails, EditBook, MyBooks,
 │                  Login, Register, NotFound
 ├── routes/        AppRoutes.jsx (animated route switch, protected routes)
 ├── hooks/         useBooks (paginated), useDebounce
 ├── context/       AuthContext (JWT + user session), ThemeContext (dark mode)
 ├── utils/         formatDate, validators (mirrors backend enums)
 ├── App.jsx
 └── main.jsx
```

## What matches the backend

- **Auth**: register/login issue a JWT, stored in `localStorage` and attached
  to every request via an axios interceptor. A 401 response clears it automatically.
- **Ownership**: the "owner" of a book is set server-side from the JWT — the
  Add Book form never asks for it. Edit/Delete only show up on `BookDetails`
  when the logged-in user is the book's owner.
- **Pagination**: `GET /books` is paginated server-side; `useBooks` tracks
  `page`/`totalPages` and `Books.jsx` filters/searches within the loaded page.
- **Exchange requests**: `MyBooks` has three tabs — your listings, requests
  received on your books (accept/decline), and requests you've sent (cancel).
- **Book fields**: category/condition/status dropdowns mirror the enums in
  `Backend/models/book.js` exactly (`src/utils/validators.js`).

## Notes

- Dark mode preference is persisted to `localStorage` and respects the
  system preference on first visit.
- Reduced-motion users get instant transitions (see `@media (prefers-reduced-motion)`
  in `src/index.css`).
