const feeRepository = require('../repositories/feeRepository');
const apartmentRepository = require('../repositories/apartmentRepository');
const residentRepository = require('../repositories/residentRepository');
const userRepository = require('../repositories/userRepository');
const paymentService = require('./paymentService');
const notificationService = require('./notificationService');
const codeGenerator = require('../utils/generateCode');

const getFees = async ({ search = '', apartmentId = null }) => {
  return feeRepository.findAll({ search, apartmentId });
};

const getFeeById = async (id) => {
  const fee = await feeRepository.findById(id);
  if (!fee) {
    throw { status: 404, message: 'Không tìm thấy khoản thu', code: 'NOT_FOUND' };
  }
  return fee;
};

const createFee = async (feeData) => {
  if (feeData.apartment_id) {
    const apartment = await apartmentRepository.findById(feeData.apartment_id);
    if (!apartment) {
      throw { status: 400, message: 'Căn hộ chỉ định không tồn tại', code: 'BAD_REQUEST' };
    }
  }

  // Generate unique fee code
  let feeCode;
  let codeExists = true;
  while (codeExists) {
    feeCode = codeGenerator.generateFeeCode();
    const [rows] = await require('../config/database').execute(
      'SELECT id FROM fees WHERE fee_code = ?',
      [feeCode]
    );
    if (rows.length === 0) codeExists = false;
  }

  const newFee = {
    ...feeData,
    fee_code: feeCode
  };

  const insertId = await feeRepository.create(newFee);
  return { id: insertId, fee_code: feeCode, ...feeData };
};

const updateFee = async (id, feeData) => {
  const fee = await feeRepository.findById(id);
  if (!fee) {
    throw { status: 404, message: 'Không tìm thấy khoản thu', code: 'NOT_FOUND' };
  }

  if (feeData.apartment_id) {
    const apartment = await apartmentRepository.findById(feeData.apartment_id);
    if (!apartment) {
      throw { status: 400, message: 'Căn hộ chỉ định không tồn tại', code: 'BAD_REQUEST' };
    }
  }

  return feeRepository.update(id, feeData);
};

const deleteFee = async (id) => {
  const fee = await feeRepository.findById(id);
  if (!fee) {
    throw { status: 404, message: 'Không tìm thấy khoản thu', code: 'NOT_FOUND' };
  }

  return feeRepository.deleteById(id);
};

const payFee = async ({ feeId, userId, method }) => {
  const fee = await feeRepository.findById(feeId);
  if (!fee) {
    throw { status: 404, message: 'Khoản thu không tồn tại', code: 'NOT_FOUND' };
  }

  const resident = await residentRepository.findByUserId(userId);
  if (!resident) {
    throw { status: 400, message: 'Không tìm thấy thông tin cư dân', code: 'BAD_REQUEST' };
  }

  const payment = await paymentService.createPayment({
    fee_id: feeId,
    resident_id: resident.id,
    amount: fee.amount,
    payment_date: new Date().toISOString().split('T')[0],
    method,
    status: 'pending'
  });

  const methodLabels = { card: 'Thẻ', transfer: 'Chuyển khoản', cash: 'Tiền mặt' };
  const notificationTitle = 'Yêu cầu thanh toán mới';
  const notificationContent = `Cư dân ${resident.full_name} (${resident.resident_code}) đã yêu cầu thanh toán hóa đơn ${fee.fee_code || feeId} - ${fee.name} với số tiền ${Number(fee.amount).toLocaleString('vi-VN')}đ bằng phương thức ${methodLabels[method] || method}. Vui lòng xác nhận thanh toán.`;

  const admins = await userRepository.findByRole('admin');
  for (const admin of admins) {
    await notificationService.createNotification({
      user_id: admin.id,
      title: notificationTitle,
      content: notificationContent,
      type: 'fee',
      sort_order: 1,
      is_read: false
    });
  }

  return payment;
};

module.exports = {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  payFee
};
