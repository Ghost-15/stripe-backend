const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

router.post('/pay', stripeController.createCheckoutSession);

module.exports = router;