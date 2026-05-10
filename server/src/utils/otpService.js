const crypto = require('crypto');

/**
 * Generate a numeric OTP of given length (default 6 digits)
 */
const generateOtp = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  return otp;
};

/**
 * Generate a 4-digit delivery OTP for booking
 */
const generateDeliveryOtp = () => generateOtp(4);

/**
 * Calculate OTP expiry date
 * @param {number} minutes
 */
const getOtpExpiry = (minutes = 10) => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

module.exports = { generateOtp, generateDeliveryOtp, getOtpExpiry };
