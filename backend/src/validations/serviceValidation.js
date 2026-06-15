const Joi = require('joi');

const createService = Joi.object({
  name: Joi.string().required().max(100).messages({
    'string.empty': 'Tên dịch vụ không được để trống',
    'any.required': 'Tên dịch vụ là bắt buộc'
  }),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).default(0),
  unit: Joi.string().allow('', null).max(50)
});

const updateService = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0),
  unit: Joi.string().allow('', null).max(50),
  is_active: Joi.boolean()
});

const createBooking = Joi.object({
  service_id: Joi.number().integer().required().messages({
    'any.required': 'Dịch vụ là bắt buộc'
  }),
  booking_date: Joi.date().required().messages({
    'any.required': 'Ngày đăng ký là bắt buộc'
  }),
  booking_time: Joi.string().allow('', null).pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  notes: Joi.string().allow('', null)
});

module.exports = {
  createService,
  updateService,
  createBooking
};