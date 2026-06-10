const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Authenticate all dashboard requests
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize('admin'));

// Dashboard statistics endpoint
router.get('/stats', statisticsController.getOverview);

module.exports = router;
