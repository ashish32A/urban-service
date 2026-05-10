const router = require('express').Router();
const ctrl = require('../controllers/serviceController');
const { requireAdmin } = require('../middleware/auth');

// Public
router.get('/categories', ctrl.getCategories);
router.get('/', ctrl.getServices);
router.get('/:id', ctrl.getServiceById);

// Admin only
router.post('/', requireAdmin, ctrl.createService);
router.patch('/:id', requireAdmin, ctrl.updateService);
router.delete('/:id', requireAdmin, ctrl.deleteService);

module.exports = router;
