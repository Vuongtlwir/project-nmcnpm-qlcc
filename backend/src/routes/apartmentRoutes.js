const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Only Admins can manage apartments
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize('admin'));

router.get('/', apartmentController.getAllApartments);
router.get('/:id', apartmentController.getApartmentById);
router.post('/', apartmentController.createApartment);
router.put('/:id', apartmentController.updateApartment);
router.delete('/:id', apartmentController.deleteApartment);

module.exports = router;
