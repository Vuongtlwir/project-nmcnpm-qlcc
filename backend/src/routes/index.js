const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const residentRoutes = require('./residentRoutes');
const apartmentRoutes = require('./apartmentRoutes');
const feeRoutes = require('./feeRoutes');
const paymentRoutes = require('./paymentRoutes');
const complaintRoutes = require('./complaintRoutes');
const notificationRoutes = require('./notificationRoutes');
const statisticsRoutes = require('./statisticsRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const chatRoutes = require('./chatRoutes');

router.use('/auth', authRoutes);
router.use('/residents', residentRoutes);
router.use('/apartments', apartmentRoutes);
router.use('/fees', feeRoutes);
router.use('/payments', paymentRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notifications', notificationRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chat', chatRoutes);

module.exports = router;
