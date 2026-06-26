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
    SELECT m.user_id, COUNT(*) as count, r.full_name, r.id_card, a.code AS apartment_code
    FROM messages m
    LEFT JOIN residents r ON m.user_id = r.user_id
    LEFT JOIN apartments a ON r.apartment_id = a.id
    WHERE m.sender = 'user' AND m.is_read = 0
    GROUP BY m.user_id
    ORDER BY MAX(m.created_at) DESC
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
