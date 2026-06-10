const authService = require('../services/authService');
const response = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    return response.success(res, 'Đăng nhập thành công', result);
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return response.success(res, 'Đăng ký tài khoản thành công', result, null, 201);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user is populated by authenticate middleware
    return response.success(res, 'Lấy thông tin tài khoản hiện tại thành công', req.user);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, oldPassword, newPassword);
    return response.success(res, 'Thay đổi mật khẩu thành công');
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return response.error(res, 'Vui lòng nhập email', 'BAD_REQUEST', null, 400);
    }
    const result = await authService.forgotPassword(email);
    return response.success(res, result.message);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
  getMe,
  changePassword,
  forgotPassword
};
