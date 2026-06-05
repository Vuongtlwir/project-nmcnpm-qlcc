const apartmentRepository = require('../repositories/apartmentRepository');

const getApartments = async ({ search = '' }) => {
  return apartmentRepository.findAll({ search });
};

const getApartmentById = async (id) => {
  const apartment = await apartmentRepository.findById(id);
  if (!apartment) {
    throw { status: 404, message: 'Không tìm thấy căn hộ', code: 'NOT_FOUND' };
  }
  return apartment;
};

const createApartment = async (apartmentData) => {
  const existing = await apartmentRepository.findByCode(apartmentData.code);
  if (existing) {
    throw { status: 400, message: 'Mã căn hộ đã tồn tại', code: 'BAD_REQUEST' };
  }

  const insertId = await apartmentRepository.create(apartmentData);
  return { id: insertId, ...apartmentData };
};

const updateApartment = async (id, apartmentData) => {
  const apartment = await apartmentRepository.findById(id);
  if (!apartment) {
    throw { status: 404, message: 'Không tìm thấy căn hộ', code: 'NOT_FOUND' };
  }

  if (apartmentData.code && apartmentData.code !== apartment.code) {
    const existing = await apartmentRepository.findByCode(apartmentData.code);
    if (existing) {
      throw { status: 400, message: 'Mã căn hộ đã tồn tại', code: 'BAD_REQUEST' };
    }
  }

  return apartmentRepository.update(id, apartmentData);
};

const deleteApartment = async (id) => {
  const apartment = await apartmentRepository.findById(id);
  if (!apartment) {
    throw { status: 404, message: 'Không tìm thấy căn hộ', code: 'NOT_FOUND' };
  }

  return apartmentRepository.deleteById(id);
};

module.exports = {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment
};
