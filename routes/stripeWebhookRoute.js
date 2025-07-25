const express = require('express');
const router = express.Router();
const stripeWebhookController = require('../controllers/stripeWebhookController');

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookController.webhook);

module.exports = router;
