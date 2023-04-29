import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/navbar'
import Followers from '../components/Followers'
import Following from '../components/Following'

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'

export default function Profile() {
    if(!localStorage.getItem('user')) window.location.href = "http://localhost:3000/login"
    const navigate = useNavigate()
    const [choice, setChoice] = React.useState('editProfile')
    const [userDetails, setUserDetails] = React.useState()
    const [btnDisable, setBtnDisable] = React.useState(true)

    let token
    if(!localStorage.getItem('user')) {
        window.location.href = 'http://localhost:3000/login';
    }
    token = JSON.parse(localStorage.getItem('user')).token
    if (!token) {
        localStorage.removeItem('user')
        window.location.href = 'http://localhost:3000/login';
	}

    
    const baseUrl = 'http://localhost:8000/api/users/'
    async function getUser() {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        await axios.get(baseUrl + 'me', config).then(response => {
            setUserDetails(response.data)
        })
    }

    React.useEffect(() => {
        getUser()
    }, [])

    if(!userDetails) return null

    async function handleSubmit(e) {
        e.preventDefault()
        setBtnDisable(true)
        token = JSON.parse(localStorage.getItem('user')).token
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        }
        // console.log(userDetails)
        await axios.put(baseUrl + 'updateuser', userDetails, config)
    }

    const handleChange = (event) => {
        setBtnDisable(false)
        setUserDetails(prevUserDetails => {
            return {
                ...prevUserDetails,
                [event.target.name]: event.target.value
            }
        })
    }

    const handleChoiceChange = (e) => {
        setChoice(e.target.id)
        console.log(choice)
    }

    return (
        <div>
            <Navbar />
            <Typography style={{marginTop: '20px', color: '#36454f', fontWeight: '900'}} align='center' variant='h2'>Your Profile</Typography>
            <ButtonGroup style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}} variant="text" aria-label="text button group">
                <Button style={{color: '#262626'}} id='editProfile' onClick={handleChoiceChange}>Edit Profile</Button>
                <Button style={{color: '#262626'}} id='followers' onClick={handleChoiceChange}>{JSON.parse(userDetails.followers).length} Followers</Button>
                <Button style={{color: '#262626'}} id='following' onClick={handleChoiceChange}>{JSON.parse(userDetails.following).length} Following</Button>
            </ButtonGroup>
            {choice === 'editProfile' &&
                <div>
                <form onSubmit={handleSubmit}>
                    <Box style={{display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'center'}}>
                        <TextField style={{minWidth: '400px'}}
                            variant="outlined"
                            label="First Name"
                            name='firstName'
                            onChange={handleChange}
                            value={userDetails.firstName}
                        ></TextField>
                        <TextField style={{minWidth: '400px'}}
                            variant="outlined"
                            label="Last Name"
                            name='lastName'
                            onChange={handleChange}
                            value={userDetails.lastName}
                        ></TextField>
                        <TextField style={{minWidth: '400px'}}
                            variant="outlined"
                            label="Email"
                            name='email'
                            type='email'
                            onChange={handleChange}
                            value={userDetails.email}
                        ></TextField>
                        <TextField style={{minWidth: '400px'}}
                            variant="outlined"
                            label="Contact Number"
                            name='contactNumber'
                            onChange={handleChange}
                            value={userDetails.contactNumber}
                        ></TextField>
                        <TextField style={{minWidth: '400px'}}
                            variant="outlined"
                            label="Age"
                            name='age'
                            onChange={handleChange}
                            value={userDetails.age}
                        ></TextField>
                        <Button disabled={btnDisable} type='submit' style={{padding: '10px 20px'}} variant='contained'>Save Changes</Button>
                    </Box>
                </form>
            </div>
            }
            {choice === 'followers' && <Followers />}
            {choice === 'following' && <Following />}
        </div>
    )
}