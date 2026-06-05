const response = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Global Error Handler:', err);

  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred';
  const errCode = err.code || 'INTERNAL_ERROR';
  const details = process.env.NODE_ENV === 'development' ? err.stack : null;

  return response.error(res, message, errCode, details, status);
};

module.exports = errorHandler;
