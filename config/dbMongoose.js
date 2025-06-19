require('dotenv').config();
const mongoose = require('mongoose')

const connectM = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGOOSE_URL)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectM