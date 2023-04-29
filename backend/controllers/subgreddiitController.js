const jwt = require('jsonwebtoken')
const Subgreddiit = require('../models/subgreddiitModel')
const Post = require('../models/postModel')
const Report = require('../models/reportModel')
const asyncHandler = require('express-async-handler')

const getSubgreddiitsOfOwner = asyncHandler(async (req, res) => {
    const {owner} = req.body

    Subgreddiit.find({owner}, (err, data) => {
        if(err) {
            console.log(err)
        } else {
            res.status(200).json(data)
        }
    })
})

const getSubgreddiitById = asyncHandler(async (req, res) => {
    const {id} = req.body
    const {
        name,
        owner,
        description,
        tags,
        bannedKeywords,
        blocked,
        followers,
        posts,
        requests,
        imageUrl,
        bannedUsers
    } = await Subgreddiit.findById(id)

    res.status(200).json({
        name,
        owner,
        description,
        tags,
        bannedKeywords,
        blocked,
        followers,
        posts,
        requests,
        imageUrl,
        bannedUsers
    })
})

const updateSubgreddiit = asyncHandler(async (req, res) => {
    const {
        name,
        owner,
        description,
        tags,
        bannedKeywords,
        blocked,
        followers,
        posts,
        requests,
        bannedUsers
    } = req.body

    await Subgreddiit.findOneAndUpdate({name}, {
        name,
        owner,
        description,
        tags,
        bannedKeywords,
        blocked,
        followers,
        posts,
        requests,
        bannedUsers
    })
    res.status(204).json("Subgreddiit updated")
})

const getAllSubgreddiits = asyncHandler(async (req, res) => {
    Subgreddiit.find((err, data) => {
        if(err) {
            console.log(err)
        } else {
            res.status(200).json(data)
        }
    })
})

const filteredSubgreddiits = asyncHandler(async (req, res) => {
    let {searchStr, selectedTagsArr, allTagsArr} = req.body
    searchStr = searchStr.trim()
    if(selectedTagsArr.length === 0) selectedTagsArr = allTagsArr
    const filteredSG = await Subgreddiit.find({ name: { $regex: new RegExp('^'+searchStr+'.*','i')}})
    .where("tags").in([...selectedTagsArr]).exec()
    res.status(200).json(filteredSG)
})

const createSubgreddiit = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            owner,
            description,
            tags,
            bannedKeywords,
        } = req.body
        const imageUrl = req.file.path

        if(!imageUrl) {
            throw new Error("Image is required")
        }

        const existing = await Subgreddiit.findOne({name})
        if(existing) {
            res.status(400)
            throw new Error("Subgreddiit already exists")
        }

        const newSubgreddiit = new Subgreddiit({
            name,
            owner,
            description,
            tags: tags.split(','),
            bannedKeywords,
            followers: `["${owner}"]`,
            blocked: "[]",
            posts: "[]",
            requests: "[]",
            imageUrl: imageUrl,
            bannedUsers: []
        })
        const savedSubgreddiit = await newSubgreddiit.save()
        res.status(201).json({message: 'created successfully :)'})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

const deleteSubgreddiit = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        await Subgreddiit.findByIdAndRemove(id)
        await Post.deleteMany({subgreddiitId: id})
        await Report.deleteMany({inSubgreddiit: id})
        res.status(200).json({message: 'deleted successfully'})
    } catch(err) {
        console.log(err)
    }
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    createSubgreddiit,
    getSubgreddiitsOfOwner,
    deleteSubgreddiit,
    getSubgreddiitById,
    getAllSubgreddiits,
    filteredSubgreddiits,
    updateSubgreddiit
}