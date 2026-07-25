// controllers/authController.js
// Handles user registration, login, and fetching the current authenticated user.

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../middleware/ApiError');
const generateToken = require('../utils/generateToken');

/**
 * Strips sensitive fields before sending the user object back to the client.
 */
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email and password are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  // NOTE: role is intentionally NOT read from req.body. Every self-registered
  // account starts as "teacher" — admin accounts (which can see every user's
  // attendance records) must be granted manually, e.g. via the seed script
  // or directly in the database, never through public registration.
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: 'teacher',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    data: sanitizeUser(user),
  });
});

/**
 * @desc    Log in an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Explicitly select password since the schema excludes it by default
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'Your account has been blocked by an administrator. Please contact support.');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    data: sanitizeUser(user),
  });
});

/**
 * @desc    Get the currently authenticated user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the `protect` middleware
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user),
  });
});

module.exports = { registerUser, loginUser, getMe };
