import React from 'react'
import Navbar from '../components/navbar'
import { useParams } from 'react-router-dom'
import { Grid, Box, Button, Divider, Typography, Modal, TextField, Container } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FlagIcon from '@mui/icons-material/Flag';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

function SubgreddiitPage() {
    if(!localStorage.getItem('user')) window.location.href = "http://localhost:3000/login"
    const [sg, setSg] = React.useState()
    const { subgreddiitId } = useParams()
    const [subgreddiitName, setSubgreddiitName] = React.useState()
    const [joined, setJoined] = React.useState()
    const [requestSent, setRequestSent] = React.useState()
    const [userDetails, setUserDetails] = React.useState()
    const [postsArr, setPostsArr] = React.useState()
    const [openModal, setOpenModal] = React.useState(false)
    const [createPostContent, setCreatePostContent] = React.useState('')
    const [openCommentModal, setOpenCommentModal] = React.useState(false)
    const [commentContent, setCommentContent] = React.useState('')
    const [currentPostId, setCurrentPostId] = React.useState()
    const [currentPostAuthor, setCurrentPostAuthor] = React.useState()
    const [openReportModal, setOpenReportModal] = React.useState(false)
    const [reportContent, setReportContent] = React.useState('')
    const [currentPostContent, setCurrentPostContent] = React.useState()

    const user = JSON.parse(localStorage.getItem('user'))

    React.useEffect(() => {
        getSg()
        getSgPosts()
        getUser()
    }, [])

    const style = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'whitesmoke',
        borderRadius: '20px',
        boxShadow: 24,
        p: 4,
        padding: '30px 30px',
    }

    async function getUser() {
        const baseUrl = 'http://localhost:8000/api/users/'
        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        }

        await axios.get(baseUrl + 'me', config).then(response => {
            setUserDetails(response.data)
        })
    }

    async function getSg() {
        let currSg
        await axios.post('http://localhost:8000/api/subgreddiits/getSubgreddiitById', {id: subgreddiitId})
        .then(res => currSg = res.data)
        setSg(currSg)
        setJoined(JSON.parse(currSg.followers).includes(user.username))
        setRequestSent(JSON.parse(currSg.requests).includes(user.username))
        setSubgreddiitName(currSg.name)
    }

    async function joinSG() {
		let arr = JSON.parse(sg.requests)
		arr.push(user.username)
		await axios.put('http://localhost:8000/api/subgreddiits/updateSubgreddiit', {
            ...sg,
			requests: JSON.stringify(arr)
		})
        setSg(prev => ({...prev, requests: JSON.stringify(arr)}))
    }

    async function leaveSG() {
        let arr = JSON.parse(sg.followers)
		arr.splice(arr.indexOf(user.username), 1)
		sg.followers = JSON.stringify(arr)
        let arr2 = []
        arr2.push(user.username)
        await axios.put('http://localhost:8000/api/subgreddiits/updateSubgreddiit', {
			...sg,
			followers: JSON.stringify(arr),
            bannedUsers: arr2
		})
        getSg()
    }

    async function getSgPosts() {
        await axios.post(`http://localhost:8000/api/posts/getSgPosts/${subgreddiitId}`, {username: user.username})
        .then(res => setPostsArr(res.data))
    }

    async function submitPost(e) {
        e.preventDefault()
        await axios.post('http://localhost:8000/api/posts/', {
            content: createPostContent,
            authorName: user.username,
            subgreddiitId: subgreddiitId,
            subgreddiitName: subgreddiitName,
            userId: user.id
        })
        handleModalClose()
        getSgPosts()
        getSg()
        getUser()
    }

    function handleCreatePostChange(event) {
        setCreatePostContent(event.target.value)
    }

    async function submitComment() {
        console.log(currentPostId)
        await axios.post('http://localhost:8000/api/posts/comment/', {
            postId: currentPostId,
            comment: `${user.username}^${commentContent}`,
        })
        handleCommentModalClose()
        getSgPosts()
        getSg()
        getUser()
    }

    async function followUnfollow(e) {
        if(JSON.parse(userDetails.following).includes(e.target.id)) {
            await axios.post('http://localhost:8000/api/users/unfollow', {user1: user.username, user2: e.target.id})
            getUser()
            getSg()
            getSgPosts()
            return
        }
        await axios.post('http://localhost:8000/api/users/follow', {user1: user.username, user2: e.target.id})
        getUser()
        getSg()
        getSgPosts()
    }

    function handleModalClose() {
        setOpenModal(false)
        setCreatePostContent('')
    }    

    function commentModalOpenFunction(postId) {
        setCurrentPostId(postId)
        setOpenCommentModal(true)
    }
    
    function handleCommentModalClose() {
        setOpenCommentModal(false)
        setCommentContent('')
    }

    function handleCommentChange(event) {
        setCommentContent(event.target.value)
    }

    function reportModalOpenFunction(postId, postAuthor, postContent) {
        setCurrentPostId(postId)
        setCurrentPostAuthor(postAuthor)
        setCurrentPostContent(postContent)
        setOpenReportModal(true)
    }

    function handleReportModalClose() {
        setOpenReportModal(false)
        setReportContent('')
    }

    function handleReportChange(event) {
        setReportContent(event.target.value)
    }
    
    function submitReport() {
        axios.post('http://localhost:8000/api/reports/', {
            postId: currentPostId,
            postContent: currentPostContent,
            reportedUser: currentPostAuthor,
            reportedBy: user.username,
            concern: reportContent,
            subgreddiitId: subgreddiitId,
            subgreddiitName: subgreddiitName,
            report: `${user.username}^${reportContent}`
        })
        handleReportModalClose()
    }

    async function upvoteDownvote(postId, vote) {
        let post
        await axios.post('http://localhost:8000/api/posts/getPostById/' + postId, {username: user.username})
        .then(res => post = res.data)
        let upvotes = JSON.parse(post.upvotes)
        let downvotes = JSON.parse(post.downvotes)
        if(vote === 1) {
            // we need to upvote this post
            // check if downvoted already
            if(downvotes.includes(user.username)) {
                downvotes.splice(downvotes.indexOf(user.username), 1)
                upvotes.push(user.username)
                await axios.put('http://localhost:8000/api/posts/updatePost', {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes)
                })
            }
            // check if upvoted already
            else if(upvotes.includes(user.username)) {
                upvotes.splice(upvotes.indexOf(user.username), 1)
                await axios.put('http://localhost:8000/api/posts/updatePost', {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes)
                })
            }
            // neither upvoted nor downvoted
            else {
                upvotes.push(user.username)
                console.log(upvotes)
                await axios.put('http://localhost:8000/api/posts/updatePost', {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes)
                })
            }
        } else {
            // we need to downvote this post
            // check if upvoted already
            if(upvotes.includes(user.username)) {
                upvotes.splice(upvotes.indexOf(user.username), 1)
                downvotes.push(user.username)
                await axios.put('http://localhost:8000/api/posts/updatePost', {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes)
                })
            }
            // check if downvoted already
            else if(downvotes.includes(user.username)) {
                downvotes.splice(downvotes.indexOf(user.username), 1)
                await axios.put('http://localhost:8000/api/posts/updatePost', {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes)
                })
            }
            // neither upvoted nor downvoted
            else {
                downvotes.push(user.username)
                await axios.put('http://localhost:8000/api/posts/updatePost', {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes)
                })
            }
        }
        getSgPosts()
    }

    async function saveUnsave(currPostId) {
        if(JSON.parse(userDetails.savedPosts).includes(currPostId)) {
            await axios.post('http://localhost:8000/api/users/unsavePost', {
                postId: currPostId,
                username: user.username
            })
            getUser()
            getSgPosts()
            getSg()
            return
        }
        await axios.post('http://localhost:8000/api/users/savePost', {
            postId: currPostId,
            username: user.username
        })
        getUser()
        getSgPosts()
        getSg()
    }
    
    if(!sg || !postsArr || !userDetails) return null

    return (
        <div>
            <Navbar />
            <Modal
                open={openModal}
                onClose={handleModalClose}
            >
                <Box style={style}>
                    <Typography align='center' variant="h6" component="h2">
                        What would you like to post?
                    </Typography>
                    <TextField 
                        onChange={handleCreatePostChange} 
                        value={createPostContent} 
                        variant='outlined' 
                        multiline 
                        minRows={3} 
                        style={{width: '100%'}}>
                    </TextField>
                    <Button disabled={createPostContent === ''} variant='contained' onClick={submitPost}>POST</Button>
                </Box>
            </Modal>
            <Grid container> 
                <Grid item md={4}>
                    <Box style={{display: 'flex', flexDirection: 'column', margin: '25px 60px', gap: '25px'}}>
                        <Typography variant='h4' align='center'>{sg.name}</Typography>
                        <Typography variant='caption' align='center'>Created By: {sg.owner}</Typography>
                        <img alt="subgreddiit picture" src={`http://localhost:8000/${sg.imageUrl}`}></img>
                        {!sg.bannedUsers.includes(user.username) && !joined && !requestSent && <Button onClick={joinSG} disabled={JSON.parse(sg.requests).includes(user.username)} style={{height: '50px', fontWeight: '900', fontSize: 'large'}} variant='outlined'>Join this Subgreddiit</Button>}
                        {!sg.bannedUsers.includes(user.username) && !joined && requestSent && <Button onClick={joinSG} disabled={JSON.parse(sg.requests).includes(user.username)} style={{height: '50px', fontWeight: '900', fontSize: 'large'}} variant='outlined'>Request Sent</Button>}
                        {!sg.bannedUsers.includes(user.username) && joined && <Button onClick={leaveSG} disabled={sg.owner === user.username} style={{height: '50px', fontWeight: '900', fontSize: 'large'}} variant='outlined'>Leave this Subgreddiit</Button>}
                        {sg.bannedUsers.includes(user.username) && <Button disabled='true' style={{height: '50px', fontWeight: '900', fontSize: 'large'}} variant='outlined'>You Left</Button>}
                        <Typography variant='h5'>{sg.description}</Typography>
                    </Box>
                </Grid>
                <Modal
                    open={openCommentModal}
                    onClose={handleCommentModalClose}
                >
                    <Box style={style}>
                        <Typography align='center' variant="h6" component="h2">
                            Type your comment here
                        </Typography>
                        <TextField 
                            onChange={handleCommentChange}
                            value={commentContent}
                            variant='outlined'
                            multiline
                            minRows={3}
                            style={{width: '100%'}}>
                        </TextField>
                        <Button disabled={commentContent === ''} variant='contained' onClick={submitComment}>Post Comment</Button>
                    </Box>
                </Modal>
                <Modal
                    open={openReportModal}
                    onClose={handleReportModalClose}
                >
                    <Box style={style}>
                        <Typography align='center' variant="h6" component="h2">
                            Why do you want to report this post?
                        </Typography>
                        <TextField 
                            onChange={handleReportChange}
                            value={reportContent}
                            variant='outlined'
                            multiline
                            minRows={3}
                            style={{width: '100%'}}>
                        </TextField>
                        <Button disabled={reportContent === ''} variant='contained' onClick={submitReport}>Submit concern for review</Button>
                    </Box>
                </Modal>
                {!sg.bannedUsers.includes(user.username) && sg.followers.includes(user.username) && <Grid item md={7} style={{margin: '0px 15px'}}>
                    <Box style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center'}}>
                        <Button onClick={() => setOpenModal(true)} align='center' style={{height: '50px', width: '400px', fontSize: 'large', fontWeight: '900'}} variant='outlined'>Create a new post!</Button>
                        {postsArr.map((currPost, idx) => (
                            <Container key={idx} style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', backgroundColor: 'white', padding: '15px 60px',width: '70%', borderRadius: '20px' ,minHeight: '150px'}}>
                                
                                <Box style={{display: 'flex', gap: '20px', justifyContent: 'space-between'}}>
                                    <Typography mb={1} variant='h4'>{currPost.authorName}</Typography>
                                    {JSON.parse(userDetails.following).includes(currPost.authorName) ? 
                                    <Button
                                        id={currPost.authorName}
                                        variant='contained'
                                        onClick={followUnfollow}
                                        style={{height: '40px'}}>
                                        Unfollow
                                    </Button> : 
                                    <Button
                                        id={currPost.authorName}
                                        onClick={followUnfollow}
                                        variant='contained' 
                                        disabled={currPost.authorName === userDetails.username} 
                                        style={{height: '40px'}}>
                                        Follow
                                    </Button>}
                                </Box>
                                <Divider />
                                <Typography mt={2} mb={2} variant='h5'>{currPost.content}</Typography>
                                <Box style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                                    <Box style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        <Typography variant='h6'>{JSON.parse(currPost.upvotes).length}</Typography>
                                        {JSON.parse(currPost.upvotes).includes(user.username) ? 
                                        <ThumbUpIcon style={{cursor: 'pointer'}} onClick={() => upvoteDownvote(currPost._id, 1)} /> : <ThumbUpOffAltIcon style={{cursor: 'pointer'}} onClick={() => upvoteDownvote(currPost._id, 1)} />}
                                    </Box>
                                    <Box style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        <Typography variant='h6'>{JSON.parse(currPost.downvotes).length}</Typography>
                                        {JSON.parse(currPost.downvotes).includes(user.username) ? 
                                        <ThumbDownIcon style={{cursor: 'pointer'}} onClick={() => upvoteDownvote(currPost._id, 2)} id={currPost._id} /> : <ThumbDownOffAltIcon style={{cursor: 'pointer'}} onClick={() => upvoteDownvote(currPost._id, 2)} id={currPost._id} />}
                                    </Box>
                                    <Box style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        <Typography variant='h6'>{JSON.parse(currPost.comments).length}</Typography>
                                        <AddCommentIcon onClick={() => commentModalOpenFunction(currPost._id)} style={{cursor: 'pointer'}} />
                                    </Box>
                                    {JSON.parse(userDetails.savedPosts).includes(currPost._id) ? 
                                    <BookmarkAddedIcon style={{cursor: 'pointer'}} onClick={() => saveUnsave(currPost._id)} /> : 
                                    <BookmarkBorderIcon style={{cursor: 'pointer'}} onClick={() => saveUnsave(currPost._id)} /> }
                                    <FlagIcon style={{cursor: 'pointer'}} onClick={() => reportModalOpenFunction(currPost._id, currPost.authorName, currPost.content)} />
                                </Box>
                                <Divider style={{margin: '10px 0px'}} />
                                {JSON.parse(currPost.comments).length === 0 && <Typography>No comments yet</Typography>}
                                {JSON.parse(currPost.comments) && 
                                <Box>
                                    {JSON.parse(currPost.comments).map(comment => (
                                        <Box key={uuidv4()} style={{display: 'flex', gap: '20px'}}>
                                            <Typography variant='h6' style={{fontWeight: '900'}}>{comment.split('^')[0]}</Typography>
                                            <Typography variant='h6' style={{fontSize: '18px', marginTop: '2px'}}>{comment.split('^')[1]}</Typography>
                                        </Box>
                                    ))}
                                </Box>}
                            </Container>
                        ))}
                    </Box>
                </Grid>}
            </Grid>
        </div>
    )
}

export default SubgreddiitPage