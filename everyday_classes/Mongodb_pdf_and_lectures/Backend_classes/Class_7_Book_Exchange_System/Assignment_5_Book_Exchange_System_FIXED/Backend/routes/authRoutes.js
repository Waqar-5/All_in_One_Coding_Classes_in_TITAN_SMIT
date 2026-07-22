// ======================================================
// Authentication Routes
// ======================================================

const express = require("express");

const router = express.Router();

// ======================================================
// Import Controller
// ======================================================

const {

    registerUser,

    loginUser

} = require("../controllers/authController");

// ======================================================
// Public Routes
// ======================================================

// Register User
// POST /api/auth/register

router.post("/register", registerUser);

// Login User
// POST /api/auth/login

router.post("/login", loginUser);

// ======================================================
// Export Router
// ======================================================

module.exports = router;