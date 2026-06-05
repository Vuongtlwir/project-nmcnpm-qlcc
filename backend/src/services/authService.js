const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const hashUtils = require('../utils/hash');
const jwtConfig = require('../config/jwt');

const login = async (username, password) => {
  // Can login with either username or email
  let user = await userRepository.findByUsername(username);
  if (!user && username.includes('@')) {
    user = await userRepository.findByEmail(username);
  }

  if (!user) {
    throw { status: 401, message: 'Tên đăng nhập hoặc mật khẩu không chính xác', code: 'UNAUTHORIZED' };
  }

  if (!user.is_active) {
    throw { status: 403, message: 'Tài khoản của bạn đã bị khóa', code: 'FORBIDDEN' };
  }

  const isPasswordMatch = await hashUtils.comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw { status: 401, message: 'Tên đăng nhập hoặc mật khẩu không chính xác', code: 'UNAUTHORIZED' };
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone: user.phone
    }
  };
};

const register = async (userData) => {
  const { username, email, password } = userData;

  // Check if username already exists
  const existingUsername = await userRepository.findByUsername(username);
  if (existingUsername) {
    throw { status: 400, message: 'Tên đăng nhập đã tồn tại', code: 'BAD_REQUEST' };
  }

  // Check if email already exists
  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) {
    throw { status: 400, message: 'Email đã tồn tại', code: 'BAD_REQUEST' };
  }

  // Hash password
  const hashedPassword = await hashUtils.hashPassword(password);
  const newUserData = { ...userData, password: hashedPassword };

  const insertId = await userRepository.create(newUserData);
  
  // Return without password
  return {
    id: insertId,
    username: userData.username,
    email: userData.email,
    role: userData.role || 'user',
    full_name: userData.full_name,
    phone: userData.phone || null
  };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw { status: 404, message: 'Không tìm thấy tài khoản', code: 'NOT_FOUND' };
  }

  const isPasswordMatch = await hashUtils.comparePassword(oldPassword, user.password);
  if (!isPasswordMatch) {
    throw { status: 400, message: 'Mật khẩu cũ không chính xác', code: 'BAD_REQUEST' };
  }

  const hashedPassword = await hashUtils.hashPassword(newPassword);
  return userRepository.update(userId, { password: hashedPassword });
};

module.exports = {
  login,
  register,
  changePassword
};
