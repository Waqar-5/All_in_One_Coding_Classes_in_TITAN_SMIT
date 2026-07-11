# 🚀 Express.js User Registration API (Beginner to Professional Guide)

> A beginner-friendly REST API built using **Node.js** and **Express.js** that demonstrates backend fundamentals without using a database. User data is temporarily stored in memory (an array).

---

# 📖 Table of Contents

1. Project Overview
2. Technologies Used
3. Project Structure
4. Installation
5. Running the Project
6. What is Express?
7. Client-Server Architecture
8. Request & Response Cycle
9. REST API
10. HTTP Methods
11. HTTP Status Codes
12. Middleware
13. `express.json()`
14. Route Handlers
15. `req` Object
16. `res` Object
17. Validation
18. Duplicate Email Check
19. User Registration Flow
20. In-Memory Database
21. API Endpoints
22. Testing with Postman
23. Common Errors
24. Code Explanation
25. Learning Summary
26. Future Improvements

---

# 🎯 Project Overview

This project creates a simple backend server where users can:

* Register a new account
* View all registered users
* Validate required fields
* Prevent duplicate email registration
* Return proper HTTP status codes
* Send JSON responses

> **Note:** Since there is no database, all user data is lost whenever the server restarts.

---

# 🛠 Technologies Used

* Node.js
* Express.js
* JavaScript (ES6)
* Postman (API Testing)

---

# 📁 Project Structure

```text
project/
│
├── node_modules/
├── package.json
├── package-lock.json
└── server.js
```

---

# ⚙️ Installation

## 1. Create a project

```bash
mkdir express-api
```

## 2. Enter the folder

```bash
cd express-api
```

## 3. Initialize npm

```bash
npm init -y
```

### Why `-y`?

`-y` automatically creates a `package.json` file using default values without asking questions.

---

## 4. Install Express

```bash
npm install express
```

---

## 5. Run the server

```bash
node server.js
```

Expected output:

```text
✅ Server is running on port 3000
```

---

# 🌐 What is Express?

Express is a lightweight web framework for Node.js.

It helps developers create:

* APIs
* Web servers
* Backend applications
* REST services

Instead of using Node's built-in HTTP module directly, Express provides an easier and cleaner way to build backend applications.

---

# 🌍 Client-Server Architecture

```text
Client (Browser/Postman)

        │
        │ HTTP Request
        ▼

Express Server

        │
        │ Process Request
        ▼

Business Logic

        │
        │ Response
        ▼

Client receives JSON
```

---

# 🔄 Request-Response Cycle

```text
Client

    │

POST /register

    │

Express receives request

    │

Middleware executes

    │

Validation

    │

Business Logic

    │

Response

    ▼

Client
```

---

# 🔥 REST API

REST stands for:

**Representational State Transfer**

A REST API allows communication between:

* Frontend
* Backend
* Mobile Apps
* Other Servers

using HTTP methods.

---

# 📡 HTTP Methods

## GET

Used to retrieve data.

Example:

```http
GET /users
```

---

## POST

Used to create new data.

Example:

```http
POST /register
```

---

## PUT

Completely updates existing data.

---

## PATCH

Partially updates existing data.

---

## DELETE

Deletes data.

---

# 📚 HTTP Status Codes

## 200 OK

Request completed successfully.

Example:

```javascript
res.status(200).json(users)
```

---

## 201 Created

Resource created successfully.

Example:

```javascript
res.status(201).json({
    message: "Registration successful"
})
```

---

## 400 Bad Request

Client sent invalid data.

Example:

```javascript
if(!name || !email || !password)
```

---

## 401 Unauthorized

Authentication required.

---

## 403 Forbidden

Authenticated but not allowed.

---

## 404 Not Found

Route doesn't exist.

---

## 500 Internal Server Error

Unexpected server error.

---

# ⚙️ Middleware

Middleware executes **between** the request and the route.

```text
Client

↓

Middleware

↓

Route

↓

Response
```

Example:

```javascript
app.use(express.json())
```

---

# 🧠 express.json()

```javascript
app.use(express.json())
```

Purpose:

Converts incoming JSON into a JavaScript object.

Without it:

```javascript
req.body
```

returns

```javascript
undefined
```

With it:

```javascript
req.body
```

returns

```javascript
{
   name: "Ali",
   email: "ali@gmail.com"
}
```

