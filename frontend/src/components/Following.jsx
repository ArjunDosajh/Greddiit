import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import axios from 'axios'

function Following() {
    const baseUrl = 'http://localhost:8000/api/users/'
    const [userDetails, setUserDetails] = React.useState()
    const user = JSON.parse(localStorage.getItem('user'))
    
    async function getUser() {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        }
        
        await axios.get(baseUrl + 'me', config).then(response => {
            setUserDetails(response.data)
        })
    }
    
    React.useEffect(() => {
        getUser()
    }, [userDetails])

    if(!userDetails) return null
    
    const arr = JSON.parse(userDetails.following)
    

    async function handleClick(e) {
        console.log(`${user.username} unfollowed ${e.target.id}`)
        await axios.post('http://localhost:8000/api/users/unfollow', {user1: user.username, user2: e.target.id})
        getUser()
    }

    return (
        <div>
            {arr.length === 0 && <Typography variant='h4' align='center'>You are not following any user</Typography>}
            {arr.map(person => (
                <Box key={person} style={{display: 'flex', gap: '20px', justifyContent: 'center', margin: '15px auto'}}>
                    <Typography variant='h6'>{person}</Typography>
                    <Button onClick={handleClick} id={person} variant='outlined'>Unfollow</Button>
                </Box>
            ))}
        </div>
    )
}

export default Following