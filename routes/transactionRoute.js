const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')


router.route('/')
    .get(transactionController.getInfoTransaction)

module.exports = router