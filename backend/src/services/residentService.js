const residentRepository = require('../repositories/residentRepository');
const apartmentRepository = require('../repositories/apartmentRepository');
const codeGenerator = require('../utils/generateCode');

const getResidents = async ({ page = 1, limit = 10, search = '' }) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const total = await residentRepository.countAll(search);
  const data = await residentRepository.findAll({ limit: limitNum, offset, search });
  const totalPages = Math.ceil(total / limitNum);

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    }
  };
};

const getResidentById = async (id) => {
  const resident = await residentRepository.findById(id);
  if (!resident) {
    throw { status: 404, message: 'Không tìm thấy cư dân', code: 'NOT_FOUND' };
  }
  return resident;
};

const createResident = async (residentData) => {
  // Validate apartment exists
  const apartment = await apartmentRepository.findById(residentData.apartment_id);
  if (!apartment) {
    throw { status: 400, message: 'Căn hộ không tồn tại', code: 'BAD_REQUEST' };
  }

  // Validate ID Card uniqueness
  const existingResident = await residentRepository.findByIdCard(residentData.id_card);
  if (existingResident) {
    throw { status: 400, message: 'Số CMND/CCCD đã tồn tại trên hệ thống', code: 'BAD_REQUEST' };
  }

  // Generate unique resident code
  let residentCode;
  let codeExists = true;
  while (codeExists) {
    residentCode = codeGenerator.generateResidentCode();
    // Verify code doesn't exist
    const [rows] = await require('../config/database').execute(
      'SELECT id FROM residents WHERE resident_code = ?',
      [residentCode]
    );
    if (rows.length === 0) codeExists = false;
  }

  const newResident = {
    ...residentData,
    resident_code: residentCode
  };

  const insertId = await residentRepository.create(newResident);

  // Update apartment status to 'occupied' if it is empty/maintenance
  if (apartment.status !== 'occupied') {
    await apartmentRepository.update(apartment.id, { status: 'occupied' });
  }

  return { id: insertId, resident_code: residentCode, ...residentData };
};

const updateResident = async (id, residentData) => {
  const resident = await residentRepository.findById(id);
  if (!resident) {
    throw { status: 404, message: 'Không tìm thấy cư dân', code: 'NOT_FOUND' };
  }

  if (residentData.id_card && residentData.id_card !== resident.id_card) {
    const existing = await residentRepository.findByIdCard(residentData.id_card);
    if (existing) {
      throw { status: 400, message: 'Số CMND/CCCD đã được sử dụng bởi cư dân khác', code: 'BAD_REQUEST' };
    }
  }

  if (residentData.apartment_id && residentData.apartment_id !== resident.apartment_id) {
    const apartment = await apartmentRepository.findById(residentData.apartment_id);
    if (!apartment) {
      throw { status: 400, message: 'Căn hộ mới không tồn tại', code: 'BAD_REQUEST' };
    }
    // Update apartment status
    if (apartment.status !== 'occupied') {
      await apartmentRepository.update(apartment.id, { status: 'occupied' });
    }
  }

  return residentRepository.update(id, residentData);
};

const deleteResident = async (id) => {
  const resident = await residentRepository.findById(id);
  if (!resident) {
    throw { status: 404, message: 'Không tìm thấy cư dân', code: 'NOT_FOUND' };
  }

  const success = await residentRepository.deleteById(id);

  // If this was the last resident in the apartment, optionally update apartment status (we keep it simple or user can change it manually)
  return success;
};

module.exports = {
  getResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident
};
