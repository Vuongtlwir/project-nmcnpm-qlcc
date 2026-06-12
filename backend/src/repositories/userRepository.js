const db = require('../config/database');

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

const findByUsername = async (username) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const create = async (user) => {
  const { username, email, password, role, full_name, phone } = user;
  const [result] = await db.execute(
    'INSERT INTO users (username, email, password, role, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
    [username, email, password, role || 'user', full_name, phone || null]
  );
  return result.insertId;
};

const update = async (id, userData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(userData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const deleteById = async (id) => {
  const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findById,
  findByUsername,
  findByEmail,
  create,
  update,
  deleteById
};
