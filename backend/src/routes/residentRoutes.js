const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const authMiddleware = require('../middlewares/authMiddleware');
const residentValidation = require('../validations/residentValidation');

// Only Admins can access resident management
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize('admin'));

router.get('/', residentController.getAllResidents);
router.get('/:id', residentController.getResidentById);
router.post('/', residentValidation.validateCreateResident, residentController.createResident);
router.put('/:id', residentValidation.validateUpdateResident, residentController.updateResident);
router.delete('/:id', residentController.deleteResident);

module.exports = router;
