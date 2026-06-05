const apartmentService = require('../services/apartmentService');
const response = require('../utils/response');

const getAllApartments = async (req, res, next) => {
  try {
    const { search = '' } = req.query;
    const apartments = await apartmentService.getApartments({ search });
    return response.success(res, 'Lấy danh sách căn hộ thành công', apartments);
  } catch (err) {
    next(err);
  }
};

const getApartmentById = async (req, res, next) => {
  try {
    const apartment = await apartmentService.getApartmentById(req.params.id);
    return response.success(res, 'Lấy chi tiết căn hộ thành công', apartment);
  } catch (err) {
    next(err);
  }
};

const createApartment = async (req, res, next) => {
  try {
    const newApartment = await apartmentService.createApartment(req.body);
    return response.success(res, 'Thêm căn hộ thành công', newApartment, null, 201);
  } catch (err) {
    next(err);
  }
};

const updateApartment = async (req, res, next) => {
  try {
    const success = await apartmentService.updateApartment(req.params.id, req.body);
    if (!success) {
      return response.error(res, 'Cập nhật căn hộ thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Cập nhật căn hộ thành công');
  } catch (err) {
    next(err);
  }
};

const deleteApartment = async (req, res, next) => {
  try {
    const success = await apartmentService.deleteApartment(req.params.id);
    if (!success) {
      return response.error(res, 'Xóa căn hộ thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Xóa căn hộ thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment
};
