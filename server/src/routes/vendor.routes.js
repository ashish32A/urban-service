const router = require('express').Router();
const ctrl = require('../controllers/vendorController');
const { protect, requireVendor } = require('../middleware/auth');

// Public
router.get('/available', ctrl.getAvailableVendors);
router.get('/:id', ctrl.getVendorById);

// Vendor portal (protected)
router.get('/portal/dashboard', requireVendor, ctrl.getVendorDashboard);
router.get('/portal/bookings', requireVendor, ctrl.getVendorBookings);
router.get('/portal/profile', requireVendor, ctrl.getVendorProfile);
router.patch('/portal/profile', requireVendor, ctrl.updateVendorProfile);
router.patch('/portal/bookings/:id/accept', requireVendor, ctrl.acceptBooking);
router.patch('/portal/bookings/:id/start', requireVendor, ctrl.startJob);
router.patch('/portal/bookings/:id/complete', requireVendor, ctrl.completeJob);
router.patch('/portal/bookings/:id/reject', requireVendor, ctrl.rejectBooking);

module.exports = router;
