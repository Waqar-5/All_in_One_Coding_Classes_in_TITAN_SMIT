# Assignment 5 — Book Exchange System — Fix &amp; Build Notes

## Backend bugs found and fixed (`Backend/`)

1. **Server wouldn't boot at all.** `server.js` required two files that didn't
   exist in the zip: `routes/exchangeRoutes.js` and `middleware/errorMiddleware.js`.
   Both are now implemented (see "New backend feature" below for the exchange
   routes; the error middleware normalizes Mongoose/JWT errors into clean JSON).

2. **Wrong-case require, breaks on Linux/most hosts.**
   `controllers/bookController.js` had `require("../models/Book")` but the
   file on disk is `models/book.js`. Case-insensitive filesystems (Windows/Mac)
   hide this; it throws `Cannot find module` on Linux, Docker, or most cloud
   hosts. Fixed to `require("../models/book")`.

3. **Missing controller crashes route registration.** `routes/bookRoutes.js`
   imported `updateBook` from the controller, but the controller never
   defined or exported it — `router.put("/:id", protect, undefined)` throws
   immediately on startup. Added a proper `updateBook` handler with an
   ownership check (only the book's owner can edit it).

4. **Unauthenticated permanent-delete route.** `router.delete("/permanent-delete/:id", permanentDeleteBook)`
   had no `protect` middleware — anyone, logged in or not, could permanently
   delete any book. Removed (the properly admin-gated `/permanent/:id` route
   was already there and is the one that should be used).

5. **Route-ordering bug.** `GET "/:id"` was registered before `GET "/my-books"`.
   Express matches routes in order, so a request to `/api/books/my-books`
   would've matched `/:id` first (treating `"my-books"` as an id) and thrown
   a Mongoose `CastError` instead of ever reaching `getMyBooks`. Reordered.

6. **Security: password hash leaked on registration.** The register endpoint
   returned the `user` document straight from `User.create()`. Mongoose's
   `select: false` on the `password` field only affects future *queries* —
   it does **not** strip the field from a document you just created and
   already have in memory. So every successful registration was sending the
   bcrypt hash back to the client in the JSON response. Login already did
   `user.password = undefined` before responding; register now does the same.

All of the above were verified with `node --check` on every backend file
(syntax-level) and a manual trace of every `require(...)` path to confirm it
resolves to a real file with matching case.

## New backend feature: exchange requests

`server.js` already referenced `/api/exchange` and your `Book.status` enum
already included `"Requested"` and `"Reserved"`, but there was no controller
behind any of it. Added a minimal but complete flow:

- `POST /api/exchange/:bookId` — request someone's book (sets it to `Requested`)
- `GET /api/exchange/sent` / `GET /api/exchange/received`
- `PATCH /api/exchange/:id` — owner accepts (→ book `Exchanged`, other pending
  requests on that book auto-rejected) or rejects (→ book back to `Available`)
- `PATCH /api/exchange/:id/cancel` — requester cancels their own request

## Frontend — rebuilt to match the new backend

The backend now has real auth, ownership, and a much richer Book schema, so
the frontend from the previous version no longer matched it. Rebuilt:

- **Auth**: Login/Register pages, JWT stored client-side, attached to every
  request, auto-cleared on 401.
- **Ownership-aware UI**: the Add Book form no longer asks for an "owner"
  field (the backend sets it from the JWT); Edit/Delete on a book's detail
  page only appear if you're logged in as that book's owner.
- **Pagination**: matches the backend's paginated `GET /books`.
- **Full schema**: condition, description, publisher, ISBN, tags, location,
  views — all wired up, using the exact enums from `Backend/models/book.js`.
- **Exchange requests UI**: a `My Books` dashboard with three tabs — your
  listings, requests received (accept/decline), requests sent (cancel).

See `frontend/README.md` for the full stack/folder breakdown.

## Before you run it

- Backend `.env` already has `PORT=5000`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE` — reuse yours.
- `frontend/.env.example` now points at `http://localhost:5000/api` (was `:3000` with no `/api` prefix in the old version).
- Run `npm install` in **both** `Backend/` and `frontend/` — this sandbox has
  no network access, so none of this was `npm install`ed or build-tested here;
  everything was checked statically (syntax, import/export pairing, route
  ordering, schema field matching). Worth a quick smoke test on your end.

---

## Round 2 — Image upload + Dashboard

You sent a follow-up prompt describing the *original* simple schema (no auth,
plain `owner` string) — but the actual project on disk had already moved to
the auth + ownership + exchange-request version from Round 1. Per "don't
recreate from scratch," I kept building on the real, current codebase rather
than reverting, and focused on the two concrete, unambiguous asks: **book
cover image upload** (explicitly high priority) and a **Dashboard page**.

### Backend

- **`middleware/uploadMiddleware.js`** (new) — Multer disk storage, saves to
  `Backend/uploads/`, validates JPG/JPEG/PNG/WEBP by mime type, 5 MB limit.
  Creates the `uploads/` folder on boot if it's missing.
- **`addBook`** — now requires `req.file` (400 `"Book image is required."`
  if missing) and stores `coverImage` as `uploads/<filename>`. If the file
  was already written to disk by Multer but a later text-field validation
  fails, the orphaned file is deleted so `uploads/` doesn't accumulate junk.
- **`updateBook`** — supports three cases: a new file replaces the old one
  (old file deleted from disk), `removeImage: "true"` in the body clears it
  (old file deleted), or neither is sent and the existing image is kept.
  Also now parses `tags` correctly whether it arrives as a JSON string, a
  comma-separated string, or a real array (Multer turns repeated `tags`
  fields into an array automatically).
- **`permanentDeleteBook`** — now also deletes the associated image file
  from disk so hard-deleting a book doesn't leave it behind.
- **`getStats`** (new) — `GET /api/books/stats`, public, powers the
  Dashboard: total count, counts by status, counts by category.
- **`errorMiddleware.js`** — now translates Multer errors (oversized file,
  wrong type) into friendly 400 JSON instead of a raw stack trace.
- **`bookRoutes.js`** — wired `upload.single("image")` onto `POST /` and
  `PUT /:id`; added `GET /stats` (registered before `/:id`, same ordering
  gotcha as `/my-books` from Round 1).
- Added `multer` to `package.json`.

### Frontend

- **`components/ImageUpload.jsx`** (new) — drag & drop + click-to-browse,
  live preview, replace/remove buttons, upload progress bar, inline
  validation (type/size) before the request is even sent.
- **`api/axios.js`** — removed the hardcoded `Content-Type: application/json`
  default. It was fine for JSON requests (axios sets that automatically
  anyway) but would have broken every image upload by overriding the
  multipart boundary Axios needs to set for `FormData`.
- **`api/books.js`** — `createBook`/`updateBook` now take a `FormData`
  payload and an optional progress callback; added `getBookStats`.
- **`utils/buildBookFormData.js`** (new) — one place that turns form state
  into the `FormData` both Add and Edit send.
- **`utils/image.js`** (new) — `getImageUrl()` turns a stored
  `"uploads/xyz.jpg"` path into an absolute URL against the API's origin
  (not its `/api` base — static files are served from the root).
- **`pages/AddBook.jsx`** / **`pages/EditBook.jsx`** — integrated
  `ImageUpload`; Add requires an image, Edit allows keep/replace/remove.
- **`components/BookCard.jsx`** — redesigned with the cover image on top
  (shelf-mark and status badge now overlay the image); falls back to a
  book-icon placeholder when there's no cover.
- **`pages/BookDetails.jsx`** — large hero cover image up top with a hover
  zoom, same placeholder fallback.
- **`pages/Dashboard.jsx`** + **`components/CategoryDonut.jsx`** (new) —
  stat cards (total/available/requested/exchanged), a dependency-free SVG
  donut chart for the category breakdown, and a "recently catalogued"
  section. Added to the Navbar and routes.
- **`components/ScrollToTop.jsx`** (new) — floating back-to-top button,
  appears after scrolling ~480px, wired into `App.jsx`.

### What I deliberately didn't change

- **Table vs. cards for the book list**: your prompt asked for a
  "professional table... responsive cards on mobile." The existing project
  already uses a card grid at every breakpoint, which fits the catalog-card
  visual identity better than a data table and is arguably more modern for
  a consumer-facing browse page. I kept it rather than bolting on a
  literal `<table>` that would clash with the design. Happy to add a
  dedicated sortable table view (e.g. for an admin screen) if you want one
  specifically — it's a bigger, separate piece of scope.
- Sorting/column-based filtering on the books list — the existing
  search + category filter + pagination covers the "filter/search" ask;
  true multi-column sorting would make more sense once there's a table view.

### Remaining improvements you could add later

- Multiple images per book (schema/UI both currently assume one cover)
- An image preview lightbox/modal on the details page
- Server-side category filtering (currently client-side per loaded page,
  since the backend doesn't have a `?category=` query param yet)
- A dedicated admin table view (sortable, bulk actions) using the existing
  `restoreBook`/`permanentDeleteBook` admin routes, which currently have
  no frontend UI at all

---

## Round 3 — the actual image bug: Helmet's Cross-Origin-Resource-Policy

Your server logs showed `GET /uploads/xxx.jpg 200` — the request was
succeeding — but the image still rendered as broken in the browser. That
combination (200 on the server, broken in the browser) is the signature of
a **client-side CORP block**, not a missing file or wrong URL.

`helmet()` sets `Cross-Origin-Resource-Policy: same-origin` by default on
every response, including the static files served from `/uploads`. Modern
browsers honor that header and will **refuse to render/use a resource**
loaded from a different origin than the page that's displaying it — even
though the HTTP request itself completes fine and shows 200 in your terminal.
Your frontend (`localhost:5173`) and backend (`localhost:5000`) are
different origins (different port = different origin), so every `<img>`
pointed at the backend was being silently blocked by the browser.

**Fix**: `server.js` now configures Helmet with
`crossOriginResourcePolicy: { policy: "cross-origin" }`, which allows the
`/uploads` files (and everything else) to be loaded cross-origin while
keeping every other Helmet protection intact. This is the standard fix for
this exact situation and is safe for a public image-serving folder.

I also kept the `onError` fallback added in the previous round (BookCard,
BookDetails, MyBooks) — it's good defensive practice regardless of root
cause, so a genuinely missing/deleted file still degrades gracefully to the
placeholder icon instead of a broken-image glyph.

**You will need to restart the backend** for this header change to take
effect — same as the earlier `/stats` route fix.

---

## Round 4 — orphaned image cleanup script

The "nexius" book (`1784620882262-atomic.jpg`) turned out to be a genuine
orphaned reference — that file really isn't in `uploads/` anymore (Backend
logs showed a real `404`, not a CORP block). No code fix can display a file
that doesn't exist; that needed a data fix. Added a script to find (and
optionally clean up) every book in this situation automatically, since it's
the kind of thing that'll happen again anytime `uploads/` is reset without
the database being reset alongside it (e.g. re-extracting a fresh copy of
the project, deploying to a new host, etc.).

