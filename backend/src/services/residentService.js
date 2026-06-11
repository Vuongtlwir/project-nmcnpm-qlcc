const residentRepository = require('../repositories/residentRepository');
const apartmentRepository = require('../repositories/apartmentRepository');
const userRepository = require('../repositories/userRepository');
const hashUtils = require('../utils/hash');
const codeGenerator = require('../utils/generateCode');
const mailService = require('./mailService');

const generateRandomPassword = (length = 8) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

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

const getResidentByUserId = async (userId) => {
  const resident = await residentRepository.findByUserId(userId);
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

  let userCredentials = null;
  if (!residentData.user_id) {
    const username = residentData.id_card;
    if (!username) {
      throw { status: 400, message: 'Số CMND/CCCD là bắt buộc để tạo tài khoản cư dân', code: 'BAD_REQUEST' };
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw { status: 400, message: 'Tên đăng nhập cư dân đã tồn tại', code: 'BAD_REQUEST' };
    }

    if (residentData.email) {
      const existingEmail = await userRepository.findByEmail(residentData.email);
      if (existingEmail) {
        throw { status: 400, message: 'Email cư dân đã tồn tại', code: 'BAD_REQUEST' };
      }
    }

    const generatedPassword = generateRandomPassword(8);
    const hashedPassword = await hashUtils.hashPassword(generatedPassword);
    const newUserId = await userRepository.create({
      username,
      email: residentData.email,
      password: hashedPassword,
      role: 'user',
      full_name: residentData.full_name,
      phone: residentData.phone || null
    });

    residentData.user_id = newUserId;
    userCredentials = { username, password: generatedPassword };

    if (residentData.email) {
      mailService.sendNewAccountEmail({
        email: residentData.email,
        username,
        password: generatedPassword,
        fullName: residentData.full_name,
      });
    }
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

  // Update apartment status based on resident relationship
  if (residentData.relation === 'owner') {
    if (apartment.status !== 'sold') {
      await apartmentRepository.update(apartment.id, { status: 'sold' });
    }
  } else if (residentData.relation === 'tenant') {
    if (apartment.status !== 'occupied') {
      await apartmentRepository.update(apartment.id, { status: 'occupied' });
    }
  }

  const result = { id: insertId, resident_code: residentCode, ...residentData };
  if (userCredentials) {
    result.user_credentials = userCredentials;
  }

  return result;
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

  const apartmentId = resident.apartment_id;
  const success = await residentRepository.deleteById(id);

  if (success && apartmentId) {
    await apartmentRepository.update(apartmentId, { status: 'empty' });
  }

  return success;
};

module.exports = {
  getResidents,
  getResidentById,
  getResidentByUserId,
  createResident,
  updateResident,
  deleteResident
};
