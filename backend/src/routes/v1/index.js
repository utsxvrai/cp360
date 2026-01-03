const express = require('express');
const { InfoController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);

// API routes
router.use('/auth', require('./auth'));
router.use('/potd', require('./potd'));
router.use('/progress', require('./progress'));
router.use('/heatmap', require('./heatmap'));
router.use('/profile', require('./profile'));

module.exports = router;