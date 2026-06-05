const residentService = require('../services/residentService');
const response = require('../utils/response');

const getAllResidents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await residentService.getResidents({ page, limit, search });
    return response.success(res, 'Lấy danh sách cư dân thành công', result.data, result.pagination);
  } catch (err) {
    next(err);
  }
};

const getResidentById = async (req, res, next) => {
  try {
    const resident = await residentService.getResidentById(req.params.id);
    return response.success(res, 'Lấy chi tiết cư dân thành công', resident);
  } catch (err) {
    next(err);
  }
};

const createResident = async (req, res, next) => {
  try {
    const newResident = await residentService.createResident(req.body);
    return response.success(res, 'Thêm cư dân thành công', newResident, null, 201);
  } catch (err) {
    next(err);
  }
};

const updateResident = async (req, res, next) => {
  try {
    const success = await residentService.updateResident(req.params.id, req.body);
    if (!success) {
      return response.error(res, 'Cập nhật cư dân thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Cập nhật cư dân thành công');
  } catch (err) {
    next(err);
  }
};

const deleteResident = async (req, res, next) => {
  try {
    const success = await residentService.deleteResident(req.params.id);
    if (!success) {
      return response.error(res, 'Xóa cư dân thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Xóa cư dân thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident
};
