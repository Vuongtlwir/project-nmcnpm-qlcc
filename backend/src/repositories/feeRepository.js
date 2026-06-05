const db = require('../config/database');

const findAll = async ({ search = '' }) => {
  let query = `
    SELECT f.*, a.code AS apartment_code 
    FROM fees f
    LEFT JOIN apartments a ON f.apartment_id = a.id
  `;
  const params = [];

  if (search) {
    query += ' WHERE f.name LIKE ? OR f.fee_code LIKE ?';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam);
  }

  query += ' ORDER BY f.due_date DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const query = `
    SELECT f.*, a.code AS apartment_code 
    FROM fees f
    LEFT JOIN apartments a ON f.apartment_id = a.id
    WHERE f.id = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
};

const findByCode = async (code) => {
  const [rows] = await db.execute('SELECT * FROM fees WHERE fee_code = ?', [code]);
  return rows[0] || null;
};

const create = async (fee) => {
  const { fee_code, name, type, amount, description, apartment_id, due_date, status } = fee;
  const [result] = await db.execute(
    'INSERT INTO fees (fee_code, name, type, amount, description, apartment_id, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [fee_code, name, type, amount, description || null, apartment_id || null, due_date, status || 'active']
  );
  return result.insertId;
};

const update = async (id, feeData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(feeData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE fees SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const deleteById = async (id) => {
  const [result] = await db.execute('DELETE FROM fees WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  findById,
  findByCode,
  create,
  update,
  deleteById
};
