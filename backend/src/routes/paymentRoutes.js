const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const paymentValidation = require('../validations/paymentValidation');

router.use(authMiddleware.authenticate);

// View payments (admin sees all, users see their own resident payments)
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);

// Admin-only operations: create payment, update payment status, confirm payment
router.post('/', authMiddleware.authorize('admin'), paymentValidation.validateCreatePayment, paymentController.createPayment);
router.put('/:id', authMiddleware.authorize('admin'), paymentValidation.validateUpdatePayment, paymentController.updatePayment);
router.put('/:id/confirm', authMiddleware.authorize('admin'), paymentController.confirmPayment);

module.exports = router;
