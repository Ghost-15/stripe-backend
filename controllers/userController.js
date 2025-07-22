const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {transporter} = require("../config/mailer");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll()

    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

const createNewUser = asyncHandler(async (req, res) => {
    const { first_name, last_name, username, password } = req.body

    // Vérifier quels champs sont manquants
    const missingFields = []
    
    if (first_name === undefined) missingFields.push('first_name')
    if (last_name === undefined) missingFields.push('last_name')
    if (username === undefined) missingFields.push('username')
    if (password === undefined) missingFields.push('password')

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `Missing required fields: ${missingFields.join(', ')}` 
        })
    }

    // Vérifier si les champs sont vides
    if ( !first_name || !last_name || !username || !password ) {
        return res.status(422).json({message: 'All fields are required'})
    }

    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { 
        first_name, 
        last_name, 
        username, 
        "password": hashedPwd, 
        roles: ["ADMIN"],
        active: false 
    }

    try {
        const user = await User.create(userObject)

        if (user) {
            const activationToken = jwt.sign(
                { userId: user.id, email: username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '24h' }
            )

            await sendConfirmationEmail(first_name, username)

            await sendActivationEmail(first_name, username, activationToken)

            res.status(201).json({ 
                message: `New user ${username} created. Please check your email to activate your account.` 
            })
        }
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).json({ message: 'Error creating user' })
    }
})

const sendConfirmationEmail = async (firstName, email) => {
    const subject = "Compte créé avec succès"
    const text = `
Bonjour ${firstName},

Votre compte a été créé avec succès !

Détails de votre compte :
- Email : ${email}
- Statut : En attente d'activation

Vous recevrez un autre email avec les instructions pour activer votre compte.

Cordialement,
L'équipe
    `

    const htmlContent = `
        <h2>Compte créé avec succès</h2>
        <p>Bonjour <strong>${firstName}</strong>,</p>
        <p>Votre compte a été créé avec succès !</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Détails de votre compte :</h3>
            <ul>
                <li><strong>Email :</strong> ${email}</li>
                <li><strong>Statut :</strong> En attente d'activation</li>
            </ul>
        </div>
        
        <p>Vous recevrez un autre email avec les instructions pour activer votre compte.</p>
        <p>Cordialement,<br>L'équipe</p>
    `

    try {
        await transporter.sendMail({
            from: 'tatibatchi15@gmail.com',
            to: email,
            subject: subject,
            text: text,
            html: htmlContent
        })
        console.log('✅ Email de confirmation envoyé à:', email)
    } catch (error) {
        console.error('❌ Erreur envoi email de confirmation:', error)
    }
}

const sendActivationEmail = async (firstName, email, activationToken) => {
    const activationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/activate?token=${activationToken}`
    
    const subject = "Activez votre compte"
    const text = `
Bonjour ${firstName},

Pour activer votre compte, cliquez sur le lien suivant :
${activationLink}

Ce lien expire dans 24 heures.

Si vous n'avez pas créé ce compte, ignorez ce message.

Cordialement,
L'équipe
    `

    const htmlContent = `
        <h2>Activez votre compte</h2>
        <p>Bonjour <strong>${firstName}</strong>,</p>
        <p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Activer mon compte
            </a>
        </div>
        
        <p>Ou copiez ce lien dans votre navigateur :</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 3px;">
            ${activationLink}
        </p>
        
        <p><strong>Ce lien expire dans 24 heures.</strong></p>
        <p>Si vous n'avez pas créé ce compte, ignorez ce message.</p>
        <p>Cordialement,<br>L'équipe</p>
    `

    try {
        await transporter.sendMail({
            from: 'tatibatchi15@gmail.com',
            to: email,
            subject: subject,
            text: text,
            html: htmlContent
        })
        console.log(' Email d\'activation envoyé à:', email)
    } catch (error) {
        console.error(' Erreur envoi email d\'activation:', error)
    }
}

const activateAccount = asyncHandler(async (req, res) => {
    const { token } = req.body

    if (!token) {
        return res.status(400).json({ message: 'Token d\'activation requis' })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        const user = await User.findOne({ where: { id: decoded.userId } })
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        if (user.active) {
            return res.status(400).json({ message: 'Compte déjà activé' })
        }

        await user.update({ active: true })

        res.json({ message: 'Compte activé avec succès ! Vous pouvez maintenant vous connecter.' })
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token d\'activation expiré' })
        }
        console.error('Erreur activation:', error)
        res.status(400).json({ message: 'Token d\'activation invalide' })
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { id, first_name, last_name, username, password} = req.body

    if (!id || !first_name || !last_name || !username) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    const user = await User.findByPk(id)

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const duplicate = await User.findOne({ where: { username } })

    if (duplicate && duplicate.id !== parseInt(id)) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const updateData = {
        first_name,
        last_name,
        username
    }

    if (password) {
        updateData.password = await bcrypt.hash(password, 10)
    }

    await user.update(updateData)

    res.json({ message: `${user.username} updated` })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const user = await User.findByPk(id)

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    await user.destroy()

    res.json({ message: `Username ${user.username} with ID ${user.id} deleted` })
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    activateAccount
}