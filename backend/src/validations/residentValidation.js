const Joi = require('joi');

const residentCreateSchema = Joi.object({
  apartment_id: Joi.number().integer().required().messages({
    'any.required': 'Mã căn hộ (apartment_id) là bắt buộc'
  }),
  user_id: Joi.number().integer().allow(null),
  full_name: Joi.string().required().messages({
    'any.required': 'Họ và tên là bắt buộc'
  }),
  date_of_birth: Joi.date().required().messages({
    'any.required': 'Ngày sinh là bắt buộc'
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.required': 'Giới tính là bắt buộc'
  }),
  id_card: Joi.string().required().messages({
    'any.required': 'Số CMND/CCCD là bắt buộc'
  }),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).allow(null, ''),
  email: Joi.string().email().allow(null, ''),
  relation: Joi.string().valid('owner', 'tenant').default('tenant'),
  status: Joi.string().valid('active', 'moved_out').default('active'),
  move_in_date: Joi.date().required().messages({
    'any.required': 'Ngày chuyển vào là bắt buộc'
  }),
  move_out_date: Joi.date().allow(null)
});

const residentUpdateSchema = Joi.object({
  apartment_id: Joi.number().integer(),
  user_id: Joi.number().integer().allow(null),
  full_name: Joi.string(),
  date_of_birth: Joi.date(),
  gender: Joi.string().valid('male', 'female', 'other'),
  id_card: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).allow(null, ''),
  email: Joi.string().email().allow(null, ''),
  relation: Joi.string().valid('owner', 'tenant'),
  status: Joi.string().valid('active', 'moved_out'),
  move_in_date: Joi.date(),
  move_out_date: Joi.date().allow(null)
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
  validateCreateResident: validateRequest(residentCreateSchema),
  validateUpdateResident: validateRequest(residentUpdateSchema)
};
