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
- Full **CRUD REST API** for attendance records
- `GET /api/attendance/count` endpoint for dashboard statistics
- Search, filter (status & date), sort, and pagination support via query params
- Centralized error handling middleware with consistent JSON responses
- Mongoose schema validation (required fields, enum status, trimming)
- `async/await` + `try/catch` (via an `asyncHandler` wrapper) throughout
- Environment-based configuration with `.env`

### Frontend
- Premium **glassmorphism** admin dashboard with animated gradient background
- Fully responsive layout (mobile, tablet, laptop, desktop)
- Sticky navbar with **dark mode toggle**
- Animated dashboard stat cards (Total, Present, Absent, Attendance %) with progress bars
- Attendance form with client-side validation (Add / Update / Reset)
- Sortable, searchable, filterable attendance table with status badges
- Live search (debounced), filter by status & date
- Pagination
- Export to **PDF** and **Excel**, plus **Print** support
- SweetAlert2 confirmation dialogs for deletes + toast notifications for all actions
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
│   │   └── attendanceController.js
│   ├── middleware/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   └── Attendance.js
│   ├── routes/
│   │   └── attendanceRoutes.js
│   ├── sample-data/
│   │   ├── attendance.sample.json
│   │   └── seed.js
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
│   │   │   └── RecentActivity.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── attendanceService.js
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

### 4. Open the app
Visit `http://localhost:5173` in your browser. The dashboard will automatically communicate with the backend API at `http://localhost:5000/api`.

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
