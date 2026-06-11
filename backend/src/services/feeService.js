const feeRepository = require('../repositories/feeRepository');
const apartmentRepository = require('../repositories/apartmentRepository');
const residentRepository = require('../repositories/residentRepository');
const paymentService = require('./paymentService');
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

  return paymentService.createPayment({
    fee_id: feeId,
    resident_id: resident.id,
    amount: fee.amount,
    payment_date: new Date().toISOString().split('T')[0],
    method,
    status: 'pending'
  });
};

module.exports = {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  payFee
};
