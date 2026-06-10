const notificationRepository = require('../repositories/notificationRepository');

const getNotifications = async ({ userId = null } = {}) => {
  return notificationRepository.findAll({ userId });
};

const getNotificationById = async (id) => {
  const notification = await notificationRepository.findById(id);
  if (!notification) {
    throw { status: 404, message: 'Không tìm thấy thông báo', code: 'NOT_FOUND' };
  }
  return notification;
};

const createNotification = async (notificationData) => {
  const insertId = await notificationRepository.create(notificationData);
  return { id: insertId, ...notificationData };
};

const markAsRead = async (id) => {
  const notification = await notificationRepository.findById(id);
  if (!notification) {
    throw { status: 404, message: 'Không tìm thấy thông báo', code: 'NOT_FOUND' };
  }

  return notificationRepository.update(id, { is_read: 1 });
};

const updateNotification = async (id, notificationData) => {
  const notification = await notificationRepository.findById(id);
  if (!notification) {
    throw { status: 404, message: 'Không tìm thấy thông báo', code: 'NOT_FOUND' };
  }

  return notificationRepository.update(id, notificationData);
};

const deleteNotification = async (id) => {
  const notification = await notificationRepository.findById(id);
  if (!notification) {
    throw { status: 404, message: 'Không tìm thấy thông báo', code: 'NOT_FOUND' };
  }

  return notificationRepository.deleteById(id);
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  updateNotification,
  deleteNotification
};
