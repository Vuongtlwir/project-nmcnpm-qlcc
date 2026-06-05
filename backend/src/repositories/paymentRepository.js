const db = require('../config/database');

const findAll = async ({ search = '', residentId = null }) => {
  let query = `
    SELECT p.*, f.name AS fee_name, f.fee_code, r.full_name AS resident_name, r.resident_code, a.code AS apartment_code
    FROM payments p
    JOIN fees f ON p.fee_id = f.id
    JOIN residents r ON p.resident_id = r.id
    JOIN apartments a ON r.apartment_id = a.id
  `;
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push('(f.name LIKE ? OR r.full_name LIKE ? OR p.payment_code LIKE ?)');
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  if (residentId) {
    conditions.push('p.resident_id = ?');
    params.push(residentId);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY p.payment_date DESC, p.created_at DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const query = `
    SELECT p.*, f.name AS fee_name, f.fee_code, r.full_name AS resident_name, r.resident_code, a.code AS apartment_code
    FROM payments p
    JOIN fees f ON p.fee_id = f.id
    JOIN residents r ON p.resident_id = r.id
    JOIN apartments a ON r.apartment_id = a.id
    WHERE p.id = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
};

const create = async (payment) => {
  const { payment_code, fee_id, resident_id, amount, payment_date, method, note, status } = payment;
  const [result] = await db.execute(
    'INSERT INTO payments (payment_code, fee_id, resident_id, amount, payment_date, method, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [payment_code, fee_id, resident_id, amount, payment_date, method || 'transfer', note || null, status || 'pending']
  );
  return result.insertId;
};

const update = async (id, paymentData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(paymentData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`,
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
