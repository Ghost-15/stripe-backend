require('dotenv').config()
const Transaction = require('../models/Transaction')
const asyncHandler = require('express-async-handler')


const getInfoTransaction = asyncHandler(async (req, res) => {

    const userId = req.user.id;

    const transactions = await Transaction.findAll({
        where: {
            userId: userId
        }
    });

    res.json(transactions);

});

module.exports = {
    getInfoTransaction,
}