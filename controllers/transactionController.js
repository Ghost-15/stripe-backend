require('dotenv').config()
const Transaction = require('../models/Transaction')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");


const getInfoTransaction = asyncHandler(async (req, res) => {

})


const createNewTransaction = asyncHandler(async (req, res) => {

    const { total } = req.body


    if ( total ) {
        return res.status(422).json({message: 'All fields are required'})
    }

    if (user) {
        const user = await User.findOne({ where: { username: username } });

        const marchandObject = { "userId": user.id, nomDeSociete, adresse, numeroSiren, code, "kbis": kbis.buffer}

        const marchand = await Marchand.create(marchandObject)

        if (marchand)
            res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

module.exports = {
    getInfoTransaction,
    createNewTransaction,
}