const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const serviceBookingController = require('../controllers/serviceBookingController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.authenticate);

// Booking routes MUST be before /:id to avoid route conflict
router.get('/bookings/all', authMiddleware.authorize('admin'), serviceBookingController.getAllBookings);
router.get('/bookings', serviceBookingController.getAllBookings);
router.get('/bookings/:id', serviceBookingController.getBookingById);
router.post('/bookings', serviceBookingController.createBooking);
router.put('/bookings/:id', serviceBookingController.updateBooking);

// Service management
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Admin-only service CRUD
router.post('/', authMiddleware.authorize('admin'), serviceController.createService);
router.put('/:id', authMiddleware.authorize('admin'), serviceController.updateService);
router.delete('/:id', authMiddleware.authorize('admin'), serviceController.deleteService);

module.exports = router;