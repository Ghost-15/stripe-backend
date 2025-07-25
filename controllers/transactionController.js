require('dotenv').config()
const Transaction = require('../models/Transaction')
const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid');


const getInfoTransaction = asyncHandler(async (req, res) => {

})

module.exports = {
    getInfoTransaction,
}