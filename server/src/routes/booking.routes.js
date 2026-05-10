const router = require('express').Router();
const ctrl = require('../controllers/bookingController');
const { requireCustomer, protect } = require('../middleware/auth');

router.post('/', requireCustomer, ctrl.createBooking);
router.get('/my', requireCustomer, ctrl.getMyBookings);
router.get('/:id', protect, ctrl.getBookingById);
router.patch('/:id/cancel', requireCustomer, ctrl.cancelBooking);
router.post('/:id/review', requireCustomer, ctrl.reviewBooking);

module.exports = router;
