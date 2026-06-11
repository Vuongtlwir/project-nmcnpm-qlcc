const paymentService = require('../services/paymentService');
const response = require('../utils/response');

const getAllPayments = async (req, res, next) => {
  try {
    const { search = '', residentId = null } = req.query;
    
    // Non-admin can only see their own resident payments (handled in routes/service or here)
    let filterResidentId = residentId;
    if (req.user.role !== 'admin') {
      // Find resident linked to this user
      const [residents] = await require('../config/database').execute(
        'SELECT id FROM residents WHERE user_id = ?',
        [req.user.id]
      );
      if (residents.length === 0) {
        return response.success(res, 'Lấy lịch sử thanh toán thành công', []);
      }
      filterResidentId = residents[0].id;
    }

    const payments = await paymentService.getPayments({ search, residentId: filterResidentId });
    return response.success(res, 'Lấy danh sách lịch sử thanh toán thành công', payments);
  } catch (err) {
    next(err);
  }
};

const getPaymentById = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    
    // Check access
    if (req.user.role !== 'admin') {
      const [residents] = await require('../config/database').execute(
        'SELECT id FROM residents WHERE user_id = ?',
        [req.user.id]
      );
      if (residents.length === 0 || residents[0].id !== payment.resident_id) {
        return response.error(res, 'Không có quyền truy cập thông tin thanh toán này', 'FORBIDDEN', null, 403);
      }
    }

    return response.success(res, 'Lấy chi tiết thông tin thanh toán thành công', payment);
  } catch (err) {
    next(err);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const newPayment = await paymentService.createPayment(req.body);
    return response.success(res, 'Tạo thanh toán thành công', newPayment, null, 201);
  } catch (err) {
    next(err);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const success = await paymentService.updatePayment(req.params.id, req.body);
    if (!success) {
      return response.error(res, 'Cập nhật thanh toán thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Cập nhật thanh toán thành công');
  } catch (err) {
    next(err);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const success = await paymentService.updatePayment(req.params.id, { status: 'paid' });
    if (!success) {
      return response.error(res, 'Xác nhận thanh toán thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Xác nhận thanh toán thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  confirmPayment
};
