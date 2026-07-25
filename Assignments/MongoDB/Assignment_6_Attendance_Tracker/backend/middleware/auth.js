// middleware/auth.js
// Protects routes by requiring a valid JWT in the Authorization header.
// Also exposes an `authorize` helper for role-based access control.

const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ApiError = require('./ApiError');
const User = require('../models/User');

/**
 * Verifies the Bearer token from the Authorization header, attaches the
 * authenticated user to `req.user`, and calls next(). Rejects with 401
 * if the token is missing, invalid, or expired, or the user no longer exists.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Not authorized — user no longer exists');
    }

    if (user.isBlocked) {
      throw new ApiError(403, 'Your account has been blocked by an administrator. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Not authorized — invalid or expired token');
  }
});

/**
 * Restricts a route to specific user roles.
 * Usage: router.delete('/:id', protect, authorize('admin'), deleteHandler)
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, `Role "${req.user?.role}" is not permitted to perform this action`);
  }
  next();
};

module.exports = { protect, authorize };
