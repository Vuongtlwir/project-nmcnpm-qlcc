const db = require('../config/database');

const findAll = async ({ search = '' }) => {
  let query = 'SELECT * FROM apartments';
  const params = [];

  if (search) {
    query += ' WHERE code LIKE ? OR building LIKE ? OR owner_name LIKE ?';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  query += ' ORDER BY code ASC';

  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM apartments WHERE id = ?', [id]);
  return rows[0] || null;
};

const findByCode = async (code) => {
  const [rows] = await db.execute('SELECT * FROM apartments WHERE code = ?', [code]);
  return rows[0] || null;
};

const create = async (apartment) => {
  const { code, floor, building, area, num_rooms, motorbikes = 0, bicycles = 0, cars = 0, electricity_reading = 0, water_reading = 0, last_electricity_reading = 0, last_water_reading = 0, status, owner_name, owner_phone } = apartment;
  const [result] = await db.execute(
    'INSERT INTO apartments (code, floor, building, area, num_rooms, motorbikes, bicycles, cars, electricity_reading, water_reading, last_electricity_reading, last_water_reading, status, owner_name, owner_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [code, floor, building, area, num_rooms, motorbikes, bicycles, cars, electricity_reading, water_reading, last_electricity_reading, last_water_reading, status || 'empty', owner_name || null, owner_phone || null]
  );
  return result.insertId;
};

const update = async (id, apartmentData) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(apartmentData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);
  const [result] = await db.execute(
    `UPDATE apartments SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const deleteById = async (id) => {
  const [result] = await db.execute('DELETE FROM apartments WHERE id = ?', [id]);
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
