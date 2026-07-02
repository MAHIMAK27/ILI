const express = require('express');
const authRoutes = require('./authRoutes');
const uploadRoutes = require('./uploadRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const mapRoutes = require('./mapRoutes');
const stateInsightsRoutes = require('./stateInsightsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/upload-data', uploadRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/regional-map', mapRoutes);
router.use('/state-insights', stateInsightsRoutes);

module.exports = router;
