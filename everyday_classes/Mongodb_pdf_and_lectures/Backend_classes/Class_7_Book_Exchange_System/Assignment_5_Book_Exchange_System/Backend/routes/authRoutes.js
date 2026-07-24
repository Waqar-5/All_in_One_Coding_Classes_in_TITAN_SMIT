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

    changePassword

} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

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
// Export Router
// ======================================================

module.exports = router;