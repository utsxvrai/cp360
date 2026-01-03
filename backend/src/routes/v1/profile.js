const express = require('express');
const { ProfileController } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');

const router = express.Router();

router.use(AuthMiddleware.authenticate);

router.get('/', ProfileController.getProfile);
router.patch('/', ProfileController.updateProfile);

module.exports = router;

