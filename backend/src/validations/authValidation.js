const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username là bắt buộc'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Mật khẩu là bắt buộc'
  })
});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username phải từ 3 kí tự trở lên',
    'any.required': 'Username là bắt buộc'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải từ 6 kí tự trở lên',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  full_name: Joi.string().required().messages({
    'any.required': 'Họ và tên là bắt buộc'
  }),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).allow(null, '').messages({
    'string.pattern.base': 'Số điện thoại không hợp lệ (phải gồm 10 hoặc 11 chữ số)'
  }),
  role: Joi.string().valid('admin', 'user').default('user')
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': 'Mật khẩu cũ là bắt buộc'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu mới phải từ 6 kí tự trở lên',
    'any.required': 'Mật khẩu mới là bắt buộc'
  })
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
  validateLogin: validateRequest(loginSchema),
  validateRegister: validateRequest(registerSchema),
  validateChangePassword: validateRequest(changePasswordSchema)
};
