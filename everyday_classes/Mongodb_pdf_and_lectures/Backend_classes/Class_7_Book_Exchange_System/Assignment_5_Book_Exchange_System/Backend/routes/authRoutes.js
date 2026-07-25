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

    getAllUsers,

    updateUserRole,

    toggleUserDeleted

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

// Update A User's Role
// PATCH /api/auth/users/:id/role

router.patch("/users/:id/role", protect, adminOnly, updateUserRole);

// Deactivate / Restore A User
// PATCH /api/auth/users/:id/toggle-delete

router.patch("/users/:id/toggle-delete", protect, adminOnly, toggleUserDeleted);

// ======================================================
// Export Router
// ======================================================

module.exports = router;