const express = require('express');
const { HeatmapController } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');

const router = express.Router();

router.use(AuthMiddleware.authenticate);

router.get('/', HeatmapController.getHeatmap);

module.exports = router;

