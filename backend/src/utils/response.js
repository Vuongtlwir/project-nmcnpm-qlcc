/**
 * Standard API Response Utility
 */

const success = (res, message, data = null, pagination = null, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    pagination
  });
};

const error = (res, message, errCode = 'INTERNAL_ERROR', details = null, status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    error: {
      code: errCode,
      details
    }
  });
};

module.exports = {
  success,
  error
};
