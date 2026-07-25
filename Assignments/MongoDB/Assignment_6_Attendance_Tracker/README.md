# 🎯 AttendancePro — Premium MERN Stack Attendance Tracker

A production-ready, full-stack **Attendance Tracker** built with **MongoDB, Express.js, React (Vite), and Node.js**, featuring a premium glassmorphism admin dashboard UI.

![Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Stack](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

---

## ✨ Features

### Backend
- Clean **MVC architecture** (Config / Models / Controllers / Routes / Middleware)
- **JWT authentication** — register/login endpoints, bcrypt password hashing, protected routes
- **Per-user data ownership** — each attendance record belongs to the user who created it; regular users only ever see their own records
- **Admin panel API** — list every registered user with their attendance record count, and block/unblock accounts
- **Account blocking** — a blocked user is signed out of any active session immediately and cannot log back in
- Full **CRUD REST API** for attendance records (all routes require a valid logged-in user)
- `GET /api/attendance/count` endpoint for dashboard statistics
- Search, filter (status & date), sort, and pagination support via query params
- Centralized error handling middleware with consistent JSON responses
- Mongoose schema validation (required fields, enum status, trimming)
- `async/await` + `try/catch` (via an `asyncHandler` wrapper) throughout
- Environment-based configuration with `.env`

### Frontend
- **Login & Registration pages** with client-side validation, protected dashboard route, auto-redirect on session expiry
- **Admin Panel page** (`/admin/users`, admin-only) — see every user, how many records they've marked, and block/unblock any account with one click
- Premium **glassmorphism** admin dashboard with animated gradient background
- Fully responsive layout (mobile, tablet, laptop, desktop)
- Sticky navbar showing the logged-in user, an **Admin Panel** shortcut (admins only), **dark mode toggle**, and logout
- Animated dashboard stat cards (Total, Present, Absent, Attendance %) with progress bars
- Attendance form with client-side validation (Add / Update / Reset)
- Sortable, searchable, filterable attendance table with status badges
- Live search (debounced), filter by status & date
- Pagination
- Export to **PDF** and **Excel**, plus **Print** support
- SweetAlert2 confirmation dialogs for deletes/logout/block-unblock + toast notifications for all actions
- Recent Activity feed
- Framer Motion animations throughout
- Empty states & premium loading spinners

---

## 📁 Project Structure

```
attendance-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   └── authController.js
│   ├── middleware/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   ├── Attendance.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── authRoutes.js
│   ├── sample-data/
│   │   ├── attendance.sample.json
│   │   └── seed.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AttendanceForm.jsx
│   │   │   ├── AttendanceTable.jsx
│   │   │   ├── DashboardCards.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RecentActivity.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── attendanceService.js
│   │   │   └── authService.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── exportUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── postman/
│   └── Attendance-Tracker.postman_collection.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** running locally, or a **MongoDB Atlas** connection string

### 1. Clone / extract the project
```bash
cd attendance-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI if needed
npm run dev
```
The API will start on **http://localhost:5000** (or the `PORT` set in `.env`).

Optional — seed the database with sample data:
```bash
npm run seed
```

### 3. Frontend Setup
Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
The app will start on **http://localhost:5173**.

### 4. Create an account and log in
Visit `http://localhost:5173` — you'll land on the **Login** page. Click **"Create one"** to register a new account (name, email, password), which logs you in automatically and takes you to the dashboard. On future visits, just log in with that email/password.

---

## 🔐 Authentication

All `/api/attendance/*` endpoints require a valid JWT sent as a Bearer token:
```
Authorization: Bearer <token>
```

| Method | Endpoint             | Description                              | Access  |
|--------|------------------------|-------------------------------------------|---------|
| POST   | `/api/auth/register`  | Create a new account (name, email, password) | Public  |
| POST   | `/api/auth/login`     | Log in and receive a JWT                  | Public  |
| GET    | `/api/auth/me`        | Get the current authenticated user's profile | Private |

The frontend stores the returned token in `localStorage` (`attendance-token`) and attaches it automatically to every API request via an Axios interceptor. If a request comes back `401` (expired/invalid token), the user is signed out and redirected to `/login`.

**Passwords** are hashed with bcrypt (10 salt rounds) before being stored — the plain-text password is never saved or returned in any API response.

### Data ownership — who sees what

Every attendance record is tied to the user who created it (`createdBy`):

- **`teacher` role (default for every self-registered account)** — can only see, edit, and delete the attendance records **they personally created**. They will never see another user's records.
- **`admin` role** — can see and manage **every** user's attendance records.

New accounts **always** register as `teacher` — there is no way to self-grant `admin` through the public registration form (this is enforced server-side). To create an admin account, either:
- Run `npm run seed` in `backend/`, which creates a demo `admin` account (`demo@attendancepro.com` / `demo1234`) along with sample data, or
- Manually update a user's `role` field to `"admin"` directly in MongoDB.

### Admin Panel

Logging in as an `admin` shows an **"Admin Panel"** link in the navbar, leading to `/admin/users`. From there an admin can:
- See every registered user, their role, join date, and **how many attendance records they've personally marked**
- **Block** a user — they are signed out immediately (even mid-session) and cannot log back in until unblocked
- **Unblock** a previously blocked user, restoring their access

Non-admin users are redirected away from `/admin/users` if they try to visit it directly, and the underlying `/api/admin/*` endpoints reject non-admin requests with a 403 regardless of what the frontend shows.

| Method | Endpoint                        | Description                                | Access        |
|--------|-----------------------------------|----------------------------------------------|---------------|
| GET    | `/api/admin/users`                | List all users + their attendance record count | Private/Admin |
| PUT    | `/api/admin/users/:id/block`      | Block a user (cannot block yourself)          | Private/Admin |
| PUT    | `/api/admin/users/:id/unblock`    | Unblock a user                                | Private/Admin |

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint                | Description                                   |
|--------|--------------------------|------------------------------------------------|
| POST   | `/attendance`            | Create a new attendance record                 |
| GET    | `/attendance`            | Get all records (supports search/filter/sort/pagination query params) |
| GET    | `/attendance/:id`        | Get a single record by ID                       |
| PUT    | `/attendance/:id`        | Update a record by ID                           |
| DELETE | `/attendance/:id`        | Delete a record by ID                           |
| GET    | `/attendance/count`      | Get total/present/absent counts + percentage    |

### Query Parameters for `GET /attendance`
| Param     | Type   | Description                                      |
|-----------|--------|---------------------------------------------------|
| `search`  | string | Case-insensitive search on `studentName`           |
| `status`  | string | `Present` or `Absent`                              |
| `date`    | string | ISO date — filters records for that calendar day  |
| `sortBy`  | string | `studentName`, `date`, `status`, or `createdAt`    |
| `order`   | string | `asc` or `desc`                                    |
| `page`    | number | Page number (default `1`)                          |
| `limit`   | number | Records per page (default `10`)                    |

### Sample Request Body (POST / PUT)
```json
{
  "studentName": "John Carter",
  "date": "2026-07-24",
  "status": "Present"
}
```

### Sample Success Response
```json
{
  "success": true,
  "message": "Attendance record created successfully",
  "data": {
    "_id": "66a1f2c3e4b0a1234567890a",
    "studentName": "John Carter",
    "date": "2026-07-24T00:00:00.000Z",
    "status": "Present",
    "createdAt": "2026-07-24T10:15:00.000Z",
    "updatedAt": "2026-07-24T10:15:00.000Z"
  }
}
```

### Sample Error Response
```json
{
  "success": false,
  "message": "Student name and status are required"
}
```

---

## 📮 Postman Collection
Import `postman/Attendance-Tracker.postman_collection.json` into Postman to test every endpoint out of the box. A `baseUrl` collection variable is pre-configured to `http://localhost:5000/api`.

---

## 🗄️ Sample MongoDB Data
Sample seed data is available at `backend/sample-data/attendance.sample.json` and can be loaded automatically with:
```bash
cd backend
npm run seed
```

---

## 🎨 UI / Design Notes
- Glassmorphism panels (`backdrop-filter: blur`) over animated gradient backgrounds
- Dark mode toggle persists the user's preference in `localStorage`
- Custom Bootstrap 5 overrides (buttons, forms, tables, pagination) live in `frontend/src/styles/index.css`
- Framer Motion powers staggered card entrances, form transitions, and row animations
- Fully responsive: table collapses into stacked "cards" on small screens

---

## 🛠️ Tech Stack

| Layer     | Technology                                                            |
|-----------|------------------------------------------------------------------------|
| Frontend  | React (Vite), React Router DOM, Axios, Bootstrap 5, React Icons, SweetAlert2, Framer Motion, jsPDF, SheetJS (xlsx) |
| Backend   | Node.js, Express.js, MongoDB, Mongoose, dotenv, cors, nodemon          |

---

## 📝 License
MIT — free to use for learning or production purposes.
