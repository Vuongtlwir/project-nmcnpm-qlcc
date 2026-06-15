const serviceService = require('../services/serviceService');
const response = require('../utils/response');

const getAllServices = async (req, res, next) => {
  try {
    const onlyActive = req.user.role !== 'admin';
    const services = await serviceService.getServices({ onlyActive });
    return response.success(res, 'Lấy danh sách dịch vụ thành công', services);
  } catch (err) {
    next(err);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    return response.success(res, 'Lấy chi tiết dịch vụ thành công', service);
  } catch (err) {
    next(err);
  }
};

const createService = async (req, res, next) => {
  try {
    const newService = await serviceService.createService(req.body);
    return response.success(res, 'Thêm dịch vụ thành công', newService, null, 201);
  } catch (err) {
    next(err);
  }
};

const updateService = async (req, res, next) => {
  try {
    const success = await serviceService.updateService(req.params.id, req.body);
    if (!success) {
      return response.error(res, 'Cập nhật dịch vụ thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Cập nhật dịch vụ thành công');
  } catch (err) {
    next(err);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const success = await serviceService.deleteService(req.params.id);
    if (!success) {
      return response.error(res, 'Xóa dịch vụ thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Xóa dịch vụ thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};