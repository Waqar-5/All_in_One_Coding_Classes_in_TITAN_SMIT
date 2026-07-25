// controllers/authController.js
// Handles user registration, login, and fetching the current authenticated user.

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../middleware/ApiError');
const generateToken = require('../utils/generateToken');
const { isSuperAdminEmail } = require('../utils/superAdmin');

/**
 * Strips sensitive fields before sending the user object back to the client.
 */
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked,
  attendanceLimit: user.attendanceLimit,
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

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists');
  }

  // NOTE: role is intentionally NOT read from req.body for everyone else —
  // every self-registered account starts as "teacher". The ONE exception is
  // the permanent super admin email (SUPER_ADMIN_EMAIL in .env), which is
  // always granted "admin" automatically, even on first registration.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: isSuperAdminEmail(normalizedEmail) ? 'admin' : 'teacher',
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

  // Self-healing: the super admin email is ALWAYS admin and ALWAYS unblocked,
  // no matter what the database currently says (e.g. if it was ever changed
  // by mistake). This runs on every login so the guarantee always holds.
  if (isSuperAdminEmail(user.email) && (user.role !== 'admin' || user.isBlocked)) {
    user.role = 'admin';
    user.isBlocked = false;
    await user.save();
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
