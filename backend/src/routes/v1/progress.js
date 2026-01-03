const express = require('express');
const { ProgressController } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');

const router = express.Router();

router.use(AuthMiddleware.authenticate);

router.get('/date/:date', ProgressController.getProgressForDate);
router.get('/range', ProgressController.getProgressForRange);
router.post('/sync', ProgressController.syncProgress);

module.exports = router;

