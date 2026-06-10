const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const authMiddleware = require('../middlewares/authMiddleware');
const residentValidation = require('../validations/residentValidation');

// Authenticate all routes
router.use(authMiddleware.authenticate);

// Allow all authenticated users to get their own profile
router.get('/my-profile', residentController.getMyResident);

// Admin only routes below
router.use(authMiddleware.authorize('admin'));

router.get('/', residentController.getAllResidents);
router.get('/:id', residentController.getResidentById);
router.post('/', residentValidation.validateCreateResident, residentController.createResident);
router.put('/:id', residentValidation.validateUpdateResident, residentController.updateResident);
router.delete('/:id', residentController.deleteResident);

module.exports = router;
