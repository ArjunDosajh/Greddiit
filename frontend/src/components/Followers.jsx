import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import axios from 'axios'

function Followers() {
    const baseUrl = 'http://localhost:8000/api/users/'
    const [userDetails, setUserDetails] = React.useState()
    const user = JSON.parse(localStorage.getItem('user'))
    
    React.useEffect(() => {
        getUser()
    }, [userDetails])

    async function getUser() {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        }
        
        await axios.get(baseUrl + 'me', config).then(response => {
            setUserDetails(response.data)
        })
    }
    

    if(!userDetails) return null
    
    const arr = JSON.parse(userDetails.followers)

    async function handleClick(e) {
        console.log(`${e.target.id} unfollowed ${user.username}`)
        await axios.post('http://localhost:8000/api/users/unfollow', {user1: e.target.id, user2: user.username})
        getUser()
    }

    return (
        <div>
            {arr.length === 0 && <Typography variant='h4' align='center'>No followers</Typography>}
            {arr.map(person => (
                <Box key={person} style={{display: 'flex', gap: '20px', justifyContent: 'center', margin: '15px auto'}}>
                    <Typography variant='h6'>{person}</Typography>
                    <Button onClick={handleClick} id={person} variant='outlined'>Remove</Button>
                </Box>
            ))}
        </div>
    )
}

export default Followers