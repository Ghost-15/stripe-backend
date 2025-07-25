const express = require('express');
const router = express.Router();

module.exports = (socketController) => {

    router.route('/')
        .post(socketController.pay);

    return router;
};
