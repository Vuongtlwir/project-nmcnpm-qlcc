const feeRepository = require('../repositories/feeRepository');
const apartmentRepository = require('../repositories/apartmentRepository');
const codeGenerator = require('../utils/generateCode');

const getFees = async ({ search = '' }) => {
  return feeRepository.findAll({ search });
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

module.exports = {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee
};
