const db = require('../config/database');

const findAll = async ({ limit = 10, offset = 0, search = '' }) => {
  let query = `
    SELECT r.*, a.code AS apartment_code, a.building AS apartment_building, u.username AS linked_username,
      CASE
        WHEN NOT EXISTS (
          SELECT 1 FROM fees f
          WHERE f.status = 'active'
            AND (f.apartment_id = r.apartment_id OR f.apartment_id IS NULL)
            AND NOT EXISTS (
              SELECT 1 FROM payments p
              WHERE p.fee_id = f.id AND p.status = 'paid'
            )
        ) THEN 'paid'
        ELSE 'unpaid'
      END AS fee_status
    FROM residents r
    JOIN apartments a ON r.apartment_id = a.id
    LEFT JOIN users u ON r.user_id = u.id
  `;
  const params = [];

  if (search) {
    query += ` WHERE r.full_name LIKE ? OR r.resident_code LIKE ? OR r.id_card LIKE ? OR r.phone LIKE ? OR u.username LIKE ? OR a.code LIKE ? OR a.building LIKE ?`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
  }

  query += ` ORDER BY r.created_at DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await db.query(query, params);
  return rows;
};

const countAll = async (search = '') => {
  let query = `SELECT COUNT(*) as count FROM residents r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN apartments a ON r.apartment_id = a.id`;
  const params = [];

  if (search) {
    query += ` WHERE r.full_name LIKE ? OR r.resident_code LIKE ? OR r.id_card LIKE ? OR r.phone LIKE ? OR u.username LIKE ? OR a.code LIKE ? OR a.building LIKE ?`;
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
  }

  const [rows] = await db.query(query, params);
  return rows[0].count;
};

const findById = async (id) => {
  const query = `
    SELECT r.*, a.code AS apartment_code, a.building AS apartment_building, a.status AS apartment_status, u.username AS linked_username 
    FROM residents r
    JOIN apartments a ON r.apartment_id = a.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
};

const findByUserId = async (userId) => {
  const query = `
    SELECT r.*, a.code AS apartment_code, a.building AS apartment_building, a.status AS apartment_status, u.username AS linked_username 
    FROM residents r
    JOIN apartments a ON r.apartment_id = a.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.user_id = ?
  `;
  const [rows] = await db.execute(query, [userId]);
  return rows[0] || null;
};

const findByIdCard = async (idCard) => {
  const [rows] = await db.execute('SELECT * FROM residents WHERE id_card = ?', [idCard]);
  return rows[0] || null;
};

const create = async (resident) => {
  const {
    resident_code, apartment_id, user_id, full_name, date_of_birth,
    gender, id_card, phone, email, relation, status, move_in_date, move_out_date
  } = resident;

  const [result] = await db.execute(
    `INSERT INTO residents (
      resident_code, apartment_id, user_id, full_name, date_of_birth,
      gender, id_card, phone, email, relation, status, move_in_date, move_out_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      resident_code, apartment_id, user_id || null, full_name, date_of_birth,
      gender, id_card, phone || null, email || null, relation || 'member',
      status || 'active', move_in_date, move_out_date || null
    ]
  );
  return result.insertId;
};

const update = async (id, residentData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(residentData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE residents SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const deleteById = async (id) => {
  const [result] = await db.execute('DELETE FROM residents WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  countAll,
  findById,
  findByUserId,
  findByIdCard,
  create,
  update,
  deleteById
};
