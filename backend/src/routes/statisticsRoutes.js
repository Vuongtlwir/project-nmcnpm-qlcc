const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Only Admins can view statistics
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize('admin'));

router.get('/overview', statisticsController.getOverview);
router.get('/revenue', statisticsController.getRevenue);
router.get('/fee-collection', statisticsController.getFeeCollection);
router.get('/apartment-status', statisticsController.getApartmentStatus);

module.exports = router;
