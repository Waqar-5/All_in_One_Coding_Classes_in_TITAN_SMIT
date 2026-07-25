// routes/authRoutes.js
// Authentication endpoints: register, login, and current-user profile.

const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
