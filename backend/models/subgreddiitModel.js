const mongoose = require('mongoose')

const subgreddiitSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
    },
    bannedKeywords: {
        type: String,
    },
    followers: {
        type: String,
        required: true
    },
    blocked: {
        type: String,
    },
    posts: {
        type: String,
    },
    requests: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
    bannedUsers: {
        type: Array,
    },
},
{
    timestamps: true,
})

module.exports = mongoose.model('Subgreddiit', subgreddiitSchema)