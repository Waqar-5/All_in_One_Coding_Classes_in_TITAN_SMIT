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

    loginUser,

    getMe,

    updateProfile,

    changePassword,

    forgotPassword,

    resetPassword,

    getAllUsers,

    getUserDetailsAdmin,

    updateUserRole,

    toggleUserBlocked,

    updateUserBookLimit

} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { authLimiter } = require("../middleware/rateLimiters");

// ======================================================
// Public Routes
// ======================================================

// Register User
// POST /api/auth/register

router.post("/register", authLimiter, registerUser);

// Login User
// POST /api/auth/login

router.post("/login", authLimiter, loginUser);

// Forgot Password — request a reset link
// POST /api/auth/forgot-password

router.post("/forgot-password", authLimiter, forgotPassword);

// Reset Password — using the token from the emailed link
// POST /api/auth/reset-password/:token

router.post("/reset-password/:token", authLimiter, resetPassword);

// ======================================================
// Private Routes
// ======================================================

// Get My Profile (with stats)
// GET /api/auth/me

router.get("/me", protect, getMe);

// Update My Profile (multipart/form-data — profileImage optional)
// PUT /api/auth/profile

router.put("/profile", protect, upload.single("profileImage"), updateProfile);

// Change Password
// PUT /api/auth/change-password

router.put("/change-password", protect, changePassword);

// ======================================================
// Admin Routes
// ======================================================

// Get All Users
// GET /api/auth/users

router.get("/users", protect, adminOnly, getAllUsers);

// Get A Specific User's Profile + Their Books
// GET /api/auth/users/:id

router.get("/users/:id", protect, adminOnly, getUserDetailsAdmin);

// Update A User's Role
// PATCH /api/auth/users/:id/role

router.patch("/users/:id/role", protect, adminOnly, updateUserRole);

// Block / Unblock A User
// PATCH /api/auth/users/:id/toggle-block

router.patch("/users/:id/toggle-block", protect, adminOnly, toggleUserBlocked);

// Set A User's Book Listing Limit
// PATCH /api/auth/users/:id/book-limit

router.patch("/users/:id/book-limit", protect, adminOnly, updateUserBookLimit);

// ======================================================
// Export Router
// ======================================================

module.exports = router;