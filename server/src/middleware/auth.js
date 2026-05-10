const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes — verifies JWT and attaches req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError('Not authenticated. Please log in.', 401, 'NOT_AUTHENTICATED'));
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please log in again.', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid token.', 401, 'INVALID_TOKEN'));
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || !user.isActive) {
    return next(new AppError('User not found or account deactivated.', 401, 'USER_NOT_FOUND'));
  }

  req.user = user;
  next();
});

/**
 * Restrict access to specific roles.
 * @param  {...string} roles
 */
const restrictTo = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
    }
    next();
  };

const requireCustomer = [protect, restrictTo('customer', 'admin')];
const requireVendor = [protect, restrictTo('vendor', 'admin')];
const requireAdmin = [protect, restrictTo('admin')];

module.exports = { protect, restrictTo, requireCustomer, requireVendor, requireAdmin };
