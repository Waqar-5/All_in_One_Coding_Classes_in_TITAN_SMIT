# 🎓 Student Management System API

A professional **RESTful CRUD API** built with **Node.js, Express.js, and MongoDB Atlas** for managing student records.

This project was developed as a backend assignment to understand real-world backend development concepts including API creation, database integration, MVC architecture, validation, error handling, and testing with Postman.

---

# 🚀 Project Overview

The **Student Management System API** allows users to perform complete CRUD operations:

- ✅ Create new students
- ✅ View all students
- ✅ View a single student by ID
- ✅ Update student information
- ✅ Delete student records

The API is connected with **MongoDB Atlas** using **Mongoose ODM** for database management.

---

# 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime environment |
| Express.js | Backend framework for creating APIs |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| dotenv | Manage environment variables |
| Postman | API testing tool |
| Git & GitHub | Version control |

---

# 📂 Project Structure

```
student-management-api/

│
├── config/
│   └── db.js                 # MongoDB connection setup
│
├── controllers/
│   └── studentController.js  # CRUD business logic
│
├── models/
│   └── Student.js            # Student database schema
│
├── routes/
│   └── studentRoutes.js      # API route definitions
│
├── middleware/
│   └── errorMiddleware.js    # Error handling middleware
│
├── .env                      # Environment variables
├── .gitignore                # Ignored files
├── server.js                 # Main application entry point
├── package.json              # Project dependencies
└── README.md                 # Documentation
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone your-github-repository-link
```

---

## 2. Navigate Into Project

```bash
cd student-management-api
```

---

## 3. Install Dependencies

```bash
npm install
```

Installed packages:

```bash
npm install express mongoose dotenv
```

---

## 4. Create Environment File

Create a `.env` file:

```
PORT=3000

MONGO_URI=your_mongodb_atlas_connection_string
```

---

## 5. Start Server

Development mode:

```bash
npm run dev
```

or

```bash
node server.js
```

Server will start:

```
http://localhost:3000
```

---

# 🔗 API Endpoints

Base URL:

```
http://localhost:3000/api/students
```

---

# 1️⃣ Create Student

### POST

```
/api/students
```

### Request Body

```json
{
    "name":"Waqar Ali",
    "rollNumber":"CS-101",
    "email":"waqar@gmail.com",
    "department":"Computer Science",
    "semester":5,
    "cgpa":3.8,
    "age":21,
    "phone":"03001234567",
    "city":"Sukkur"
}
```

### Response

```json
{
    "success":true,
    "message":"Student created successfully."
}
```

---

# 2️⃣ Get All Students

### GET

```
/api/students
```

Returns all students from MongoDB.

Example response:

```json
{
    "success":true,
    "totalStudents":10,
    "data":[]
}
```

---

# 3️⃣ Get Student By ID

### GET

```
/api/students/:id
```

Example:

```
/api/students/687abc123456789
```

Returns a single student record.

---

# 4️⃣ Update Student

### PUT

```
/api/students/:id
```

Example Request:

```json
{
    "cgpa":3.9,
    "semester":6
}
```

Features:

- ID validation
- Duplicate email checking
- Duplicate roll number checking
- Schema validation

---

# 5️⃣ Delete Student

### DELETE

```
/api/students/:id
```

Deletes a student from MongoDB.

Response:

```json
{
    "success":true,
    "message":"Student deleted successfully."
}
```

---

# 🗄️ Database Model

Each student document contains:

| Field | Type | Description |
|-|-|-|
| name | String | Student name |
| rollNumber | String | Unique roll number |
| email | String | Unique email |
| department | String | Student department |
| semester | Number | Current semester |
| cgpa | Number | Student CGPA |
| age | Number | Student age |
| phone | String | Contact number |
| city | String | Student city |
| isGraduated | Boolean | Graduation status |
| createdAt | Date | Creation time |
| updatedAt | Date | Last update time |

---

# 🔐 Validation & Error Handling

The API includes:

✅ Required field validation

✅ Duplicate email prevention

✅ Duplicate roll number prevention

✅ MongoDB ObjectId validation

✅ Proper HTTP status codes

✅ Try-catch error handling

✅ Meaningful error messages

---

# 📊 HTTP Status Codes Used

| Status Code | Meaning |
|-|-|
| 200 | Successful request |
| 201 | Data created successfully |
| 400 | Bad request |
| 404 | Data not found |
| 409 | Duplicate data conflict |
| 500 | Server error |

---

# 🧪 API Testing

All APIs were tested using:

## Postman

Testing included:

- Creating students
- Fetching students
- Updating records
- Deleting records
- Testing invalid requests
- Checking database responses

---

# 🏗️ Architecture Used

This project follows the MVC pattern:

```
        Client
          |
          ↓
       Routes
          |
          ↓
     Controller
          |
          ↓
        Model
          |
          ↓
     MongoDB Atlas
```

### Model

Responsible for:

- Database structure
- Schema validation

### Controller

Responsible for:

- Business logic
- CRUD operations
- Error responses

### Routes

Responsible for:

- API URL mapping

---

# 📚 What I Learned From This Project

Through this project I learned:

✅ Building REST APIs with Express.js

✅ Connecting Node.js with MongoDB Atlas

✅ Working with Mongoose models and schemas

✅ Implementing CRUD operations

✅ Creating MVC architecture

✅ Validating user input

✅ Handling backend errors

✅ Testing APIs with Postman

✅ Managing environment variables securely

✅ Using Git and GitHub for version control

---

# 🔮 Future Improvements

Possible future upgrades:

- User authentication with JWT
- Password encryption using bcrypt
- Role-based authorization
- Pagination
- Search and filtering
- Image upload
- Admin dashboard
- API documentation using Swagger

---

# 👨‍💻 Developer

**Waqar Ali**

Backend Developer | MERN Stack Learner

---

# ⭐ Project Status

```
Completed ✅
```

This project demonstrates a complete beginner-to-intermediate backend CRUD application using modern technologies.