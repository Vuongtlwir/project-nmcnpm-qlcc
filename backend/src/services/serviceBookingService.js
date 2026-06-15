const serviceBookingRepository = require('../repositories/serviceBookingRepository');
const serviceRepository = require('../repositories/serviceRepository');
const residentRepository = require('../repositories/residentRepository');
const feeService = require('./feeService');
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

const createFeeForBooking = async (booking) => {
  const service = await serviceRepository.findById(booking.service_id);
  if (!service || !service.price || service.price == 0) return;

  const resident = await residentRepository.findByUserId(booking.user_id);
  if (!resident || !resident.apartment_id) return;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  await feeService.createFee({
    name: `Phí dịch vụ: ${service.name}`,
    type: 'voluntary',
    amount: service.price,
    description: `Phí đăng ký dịch vụ "${service.name}" - Mã đơn: ${booking.booking_code}`,
    apartment_id: resident.apartment_id,
    booking_id: booking.id,
    due_date: dueDate.toISOString().split('T')[0],
    status: 'active'
  });
};

const updateBooking = async (id, updateData) => {
  const booking = await serviceBookingRepository.findById(id);
  if (!booking) {
    throw { status: 404, message: 'Không tìm thấy đăng ký dịch vụ', code: 'NOT_FOUND' };
  }

  const result = await serviceBookingRepository.update(id, updateData);

  if (updateData.status === 'confirmed') {
    const updatedBooking = await serviceBookingRepository.findById(id);
    await createFeeForBooking(updatedBooking);
  }

  return result;
};

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking
};