---

# 🛣 Route Handlers

GET Route

```javascript
app.get("/users", ...)
```

POST Route

```javascript
app.post("/register", ...)
```

Routes determine what happens when a client visits a URL.

---

# 📨 Request Object (`req`)

Contains information sent by the client.

Examples:

```javascript
req.body

req.params

req.query

req.headers
```

---

# 📤 Response Object (`res`)

Used to send data back to the client.

Examples:

```javascript
res.send()

res.json()

res.status()

res.redirect()
```

---

# ✅ Validation

Validation checks whether required data exists.

Example:

```javascript
if(!name || !email || !password)
```

If validation fails:

```javascript
return res.status(400).json({
    message: "All fields are required"
})
```

---

# 📧 Duplicate Email Check

```javascript
const existingUser = users.find(
    user => user.email === email
);
```

Purpose:

Prevent multiple accounts using the same email.

---

# 👤 Creating a New User

```javascript
const newUser = {

    id: users.length + 1,

    name,

    email,

    password

};
```

---

# 💾 In-Memory Database

Users are stored inside:

```javascript
const users = [];
```

This is called **in-memory storage**.

Advantages:

* Easy to learn
* Fast
* No setup

Disadvantages:

* Data disappears after restarting the server
* Not suitable for production

---

# 📌 API Endpoints

## Register User

### POST

```http
POST /register
```

Request Body

```json
{
    "name":"Waqar",
    "email":"waqar@gmail.com",
    "password":"123456"
}
```

Success Response

Status Code:

```text
201 Created
```

Response

```json
{
    "message":"Registration successful",
    "user":{
        "id":1,
        "name":"Waqar",
        "email":"waqar@gmail.com",
        "password":"123456"
    }
}
```

---

Validation Error

Status Code

```text
400 Bad Request
```

Response

```json
{
    "message":"All fields are required"
}
```

---

Duplicate Email

```json
{
    "message":"Email already exists"
}
```

---

## Get All Users

### GET

```http
GET /users
```

Response

```json
[
    {
        "id":1,
        "name":"Waqar",
        "email":"waqar@gmail.com",
        "password":"123456"
    }
]
```

Status Code

```text
200 OK
```

---

# 🧪 Testing with Postman

## Register

Method:

```text
POST
```

URL

```text
http://localhost:3000/register
```

Body

* raw
* JSON

---

## Get Users

Method

```text
GET
```

URL

```text
http://localhost:3000/users
```

---

# ❗ Common Errors

## Cannot find module 'express'

Reason:

Express isn't installed.

Solution:

```bash
npm install express
```

---

## Cannot find module 'react'

Reason:

React was imported into a backend project by mistake.

Incorrect:

```javascript
const { use } = require("react");
```

Solution:

Remove the line.

---

## Port Already In Use

Error:

```text
EADDRINUSE
```

Solution:

* Stop the process using the port, or
* Change the port number.

---

## Why can't I send `res.status()` when the server stops?

When the server is stopped, the Node.js process has already ended.

That means:

* No Express application is running.
* No request is being processed.
* No `req` or `res` object exists.
* The client receives a connection error instead of an HTTP response.

Example client error:

```text
ECONNREFUSED
```

---

# 💡 Best Practices

* Validate every input.
* Never trust client data.
* Return meaningful status codes.
* Use clear JSON responses.
* Organize routes logically.
* Keep sensitive data out of responses (never return plain-text passwords in real applications).
* Use a database like MongoDB instead of arrays for production.

---

# 📚 Learning Summary

By building this project, you practiced:

* Node.js fundamentals
* Express.js
* Server creation
* Middleware
* JSON parsing
* Route handling
* Request & Response objects
* REST API principles
* HTTP methods
* HTTP status codes
* Validation
* Duplicate checking
* In-memory data storage
* API testing with Postman
* Error handling basics

---

# 🚀 Future Improvements

* MongoDB integration
* Mongoose models
* Password hashing with bcrypt
* JWT Authentication
* Login API
* Logout API
* Protected Routes
* Environment variables (`.env`)
* Async/Await
* Error-handling middleware
* MVC Architecture
* Input validation libraries (e.g., Joi or Zod)
* File uploads
* Logging
* Unit and integration testing

---

# 📜 License

This project is created for learning purposes and can be freely modified and extended as you continue your backend development journey.
