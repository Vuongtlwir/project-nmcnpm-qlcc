const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

router.get('/conversation/:userId', authMiddleware.authorize('admin'), chatController.getConversation);
router.get('/conversation', chatController.getConversation);
router.post('/send', chatController.sendMessage);
router.put('/read/:userId', authMiddleware.authorize('admin'), chatController.markAsRead);
router.put('/read', chatController.markAsRead);
router.get('/unread', chatController.getUnreadCount);

module.exports = router;
