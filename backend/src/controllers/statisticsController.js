const statisticsService = require('../services/statisticsService');
const response = require('../utils/response');

const getOverview = async (req, res, next) => {
  try {
    const data = await statisticsService.getOverview();
    return response.success(res, 'Lấy số liệu tổng quan thành công', data);
  } catch (err) {
    next(err);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    const data = await statisticsService.getRevenueByMonth();
    return response.success(res, 'Lấy doanh thu theo tháng thành công', data);
  } catch (err) {
    next(err);
  }
};

const getFeeCollection = async (req, res, next) => {
  try {
    const data = await statisticsService.getFeeCollectionRate();
    return response.success(res, 'Lấy tỷ lệ thu phí thành công', data);
  } catch (err) {
    next(err);
  }
};

const getApartmentStatus = async (req, res, next) => {
  try {
    const data = await statisticsService.getApartmentStatus();
    return response.success(res, 'Lấy trạng thái căn hộ thành công', data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview,
  getRevenue,
  getFeeCollection,
  getApartmentStatus
};
