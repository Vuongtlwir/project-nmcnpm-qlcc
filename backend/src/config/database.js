const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'qlcc_db',
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection pool established successfully.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
})();

module.exports = pool;
