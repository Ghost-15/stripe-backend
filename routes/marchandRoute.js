const express = require('express')
const router = express.Router()
const marchandController = require('../controllers/marchandController')
const verifyJWT = require('../middleware/verifyJWT')
const upload = require('../middleware/uploadFile');

// router.use(verifyJWT)

router.route('/')
    .post(verifyJWT, marchandController.getInfoMarchand)
    .post(upload.single('kbis'), (marchandController.createNewMarchand))
    .put(verifyJWT, marchandController.updateMarchand)
    .delete(verifyJWT, marchandController.deleteMarchand)

// router.route('/:id')
//     .get(verifyJWT, marchandController.getMarchand);

module.exports = router