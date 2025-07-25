const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tatibatchi15@gmail.com',
        pass: 'bbvxpdtycblofjeoa'
    }
});

module.exports = {
    transporter,
}