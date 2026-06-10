/**
 * Standard API Response Utility
 */

const success = (res, message, data = null, pagination = null, status = 200) => {
  const response = {
    success: true,
    message,
    data: data || null
  };
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return res.status(status).json(response);
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
