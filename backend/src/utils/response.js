/**
 * Standard API Response Utility
 */

const success = (res, message, data = null, pagination = null, status = 200) => {
  // Return data directly to simplify frontend consumption.
  if (data !== null) {
    return res.status(status).json(data);
  }
  // No data provided - return an empty object to maintain valid JSON
  return res.status(status).json({});
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
