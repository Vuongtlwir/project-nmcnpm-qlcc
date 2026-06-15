const db = require('../config/database');

const findAll = async ({ onlyActive = true } = {}) => {
  let query = 'SELECT * FROM services';
  const params = [];
  if (onlyActive) {
    query += ' WHERE is_active = TRUE';
  }
  query += ' ORDER BY id ASC';
  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM services WHERE id = ?', [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const { name, description, price, unit } = data;
  const [result] = await db.execute(
    'INSERT INTO services (name, description, price, unit) VALUES (?, ?, ?, ?)',
    [name, description, price || 0, unit || null]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (fields.length === 0) return false;
  values.push(id);
  const [result] = await db.execute(
    `UPDATE services SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const deleteById = async (id) => {
  const [result] = await db.execute('DELETE FROM services WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById
};