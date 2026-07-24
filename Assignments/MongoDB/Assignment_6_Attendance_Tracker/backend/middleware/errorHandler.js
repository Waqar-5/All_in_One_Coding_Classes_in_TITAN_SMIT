// middleware/errorHandler.js
// Centralized error handling middleware. All errors (thrown or passed via
// next(error)) end up here and are converted into a consistent JSON response.

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set on the response or error
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value entered for field: ${field}`;
  }

  // Custom ApiError already carries its own statusCode
  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