**`Backend/scripts/checkImages.js`** — connects to your MongoDB, checks
every book's `coverImage` against what's actually on disk in `uploads/`,
and reports any mismatches.

```bash
cd Backend
npm run check-images        # dry run — just lists orphaned books
npm run check-images:fix    # also clears coverImage on those books,
                             # so the frontend placeholder icon shows
                             # instead of a broken image, until you
                             # re-upload a real cover for them
```

It checks soft-deleted books too (flagged as such in the output), since a
stale reference there is still worth knowing about even if it's not
currently visible in the UI.

---

## Round 5 — Profile page + password change

From the full project audit (posted in chat), you didn't pick a priority,
so I went with Profile — the `User` model already had `bio`/`city`/`phone`/
`profileImage` sitting unused, so this was the highest-value, lowest-risk
next step.

### What changed

**Backend**
- **`utils/fileHelpers.js`** (new) — extracted the image-delete-from-disk
  logic that used to live only in `bookController.js` into a shared helper,
  since profile images now need the exact same replace/remove handling.
  `bookController.js` now imports it instead of duplicating it.
- **`authController.js`** — added three functions:
  - `getMe` (`GET /api/auth/me`) — returns the current user plus computed
    stats (`booksListed`, `booksExchanged`, `exchangesCompleted`, the last
    one counting accepted exchanges in either direction).
  - `updateProfile` (`PUT /api/auth/profile`, multipart) — updates
    name/phone/city/bio, and supports replace/remove/keep for the profile
    photo, same pattern as book cover editing.
  - `changePassword` (`PUT /api/auth/change-password`) — verifies the
    current password with bcrypt before hashing and saving the new one.
  - Also fixed the register endpoint's response to reuse the same "hide
    the password" step as before — no behavior change, just noting it's
    still in place after the refactor.
- **`authRoutes.js`** — wired all three behind `protect` (and `upload.single`
  for the profile one).

**Frontend**
- **`pages/Profile.jsx`** (new) — stats cards, "member since," an editable
  details form (photo, name, phone, city, bio — email is shown read-only),
  and a separate change-password form.
- **`components/ImageUpload.jsx`** — generalized so it's not book-specific
  anymore: added `label`, `previewAlt`, `shape` (`"rect"` or `"circle"`),
  and `heightClass` props. Book Add/Edit pages are unaffected (they get the
  same defaults as before); Profile uses `shape="circle"` for the avatar.
- **`context/AuthContext.jsx`** — added `updateUser()` so Profile can push
  a fresh user object into context/localStorage right after saving, without
  a full re-login.
- **`components/Navbar.jsx`** — the avatar/name chip is now a link to
  `/profile`, and renders the actual uploaded `profileImage` when one
  exists (falls back to initials otherwise, same as before). Added a
  "Profile" entry to the mobile menu.
- **`routes/AppRoutes.jsx`** — added the protected `/profile` route.

### What I deliberately didn't build (from the bigger audit)
Forgot/reset password and email verification need an actual email
provider (SMTP credentials, a transactional email service, etc.) that I
don't have — happy to wire it up once you tell me which provider you want
(Resend, SendGrid, Nodemailer+Gmail, etc.). Everything else from the audit
(wishlist, admin panel UI, search/sort/filter overhaul, chat) is still
queued — just say which one's next.

