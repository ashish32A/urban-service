const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user: user.toPublicJSON() });
}));

router.patch('/me', protect, asyncHandler(async (req, res) => {
  const allowed = ['name', 'email', 'city', 'profilePicture'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user: user.toPublicJSON() });
}));

router.post('/me/addresses', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
}));

module.exports = router;
