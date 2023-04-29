const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
    reportedBy: {
        type: String,
        required: true
    },
    reportedUser: {
        type: String,
        required: true
    },
    inSubgreddiit: {
        type: String,
        required: true
    },
    subgreddiitName: {
        type: String,
        required: true
    },
    concern: {
        type: String,
        required: true,
    },
    reportedPostId: {
        type: String,
        required: true
    },
    reportedPostContent: {
        type: String,
        required: true
    },
    ignored: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Report', reportSchema)