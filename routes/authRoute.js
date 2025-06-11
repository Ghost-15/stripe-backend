const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const limiter = require('../middleware/limiter')

router.route('/')
      .post(limiter, authController.login);

module.exports = router;