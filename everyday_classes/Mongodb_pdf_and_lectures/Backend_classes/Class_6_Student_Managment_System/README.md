# 🎓 Student Management System

A full-stack **Student Management System** built with the **MERN stack** (MongoDB, Express, React, Node.js). It lets you register, view, search, sort, update, and delete student records through a clean, animated admin-style dashboard.

---

## ✨ Features

- **Register / Update / Delete students** — full CRUD, backed by MongoDB
- **Live search** — filter instantly by name or email
- **Sorting** — by name, email, or created date (ascending/descending)
- **Pagination-style "See More / See Less"** — starts with 3 users, loads 5 more at a time
- **Dashboard stats** — total users, users registered today, last registered user
- **Password visibility toggle** — both on the form and per row in the table
- **Confirm-before-delete** — SweetAlert2 confirmation dialog instead of a browser popup
- **Toast notifications** — success / error / warning messages via React Toastify
- **Skeleton loaders** — smooth loading state while data is fetched
- **Smooth animations** — page, card, and row transitions via Framer Motion
- **Fully responsive** — works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, Vite |
| Styling    | Custom CSS (design system with CSS variables) |
| Animation  | Framer Motion |
| Icons      | React Icons |
| Alerts     | React Toastify, SweetAlert2 |
| HTTP Client| Axios |
| Backend    | Node.js, Express 5 |
| Database   | MongoDB with Mongoose |

---

## 📁 Project Structure

```
Class_5_Student_Managment_System/
├── Backend/                  # Express + MongoDB API
│   ├── models/
│   │   └── User.js           # Mongoose schema (name, email, password, timestamps)
│   ├── server.js             # API routes + server setup
│   ├── .env                  # Environment variables (Mongo URI, port)
│   └── package.json
│
├── frontend/                 # React + Vite client
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserForm.jsx  # Register / update form
│   │   │   ├── UserTable.jsx # Search, sort, table, delete, see more/less
│   │   │   ├── StatsBar.jsx  # Dashboard stat cards
│   │   │   └── Loader.jsx    # Skeleton + page loaders
│   │   ├── hooks/
│   │   │   └── useUsers.js   # Shared data-fetching hook
│   │   ├── services/
│   │   │   └── api.js        # Axios instance (base URL config)
│   │   ├── App.jsx           # App shell / layout
│   │   └── App.css           # Design system + all styling
│   └── package.json
│
└── README.md                 # You are here
```

---

## 🔌 API Endpoints (Backend)

| Method | Endpoint         | Description               |
|--------|------------------|----------------------------|
| POST   | `/register`      | Create a new user          |
| POST   | `/login`         | Login an existing user     |
| GET    | `/users`         | Get all users               |
| GET    | `/users/:id`     | Get a single user by ID    |
| PUT    | `/users/:id`     | Update a user by ID        |
| DELETE | `/users/:id`     | Delete a user by ID        |

Base URL used by the frontend: `http://localhost:3000` (set in `frontend/src/services/api.js`).

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- A MongoDB database (local `mongod` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create/update `Backend/.env` with your database connection:

```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

Start the server:

```bash
npm start        # production
npm run dev       # with nodemon (auto-restart)
```

The API will run at `http://localhost:3000`.

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` (default Vite port) and connect to the backend automatically.

---

## 🎨 Design System

The UI follows a consistent indigo / purple / blue theme defined with CSS variables in `App.css`:

- **Primary colors:** Indigo `#4F46E5`, Purple `#7C3AED`, Blue `#2563EB`
- **Background:** Light gray `#F3F4FB` with white glass cards
- **Typography:** `Sora` for headings, `Inter` for body text
- **Motion:** Framer Motion for entrances, hover states, and list transitions

---

## 📌 Notes

- Passwords are currently stored and displayed in plain text for learning purposes — for a production app, hash passwords (e.g. with `bcrypt`) before saving them.
- `Backend/.env` contains sensitive credentials — do not commit it to a public repository.

---

## 👤 Author

Built as a learning project to practice full-stack CRUD development with the MERN stack.
