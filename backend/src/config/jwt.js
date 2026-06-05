require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_qlcc_system_2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
