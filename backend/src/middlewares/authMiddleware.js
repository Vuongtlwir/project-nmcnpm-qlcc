const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const db = require('../config/database');
const response = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 'Authentication token missing or invalid format', 'UNAUTHORIZED', null, 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, jwtConfig.secret);
    } catch (err) {
      return response.error(res, 'Invalid or expired token', 'UNAUTHORIZED', null, 401);
    }

    // Fetch user to ensure user still exists and is active
    const [rows] = await db.execute(
      'SELECT id, username, email, role, full_name, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return response.error(res, 'User no longer exists', 'UNAUTHORIZED', null, 401);
    }

    const user = rows[0];
    if (!user.is_active) {
      return response.error(res, 'User account is deactivated', 'FORBIDDEN', null, 403);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return response.error(res, 'Internal server authentication error', 'INTERNAL_ERROR', err.message, 500);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, 'User not authenticated', 'UNAUTHORIZED', null, 401);
    }

    if (!roles.includes(req.user.role)) {
      return response.error(res, 'Access denied. Insufficient permissions.', 'FORBIDDEN', null, 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
