const db = require('../config/database');

const findConversation = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC',
    [userId]
  );
  return rows;
};

const create = async (message) => {
  const { user_id, sender, text } = message;
  const [result] = await db.execute(
    'INSERT INTO messages (user_id, sender, text) VALUES (?, ?, ?)',
    [user_id, sender, text]
  );
  return result.insertId;
};

const markAsRead = async (userId, viewer) => {
  const [result] = await db.execute(
    'UPDATE messages SET is_read = 1 WHERE user_id = ? AND sender != ? AND is_read = 0',
    [userId, viewer]
  );
  return result.affectedRows > 0;
};

const getUnreadCount = async (userId, viewer) => {
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count FROM messages WHERE user_id = ? AND sender != ? AND is_read = 0',
    [userId, viewer]
  );
  return rows[0].count;
};

const getAdminUnreadCounts = async () => {
  const [rows] = await db.execute(`
    SELECT user_id, COUNT(*) as count
    FROM messages
    WHERE sender = 'user' AND is_read = 0
    GROUP BY user_id
  `);
  return rows;
};

module.exports = {
  findConversation,
  create,
  markAsRead,
  getUnreadCount,
  getAdminUnreadCounts
};
