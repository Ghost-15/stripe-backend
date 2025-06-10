const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect()
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB