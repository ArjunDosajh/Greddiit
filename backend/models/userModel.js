const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add last name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: false
    },
    age: {
        type: String,
        required: [true, 'Please add your age']
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add your contact number']
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    followers: {
        type: String,
        default: "[]"
    },
    following: {
        type: String,
        default: "[]"
    },
    savedPosts: {
        type: String,
        default: "[]"
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)