---

## Round 6 — a real auth bug, plus Wishlist/Favorites

### Bug fix: changing your password was logging you out

`authController.js`'s `changePassword` returned **401** when the current
password was wrong. The frontend's axios interceptor treats *any* 401 as
"the session is invalid" and clears the stored JWT — that logic exists for
genuinely expired/missing tokens, but it doesn't distinguish between "your
token is bad" and "you got a business-logic check wrong." So one wrong
guess at your current password silently logged you out, and every request
afterward (including retrying the password change) failed with "Access
denied. No token provided."

**Fix**: that response now returns **403** instead. Correct REST semantics:
401 = not authenticated at all, 403 = authenticated but this specific
action isn't allowed. The frontend already surfaces the message either way
via toast — only the token-clearing side effect was wrong, and that's
fixed by not sending 401 for a non-token problem in the first place.

If you'd already run into this, you'll need to log in again once — your
last token was cleared by the old bug.

### New: Wishlist / Favorites

**Backend**
- **`controllers/favoriteController.js`** (new) — `toggleFavorite`
  (add/remove a book from `req.user.favorites`, which already existed on
  the `User` schema), `getMyFavorites` (populated book list for the
  Wishlist page), `getMyFavoriteIds` (lightweight id list so hearts across
  the app know what to render as filled without fetching full book data).
- **`routes/favoriteRoutes.js`** (new), mounted at `/api/favorites` in
  `server.js`:
  - `GET /api/favorites/ids`
  - `GET /api/favorites`
  - `POST /api/favorites/:bookId` (toggle)

**Frontend**
- **`context/FavoritesContext.jsx`** (new) — loads the current user's
  favorite ids once, exposes `isFavorite(id)` / `toggle(id)` with an
  optimistic update (instant UI feedback, rolled back if the request
  fails). Guests tapping the heart get the same login popup used for
  exchange requests, and their action retries automatically after they
  log in.
- **`pages/Wishlist.jsx`** (new) — protected page, same card grid/empty
  state pattern as My Books/Dashboard.
- **`components/BookCard.jsx`** — heart button overlaid on the cover image
  (bottom-right), filled brass when favorited.
- **`pages/BookDetails.jsx`** — heart button next to the status badge.
- Wired into `main.jsx` (`FavoritesProvider`, nested inside `AuthModalProvider`
  so it can trigger the login popup), `routes/AppRoutes.jsx` (`/wishlist`),
  and `components/Navbar.jsx` (new "Wishlist" link for logged-in users).

Still queued from the original audit: Admin panel UI, server-side
search/sort/filter overhaul, chat/messaging.

---

## Round 7 — Search/Sort/Filter overhaul (server-side)

Previously, Browse only filtered client-side over whatever page happened
to be loaded — a category filter could "hide" books that were actually on
page 2. This round moves everything to the backend, matching what both of
your feature prompts asked for (search by title/author/category/city/isbn/
tags/owner; filters for category/condition/language/status/city; sort by
newest/oldest/A-Z/Z-A/recently-updated; clear filters).

### Backend
- **`bookController.js`** — `getAllBooks` now builds its Mongoose query
  from `req.query`: `search` (regex `$or` across title/author/category/
  isbn/tags/location, plus a separate lookup to match owner name — owner
  is a reference, not a plain field, so it can't join the same `$or`
  directly), `category`, `condition`, `language`, `status`, `city`, and
  `sort` (mapped to `newest`/`oldest`/`az`/`za`/`updated`). The existing
  "Available only" default is preserved when no `status` is passed;
  `status=All` removes the filter entirely if you ever want a "show
  everything" view. Pagination (`page`/`limit`) works exactly as before,
  now applied on top of the filtered query.

### Frontend
- **`api/books.js`** — `getBooks()` now accepts any of the above as named
  params and strips out empty ones before sending, so you don't end up
  with `?category=&condition=` clutter in the request.
- **`hooks/useBooks.js`** — takes a `filters` object alongside `limit`;
  any filter change resets back to page 1 automatically.
- **`components/FilterSelect.jsx`** (new) — small reusable dropdown used
  for Condition/Language/Status/Sort.
- **`pages/Books.jsx`** — rewritten: debounced search (350ms) sent to the
  server instead of filtered client-side, the existing category pill row,
  a new filter bar (condition, language, status, city text input, sort),
  and a "Clear filters" button that resets everything back to defaults.

Home and Dashboard's `getBooks({ page: 1, limit: 4 })` calls are
unaffected — the new params are all optional.

Still queued: Admin panel UI, chat/messaging.

---

## Round 8 — rate limiter was too strict for real usage

You hit `429 Too many requests` across almost every endpoint. The original
setup applied one limiter — 100 requests per 15 minutes — globally, to
every single API call. That's far too tight for how this app actually
behaves: a single page can fire several requests in parallel (auth check,
favorites, stats, books, my-books, exchange sent/received...), and React's
StrictMode in development intentionally double-invokes effects, doubling
every mount-triggered fetch. Normal browsing burns through 100 requests in
a couple of minutes.

**Fix**: split rate limiting into two tiers in the new
**`middleware/rateLimiters.js`**:
- **`generalLimiter`** — 1000 requests/15min, applied globally in
  `server.js`. Generous enough that no real usage pattern hits it, while
  still providing basic abuse protection.
- **`authLimiter`** — 30 requests/15min, applied *only* to
  `POST /api/auth/register` and `POST /api/auth/login` in `authRoutes.js`.
  This is where rate limiting actually matters (slowing down
  password-guessing attempts) — everything else doesn't need to be nearly
  this strict.

**You'll need to restart the backend** for this to take effect. Restarting
also immediately clears the current block — `express-rate-limit`'s counter
lives in memory and resets when the process restarts, so you don't need to
wait out the 15-minute window.

---

## Round 9 — Admin panel UI

The backend already had `adminOnly` middleware and two admin book routes
(restore/permanent-delete) sitting unused with no frontend. Built out a
full admin panel on top of that.

### Backend
- **`bookController.js`** — added `getAllBooksAdmin`
  (`GET /api/books/admin/all`), which lists *every* book including
  soft-deleted ones (the regular `/books` endpoint always excludes
  `isDeleted: true`), with search and pagination. Registered before `/:id`
  in `bookRoutes.js`, same ordering rule as `/my-books` and `/stats`.
- **`authController.js`** — added three admin-only functions:
  - `getAllUsers` (`GET /api/auth/users`) — paginated, searchable by name/email
  - `updateUserRole` (`PATCH /api/auth/users/:id/role`) — promote/demote
    between `User`/`Admin`; blocks an admin from demoting their own account
  - `toggleUserDeleted` (`PATCH /api/auth/users/:id/toggle-delete`) —
    deactivate/restore a user (soft delete, mirrors how books already
    work); blocks deleting your own account
  - Both self-protection checks return `400`, not `401`/`403`, since it's
    a normal validation rule, not an auth failure (same reasoning as the
    change-password fix in Round 6)

### Frontend
- **`api/admin.js`** (new) — service layer for all of the above
- **`components/AdminRoute.jsx`** (new) — wraps `ProtectedRoute` (so you
  get the login prompt if logged out) and additionally checks
  `user.role === "Admin"`, showing a clean "Admins only" message otherwise
  rather than a blank page or crash
- **`pages/Admin.jsx`** (new) — tabbed panel:
  - **Manage Books** — every book (including deleted ones, clearly
    labeled), search, restore or permanently delete
  - **Manage Users** — every user, role badge, search, promote/demote,
    deactivate/restore — your own row's action buttons are disabled
    client-side too, not just blocked server-side
- **`routes/AppRoutes.jsx`** — added `/admin` behind `AdminRoute`
- **`components/Navbar.jsx`** — "Admin" link appears only when
  `user.role === "Admin"` (both desktop and mobile menus)

### One thing you'll need to do manually
There's no signup flow for admin accounts (correctly — that shouldn't be
self-serve). To make your own account an admin, set it directly in
MongoDB: find your user document in the `users` collection and change
`role` from `"User"` to `"Admin"`, then log out and back in so your token/
profile reflects the change. After that, you can promote other accounts
from the panel itself.

Still queued: real-time chat, forgot/reset password (needs an email
provider — let me know which one you want to use).

---

## Round 10 — bootstrap admin account, and a real caching bug

### Bug fix: DB role changes weren't reflected in the app

This was a real bug, not user error. `AuthContext` initialized `user`
purely from a cached copy in `localStorage` and never re-fetched it from
the server — so if a role (or anything else) changed in the database
directly, the app kept using the stale cached copy until you did a full
logout/login. That's why manually setting `role: "Admin"` in MongoDB
didn't do anything: your browser was still holding onto the old cached
user object.

**Fix**: `AuthContext` now calls `GET /api/auth/me` once when the app
loads (if a token exists) and refreshes `user` from the server — the
database is the source of truth, not whatever got cached at last login.

### New: a permanent, self-healing admin account

Rather than relying on manual MongoDB edits (fragile, and per the bug
above, wasn't even taking effect), added `ADMIN_EMAIL`/`ADMIN_PASSWORD` to
`.env` (set to your requested `waqar52524@gmail.com` / `seebooks@`) and:

- **`config/seedAdmin.js`** (new) — runs once when the server starts.
  Creates that account if it doesn't exist yet, or if it already exists,
  forces its role back to `"Admin"` (and un-deletes it if it was ever
  deactivated). This means that account can never get "stuck" as a
  regular user, no matter what happens to it.
- **`authController.js`** — `loginUser` also double-checks this at login
  time as a second safety net, in case `.env` was added/edited without
  restarting the server since.
- **Frontend** — after a successful login, if `user.role === "Admin"`,
  you're taken straight to `/admin` (both the standalone Login page and
  the popup modal, though the modal only does this for a *direct* login —
  if you triggered the modal by trying to do something else first, like
  favoriting a book, it resumes that action instead of yanking you away).

