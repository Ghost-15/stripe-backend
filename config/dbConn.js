const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://stripe:rUBviKaZkgyjwoLh@stripedb.k8gzzp0.mongodb.net/?retryWrites=true&w=majority&appName=stripeDB")
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB