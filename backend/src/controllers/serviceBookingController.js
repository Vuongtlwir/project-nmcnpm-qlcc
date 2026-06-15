const serviceBookingService = require('../services/serviceBookingService');
const response = require('../utils/response');

const getAllBookings = async (req, res, next) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      const { status } = req.query;
      bookings = await serviceBookingService.getBookings({ status });
    } else {
      bookings = await serviceBookingService.getBookings({ userId: req.user.id });
    }
    return response.success(res, 'Lấy danh sách đăng ký dịch vụ thành công', bookings);
  } catch (err) {
    next(err);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await serviceBookingService.getBookingById(req.params.id);
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return response.error(res, 'Không có quyền truy cập đăng ký này', 'FORBIDDEN', null, 403);
    }
    return response.success(res, 'Lấy chi tiết đăng ký dịch vụ thành công', booking);
  } catch (err) {
    next(err);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { service_id, booking_date, booking_time, notes } = req.body;
    const newBooking = await serviceBookingService.createBooking({
      user_id: req.user.id,
      service_id,
      booking_date,
      booking_time,
      notes
    });
    return response.success(res, 'Đăng ký dịch vụ thành công', newBooking, null, 201);
  } catch (err) {
    next(err);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const updateData = {};
    if (req.user.role === 'admin') {
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.admin_response) updateData.admin_response = req.body.admin_response;
    } else {
      const booking = await serviceBookingService.getBookingById(req.params.id);
      if (booking.user_id !== req.user.id) {
        return response.error(res, 'Không có quyền sửa đăng ký này', 'FORBIDDEN', null, 403);
      }
      if (booking.status !== 'pending') {
        return response.error(res, 'Không thể hủy đăng ký đã được xác nhận', 'BAD_REQUEST', null, 400);
      }
      if (req.body.status === 'cancelled') {
        updateData.status = 'cancelled';
      } else {
        return response.error(res, 'Chỉ có thể hủy đăng ký', 'BAD_REQUEST', null, 400);
      }
    }

    const success = await serviceBookingService.updateBooking(req.params.id, updateData);
    if (!success) {
      return response.error(res, 'Cập nhật đăng ký thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Cập nhật đăng ký dịch vụ thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking
};