require('dotenv').config();
const {User} = require('../models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ where: { username: username } })

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!foundUser.active) {
        return res.status(403).json({ 
            message: 'Account not activated. Please check your email and activate your account first.' 
        })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const roles = ( foundUser.roles )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false,       
        sameSite: 'Lax',    
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
        accessToken,
        roles,
        user: {
            id: foundUser.id,
        }
    })

})

module.exports = { login };