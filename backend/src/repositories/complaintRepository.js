const db = require('../config/database');

const findAll = async ({ userId = null } = {}) => {
  let query = `
    SELECT c.*, u.full_name AS user_fullname, u.username AS user_name, a.code AS apartment_code
    FROM complaints c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN residents r ON u.id = r.user_id AND r.status = 'active'
    LEFT JOIN apartments a ON r.apartment_id = a.id
  `;
  const params = [];

  if (userId) {
    query += ' WHERE c.user_id = ?';
    params.push(userId);
  }

  query += ' ORDER BY c.created_at DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const query = `
    SELECT c.*, u.full_name AS user_fullname, u.username AS user_name, a.code AS apartment_code
    FROM complaints c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN residents r ON u.id = r.user_id AND r.status = 'active'
    LEFT JOIN apartments a ON r.apartment_id = a.id
    WHERE c.id = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
};

const create = async (complaint) => {
  const { user_id, title, type, content, status } = complaint;
  const [result] = await db.execute(
    'INSERT INTO complaints (user_id, title, type, content, status) VALUES (?, ?, ?, ?, ?)',
    [user_id, title, type || 'Khác', content, status || 'pending']
  );
  return result.insertId;
};

const update = async (id, complaintData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(complaintData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE complaints SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update
};
