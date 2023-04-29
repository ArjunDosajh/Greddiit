const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, allUsers, updateUser, follow, unfollow, savePost, unsavePost, sendMail } = require('../controllers/userController')
const { protect } = require('../middleware/auth')

router.post('/', registerUser, protect)
router.post('/login', loginUser, protect)
router.get('/me', protect, getMe, protect)
router.get('/allusers', allUsers, protect)
router.put('/updateuser', protect, updateUser, protect)
router.post('/follow', follow, protect)
router.post('/unfollow', unfollow, protect)
router.post('/savePost', savePost, protect)
router.post('/unsavePost', unsavePost, protect)
router.post('/sendMail', sendMail, protect)

module.exports = router