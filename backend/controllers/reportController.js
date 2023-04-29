const Report = require('../models/reportModel')
const asyncHandler = require('express-async-handler')

const createReport = asyncHandler(async (req, res) => {
    const { postId, postContent, reportedUser, reportedBy, concern, subgreddiitId, subgreddiitName } = req.body

    const report = await Report.create({
        reportedPostId: postId,
        reportedPostContent: postContent,
        reportedBy,
        reportedUser,
        concern,
        inSubgreddiit: subgreddiitId,
        subgreddiitName: subgreddiitName
    })

    if (report) {
        res.status(201).json("Report created successfully")
    } else {
        res.status(400)
        throw new Error('Invalid report data')
    }
})

const getReportsOfSg = asyncHandler(async (req, res) => {
    const { id } = req.params
    const reports = await Report.find({ inSubgreddiit: id })
    res.status(200).json(reports)
})

const ignoreReport = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Report.findByIdAndUpdate(id, { ignored: true })
    res.status(200).json("Report ignored")
})

const removeReport = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Report.findByIdAndDelete(id)
    res.status(200).json("Report removed")
})

module.exports = {
    createReport,
    getReportsOfSg,
    ignoreReport,
    removeReport
}