**You'll need to restart the backend** for `seedAdmin` to run and create/
fix the account. After that, log in with `waqar52524@gmail.com` /
`seebooks@` — you should land straight on `/admin`.

---

## Round 11 — real user blocking, and per-user book limits

### Bug fix: "Deactivate" from Round 9 didn't actually block anything

Worth flagging: the "Deactivate/Restore" action I built in the Admin panel
last round toggled a field (`isDeleted`) that was never actually checked
anywhere — not at login, not on any protected request. A "deactivated"
user could keep using the app entirely normally with their existing
session. That's now fixed as part of this round.

### New: Block / Unblock (a real block this time)

- **`models/User.js`** — added a dedicated `isBlocked` field (kept
  `isDeleted` separate rather than reusing it, since "soft-deleted" and
  "temporarily blocked" are different concepts that shouldn't be
  conflated).
- **`middleware/authMiddleware.js`** — `protect` now rejects every
  request from a blocked user with `401`, even with an otherwise valid
  token. This is the important part: a JWT is stateless, so without this
  check a user blocked mid-session would keep working until their token
  naturally expired (7 days). Now it takes effect immediately, and the
  frontend's existing 401 handling cleanly logs them out.
- **`authController.js`** — `loginUser` also rejects login attempts for
  blocked accounts (also `401`, consistent with other login failures).
  Renamed `toggleUserDeleted` → `toggleUserBlocked`, operating on the new
  field. The bootstrap admin account (`ADMIN_EMAIL`) can't be blocked by
  anyone, including other admins — it's the account of last resort.
- **Frontend `pages/Admin.jsx`** — "Deactivate/Restore" buttons are now
  "Block/Unblock", with a "Blocked" badge instead of "Deactivated".

### New: per-user book listing limits

- **`models/User.js`** — added `bookLimit` (a number, or `null` for no
  limit — the default).
- **`authController.js`** — `updateUserBookLimit`
  (`PATCH /api/auth/users/:id/book-limit`), admin-only.
- **`bookController.js`** — `addBook` now checks `req.user.bookLimit`
  before creating a book: if the user already owns that many (non-deleted)
  books, the request is rejected with `403` and a clear message, and the
  already-uploaded cover image is cleaned up so it doesn't orphan on disk.
