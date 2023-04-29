import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import Textfield from '@mui/material/TextField'
import Navbar from '../components/navbar'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

export default function MySubgreddiitsPage() {
    if(!localStorage.getItem('user')) window.location.href = "http://localhost:3000/login"
    const navigate = useNavigate()
    const [mySubgreddiitsArr, setMySubgreddiitsArr] = React.useState()
    const [sgFormData, setSgFormData] = React.useState({name: '', description: '', bannedKeywords: '', tags: ''})
    const [openModal, setOpenModal] = React.useState(false)
    const [image, setImage] = React.useState()
    const user = JSON.parse(localStorage.getItem('user'))
    const baseUrl = 'http://localhost:8000/api/subgreddiits/'
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    }

    const style = {
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

    const style2 = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center'    
    }

    React.useEffect(() => {
        getSubgreddiits()
    }, [])

    async function getSubgreddiits() {
        await axios.post(baseUrl + 'mysubgreddiits',{owner: user.username} , config).then(res => {
            setMySubgreddiitsArr(res.data)
        }, config)
    }

    async function deleteSubgreddiit(e) {
        await axios.delete(baseUrl + `mysubgreddiits/${e.target.id}`, config)
        getSubgreddiits()
    }

    function handleModalClose() {
        setOpenModal(false)
        setSgFormData({name: '', description: '', bannedKeywords: '', tags: ''})
    }

    function handleChange(event) {
        setSgFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let tagsArr
        if(sgFormData.tags === '') tagsArr = []
        else tagsArr = sgFormData.tags.split(',')

        const formData = new FormData()
        formData.append('image', image)
        formData.append('name', sgFormData.name)
        formData.append('description', sgFormData.description)
        formData.append('bannedKeywords', sgFormData.bannedKeywords)
        formData.append('tags', tagsArr)
        formData.append('owner', user.username)

        await axios.post(baseUrl, formData, config)

        // await axios.post(baseUrl, {...sgFormData, owner: user.username, tags: tagsArr}, config)
        handleModalClose()
        getSubgreddiits()
    }

    function openSG(e) {
        navigate(`/subgreddiitAnalytics/${e.target.id}`)
    }

    if(!mySubgreddiitsArr) return null

    return (
        <div>
            <Navbar />
            <Box style={{display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'center'}}>
                <Typography style={{marginTop: '20px', color: '#36454f', fontWeight: '900'}} variant='h3'>My Sub Greddiits</Typography>
                <Button onClick={() => setOpenModal(true)} style={{maxWidth: '300px'}} variant='contained'>Create a new Sub Greddiit</Button>
            </Box>
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <Typography align='center' id="modal-modal-title" variant="h6" component="h2">
                        Enter the following details:
                    </Typography>
                    <form style={style2} onSubmit={handleSubmit}>
                        <Textfield
                            style={{minWidth: '350px', margin: '10px auto'}}
                            align='center'
                            variant="outlined"
                            label="Sub Greddiit Name"
                            name='name'
                            onChange={handleChange}
                            value={sgFormData.name}
                            required
                        ></Textfield>
                        <Textfield
                            style={{minWidth: '350px', margin: '10px auto'}}
                            variant="outlined"
                            label="Description"
                            name='description'
                            onChange={handleChange}
                            value={sgFormData.description}
                            required
                        ></Textfield>
                        <Textfield
                            style={{minWidth: '350px', margin: '10px auto'}}
                            variant="outlined"
                            label="Banned Keywords (comma separated)"
                            name='bannedKeywords'
                            onChange={handleChange}
                            value={sgFormData.bannedKeywords}
                        ></Textfield>
                        <Textfield
                            style={{minWidth: '350px', margin: '10px auto'}}
                            variant="outlined"
                            label="Tags (comma separated)"
                            name='tags'
                            onChange={handleChange}
                            value={sgFormData.tags}
                        ></Textfield>
                        <input type='file' onChange={(e) => setImage(e.target.files[0])} />
                        <Button disabled={sgFormData.name === '' || sgFormData.description === '' || !image} type='submit' variant='contained'>Create Sub Greddiit</Button>
                    </form>
                </Box>
            </Modal>
            <Divider style={{margin: '20px'}} />

            {mySubgreddiitsArr.map(sg => (
                <Container key={sg.name} style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: '20px', backgroundColor: 'white', marginBottom: '50px' ,padding: '15px 60px',width: '50%', borderRadius: '20px' ,minHeight: '200px'}}>
                    <Typography variant='h4' align='center' style={{color: '#36454f'}}>{sg.name}</Typography>
                    <Divider style={{margin: '15px 0'}}/>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Description: </span>{sg.description}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Number of users: </span>{JSON.parse(sg.followers).length}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Number of posts: </span>{JSON.parse(sg.posts).length}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Banned Keywords: </span>{sg.bannedKeywords}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Tags: </span></Typography>
                    <Box style={{display: 'flex', gap: '7px'}}>
                        {sg.tags && sg.tags.map(
                            el => <Typography key={uuidv4()} variant='h6'>#{el}</Typography>
                        )}
                    </Box>
                    <Box style={{display: 'flex', gap: '80px', justifyContent: 'center'}}>
                        <Button id={sg._id} onClick={openSG} variant='outlined'>Open</Button>
                        <Button id={sg._id} variant='outlined' onClick={deleteSubgreddiit}>Delete</Button>
                    </Box>
                </Container>
            ))}

        </div>
    )
}