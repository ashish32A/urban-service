/**
 * Wrapper for async route handlers to avoid try/catch boilerplate.
 * Passes errors to Express error handler middleware.
 * @param {Function} fn - async route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
