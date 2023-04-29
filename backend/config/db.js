const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://arjun:arjun@arjunscluster.ypq79vi.mongodb.net/greddiit?retryWrites=true&w=majority')
        console.log(`mongo db connected: ${conn.connection.host}`.rainbow.underline)
    }
    catch(error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB