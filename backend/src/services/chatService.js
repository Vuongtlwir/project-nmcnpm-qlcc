const chatRepository = require('../repositories/chatRepository');

const getConversation = async (userId) => {
  return chatRepository.findConversation(userId);
};

const sendMessage = async (messageData) => {
  const insertId = await chatRepository.create(messageData);
  return { id: insertId, ...messageData };
};

const markConversationRead = async (userId, viewer) => {
  return chatRepository.markAsRead(userId, viewer);
};

const getUnreadCount = async (userId, viewer) => {
  return chatRepository.getUnreadCount(userId, viewer);
};

const getAdminUnreadCounts = async () => {
  const counts = await chatRepository.getAdminUnreadCounts();
  const result = {};
  counts.forEach(row => { result[row.user_id] = row.count; });
  return result;
};

module.exports = {
  getConversation,
  sendMessage,
  markConversationRead,
  getUnreadCount,
  getAdminUnreadCounts
};
