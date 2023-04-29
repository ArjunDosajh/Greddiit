const Post = require('../models/postModel')
const Subgreddiit = require('../models/subgreddiitModel')
const asyncHandler = require('express-async-handler')

const createPost = asyncHandler(async (req, res) => {
    const {
        content,
        userId,
        subgreddiitId,
        subgreddiitName,
        authorName
    } = req.body

    const newPost = new Post({
        content: content,
        userId: userId,
        subgreddiitId: subgreddiitId,
        subgreddiitName: subgreddiitName,
        authorName: authorName,
        upvotes: "[]",
        downvotes: "[]",
        comments: "[]"
    })
    const savedPost = newPost.save()
    res.status(201).json("new post created successfully! :)")
})

const deletePost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        await Post.findByIdAndRemove(id)
    } catch(err) {
        console.log(err)
    }
    res.status(200).json({message: 'deleted successfully'})
})

const updatePost = asyncHandler(async (req, res) => {
    const {
        postId,
        upvotes,
        downvotes
    } = req.body

    await Post.findByIdAndUpdate(postId, {
        upvotes: upvotes,
        downvotes: downvotes,
    })

    res.status(200).json('post updated successfully! :)')
})

const comment = asyncHandler(async (req, res) => {
    const {
        postId,
        comment,
    } = req.body
    const temp = await Post.findById(postId)
    let arr = JSON.parse(temp.comments)
    arr.push(comment)

    await Post.findByIdAndUpdate(postId, {
        comments: JSON.stringify(arr),
    })

    res.status(200).json('commented successfully! :)')
})

const getPostById = asyncHandler(async (req, res) => {
    const {id} = req.params
    const { username } = req.body
    const {
        content,
        userId,
        subgreddiitId,
        subgreddiitName,
        authorName,
        upvotes,
        downvotes,
        comments
    } = await Post.findById(id)

    const sg = await Subgreddiit.findById(subgreddiitId)

    console.log(sg.blocked)

    res.status(200).json({
        content,
        userId,
        subgreddiitId,
        subgreddiitName,
        authorName: JSON.parse(sg.blocked).includes(username) ? '*Blocked User*' : authorName,
        upvotes,
        downvotes,
        comments
    })
})

const getSgPosts = asyncHandler(async (req, res) => {
    const { id } = req.params
    const {username} = req.body
    let postsArr
    const sg = await Subgreddiit.findById(id)
    Post.find({'subgreddiitId': id}, (err, data) => {
        if(err) {
            console.log(err)
        } else {
            data.forEach(post => {
                post.authorName = JSON.parse(sg.blocked).includes(post.authorName) && sg.owner !== username ? '*Blocked User*' : post.authorName
            })

            res.status(200).json(data)
        }
    })
})

const getMultiplePosts = asyncHandler(async (req, res) => {
    const { savedPosts, username } = req.body
    const idArr = JSON.parse(savedPosts)

    const posts = await Post.find({ _id: { $in: idArr } })
    res.status(200).json(posts)
})

const getAllPosts = asyncHandler(async (req, res) => {
    const { username } = req.body
    const posts = await Post.find({})
    

    posts.forEach(post => {
        post.authorName = post.authorName
    })

    res.status(200).json(posts)
})

module.exports = {
    createPost,
    deletePost,
    updatePost,
    getPostById,
    getSgPosts,
    comment,
    getMultiplePosts,
    getAllPosts
}