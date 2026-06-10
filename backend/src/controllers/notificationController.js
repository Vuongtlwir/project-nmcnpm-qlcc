const notificationService = require('../services/notificationService');
const response = require('../utils/response');

const getAllNotifications = async (req, res, next) => {
  try {
    let notifications;
    if (req.user.role === 'admin') {
      notifications = await notificationService.getNotifications();
    } else {
      notifications = await notificationService.getNotifications({ userId: req.user.id });
    }
    return response.success(res, 'Lấy danh sách thông báo thành công', notifications);
  } catch (err) {
    next(err);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const { title, content, type, user_id, sort_order = 0 } = req.body;
    const newNotification = await notificationService.createNotification({
      title,
      content,
      type,
      user_id,
      sort_order,
      is_read: false
    });
    return response.success(res, 'Tạo thông báo thành công', newNotification, null, 201);
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const success = await notificationService.markAsRead(req.params.id);
    if (!success) {
      return response.error(res, 'Đánh dấu đã đọc thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Đánh dấu đã đọc thành công');
  } catch (err) {
    next(err);
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const { title, content, type, user_id, sort_order } = req.body;
    const success = await notificationService.updateNotification(req.params.id, {
      title,
      content,
      type,
      user_id,
      sort_order
    });

    if (!success) {
      return response.error(res, 'Cập nhật thông báo thất bại', 'BAD_REQUEST', null, 400);
    }

    return response.success(res, 'Cập nhật thông báo thành công');
  } catch (err) {
    next(err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const success = await notificationService.deleteNotification(req.params.id);
    if (!success) {
      return response.error(res, 'Xóa thông báo thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Xóa thông báo thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllNotifications,
  createNotification,
  markAsRead,
  updateNotification,
  deleteNotification
};
