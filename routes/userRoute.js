const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .get(verifyJWT, userController.getAllUsers)
    .post(userController.createNewUser)
    .patch(verifyJWT, userController.updateUser)
    .delete(verifyJWT, userController.deleteUser)

// router.route('/:id')
//     .get(verifyJWT, userController.getUser);

module.exports = router