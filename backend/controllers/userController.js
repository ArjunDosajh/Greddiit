const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

const getMe = asyncHandler(async (req, res) => {
    const {
        _id,
        firstName,
        lastName,
        email,
        age,
        contactNumber,
        username,
        password,
        followers,
        following,
        savedPosts
    } = await User.findById(req.user.id)

    res.status(200).json({
        _id,
        firstName,
        lastName,
        email,
        age,
        contactNumber,
        username,
        password,
        followers,
        following,
        savedPosts
    })
})

const allUsers = asyncHandler(async (req, res) => {
    const user = await User.find()
    res.json(user)
})

const updateUser = asyncHandler(async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            username,
            password,
            followers,
            following,
            savedPosts
        } = req.body

        await User.findOneAndUpdate({username}, {
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            username,
            password,
            followers,
            following,
            savedPosts
        })
        res.status(204).json("user updated successfully! :)")
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

const registerUser = asyncHandler(async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            username,
            password,
            followers,
            following,
            savedPosts
        } = req.body

        const existing = await User.findOne({username})
        if(existing) {
            res.status(400)
            throw new Error("User already exists")
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            username,
            password: hashedPassword,
            followers: "[]",
            following: "[]",
            savedPosts: "[]"
        })
        const savedUser = await newUser.save()
        res.status(201).json({token: generateToken(newUser._id), id: newUser._id})
        console.log("new user and token created")
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({username})

    if(user && await bcrypt.compare(password, user.password)) {
        res.json({token: generateToken(user._id), id: user._id})
    }
    else {
        throw new Error("username not found!")
    }
})

const follow = asyncHandler(async (req, res) => {
    // user1 is following user2
    const {user1, user2} = req.body

    const temp = await User.findOne({username: user2})
    let arr = JSON.parse(temp.followers)
    arr.push(user1)
    await User.findOneAndUpdate({username: user2}, {
        followers: JSON.stringify(arr)
    })
    const temp2 = await User.findOne({username: user1})
    let arr2 = JSON.parse(temp2.following)
    arr2.push(user2)
    await User.findOneAndUpdate({username: user1}, {
        following: JSON.stringify(arr2)
    })
    res.status(200).json("followed!")
})

const unfollow = asyncHandler(async (req, res) => {
    // user1 is unfollowing user2
    const {user1, user2} = req.body
    const temp = await User.findOne({username: user2})
    let arr = JSON.parse(temp.followers)

    arr.splice(arr.indexOf(user1), 1)
    await User.findOneAndUpdate({username: user2}, {
        followers: JSON.stringify(arr)
    })
    const temp2 = await User.findOne({username: user1})
    let arr2 = JSON.parse(temp2.following)
    arr2.splice(arr2.indexOf(user2), 1)
    await User.findOneAndUpdate({username: user1}, {
        following: JSON.stringify(arr2)
    })
    res.status(200).json("unfollowed!")
})

const savePost = asyncHandler(async (req, res) => {
    const {username, postId} = req.body
    const temp = await User.findOne({username})
    let arr = JSON.parse(temp.savedPosts)
    arr.push(postId)

    await User.findOneAndUpdate({username}, {
        savedPosts: JSON.stringify(arr)
    })
    res.status(200).json("post saved")
})

const unsavePost = asyncHandler(async (req, res) => {
    const {username, postId} = req.body
    const temp = await User.findOne({username})
    let arr = JSON.parse(temp.savedPosts)
    arr.splice(arr.indexOf(postId), 1)

    await User.findOneAndUpdate({username}, {
        savedPosts: JSON.stringify(arr)
    })
    res.status(200).json("post unsaved")
})

const sendMail = (async (req, res) => {
    const {text, toUser} = req.body
    let mailTransporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'greddiitarjun@outlook.com',
            pass: 'nodemailer123'
        }
    })
    let detais = {
        from: 'greddiitarjun@outlook.com',
        to: toUser,
        subject: 'Greetings from Greddiit!',
        text: text
    }

    mailTransporter.sendMail(detais, function(err, data) {
        if(err) {
            console.log(err)
        } else {
            console.log('email sent successfully')
        }
    })
    res.status(200).json("mail sent")
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    allUsers,
    updateUser,
    follow,
    unfollow,
    savePost,
    unsavePost,
    sendMail
}