const express = require('express')
const router = express.Router()
const marchandController = require('../controllers/marchandController')
const verifyJWT = require('../middleware/verifyJWT')
const upload = require('../middleware/uploadFile');

console.log("ici")
router.route('/')
    .post(upload.single('kbis'), (marchandController.createNewMarchand))
    .put(verifyJWT, marchandController.updateMarchand)
    .delete(verifyJWT, marchandController.deleteMarchand)

// router.route('/:id')
//     .get(verifyJWT, marchandController.getInfoMarchand);

module.exports = router