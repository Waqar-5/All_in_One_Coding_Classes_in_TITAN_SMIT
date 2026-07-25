// routes/adminRoutes.js
// Admin-only endpoints for managing users. Every route requires a valid
// JWT (protect) AND the "admin" role (authorize) — regular "teacher"
// accounts get a 403 if they try to hit any of these.

const express = require('express');
const router = express.Router();

const { getAllUsers, getUserById, blockUser, unblockUser, changeUserRole, setUserLimit } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Every route below requires a logged-in admin
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);
router.put('/users/:id/role', changeUserRole);
router.put('/users/:id/limit', setUserLimit);

module.exports = router;
