const serviceRepository = require('../repositories/serviceRepository');

const getServices = async ({ onlyActive = true } = {}) => {
  return serviceRepository.findAll({ onlyActive });
};

const getServiceById = async (id) => {
  const service = await serviceRepository.findById(id);
  if (!service) {
    throw { status: 404, message: 'Không tìm thấy dịch vụ', code: 'NOT_FOUND' };
  }
  return service;
};

const createService = async (data) => {
  const insertId = await serviceRepository.create(data);
  return { id: insertId, ...data };
};

const updateService = async (id, data) => {
  const service = await serviceRepository.findById(id);
  if (!service) {
    throw { status: 404, message: 'Không tìm thấy dịch vụ', code: 'NOT_FOUND' };
  }
  return serviceRepository.update(id, data);
};

const deleteService = async (id) => {
  const service = await serviceRepository.findById(id);
  if (!service) {
    throw { status: 404, message: 'Không tìm thấy dịch vụ', code: 'NOT_FOUND' };
  }
  return serviceRepository.deleteById(id);
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};