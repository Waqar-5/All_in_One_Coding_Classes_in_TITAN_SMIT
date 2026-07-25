// routes/adminRoutes.js
// Admin-only endpoints for managing users. Every route requires a valid
// JWT (protect) AND the "admin" role (authorize) — regular "teacher"
// accounts get a 403 if they try to hit any of these.

const express = require('express');
const router = express.Router();

const { getAllUsers, blockUser, unblockUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Every route below requires a logged-in admin
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);

module.exports = router;
