const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const svcCtrl = require('../controllers/serviceController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

// Analytics
router.get('/analytics', ctrl.getAnalytics);

// User management
router.get('/users', ctrl.getUsers);
router.patch('/users/:id/toggle', ctrl.toggleUser);

// Vendor management
router.get('/vendors', ctrl.getVendors);
router.get('/vendors/:id', ctrl.getVendorDetail);
router.patch('/vendors/:id/approve', ctrl.approveVendor);
router.patch('/vendors/:id/reject', ctrl.rejectVendor);
router.patch('/vendors/:id/toggle', ctrl.toggleVendor);

// Service management (admin-specific CRUD)
router.get('/services', svcCtrl.getServices);
router.post('/services', svcCtrl.createService);
router.patch('/services/:id', svcCtrl.updateService);
router.delete('/services/:id', svcCtrl.deleteService);

// Booking management
router.get('/bookings', ctrl.getAllBookings);

module.exports = router;
