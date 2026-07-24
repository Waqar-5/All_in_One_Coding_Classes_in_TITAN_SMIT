// middleware/notFound.js
// Catches requests to routes that do not exist and forwards a 404 error
// to the centralized error handler.

const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
