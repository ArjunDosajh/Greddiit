const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    subgreddiitId: {
        type: String,
        required: true,
    },
    subgreddiitName: {
        type: String,
        required: true
    },
    upvotes: {
        type: String,
        required: true
    },
    downvotes: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Post', postSchema)