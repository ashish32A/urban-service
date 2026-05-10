const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Booking = require('../models/Booking');
const { Service, Category } = require('../models/Service');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// ── GET /api/admin/analytics ──────────────────────────────────────────────────
exports.getAnalytics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalUsers, totalVendors, totalBookings, pendingApprovals,
    todayBookings, revenueData, statusData, categoryData, revenueByDay,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Vendor.countDocuments(),
    Booking.countDocuments(),
    Vendor.countDocuments({ isVerified: false, isActive: true }),
    Booking.countDocuments({ createdAt: { $gte: today } }),
    Booking.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: firstOfMonth } } },
      { $group: { _id: null, revenue: { $sum: '$pricing.total' } } },
    ]),
    Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'svc' } },
      { $unwind: '$svc' },
      { $lookup: { from: 'categories', localField: 'svc.category', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $group: { _id: '$cat.name', count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.total' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({
    success: true,
    analytics: {
      totalUsers,
      totalVendors,
      totalBookings,
      pendingApprovals,
      todayBookings,
      revenueThisMonth: revenueData[0]?.revenue || 0,
      bookingsByStatus: statusData,
      bookingsByCategory: categoryData,
      revenueByDay,
    },
  });
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
exports.getUsers = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const query = { role: 'customer' };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// ── PATCH /api/admin/users/:id/toggle ────────────────────────────────────────
exports.toggleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404, 'NOT_FOUND'));
  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, user });
});

// ── GET /api/admin/vendors ────────────────────────────────────────────────────
exports.getVendors = asyncHandler(async (req, res) => {
  const { approval, search, page = 1, limit = 20 } = req.query;
  const query = {};

  if (approval === 'pending') query.isVerified = false;
  if (approval === 'approved') query.isVerified = true;

  const skip = (Number(page) - 1) * Number(limit);
  const vendors = await Vendor.find(query)
    .populate('user', 'name phone email isActive createdAt')
    .populate('services', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Vendor.countDocuments(query);
  res.json({ success: true, vendors, total, page: Number(page) });
});

// ── GET /api/admin/vendors/:id ────────────────────────────────────────────────
exports.getVendorDetail = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id)
    .populate('user', '-password -otp -refreshToken')
    .populate('services');
  if (!vendor) return next(new AppError('Vendor not found', 404, 'NOT_FOUND'));
  res.json({ success: true, vendor });
});

// ── PATCH /api/admin/vendors/:id/approve ─────────────────────────────────────
exports.approveVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { isVerified: true, isActive: true },
    { new: true }
  ).populate('user', 'name email');
  if (!vendor) return next(new AppError('Vendor not found', 404, 'NOT_FOUND'));
  res.json({ success: true, vendor, message: 'Vendor approved' });
});

// ── PATCH /api/admin/vendors/:id/reject ──────────────────────────────────────
exports.rejectVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { isVerified: false, isActive: false },
    { new: true }
  );
  if (!vendor) return next(new AppError('Vendor not found', 404, 'NOT_FOUND'));
  res.json({ success: true, message: 'Vendor rejected' });
});

// ── PATCH /api/admin/vendors/:id/toggle ──────────────────────────────────────
exports.toggleVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found', 404, 'NOT_FOUND'));
  vendor.isActive = !vendor.isActive;
  await vendor.save();
  res.json({ success: true, vendor });
});

// ── GET /api/admin/bookings ───────────────────────────────────────────────────
exports.getAllBookings = asyncHandler(async (req, res) => {
  const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (startDate || endDate) {
    query.scheduledAt = {};
    if (startDate) query.scheduledAt.$gte = new Date(startDate);
    if (endDate) query.scheduledAt.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('customer', 'name phone')
      .populate('service', 'name')
      .populate({ path: 'vendor', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query),
  ]);

  res.json({ success: true, bookings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});
