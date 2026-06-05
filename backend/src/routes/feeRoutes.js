const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const authMiddleware = require('../middlewares/authMiddleware');
const feeValidation = require('../validations/feeValidation');

router.use(authMiddleware.authenticate);

// Both user & admin can list/get detail of fees
router.get('/', feeController.getAllFees);
router.get('/:id', feeController.getFeeById);

// Only admin can manage fees
router.post('/', authMiddleware.authorize('admin'), feeValidation.validateCreateFee, feeController.createFee);
router.put('/:id', authMiddleware.authorize('admin'), feeValidation.validateUpdateFee, feeController.updateFee);
router.delete('/:id', authMiddleware.authorize('admin'), feeController.deleteFee);

module.exports = router;
