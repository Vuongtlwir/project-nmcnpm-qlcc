const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authValidation = require('../validations/authValidation');

router.post('/login', authValidation.validateLogin, authController.login);
router.post('/register', authValidation.validateRegister, authController.register);
router.get('/me', authMiddleware.authenticate, authController.getMe);
router.put('/change-password', authMiddleware.authenticate, authValidation.validateChangePassword, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
