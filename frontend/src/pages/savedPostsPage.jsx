import React from "react";
import Navbar from "../components/navbar";
import {
    Box,
    Button,
    Divider,
    Typography,
    Modal,
    TextField,
    Container,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddCommentIcon from "@mui/icons-material/AddComment";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FlagIcon from "@mui/icons-material/Flag";
import { v4 as uuidv4 } from "uuid";

import axios from "axios";

function SavedPostsPage() {
    if(!localStorage.getItem('user')) window.location.href = "http://localhost:3000/login"
    const [userDetails, setUserDetails] = React.useState();
    const [postsArr, setPostsArr] = React.useState();
    const [savedPosts, setSavedPosts] = React.useState()
    const [openModal, setOpenModal] = React.useState(false);
    const [openCommentModal, setOpenCommentModal] = React.useState(false);
    const [commentContent, setCommentContent] = React.useState("");
    const [currentPostId, setCurrentPostId] = React.useState();
    const [openReportModal, setOpenReportModal] = React.useState(false);
    const [reportContent, setReportContent] = React.useState("");
    const [allPosts, setAllPosts] = React.useState();

    const user = JSON.parse(localStorage.getItem("user"));
    const config = {
		headers: { Authorization: `Bearer ${user.token}` }
	}

    React.useEffect(() => {
        getUser();
        getAllPosts();
    }, []);

    async function getUser() {
        const baseUrl = "http://localhost:8000/api/users/";

        await axios.get(baseUrl + "me", config).then((response) => {
            setUserDetails(response.data);
            // console.log(response.data)
            setSavedPosts(JSON.parse(response.data.savedPosts))
        });
    }

    async function getAllPosts() {
        await axios.post("http://localhost:8000/api/posts/getAllPosts", {username: user.username}, config)
            .then((response) => setAllPosts(response.data));
    }

    const style = {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        backgroundColor: "whitesmoke",
        borderRadius: "20px",
        boxShadow: 24,
        p: 4,
        padding: "30px 30px",
    };

    async function submitComment() {
        console.log(currentPostId);
        await axios.post("http://localhost:8000/api/posts/comment/", {
            postId: currentPostId,
            comment: `${user.username}^${commentContent}`,
        }, config);
        handleCommentModalClose();
        getUser();
        getAllPosts();
    }

    async function followUnfollow(e) {
        if (JSON.parse(userDetails.following).includes(e.target.id)) {
            await axios.post("http://localhost:8000/api/users/unfollow", {
                user1: user.username,
                user2: e.target.id,
            }, config);
            getUser();
            getAllPosts();
            return;
        }
        await axios.post("http://localhost:8000/api/users/follow", {
            user1: user.username,
            user2: e.target.id,
        }, config);
        getUser();
        getAllPosts();
    }

    function commentModalOpenFunction(postId) {
        setCurrentPostId(postId);
        setOpenCommentModal(true);
    }

    function handleCommentModalClose() {
        setOpenCommentModal(false);
        setCommentContent("");
    }

    function handleCommentChange(event) {
        setCommentContent(event.target.value);
    }

    function reportModalOpenFunction(postId) {
        setCurrentPostId(postId);
        setOpenReportModal(true);
    }

    function handleReportModalClose() {
        setOpenReportModal(false);
        setReportContent("");
    }

    function handleReportChange(event) {
        setReportContent(event.target.value);
    }

    function submitReport() {
        axios.post("http://localhost:8000/api/report/", {
            postId: currentPostId,
            report: `${user.username}^${reportContent}`,
        }, config);
        handleReportModalClose();
        getAllPosts();
    }

    async function upvoteDownvote(postId, vote) {
        let post;
        await axios.post("http://localhost:8000/api/posts/getPostById/" + postId, {username: user.username}, config)
            .then((res) => (post = res.data));
        let upvotes = JSON.parse(post.upvotes);
        let downvotes = JSON.parse(post.downvotes);
        if (vote === 1) {
            // we need to upvote this post
            // check if downvoted already
            if (downvotes.includes(user.username)) {
                downvotes.splice(downvotes.indexOf(user.username), 1);
                upvotes.push(user.username);
                await axios.put("http://localhost:8000/api/posts/updatePost", {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes),
                }, config);
            }
            // check if upvoted already
            else if (upvotes.includes(user.username)) {
                upvotes.splice(upvotes.indexOf(user.username), 1);
                await axios.put("http://localhost:8000/api/posts/updatePost", {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes),
                }, config);
            }
            // neither upvoted nor downvoted
            else {
                upvotes.push(user.username);
                await axios.put("http://localhost:8000/api/posts/updatePost", {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes),
                }, config);
            }
        } else {
            // we need to downvote this post
            // check if upvoted already
            if (upvotes.includes(user.username)) {
                upvotes.splice(upvotes.indexOf(user.username), 1);
                downvotes.push(user.username);
                await axios.put("http://localhost:8000/api/posts/updatePost", {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes),
                }, config);
            }
            // check if downvoted already
            else if (downvotes.includes(user.username)) {
                downvotes.splice(downvotes.indexOf(user.username), 1);
                await axios.put("http://localhost:8000/api/posts/updatePost", {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes),
                }, config);
            }
            // neither upvoted nor downvoted
            else {
                downvotes.push(user.username);
                await axios.put("http://localhost:8000/api/posts/updatePost", {
                    postId: postId,
                    upvotes: JSON.stringify(upvotes),
                    downvotes: JSON.stringify(downvotes),
                }, config);
            }
        }
        getAllPosts();
    }

    async function saveUnsave(currPostId) {
        if (JSON.parse(userDetails.savedPosts).includes(currPostId)) {
            await axios.post("http://localhost:8000/api/users/unsavePost", {
                postId: currPostId,
                username: user.username,
            }, config);
            getUser();
            return;
        }
        await axios.post("http://localhost:8000/api/users/savePost", {
            postId: currPostId,
            username: user.username,
        }, config);
        getUser();
        getAllPosts();
    }

    async function reportPost(currPostId) {
        await axios.post("http://localhost:8000/api/posts/reportPost", {
            postId: currPostId,
            username: user.username,
        }, config);
        getAllPosts();
    }

    if (!userDetails || !allPosts || !savedPosts) return null;

    return (
        <div>
            <Navbar />
            <Typography align="center" variant="h2" fontWeight={900} mt={2}>Saved Posts</Typography>
            <Modal open={openCommentModal} onClose={handleCommentModalClose}>
                <Box style={style}>
                    <Typography align="center" variant="h6" component="h2">
                        Type your comment here
                    </Typography>
                    <TextField
                        onChange={handleCommentChange}
                        value={commentContent}
                        variant="outlined"
                        multiline
                        minRows={3}
                        style={{ width: "100%" }}
                    ></TextField>
                    <Button disabled={commentContent === ''} variant="contained" onClick={submitComment}>
                        Post Comment
                    </Button>
                </Box>
            </Modal>
            <Modal open={openReportModal} onClose={handleReportModalClose}>
                <Box style={style}>
                    <Typography align="center" variant="h6" component="h2">
                        Why do you want to report this post?
                    </Typography>
                    <TextField
                        onChange={handleReportChange}
                        value={reportContent}
                        variant="outlined"
                        multiline
                        minRows={3}
                        style={{ width: "100%" }}
                    ></TextField>
                    <Button disabled={reportContent === ''} variant="contained" onClick={submitReport}>
                        Submit concern for review
                    </Button>
                </Box>
            </Modal>
            <Box style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center'}}>
                        {allPosts.filter(post => savedPosts.includes(post._id)).map((currPost, idx) => (
                            <Container key={idx} style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: '20px', backgroundColor: 'white', padding: '15px 60px',width: '70%', borderRadius: '20px' ,minHeight: '150px'}}>
                                
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
                                    <AddCommentIcon onClick={() => commentModalOpenFunction(currPost._id)} style={{cursor: 'pointer'}} />
                                    {JSON.parse(userDetails.savedPosts).includes(currPost._id) ? 
                                    <BookmarkAddedIcon style={{cursor: 'pointer'}} onClick={() => saveUnsave(currPost._id)} /> : 
                                    <BookmarkBorderIcon style={{cursor: 'pointer'}} onClick={() => saveUnsave(currPost._id)} /> }
                                    <FlagIcon style={{cursor: 'pointer'}} onClick={() => reportModalOpenFunction()} />
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
        </div>
    );
}

export default SavedPostsPage;
