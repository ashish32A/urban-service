const router = require('express').Router();
const { Category } = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json({ success: true, categories });
}));

module.exports = router;
