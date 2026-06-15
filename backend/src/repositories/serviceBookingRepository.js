const db = require('../config/database');

const findAll = async ({ userId = null, status = null } = {}) => {
  let query = `
    SELECT sb.*, s.name AS service_name, s.price, s.unit,
           u.full_name AS user_fullname, u.username AS user_name,
           u.phone AS user_phone,
           a.code AS apartment_code
    FROM service_bookings sb
    JOIN services s ON sb.service_id = s.id
    JOIN users u ON sb.user_id = u.id
    LEFT JOIN residents r ON u.id = r.user_id AND r.status = 'active'
    LEFT JOIN apartments a ON r.apartment_id = a.id
    WHERE 1=1
  `;
  const params = [];

  if (userId) {
    query += ' AND sb.user_id = ?';
    params.push(userId);
  }

  if (status) {
    query += ' AND sb.status = ?';
    params.push(status);
  }

  query += ' ORDER BY sb.created_at DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const query = `
    SELECT sb.*, s.name AS service_name, s.price, s.unit, s.description AS service_description,
           u.full_name AS user_fullname, u.username AS user_name,
           u.phone AS user_phone,
           a.code AS apartment_code
    FROM service_bookings sb
    JOIN services s ON sb.service_id = s.id
    JOIN users u ON sb.user_id = u.id
    LEFT JOIN residents r ON u.id = r.user_id AND r.status = 'active'
    LEFT JOIN apartments a ON r.apartment_id = a.id
    WHERE sb.id = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
};

const create = async (booking) => {
  const { booking_code, user_id, service_id, booking_date, booking_time, notes, status } = booking;
  const [result] = await db.execute(
    'INSERT INTO service_bookings (booking_code, user_id, service_id, booking_date, booking_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [booking_code, user_id, service_id, booking_date, booking_time || null, notes || null, status || 'pending']
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
    `UPDATE service_bookings SET ${fields.join(', ')} WHERE id = ?`,
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