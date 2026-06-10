const db = require('../config/database');

const findAll = async ({ userId = null } = {}) => {
  let query = 'SELECT * FROM notifications';
  const params = [];

  if (userId) {
    // Show general notifications (user_id IS NULL) + user specific notifications
    query += ' WHERE user_id IS NULL OR user_id = ?';
    params.push(userId);
  }

  query += ' ORDER BY sort_order ASC, created_at DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM notifications WHERE id = ?', [id]);
  return rows[0] || null;
};

const create = async (notification) => {
  const { user_id, sort_order = 0, title, content, type, is_read } = notification;
  const [result] = await db.execute(
    'INSERT INTO notifications (user_id, sort_order, title, content, type, is_read) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id || null, sort_order, title, content, type || 'general', is_read ? 1 : 0]
  );
  return result.insertId;
};

const update = async (id, notificationData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(notificationData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE notifications SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const deleteById = async (id) => {
  const [result] = await db.execute('DELETE FROM notifications WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById
};
