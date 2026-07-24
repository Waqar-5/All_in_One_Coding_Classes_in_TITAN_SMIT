// middleware/asyncHandler.js
// Wraps async route handlers so we don't need repetitive try/catch blocks
// in every controller. Any rejected promise is forwarded to Express's
// centralized error handling middleware via next(error).

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