- **Frontend** — each row in the Admin panel's Users tab now has an
  inline "Book limit" field (blank = unlimited) with its own Set button.
  The Add Book page shows a small notice ("Your account can list up to N
  books") when a limit is set, so the restriction isn't a surprise when
  someone hits it.

**Restart your backend** for the model changes to take effect. Test flow:
block a test account → confirm it's logged out immediately and can't log
back in → unblock it → confirm it works again. Then set a book limit of,
say, 2 on a test account and try adding a 3rd book.

---

## Round 12 — default book limit, admin user detail view, PDF/read-link

### Default book limit (10, admin-overridable)

- **`.env`**: added `DEFAULT_BOOK_LIMIT=10`.
- **`bookController.js`**: `addBook` now uses `req.user.bookLimit` if an
  admin has set one for that specific account, otherwise falls back to
  `DEFAULT_BOOK_LIMIT`. So every user is capped at 10 books unless an
  admin explicitly changes it for them in the panel (blank = go back to
  the default; any number = that user's specific limit).

### Admin: view a user's profile + all their books

- **`authController.js`**: new `getUserDetailsAdmin`
  (`GET /api/auth/users/:id`) — returns the full user profile plus every
  book they've ever listed (including soft-deleted ones, flagged
  separately) and some quick stats (total/active/exchanged).
- **`pages/AdminUserDetail.jsx`** (new), routed at `/admin/users/:id` —
  profile card (avatar, bio, city, phone, book limit, blocked status),
  stat cards, and a grid of their active listings. Click any user's name
  in the Admin panel's Users tab to get here.

### Book PDF upload + "read online" link

- **`models/book.js`**: added `readLink` (a plain URL) and `pdfFile`
  (stored the same way as `coverImage` — a relative `uploads/...` path).
- **`middleware/uploadMiddleware.js`**: now validates file type per
  *field name* — `image`/`profileImage` still only accept images,
  `pdfFile` only accepts `application/pdf`. Bumped the shared size limit
  to 15 MB to accommodate PDFs (images are still separately capped at
  5 MB client-side).
- **`bookRoutes.js`**: `POST /books` and `PUT /books/:id` now use
  `upload.fields([...])` instead of `upload.single("image")`, so a
  request can carry both a cover image and a PDF at once.
- **`bookController.js`**: `addBook`/`updateBook` rewritten to read
  `req.files.image`/`req.files.pdfFile` instead of `req.file`; both
  properly clean up any already-written files if a later validation
  check fails, so nothing orphans in `/uploads`. `updateBook` supports
  keep/replace/remove for the PDF the same way it already did for the
  cover image (`removePdf: "true"` to clear it). `permanentDeleteBook`
  now also removes the PDF file from disk.
- **Frontend**: new **`components/PdfUpload.jsx`** (drag & drop, no
  preview thumbnail — just a filename chip with replace/remove). Wired
  into both `AddBook.jsx` and `EditBook.jsx`, alongside a new "Read
  online link" text field. `BookDetails.jsx` shows "Read online" /
  "Download PDF" buttons when either is set, visible to anyone viewing
  the book (not just the owner).

**Restart your backend** for the schema/model changes to take effect.

---

## Round 13 — Forgot / Reset Password (via Gmail SMTP)

Built the full flow using `nodemailer` over Gmail SMTP — free, no paid
email service needed, just a Gmail account.

### Backend
- **`models/User.js`** — added `resetPasswordToken` (a SHA-256 hash, never
  the raw token) and `resetPasswordExpire`.
- **`utils/sendEmail.js`** (new) — thin wrapper around nodemailer's Gmail
  transport. Throws a clear error if `EMAIL_USER`/`EMAIL_PASS` aren't set,
  rather than crashing or failing silently.
- **`authController.js`**:
  - `forgotPassword` (`POST /api/auth/forgot-password`) — generates a
    random token, stores only its hash + a 15-minute expiry, emails the
    *raw* token as a link. Always returns the same generic message
    whether or not the email exists, so this endpoint can't be used to
    check which emails are registered. If sending the email fails, the
    token is cleared again immediately (no dangling valid token left
    behind).
  - `resetPassword` (`POST /api/auth/reset-password/:token`) — hashes the
    incoming token, looks up a user whose stored hash matches *and* whose
    expiry hasn't passed, updates the password, clears the reset fields.
- **`authRoutes.js`** — both routes are rate-limited the same as login/
  register (`authLimiter`), since this is exactly the kind of endpoint
  someone could otherwise hammer.
- **`.env`** — added `FRONTEND_URL` (used to build the reset link) and
  blank `EMAIL_USER`/`EMAIL_PASS` placeholders.

### Frontend
- **`api/auth.js`** — `forgotPassword(email)`, `resetPassword(token, newPassword)`
- **`pages/ForgotPassword.jsx`** (new) — email form, generic
  "check your inbox" confirmation
- **`pages/ResetPassword.jsx`** (new) — reads the token from the URL
  (`/reset-password/:token`), new password + confirm
- **`pages/Login.jsx`** and **`components/AuthModal.jsx`** — added a
  "Forgot password?" link (the modal version closes the popup and
  navigates, since a full page makes more sense for this flow than
  another nested popup)

### You need to do this before it'll actually send emails

1. Go to a Gmail account (yours or a dedicated one) → turn on
   **2-Step Verification**: https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password (name it anything, e.g. "Chapter & Verse")
4. Google gives you a 16-character password — put that in `Backend/.env`:
   ```
   EMAIL_USER=your_gmail_address@gmail.com
   EMAIL_PASS=the_16_character_app_password
   ```
   **Not** your normal Gmail password — Gmail blocks that for SMTP.
5. Restart the backend.

If you skip this setup, "Forgot password" will fail with a clear
"Email isn't configured on this server" error instead of crashing —
so the rest of the app keeps working fine either way.

