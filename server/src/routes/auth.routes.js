const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Strict rate limit for OTP: 3 per phone per hour (enforced by IP here, extend to Redis for prod)
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 9999 : 5,  // unlimited in dev
  skip: () => process.env.NODE_ENV === 'development',        // bypass entirely in dev
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many OTP requests. Try again in 1 hour.' } },
});

router.post('/send-otp', otpLimiter, ctrl.sendOtp);
router.post('/verify-otp', ctrl.verifyOtp);
router.post('/complete-profile', protect, ctrl.completeProfile);
router.post('/login', ctrl.emailLogin);           // Vendor + Admin
router.post('/refresh-token', ctrl.refreshToken);
router.post('/logout', ctrl.logout);
router.get('/me', protect, ctrl.getMe);

module.exports = router;
