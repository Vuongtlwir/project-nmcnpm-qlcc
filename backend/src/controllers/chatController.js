const chatService = require('../services/chatService');
const response = require('../utils/response');

const getConversation = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;
    if (req.user.role !== 'admin' && userId != req.user.id) {
      return response.error(res, 'Không có quyền truy cập', 'FORBIDDEN', null, 403);
    }
    const messages = await chatService.getConversation(userId);
    return response.success(res, 'Lấy tin nhắn thành công', messages);
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { user_id, text } = req.body;
    const sender = req.body.sender || (req.user.role === 'admin' ? 'admin' : 'user');
    const targetUserId = req.user.role === 'admin' ? user_id : req.user.id;

    if (!targetUserId || !text) {
      return response.error(res, 'Thiếu thông tin tin nhắn', 'BAD_REQUEST', null, 400);
    }

    const message = await chatService.sendMessage({
      user_id: targetUserId,
      sender,
      text
    });
    return response.success(res, 'Gửi tin nhắn thành công', message, null, 201);
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;
    const viewer = req.user.role === 'admin' ? 'admin' : 'user';
    await chatService.markConversationRead(userId, viewer);
    return response.success(res, 'Đã đánh dấu đã đọc');
  } catch (err) {
    next(err);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const counts = await chatService.getAdminUnreadCounts();
      return response.success(res, 'Lấy số tin chưa đọc thành công', counts);
    }
    const count = await chatService.getUnreadCount(req.user.id, 'user');
    return response.success(res, 'Lấy số tin chưa đọc thành công', { count });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getConversation,
  sendMessage,
  markAsRead,
  getUnreadCount
};
