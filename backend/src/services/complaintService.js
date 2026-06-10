const complaintRepository = require('../repositories/complaintRepository');

const getComplaints = async ({ userId = null } = {}) => {
  return complaintRepository.findAll({ userId });
};

const getComplaintById = async (id) => {
  const complaint = await complaintRepository.findById(id);
  if (!complaint) {
    throw { status: 404, message: 'Không tìm thấy khiếu nại/phản ánh', code: 'NOT_FOUND' };
  }
  return complaint;
};

const createComplaint = async (complaintData) => {
  complaintData.type = complaintData.type || 'Khác';
  const insertId = await complaintRepository.create(complaintData);
  return { id: insertId, ...complaintData };
};

const updateComplaint = async (id, updateData) => {
  const complaint = await complaintRepository.findById(id);
  if (!complaint) {
    throw { status: 404, message: 'Không tìm thấy khiếu nại/phản ánh', code: 'NOT_FOUND' };
  }

  return complaintRepository.update(id, updateData);
};

module.exports = {
  getComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint
};
