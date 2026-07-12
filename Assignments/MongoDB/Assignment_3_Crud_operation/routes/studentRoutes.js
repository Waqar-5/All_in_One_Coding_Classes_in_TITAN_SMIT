// ===================================
// Import Express
// ===================================

// Express provides routing functionality.
// We use Router() to create separate route files.
const express = require("express");

// Create a new router object.
const router = express.Router();

// ===================================
// Import Controller Functions
// ===================================

// These functions are imported from:
// controllers/studentController.js
//
// Each function contains the business logic
// for a specific API.
const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

// ===================================
// Student Routes
// ===================================

// Create a new student
// POST /api/students
router.post("/", createStudent);

// Get all students
// GET /api/students
router.get("/", getAllStudents);

// Get one student by ID
// GET /api/students/:id
router.get("/:id", getStudentById);

// Update a student by ID
// PUT /api/students/:id
router.put("/:id", updateStudent);

// Delete a student by ID
// DELETE /api/students/:id
router.delete("/:id", deleteStudent);

// Export router so it can be used in server.js
module.exports = router;