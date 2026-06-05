const Joi = require('joi');

const paymentCreateSchema = Joi.object({
  fee_id: Joi.number().integer().required().messages({
    'any.required': 'Mã khoản thu (fee_id) là bắt buộc'
  }),
  resident_id: Joi.number().integer().required().messages({
    'any.required': 'Mã cư dân (resident_id) là bắt buộc'
  }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'Số tiền thanh toán là bắt buộc'
  }),
  payment_date: Joi.date().required().messages({
    'any.required': 'Ngày thanh toán là bắt buộc'
  }),
  method: Joi.string().valid('cash', 'transfer', 'card').default('transfer'),
  note: Joi.string().allow(null, ''),
  status: Joi.string().valid('paid', 'pending', 'cancelled').default('pending')
});

const paymentUpdateSchema = Joi.object({
  fee_id: Joi.number().integer(),
  resident_id: Joi.number().integer(),
  amount: Joi.number().positive(),
  payment_date: Joi.date(),
  method: Joi.string().valid('cash', 'transfer', 'card'),
  note: Joi.string().allow(null, ''),
  status: Joi.string().valid('paid', 'pending', 'cancelled')
});

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu đầu vào không hợp lệ',
        error: {
          code: 'VALIDATION_ERROR',
          details: errorDetails
        }
      });
    }
    next();
  };
};

module.exports = {
  validateCreatePayment: validateRequest(paymentCreateSchema),
  validateUpdatePayment: validateRequest(paymentUpdateSchema)
};
