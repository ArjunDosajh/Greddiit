const express = require('express')
const router = express.Router()
const { createPost, deletePost, updatePost, getPostById, getSgPosts, comment, getMultiplePosts, getAllPosts } = require('../controllers/postController')
const { protect } = require('../middleware/auth')

router.post('/', createPost)
router.delete('/deletePost/:id', deletePost, protect)
router.put('/updatePost', updatePost, protect)
router.post('/getPostById/:id', getPostById, protect)
router.post('/getSgPosts/:id', getSgPosts, protect)
router.post('/comment', comment, protect)
router.post('/getMultiplePosts', getMultiplePosts, protect)
router.post('/getAllPosts', getAllPosts, protect)

module.exports = router