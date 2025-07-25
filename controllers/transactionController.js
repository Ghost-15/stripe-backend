require('dotenv').config()
const Transaction = require('../models/transaction')
const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid');


const getInfoTransaction = asyncHandler(async (req, res) => {

})


const createNewTransaction = asyncHandler(async (req, res) => {

    const { description, total } = req.body
    const randomCode = uuidv4();

    if ( !description || !total ) {
        return res.status(422).json({message: 'All fields are required'})
    }

    const transactionObject = { "description": description,
        amount: total, code: randomCode }

    // const transaction = await Transaction.create(transactionObject)

    if (transactionObject){
        return res.status(200).json({ message: '34513fe7-9128-418b-9622-f6c74c04fa1d' })
    } else {
        return res.status(400).json({ message: 'Not enregistrer' })
    }
})

module.exports = {
    getInfoTransaction,
    createNewTransaction,
}