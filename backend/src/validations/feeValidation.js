const Joi = require('joi');

const feeCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Tên khoản thu là bắt buộc'
  }),
  type: Joi.string().valid('mandatory', 'voluntary').required().messages({
    'any.required': 'Loại khoản thu là bắt buộc'
  }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'Số tiền là bắt buộc'
  }),
  description: Joi.string().allow(null, ''),
  apartment_id: Joi.number().integer().allow(null),
  due_date: Joi.date().required().messages({
    'any.required': 'Hạn đóng là bắt buộc'
  }),
  status: Joi.string().valid('active', 'closed').default('active')
});

const feeUpdateSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string().valid('mandatory', 'voluntary'),
  amount: Joi.number().positive(),
  description: Joi.string().allow(null, ''),
  apartment_id: Joi.number().integer().allow(null),
  due_date: Joi.date(),
  status: Joi.string().valid('active', 'closed')
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
  validateCreateFee: validateRequest(feeCreateSchema),
  validateUpdateFee: validateRequest(feeUpdateSchema)
};
