const { Service, Category } = require('../models/Service');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// ── GET /api/services/categories ─────────────────────────────────────────────
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json({ success: true, categories });
});

// ── GET /api/services ─────────────────────────────────────────────────────────
exports.getServices = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
  }

  if (search) {
    query.$text = { $search: search };
  }

  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = Number(minPrice);
    if (maxPrice) query.basePrice.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [services, total] = await Promise.all([
    Service.find(query)
      .populate('category', 'name slug icon color')
      .sort({ avgRating: -1, totalBookings: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Service.countDocuments(query),
  ]);

  res.json({
    success: true,
    services,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

// ── GET /api/services/:id ─────────────────────────────────────────────────────
exports.getServiceById = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id).populate('category');
  if (!service || !service.isActive) {
    return next(new AppError('Service not found', 404, 'NOT_FOUND'));
  }
  res.json({ success: true, service });
});

// ── POST /api/admin/services ──────────────────────────────────────────────────
exports.createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, service });
});

// ── PATCH /api/admin/services/:id ────────────────────────────────────────────
exports.updateService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) return next(new AppError('Service not found', 404, 'NOT_FOUND'));
  res.json({ success: true, service });
});

// ── DELETE /api/admin/services/:id (soft delete) ──────────────────────────────
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!service) return next(new AppError('Service not found', 404, 'NOT_FOUND'));
  res.json({ success: true, message: 'Service deactivated' });
});
