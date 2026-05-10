const User = require('../models/User');
const { generateOtp, getOtpExpiry } = require('../utils/otpService');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendOtpSms } = require('../services/emailService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const issueTokens = (user, res) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  return { accessToken, refreshToken };
};

// ── CUSTOMER: Send OTP ────────────────────────────────────────────────────────
exports.sendOtp = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return next(new AppError('Invalid Indian mobile number', 400, 'INVALID_PHONE'));
  }

  let user = await User.findOne({ phone });
  const otp = generateOtp(6);
  const otpExpiry = getOtpExpiry(parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10);

  if (!user) {
    user = await User.create({ phone, otp, otpExpiry, role: 'customer' });
  } else {
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save({ validateBeforeSave: false });
  }

  await sendOtpSms(phone, otp);

  // In development, return OTP in response for testing
  res.json({
    success: true,
    message: 'OTP sent successfully',
    isNewUser: !user.isProfileComplete,
    otp, // Always return OTP for local testing since Twilio is a placeholder
  });
});

// ── CUSTOMER: Verify OTP ──────────────────────────────────────────────────────
exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone }).select('+otp +otpExpiry');
  if (!user) return next(new AppError('Phone number not registered', 404, 'USER_NOT_FOUND'));

  if (!user.otp || user.otp !== otp) {
    return next(new AppError('Invalid OTP', 400, 'INVALID_OTP'));
  }
  if (new Date() > user.otpExpiry) {
    return next(new AppError('OTP has expired. Please request a new one.', 400, 'OTP_EXPIRED'));
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  user.isPhoneVerified = true;
  user.lastLogin = new Date();

  const { accessToken } = issueTokens(user, res);
  user.refreshToken = require('crypto').createHash('sha256').update(accessToken).digest('hex');
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    accessToken,
    isNewUser: !user.isProfileComplete,
    user: user.toPublicJSON(),
  });
});

// ── CUSTOMER: Complete Profile ────────────────────────────────────────────────
exports.completeProfile = asyncHandler(async (req, res) => {
  const { name, email, city } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name.trim();
  if (email) user.email = email.toLowerCase().trim();
  if (city) user.city = city.trim();
  user.isProfileComplete = true;

  await user.save();

  res.json({ success: true, user: user.toPublicJSON() });
});

// ── VENDOR/ADMIN: Email + Password Login ──────────────────────────────────────
exports.emailLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400, 'MISSING_FIELDS'));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
  }
  if (!user.isActive) {
    return next(new AppError('Account has been deactivated', 401, 'ACCOUNT_DEACTIVATED'));
  }
  if (!['vendor', 'admin'].includes(user.role)) {
    return next(new AppError('This login is for vendors and admins only', 403, 'FORBIDDEN'));
  }

  user.lastLogin = new Date();
  const { accessToken } = issueTokens(user, res);
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, accessToken, user: user.toPublicJSON() });
});

// ── Refresh Token ─────────────────────────────────────────────────────────────
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) return next(new AppError('No refresh token', 401, 'NO_REFRESH_TOKEN'));

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return next(new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN'));
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return next(new AppError('User not found', 401, 'USER_NOT_FOUND'));
  }

  const { accessToken } = issueTokens(user, res);
  res.json({ success: true, accessToken });
});

// ── Logout ────────────────────────────────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ success: true, message: 'Logged out successfully' });
});

// ── Get Me ────────────────────────────────────────────────────────────────────
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user: user.toPublicJSON() });
});
