const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');
const { Service } = require('../models/Service');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendBookingConfirmation, sendNewJobAlert } = require('../services/emailService');

// ── POST /api/bookings ────────────────────────────────────────────────────────
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { getIO } = require('../socket');
  const { serviceId, vendorId, scheduledAt, timeSlot, address, notes } = req.body;

  // Validate service
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    return next(new AppError('Service not found or unavailable', 404, 'NOT_FOUND'));
  }

  // Validate vendor
  const vendor = await Vendor.findById(vendorId)
    .populate('user', 'name email phone');
  if (!vendor || !vendor.isActive || !vendor.isVerified) {
    return next(new AppError('Vendor not found or unavailable', 404, 'NOT_FOUND'));
  }

  // Check vendor not already booked at that slot
  const scheduledDate = new Date(scheduledAt);
  const slotStart = new Date(scheduledDate);
  slotStart.setHours(slotStart.getHours() - 2);
  const slotEnd = new Date(scheduledDate);
  slotEnd.setHours(slotEnd.getHours() + 2);

  const conflict = await Booking.findOne({
    vendor: vendorId,
    scheduledAt: { $gte: slotStart, $lte: slotEnd },
    status: { $in: ['pending', 'confirmed', 'in_progress'] },
  });
  if (conflict) {
    return next(new AppError('Vendor is already booked for this time slot', 409, 'SLOT_CONFLICT'));
  }

  const tax = Math.round(service.basePrice * 0.18);
  const total = service.basePrice + tax;

  const booking = await Booking.create({
    customer: req.user._id,
    vendor: vendorId,
    service: serviceId,
    scheduledAt,
    timeSlot,
    address,
    notes,
    pricing: { basePrice: service.basePrice, tax, total },
  });

  await booking.populate([
    { path: 'service', select: 'name basePrice' },
    { path: 'customer', select: 'name email phone' },
  ]);

  // Emit socket event to vendor
  try {
    getIO().to(`vendor_${vendorId}`).emit('booking:new', {
      bookingId: booking.bookingId,
      service: service.name,
      scheduledAt,
      message: 'New booking request!',
    });
  } catch (_) {}

  // Send emails (fire and forget)
  sendBookingConfirmation(
    { ...booking.toObject(), deliveryOtp: booking.deliveryOtp },
    booking.customer
  );
  sendNewJobAlert(booking, vendor);

  res.status(201).json({ success: true, booking });
});

// ── GET /api/bookings/my ──────────────────────────────────────────────────────
exports.getMyBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { customer: req.user._id };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('service', 'name image category')
    .populate({ path: 'vendor', populate: { path: 'user', select: 'name profilePicture' } })
    .sort({ scheduledAt: -1 });

  res.json({ success: true, bookings });
});

// ── GET /api/bookings/:id ─────────────────────────────────────────────────────
exports.getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    $or: [{ customer: req.user._id }],
  })
    .populate('service', 'name image description')
    .populate({ path: 'vendor', populate: { path: 'user', select: 'name phone profilePicture' } });

  if (!booking) return next(new AppError('Booking not found', 404, 'NOT_FOUND'));
  res.json({ success: true, booking });
});

// ── PATCH /api/bookings/:id/cancel ────────────────────────────────────────────
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    customer: req.user._id,
  });

  if (!booking) return next(new AppError('Booking not found', 404, 'NOT_FOUND'));
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return next(new AppError('Only pending or confirmed bookings can be cancelled', 400, 'INVALID_STATUS'));
  }

  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by customer';
  booking.cancelledAt = new Date();
  await booking.save();

  res.json({ success: true, booking });
});

// ── POST /api/bookings/:id/review ─────────────────────────────────────────────
exports.reviewBooking = asyncHandler(async (req, res, next) => {
  const { score, review } = req.body;
  if (!score || score < 1 || score > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400, 'INVALID_RATING'));
  }

  const booking = await Booking.findOne({
    _id: req.params.id,
    customer: req.user._id,
    status: 'completed',
  });

  if (!booking) return next(new AppError('Completed booking not found', 404, 'NOT_FOUND'));
  if (booking.rating?.score) return next(new AppError('Already reviewed', 409, 'ALREADY_REVIEWED'));

  booking.rating = { score, review, ratedAt: new Date() };
  await booking.save();

  // Update vendor average rating
  if (booking.vendor) {
    const vendor = await Vendor.findById(booking.vendor);
    if (vendor) {
      const newCount = vendor.totalRatings + 1;
      vendor.avgRating = ((vendor.avgRating * vendor.totalRatings) + score) / newCount;
      vendor.totalRatings = newCount;
      await vendor.save();
    }
  }

  res.json({ success: true, booking });
});
