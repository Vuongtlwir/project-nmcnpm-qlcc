const feeService = require('../services/feeService');
const response = require('../utils/response');

const getAllFees = async (req, res, next) => {
  try {
    const { search = '', apartment_id } = req.query;
    const fees = await feeService.getFees({ search, apartmentId: apartment_id != null ? apartment_id : null });
    return response.success(res, 'Lấy danh sách khoản thu thành công', fees);
  } catch (err) {
    next(err);
  }
};

const getFeeById = async (req, res, next) => {
  try {
    const fee = await feeService.getFeeById(req.params.id);
    return response.success(res, 'Lấy chi tiết khoản thu thành công', fee);
  } catch (err) {
    next(err);
  }
};

const createFee = async (req, res, next) => {
  try {
    const newFee = await feeService.createFee(req.body);
    return response.success(res, 'Tạo khoản thu thành công', newFee, null, 201);
  } catch (err) {
    next(err);
  }
};

const updateFee = async (req, res, next) => {
  try {
    const success = await feeService.updateFee(req.params.id, req.body);
    if (!success) {
      return response.error(res, 'Cập nhật khoản thu thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Cập nhật khoản thu thành công');
  } catch (err) {
    next(err);
  }
};

const deleteFee = async (req, res, next) => {
  try {
    const success = await feeService.deleteFee(req.params.id);
    if (!success) {
      return response.error(res, 'Xóa khoản thu thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Xóa khoản thu thành công');
  } catch (err) {
    next(err);
  }
};

const payFee = async (req, res, next) => {
  try {
    const { method } = req.body;
    const result = await feeService.payFee({
      feeId: req.params.id,
      userId: req.user.id,
      method: method || 'card'
    });
    return response.success(res, 'Gửi yêu cầu thanh toán thành công', result, null, 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  payFee
};
