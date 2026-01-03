const express = require('express');
const { POTDController } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');

const router = express.Router();

// Public routes
router.get('/today', POTDController.getTodayPOTD);
router.get('/date/:date', POTDController.getPOTDByDate);

// Protected routes (for admin/manual generation)
router.post('/generate', AuthMiddleware.authenticate, POTDController.generatePOTD);

module.exports = router;

