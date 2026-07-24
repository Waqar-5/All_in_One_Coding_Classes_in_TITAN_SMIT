// middleware/ApiError.js
// Custom error class to standardize error responses with an HTTP status code.

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
