const complaintService = require('../services/complaintService');
const response = require('../utils/response');

const getAllComplaints = async (req, res, next) => {
  try {
    let complaints;
    if (req.user.role === 'admin') {
      complaints = await complaintService.getComplaints();
    } else {
      // Regular users only see their own complaints
      complaints = await complaintService.getComplaints({ userId: req.user.id });
    }
    return response.success(res, 'Lấy danh sách khiếu nại thành công', complaints);
  } catch (err) {
    next(err);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
    
    // Regular users can only see their own complaints
    if (req.user.role !== 'admin' && complaint.user_id !== req.user.id) {
      return response.error(res, 'Không có quyền truy cập khiếu nại này', 'FORBIDDEN', null, 403);
    }

    return response.success(res, 'Lấy chi tiết khiếu nại thành công', complaint);
  } catch (err) {
    next(err);
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const { title, type, content } = req.body;
    const newComplaint = await complaintService.createComplaint({
      user_id: req.user.id,
      title,
      type,
      content,
      status: 'pending'
    });
    return response.success(res, 'Gửi khiếu nại thành công', newComplaint, null, 201);
  } catch (err) {
    next(err);
  }
};

const updateComplaint = async (req, res, next) => {
  try {
    // Admin update status or response, user can only update before processing (we keep it simple here)
    const updateData = {};
    if (req.user.role === 'admin') {
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.response) updateData.response = req.body.response;
      if (req.body.type) updateData.type = req.body.type;
    } else {
      // User can only update title and content if status is still pending
      const complaint = await complaintService.getComplaintById(req.params.id);
      if (complaint.user_id !== req.user.id) {
        return response.error(res, 'Không có quyền sửa khiếu nại này', 'FORBIDDEN', null, 403);
      }
      if (complaint.status !== 'pending') {
        return response.error(res, 'Không thể sửa khiếu nại đã được tiếp nhận xử lý', 'BAD_REQUEST', null, 400);
      }
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.content) updateData.content = req.body.content;
    }

    const success = await complaintService.updateComplaint(req.params.id, updateData);
    if (!success) {
      return response.error(res, 'Cập nhật khiếu nại thất bại', 'BAD_REQUEST', null, 400);
    }
    return response.success(res, 'Cập nhật khiếu nại thành công');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint
};
