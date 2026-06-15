const serviceBookingRepository = require('../repositories/serviceBookingRepository');
const serviceRepository = require('../repositories/serviceRepository');
const { generateBookingCode } = require('../utils/generateCode');

const getBookings = async ({ userId = null, status = null } = {}) => {
  return serviceBookingRepository.findAll({ userId, status });
};

const getBookingById = async (id) => {
  const booking = await serviceBookingRepository.findById(id);
  if (!booking) {
    throw { status: 404, message: 'Không tìm thấy đăng ký dịch vụ', code: 'NOT_FOUND' };
  }
  return booking;
};

const createBooking = async (bookingData) => {
  const service = await serviceRepository.findById(bookingData.service_id);
  if (!service) {
    throw { status: 404, message: 'Không tìm thấy dịch vụ', code: 'NOT_FOUND' };
  }
  if (!service.is_active) {
    throw { status: 400, message: 'Dịch vụ hiện không khả dụng', code: 'SERVICE_INACTIVE' };
  }

  bookingData.booking_code = generateBookingCode();
  bookingData.status = 'pending';
  const insertId = await serviceBookingRepository.create(bookingData);
  return { id: insertId, ...bookingData };
};

const updateBooking = async (id, updateData) => {
  const booking = await serviceBookingRepository.findById(id);
  if (!booking) {
    throw { status: 404, message: 'Không tìm thấy đăng ký dịch vụ', code: 'NOT_FOUND' };
  }
  return serviceBookingRepository.update(id, updateData);
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking
};