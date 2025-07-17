require('dotenv').config()
const Marchand = require('../models/Marchand')
const User = require("../models/User");
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");


const getInfoMarchand = asyncHandler(async (req, res) => {

    const token = req.body.token;
    let user = "";

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        user = await User.findOne({ where: { username: payload.UserInfo.username } });
    } catch (e) {
        console.error(e);
        return res.sendStatus(401);
    }

    const marchands = await Marchand.findByPk(user.id)

    if (!marchands) {
        return res.status(400).json({ message: 'No InfoMarchand found' })
    }

    return res.json(marchands)
})


const createNewMarchand = asyncHandler(async (req, res) => {

    const { first_name, last_name, username, password,
        nomDeSociete, adresse, numeroSiren, code } = req.body

    const kbis = req.file;

    if ( !first_name || !last_name || !username || !password
        || !nomDeSociete || !adresse || !numeroSiren || !code || !kbis) {
        return res.status(422).json({message: 'All fields are required'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { first_name, last_name, username, "password": hashedPwd, roles: ["MARCHAND"] }

    const user = await User.create(userObject)

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


const updateMarchand = asyncHandler(async (req, res) => {
    const { id, first_name, last_name, username, password} = req.body

    if (!id || !first_name || !last_name || !username || password) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }


    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.first_name = first_name
    user.last_name = last_name
    user.username = username
    // user.roles = roles
    // user.active = active

    if (password) {

        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})


const deleteMarchand = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getInfoMarchand,
    createNewMarchand,
    updateMarchand,
    deleteMarchand
}