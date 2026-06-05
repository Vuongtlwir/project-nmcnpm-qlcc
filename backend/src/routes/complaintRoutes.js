const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

// View complaints (admin sees all, users see their own)
router.get('/', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintById);

// Submit complaint
router.post('/', complaintController.createComplaint);

// Update complaint (admin updates status/response, user updates title/content of pending complaints)
router.put('/:id', complaintController.updateComplaint);

module.exports = router;
