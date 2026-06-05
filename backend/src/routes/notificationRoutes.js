const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

// View notifications
router.get('/', notificationController.getAllNotifications);

// Mark as read
router.put('/:id/read', notificationController.markAsRead);

// Create / Delete notification (admin only)
router.post('/', authMiddleware.authorize('admin'), notificationController.createNotification);
router.delete('/:id', authMiddleware.authorize('admin'), notificationController.deleteNotification);

module.exports = router;
