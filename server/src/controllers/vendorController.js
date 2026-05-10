const Vendor = require('../models/Vendor');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// ── GET /api/vendors/available ────────────────────────────────────────────────
exports.getAvailableVendors = asyncHandler(async (req, res) => {
  const { serviceId, city, sortBy = 'rating' } = req.query;

  const query = {
    isActive: true,
    isAvailable: true,
    isVerified: true,
  };

  if (serviceId) query.services = serviceId;
  if (city) query.cities = { $regex: new RegExp(city, 'i') };

  const sortOptions = {
    rating: { avgRating: -1 },
    price: { hourlyRate: 1 },
    experience: { experience: -1 },
  };

  const vendors = await Vendor.find(query)
    .populate('user', 'name phone profilePicture')
    .populate('services', 'name basePrice')
    .sort(sortOptions[sortBy] || sortOptions.rating)
    .limit(20);

  res.json({ success: true, vendors });
});

// ── GET /api/vendors/:id ──────────────────────────────────────────────────────
exports.getVendorById = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id)
    .populate('user', 'name profilePicture')
    .populate('services', 'name basePrice category');

  if (!vendor) return next(new AppError('Vendor not found', 404, 'NOT_FOUND'));
  res.json({ success: true, vendor });
});

// ── GET /api/vendor/dashboard ─────────────────────────────────────────────────
exports.getVendorDashboard = asyncHandler(async (req, res, next) => {
  const Booking = require('../models/Booking');
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) return next(new AppError('Vendor profile not found', 404, 'NOT_FOUND'));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayJobs, pendingRequests, completedThisMonth, totalEarningsData] = await Promise.all([
    Booking.countDocuments({
      vendor: vendor._id,
      scheduledAt: { $gte: today, $lt: tomorrow },
      status: { $in: ['confirmed', 'in_progress'] },
    }),
    Booking.countDocuments({ vendor: vendor._id, status: 'pending' }),
    Booking.countDocuments({
      vendor: vendor._id,
      status: 'completed',
      completedAt: { $gte: firstOfMonth },
    }),
    Booking.aggregate([
      { $match: { vendor: vendor._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      todayJobs,
      pendingRequests,
      completedThisMonth,
      totalEarnings: totalEarningsData[0]?.total || 0,
      rating: vendor.avgRating,
    },
  });
});

// ── GET /api/vendor/bookings ──────────────────────────────────────────────────
exports.getVendorBookings = asyncHandler(async (req, res, next) => {
  const Booking = require('../models/Booking');
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) return next(new AppError('Vendor profile not found', 404, 'NOT_FOUND'));

  const { status } = req.query;
  const query = { vendor: vendor._id };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('customer', 'name phone')
    .populate('service', 'name basePrice')
    .sort({ scheduledAt: 1 });

  res.json({ success: true, bookings });
});

// ── PATCH /api/vendor/bookings/:id/accept ─────────────────────────────────────
exports.acceptBooking = asyncHandler(async (req, res, next) => {
  const Booking = require('../models/Booking');
  const { getIO } = require('../socket');

  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) return next(new AppError('Vendor profile not found', 404, 'NOT_FOUND'));

  const booking = await Booking.findOne({ _id: req.params.id, vendor: vendor._id });
  if (!booking) return next(new AppError('Booking not found', 404, 'NOT_FOUND'));
  if (booking.status !== 'pending') {
    return next(new AppError('Only pending bookings can be accepted', 400, 'INVALID_STATUS'));
  }

  booking.status = 'confirmed';
  booking.confirmedAt = new Date();
  await booking.save();

  // Notify customer via Socket.IO
  try {
    getIO().to(`user_${booking.customer}`).emit('booking:accepted', {
      bookingId: booking.bookingId,
      message: 'Your booking has been accepted!',
    });
  } catch (_) {}

  res.json({ success: true, booking });
});

// ── PATCH /api/vendor/bookings/:id/start ──────────────────────────────────────
exports.startJob = asyncHandler(async (req, res, next) => {
  const Booking = require('../models/Booking');
  const vendor = await Vendor.findOne({ user: req.user._id });
  const booking = await Booking.findOne({ _id: req.params.id, vendor: vendor._id });

  if (!booking) return next(new AppError('Booking not found', 404, 'NOT_FOUND'));
  if (booking.status !== 'confirmed') {
    return next(new AppError('Booking must be confirmed before starting', 400, 'INVALID_STATUS'));
  }

  booking.status = 'in_progress';
  await booking.save();
  res.json({ success: true, booking });
});

// ── PATCH /api/vendor/bookings/:id/complete ───────────────────────────────────
exports.completeJob = asyncHandler(async (req, res, next) => {
  const Booking = require('../models/Booking');
  const { getIO } = require('../socket');
  const { sendCompletionReceipt } = require('../services/emailService');
  const User = require('../models/User');

  const vendor = await Vendor.findOne({ user: req.user._id });
  const booking = await Booking.findOne({ _id: req.params.id, vendor: vendor._id })
    .select('+deliveryOtp')
    .populate('customer');

  if (!booking) return next(new AppError('Booking not found', 404, 'NOT_FOUND'));
  if (booking.status !== 'in_progress') {
    return next(new AppError('Job must be in progress to complete', 400, 'INVALID_STATUS'));
  }

  const { otp } = req.body;
  if (!otp || otp !== booking.deliveryOtp) {
    return next(new AppError('Invalid delivery OTP', 400, 'INVALID_OTP'));
  }

  booking.status = 'completed';
  booking.completedAt = new Date();
  booking.isOtpVerified = true;
  await booking.save();

  // Update vendor stats
  await Vendor.findByIdAndUpdate(vendor._id, { $inc: { totalJobsCompleted: 1 } });

  // Notify customer
  try {
    getIO().to(`user_${booking.customer._id}`).emit('booking:completed', {
      bookingId: booking.bookingId,
      message: 'Your service has been completed!',
    });
  } catch (_) {}

  sendCompletionReceipt(booking, booking.customer);

  res.json({ success: true, booking });
});

// ── PATCH /api/vendor/bookings/:id/reject ─────────────────────────────────────
exports.rejectBooking = asyncHandler(async (req, res, next) => {
  const Booking = require('../models/Booking');
  const vendor = await Vendor.findOne({ user: req.user._id });
  const booking = await Booking.findOne({ _id: req.params.id, vendor: vendor._id });

  if (!booking) return next(new AppError('Booking not found', 404, 'NOT_FOUND'));
  if (booking.status !== 'pending') {
    return next(new AppError('Only pending bookings can be rejected', 400, 'INVALID_STATUS'));
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Rejected by vendor';
  booking.cancelledAt = new Date();
  booking.vendor = null;
  await booking.save();

  res.json({ success: true, message: 'Booking rejected' });
});

// ── GET/PATCH /api/vendor/profile ─────────────────────────────────────────────
exports.getVendorProfile = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id })
    .populate('user', 'name email phone profilePicture')
    .populate('services', 'name category');
  if (!vendor) return next(new AppError('Vendor profile not found', 404, 'NOT_FOUND'));
  res.json({ success: true, vendor });
});

exports.updateVendorProfile = asyncHandler(async (req, res, next) => {
  const allowed = ['bio', 'businessName', 'experience', 'hourlyRate', 'isAvailable', 'cities', 'availabilitySlots'];
  const updates = {};
  allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  const vendor = await Vendor.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate('user', 'name email phone');

  if (!vendor) return next(new AppError('Vendor profile not found', 404, 'NOT_FOUND'));
  res.json({ success: true, vendor });
});
