const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.findAll()

    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})


const createNewUser = asyncHandler(async (req, res) => {

    const { first_name, last_name, username, password } = req.body

    if ( !first_name || !last_name || !username || !password ) {
        return res.status(422).json({message: 'All fields are required'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { first_name, last_name, username, "password": hashedPwd, roles: ["ADMIN"] }

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Duplicate username' })
    }

})


const updateUser = asyncHandler(async (req, res) => {
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


const deleteUser = asyncHandler(async (req, res) => {
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

subject = "subject"
text = "text"

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}