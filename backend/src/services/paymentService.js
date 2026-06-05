const paymentRepository = require('../repositories/paymentRepository');
const feeRepository = require('../repositories/feeRepository');
const residentRepository = require('../repositories/residentRepository');
const codeGenerator = require('../utils/generateCode');

const getPayments = async ({ search = '', residentId = null }) => {
  return paymentRepository.findAll({ search, residentId });
};

const getPaymentById = async (id) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) {
    throw { status: 404, message: 'Không tìm thấy thông tin thanh toán', code: 'NOT_FOUND' };
  }
  return payment;
};

const createPayment = async (paymentData) => {
  // Check if fee exists
  const fee = await feeRepository.findById(paymentData.fee_id);
  if (!fee) {
    throw { status: 400, message: 'Khoản thu không tồn tại', code: 'BAD_REQUEST' };
  }

  // Check if resident exists
  const resident = await residentRepository.findById(paymentData.resident_id);
  if (!resident) {
    throw { status: 400, message: 'Cư dân không tồn tại', code: 'BAD_REQUEST' };
  }

  // Generate unique payment code
  let paymentCode;
  let codeExists = true;
  while (codeExists) {
    paymentCode = codeGenerator.generatePaymentCode();
    const [rows] = await require('../config/database').execute(
      'SELECT id FROM payments WHERE payment_code = ?',
      [paymentCode]
    );
    if (rows.length === 0) codeExists = false;
  }

  const newPayment = {
    ...paymentData,
    payment_code: paymentCode
  };

  const insertId = await paymentRepository.create(newPayment);
  return { id: insertId, payment_code: paymentCode, ...paymentData };
};

const updatePayment = async (id, paymentData) => {
  const payment = await paymentRepository.findById(id);
  if (!payment) {
    throw { status: 404, message: 'Không tìm thấy thông tin thanh toán', code: 'NOT_FOUND' };
  }

  if (paymentData.fee_id) {
    const fee = await feeRepository.findById(paymentData.fee_id);
    if (!fee) {
      throw { status: 400, message: 'Khoản thu không tồn tại', code: 'BAD_REQUEST' };
    }
  }

  if (paymentData.resident_id) {
    const resident = await residentRepository.findById(paymentData.resident_id);
    if (!resident) {
      throw { status: 400, message: 'Cư dân không tồn tại', code: 'BAD_REQUEST' };
    }
  }

  return paymentRepository.update(id, paymentData);
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment
};
