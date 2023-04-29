import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/navbar'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container'

import axios from 'axios'

function SubgreddiitPage() {
    if(!localStorage.getItem('user')) window.location.href = "http://localhost:3000/login"
    const { subgreddiitId } = useParams()
    const [value, setValue] = React.useState('1')
    const [subgreddiitData, setSubgreddiitData] = React.useState()
    const [reportsArr, setReportsArr] = React.useState()

    const user = localStorage.getItem('user')

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    async function getSubgreddiitById() {
        await axios.post('http://localhost:8000/api/subgreddiits/getSubgreddiitById', {id: subgreddiitId})
        .then(res => setSubgreddiitData(res.data))
    }

    React.useEffect(() => {
        document.addEventListener("keydown", detectKeyDown, true)

        function detectKeyDown(e) {
            if(e.key === "J" || e.key === "j") {
                setValue('2')
            } else if(e.key === "U" || e.key === "u") {
                setValue('1')
            } else if(e.key === "S" || e.key === "s") {
                setValue('3')
            } else if(e.key === "R" || e.key === "r") {
                setValue('4')
            }
        }
    }, [])

    React.useEffect(() => {
        getSubgreddiitById()
        getReportsOfSg()
    }, [])

    async function handleAccept(e) {
        const arr = JSON.parse(subgreddiitData.requests)
        arr.splice(arr.indexOf(e.target.id), 1)
        const arr2 = JSON.parse(subgreddiitData.followers)
        arr2.push(e.target.id)
        await axios.put('http://localhost:8000/api/subgreddiits/updateSubgreddiit', {...subgreddiitData, followers: JSON.stringify(arr2), requests: JSON.stringify(arr)})
        setSubgreddiitData({...subgreddiitData, followers: JSON.stringify(arr2), requests: JSON.stringify(arr)})
    }

    async function handleDecline(e) {
        const arr = JSON.parse(subgreddiitData.requests)
        arr.splice(arr.indexOf(e.target.id), 1)
        await axios.put('http://localhost:8000/api/subgreddiits/updateSubgreddiit', {...subgreddiitData, requests: JSON.stringify(arr)})
        setSubgreddiitData({...subgreddiitData, requests: JSON.stringify(arr)})
    }

    async function getReportsOfSg() {
        await axios.get(`http://localhost:8000/api/reports/getReportsOfSg/${subgreddiitId}`)
        .then(res => setReportsArr(res.data))
    }

    async function ignoreReport(id, reportedBy, postContent, sgName) {
        await axios.put(`http://localhost:8000/api/reports/ignoreReport/${id}`)
        getReportsOfSg()
        // sendMail(`We have ignored your report on the post: "${postContent}" in the subgreddiit: "${sgName}".`, reportedBy)
    }

    async function blockUser(id, repUser, reportedBy, postContent, sgName) {
        const arr = JSON.parse(subgreddiitData.blocked)
        arr.push(repUser)
        await axios.put('http://localhost:8000/api/subgreddiits/updateSubgreddiit', {...subgreddiitData, blocked: JSON.stringify(arr)})
        await axios.delete(`http://localhost:8000/api/reports/removeReport/${id}`)
        setSubgreddiitData({...subgreddiitData, blocked: JSON.stringify(arr)})
        getReportsOfSg()
        // sendMail(`This mail is regarding your report on the post: "${postContent}" in the subgreddiit: "${sgName}". The user: "${repUser}" has been blocked from this subgreddit.`, reportedBy)
        // sendMail(`This mail is regarding your post: "${postContent}" in the subgreddiit: "${sgName}". You have been blocked from this subgreddit.`, repUser)
    }

    async function deletePostReport(reportId, postId, postContent, reportedBy, sgName, repUser) {
        await axios.delete(`http://localhost:8000/api/reports/removeReport/${reportId}`)
        await axios.delete(`http://localhost:8000/api/posts/deletePost/${postId}`)
        getReportsOfSg()
        // sendMail(`This mail is regarding your report on the post: "${postContent}" in the subgreddiit: "${sgName}". This post has been deleted from the subgreddit.`, reportedBy)
        // sendMail(`This mail is regarding your post: "${postContent}" in the subgreddiit: "${sgName}". This post has been deleted from the subgreddit.`, repUser)
    }

    async function sendMail(text, toUser) {
        toUser = 'arjundosajh100@gmail.com'
        await axios.post('http://localhost:8000/api/users/sendMail', {text: text, toUser: toUser})
        .then(res => console.log(res.data))
    }

    if(!subgreddiitData || !reportsArr) return null

    return (
        <div style={{backgroundColor: 'whitesmoke', minHeight: '100vh'}}>
            <Navbar />
            <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Users" value="1" />
                    <Tab label="Join Requests" value="2" />
                    <Tab label="Stats" value="3" />
                    <Tab label="Reports" value="4" />
                </TabList>
                </Box>
                <TabPanel value="1">
                    <Box style={{display: 'flex', justifyContent: 'center', gap: '100px', marginTop: '10px'}}>
                        <Box style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', padding: '10px 10px', borderRadius: '20px' ,backgroundColor: 'white', minWidth: '350px', minHeight: '400px'}}>
                            <Typography style={{color: '#36454f'}} align='center' variant='h4'>Users</Typography>
                            <Divider />
                            {JSON.parse(subgreddiitData.followers).map(item => (
                                <Typography style={{margin: '0px 30px'}} key={item} variant='h5'>{item}</Typography>
                            ))}
                        </Box>
                        <Box style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', padding: '10px 10px', borderRadius: '20px', backgroundColor: 'white', minWidth: '350px', minHeight: '400px'}}>
                            <Typography style={{color: '#36454f'}} align='center' variant='h4'>Blocked Users</Typography>
                            <Divider />
                            {JSON.parse(subgreddiitData.blocked).map(item => (
                                <Typography key={item} variant='h5'>{item}</Typography>
                            ))}
                        </Box>
                    </Box>
                </TabPanel>
                <TabPanel value="2">
                    <Box style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: '20px', backgroundColor: 'white', maxWidth: '500px', minHeight: '500px', margin: 'auto'}}>
                        <Typography style={{color: '#36454f'}} align='center' variant='h4'>Join Requests</Typography>
                        <Divider />
                        {JSON.parse(subgreddiitData.requests).map(item => (
                            <Box key={item} style={{padding: '0px 30px' ,display: 'flex', justifyContent: 'space-between', margin: '10px 10px'}}>
                                <Typography style={{color: '#262626'}} align='center' variant='h5'>{item}</Typography>
                                <Box>
                                    <Button id={item} onClick={handleAccept} style={{margin: '0px 10px'}} variant='contained'>ACCEPT</Button>
                                    <Button id={item} onClick={handleDecline} style={{margin: '0px 10px'}} variant='outlined'>DECLINE</Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </TabPanel>
                <TabPanel value="3"></TabPanel>
                <TabPanel value="4">
                    <Typography align='center' mb={2} fontWeight={900} variant='h3' style={{color: '#36454f'}}>Reports Page</Typography>
                    {reportsArr.map(report => (
                        <Container key={report._id} style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: '20px', backgroundColor: 'white', marginBottom: '20px' ,padding: '15px 30px',width: '70%', borderRadius: '20px' ,minHeight: '150px'}}>
                            <Box style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Typography fontSize={14} style={{color: '#36454f'}} align='center' variant='caption'>Reported By: {report.reportedBy}</Typography>
                                <Typography fontSize={14} style={{color: '#36454f'}} align='center' variant='caption'>Reported User: {report.reportedUser}</Typography>
                                <Typography fontSize={14} style={{color: '#36454f'}} align='center' variant='caption'>Subgreddiit: {report.subgreddiitName}</Typography>
                            </Box>
                            <Divider style={{margin: '10px 0px'}} />
                            <Box style={{display: 'flex', gap: '15px'}}>
                                <Typography style={{color: '#626f76'}}>Post Content: </Typography>
                                <Typography>{report.reportedPostContent}</Typography>
                            </Box>
                            <Box style={{margin: '20px 0',display: 'flex', gap: '15px'}}>
                                <Typography style={{color: '#626f76'}}>Report Concern: </Typography>
                                <Typography>{report.concern}</Typography>
                            </Box>
                            <Box style={{display: 'flex', justifyContent: 'center', gap: '50px'}}>
                                <Button onClick={() => deletePostReport(report._id, report.reportedPostId, report.postContent, report.reportedBy, report.subgreddiitName, report.repUser)} disabled={report.ignored} variant='outlined'>Delete Post</Button>
                                <Button onClick={() => blockUser(report._id, report.reportedUser, report.reportedBy, report.reportedPostContent, report.subgreddiitName)} id={report._id} disabled={report.ignored} variant='outlined'>Block User</Button>
                                <Button onClick={() => ignoreReport(report._id, report.reportedBy, report.postContent, report.subgreddiitName)} variant='outlined'>Ignore Report</Button>
                            </Box>
                        </Container>
                    ))}
                </TabPanel>
            </TabContext>
            </Box>
        </div>
    )
}

export default SubgreddiitPage