# 📖 Chapter & Verse — Community Book Exchange Platform

A full-stack web application where people list the books they've finished reading and trade them with other readers nearby, instead of letting them sit on a shelf or throwing money at buying something they'll read once. Built with React (Vite) on the frontend and Node.js/Express/MongoDB on the backend.

---

## Table of Contents

1. [What this project is](#what-this-project-is)
2. [Why this exists — the real problem it solves](#why-this-exists--the-real-problem-it-solves)
3. [Who this is for](#who-this-is-for)
4. [Tech stack](#tech-stack)
5. [Every feature, in full](#every-feature-in-full)
6. [Project structure](#project-structure)
7. [Data models](#data-models)
8. [Full API reference](#full-api-reference)
9. [Getting started](#getting-started)
10. [Environment variables](#environment-variables)
11. [Design system](#design-system)
12. [Security measures already in place](#security-measures-already-in-place)
13. [Known limitations](#known-limitations)
14. [Roadmap — what a future developer could add](#roadmap--what-a-future-developer-could-add)
15. [Credits](#credits)

---

## What this project is

Chapter & Verse is a **book exchange marketplace**, not a bookstore and not a library. Members list physical books they own and no longer need, browse what everyone else in the community has listed, and arrange direct swaps — no money changes hands, no shipping is handled by the platform. It's the "Craigslist model" applied specifically to books, with the trust and structure (accounts, request/accept flow, moderation) that a plain classifieds board doesn't give you.

## Why this exists — the real problem it solves

- **Books pile up.** Most people finish a book and never touch it again, but keep it because there's no easy way to pass it on to someone who'd actually read it.
- **Buying every book new is expensive**, and secondhand bookstores are hit-or-miss on selection and inconvenient to visit regularly.
- **Informal book-sharing (friends, Facebook groups, WhatsApp chats) doesn't scale** — there's no search, no way to see what's actually available right now, no record of who has what, and no accountability if someone flakes on a swap.
- **Public libraries have limited copies and wait lists**, and don't let you keep a book indefinitely or write in the margins.

This app gives book owners **a searchable, persistent catalog** instead of a one-off social media post that gets buried in an hour, and gives book seekers **a real way to find a specific title** (by name, author, ISBN, category, or even city) instead of hoping the right person happens to post at the right time.

## Who this is for

- **Readers who buy a lot of books** and want to offload finished ones for new-to-them titles instead of paying full price repeatedly.
- **Students** trading textbooks and course reading within a campus or city.
- **Community organizers** (book clubs, neighborhood groups, libraries) who want a lightweight tool to facilitate swaps without building something from scratch.
- **Anyone learning full-stack development** — this is also a complete, realistic reference implementation of a production-style MERN app: auth, file uploads, admin tooling, rate limiting, email, and more, all in one codebase.

---

## Tech stack

**Frontend**
- React 18 + Vite
- React Router v6
- Tailwind CSS (fully custom design tokens — no default theme)
- Framer Motion (page transitions, micro-animations)
- Axios
- react-hot-toast (notifications)
- react-icons

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication (`jsonwebtoken`)
- `bcryptjs` for password hashing
- `multer` for file uploads (images, PDFs)
- `nodemailer` (Gmail SMTP) for password-reset emails
- `helmet`, `cors`, `express-rate-limit`
- `morgan` (request logging), `compression`

---

## Every feature, in full

### Accounts & Authentication
- Register / log in with email + password (JWT-based sessions)
- Login/signup available as a **popup modal** from anywhere in the app (Navbar, or triggered mid-action — e.g. tapping "favorite" while logged out prompts login, then completes the favorite automatically after signing in) *and* as standalone `/login` / `/register` pages for direct/shareable links
- **Forgot / Reset Password** via email — a time-limited (15 minute), single-use reset link sent through Gmail SMTP. Reset requests never reveal whether an email is actually registered (prevents account enumeration)
- **Change Password** from your own Profile page (requires your current password)
- Session auto-refreshes from the server on every app load, so role/permission/profile changes always reflect the current database state — not a stale cached copy

### Profile
- Editable name, phone, city, bio
- Profile photo upload (drag & drop, replace, remove)
- Stats: books listed, books exchanged, exchanges completed
- "Member since" date

### Browsing & Discovery
- Full book catalog with **server-side pagination**
- **Server-side search** across title, author, ISBN, tags, city, *and owner name*
- Filters: category, condition, language, status, city
- Sort: newest, oldest, A–Z, Z–A, recently updated
- "Clear filters" to reset everything at once
- A public Dashboard with live stats (total books, by status), a category breakdown chart, and recently listed books

### Listing a Book
- Fields: title, author, description, category, condition, publisher, published year, language, ISBN, city/location, tags, status
- **Cover image is required** (drag & drop, click to browse, live preview, replace/remove, upload progress bar, client + server-side validation for file type and size)
- **Optional PDF upload** — for books the owner is happy to let others read digitally, not just swap physically
- **Optional "read online" link** — a URL to an external preview/reader
- A per-account **book listing limit** (default: 10 books, configurable per-user by an admin) prevents any one account from flooding the catalog
- Editing a listing supports keeping, replacing, or removing the cover image and PDF independently

### Book Details
- Full record: description, condition, publisher, year, ISBN, language, tags, location, view count, catalog date
- Owner info (name, city)
- "Read online" and "Download PDF" buttons when the owner provided them
- Heart/wishlist toggle
- Edit/Delete visible only to the book's owner
- "Request Exchange" for everyone else (disabled once a book is no longer Available)

### Exchange System
- **Request** a book from its owner, with an optional message
- Owner sees requests on their **My Books** dashboard (tabbed: My Listings / Requests Received / Requests Sent) and can **Accept** or **Reject**
- Accepting a request marks the book `Exchanged` and auto-rejects any other pending requests for the same book
- Requesters can **Cancel** their own pending request
- Book status flows through `Available → Requested → Exchanged` (or back to `Available` if a request is rejected/cancelled)

### Wishlist
- Heart any book from its card or its details page to save it
- Dedicated `/wishlist` page listing everything you've saved
- Optimistic UI (instant visual feedback, rolled back automatically if the request fails)

### Admin Panel (`/admin`, role-gated)
- **Manage Books** — search, view every book including soft-deleted ones, restore a soft-deleted book, or permanently delete a book (removes its files from disk too)
- **Manage Users** — search, promote/demote between User and Admin, **block/unblock an account** (a blocked user is logged out immediately — even with a valid, unexpired session token — and can't log back in until unblocked), and set a **custom book limit per user**
- Click any user to open their **full profile + every book they've listed**, with stats
- A **permanent bootstrap admin account** is configured via environment variables and self-heals its own role on every server start — so the "master" admin account can never accidentally get locked out or demoted, even by another admin

### Design & UX polish
- Full dark/light mode with persisted preference
- Skeleton loaders, empty states, and error states with retry, on every data-driven screen
- Toast notifications for every create/update/delete/error
- Confirmation modals before destructive actions (delete, permanent delete)
- Framer Motion page transitions and hover animations throughout
- Fully responsive (mobile, tablet, desktop) with a working mobile nav menu
- A custom "library card catalog" visual identity (not a generic template) — cover images styled like catalog cards, rubber-stamp status badges, a card-catalog color palette

---

## Project structure

```
Assignment_5_Book_Exchange_System/
├── Backend/
│   ├── config/          → DB connection, bootstrap admin seeder
│   ├── controllers/      → business logic (auth, books, exchange, favorites)
│   ├── middleware/       → auth guards, rate limiters, uploads, error handling
│   ├── models/           → Mongoose schemas (User, Book, Exchange)
│   ├── routes/           → Express route definitions
│   ├── scripts/          → maintenance scripts (orphaned-image cleanup)
│   ├── utils/            → shared helpers (file cleanup, email)
│   ├── uploads/          → uploaded cover images, PDFs, avatars
│   └── server.js
│
└── frontend/
    └── src/
        ├── api/           → one file per backend resource (books, auth, exchange, favorites, admin)
        ├── components/    → reusable UI (BookCard, forms, modals, uploaders...)
        ├── context/       → Auth, Theme, AuthModal, Favorites (React Context)
        ├── hooks/         → useBooks (paginated + filtered), useDebounce
        ├── pages/         → one file per route
        ├── routes/        → route table + guards (ProtectedRoute, AdminRoute)
        └── utils/         → validators, formatters, image URL helper
```

## Data models

**User** — name, email (unique), password (hashed, never returned), profileImage, phone, city, bio, role (`User`/`Admin`), isVerified, favorites (Book references), isDeleted, isBlocked, bookLimit, resetPasswordToken/Expire, timestamps

**Book** — title, author, description, category, condition, publisher, publishedYear, language, isbn, location, tags, status (`Available`/`Requested`/`Reserved`/`Exchanged`), coverImage, readLink, pdfFile, owner (User reference), views, isDeleted, timestamps

**Exchange** — book (reference), requester (User reference), owner (User reference), message, status (`Pending`/`Accepted`/`Rejected`/`Cancelled`), timestamps

## Full API reference

All routes are mounted under `/api`. 🔒 = requires login. 👑 = requires Admin role.

**Auth** (`/api/auth`)
| Method | Path | Purpose |
|---|---|---|
| POST | `/register` | Create an account |
| POST | `/login` | Log in |
| POST | `/forgot-password` | Request a password reset email |
| POST | `/reset-password/:token` | Reset password using the emailed token |
| GET 🔒 | `/me` | Current user + stats |
| PUT 🔒 | `/profile` | Update profile (+ optional avatar) |
| PUT 🔒 | `/change-password` | Change password (requires current password) |
| GET 👑 | `/users` | List all users |
| GET 👑 | `/users/:id` | A specific user's profile + their books |
| PATCH 👑 | `/users/:id/role` | Promote/demote |
| PATCH 👑 | `/users/:id/toggle-block` | Block/unblock |
| PATCH 👑 | `/users/:id/book-limit` | Set a custom listing limit |

**Books** (`/api/books`)
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Paginated, searchable, filterable, sortable catalog |
| GET | `/:id` | Single book |
| GET | `/stats` | Catalog-wide stats (for the Dashboard) |
| GET 🔒 | `/my-books` | Your own listings |
| GET 👑 | `/admin/all` | Every book, including soft-deleted |
| POST 🔒 | `/` | Create a listing (multipart: image required, PDF optional) |
| PUT 🔒 | `/:id` | Update a listing (owner only) |
| DELETE 🔒 | `/:id` | Soft-delete (owner only) |
| PATCH 👑 | `/restore/:id` | Restore a soft-deleted book |
| DELETE 👑 | `/permanent/:id` | Permanently delete (and its files) |

**Exchange** (`/api/exchange`)
| Method | Path | Purpose |
|---|---|---|
| POST 🔒 | `/:bookId` | Request a book |
| GET 🔒 | `/sent` | Requests you've sent |
| GET 🔒 | `/received` | Requests on your books |
| PATCH 🔒 | `/:id` | Accept/reject a request (owner only) |
| PATCH 🔒 | `/:id/cancel` | Cancel your own request |

**Favorites** (`/api/favorites`)
| Method | Path | Purpose |
|---|---|---|
| GET 🔒 | `/ids` | Just the IDs (lightweight, for heart icons) |
| GET 🔒 | `/` | Full wishlist with book data |
| POST 🔒 | `/:bookId` | Toggle favorite on/off |

---

## Getting started

```bash
# Backend
cd Backend
npm install
cp .env.example .env   # fill in your own values — see below
npm run dev             # http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## Environment variables

**Backend/.env**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
JWT_EXPIRE=7d

ADMIN_EMAIL=your_admin_account_email
ADMIN_PASSWORD=your_admin_account_password

DEFAULT_BOOK_LIMIT=10
FRONTEND_URL=http://localhost:5173

EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```
`EMAIL_PASS` must be a Gmail **App Password**, not your normal password (Gmail blocks plain SMTP logins). Generate one at `myaccount.google.com/apppasswords` after turning on 2-Step Verification. If left blank, the rest of the app works fine — only password reset emails will fail with a clear error instead of crashing.

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Design system

A "library card catalog" identity, not a generic SaaS template:
- **Typography**: `Fraunces` (display serif) + `Public Sans` (body) + `JetBrains Mono` (catalog numbers, dates)
- **Palette**: deep forest ink, warm paper, moss green + brass accents
- Book cards render like literal library catalog cards — dog-eared corner, shelf-mark number, rotated rubber-stamp status badge
- Full dark mode variant

## Security measures already in place

- Passwords hashed with bcrypt, never returned in any API response
- JWT auth with a `protect` middleware that also rejects requests from blocked users immediately (not just at login)
- Rate limiting: generous globally (1000 req/15min), strict on auth endpoints (30 req/15min on login/register/password-reset)
- File upload validation by MIME type and size, per field (images vs. PDFs)
- `helmet` configured correctly for cross-origin static asset serving (a common misconfiguration that silently breaks image loading — deliberately fixed here)
- ObjectId format validation before any database lookup by ID (prevents raw Mongoose cast errors from leaking internals)
- Password reset tokens are hashed before storage and time-limited; the reset endpoint never reveals whether an email exists
- Self-protection guards: an admin can't demote, block, or delete their own account; the bootstrap admin account can't be blocked by anyone

## Known limitations

- One cover image per book (no multi-image gallery)
- Category filtering, search, etc. are real and server-side, but there's no full-text search engine (Elasticsearch/Atlas Search) behind it — it's regex-based, fine at small-to-medium scale, slower at very large scale
- No real-time features (no live chat, no live notification push — everything is request/response)
- No automated test suite
- Rate limiting and reset tokens are stored in memory / MongoDB respectively — no Redis or other distributed store, which matters only if this is ever scaled across multiple server instances

## Roadmap — what a future developer could add

**High value, not yet built:**
- **Real-time chat between a requester and owner** (Socket.IO) — currently the only communication is the one-time message on an exchange request
- **In-app / push notifications** for new requests, accepted/rejected exchanges, etc. (currently the only feedback is toasts while you're actively in the app)
- **Ratings & reviews** after a completed exchange, to build trust between members
- **Multi-image galleries** per book instead of a single cover
- **Email verification** on signup (the `isVerified` field already exists on the User model but isn't enforced anywhere yet)

**Nice to have:**
- Recently viewed / recommended books
- QR code generation per book for easy in-person sharing
- "Report a listing" for moderation
- Static pages: About, Contact, Privacy Policy, Terms of Service
- A public "seller profile" page distinct from the private Profile settings page
- CSV/JSON export of the catalog for admins
- True full-text search (MongoDB Atlas Search or a dedicated search engine) if the catalog grows large

**Infrastructure / engineering:**
- Automated tests (unit + integration) — none exist yet
- CI/CD pipeline
- Move uploaded files to cloud object storage (S3, Cloudinary, etc.) instead of local disk, so uploads survive redeploys and scale across multiple server instances
- Redis-backed rate limiting and session/token storage if deployed at scale
- API documentation via Swagger/OpenAPI generated from the routes

---

## Credits

Built iteratively as a full-stack learning/portfolio project — backend (Express/MongoDB) and frontend (React/Tailwind) architected and developed together, with a deliberate focus on production-realistic concerns (security, error handling, admin tooling) rather than just the happy path.
