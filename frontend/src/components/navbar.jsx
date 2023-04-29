import React from 'react'
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
    function handleClick(e) {
        if(e.target.id === 'logout' || !localStorage.getItem('user')) {
            localStorage.removeItem('user')
            navigate('/login')
        }
        else {
            navigate('/' + e.target.id)
        }
    }
    return (
        <>
            <CssBaseline />
            <AppBar style={{background: "#36454F"}} position="relative">
                <Toolbar>
                    <Typography className='text' variant="h4" sx={{flexGrow: 1}} >Greddiit</Typography>
                    <Stack direction="row" spacing={5}>
                        <div style={{display: 'flex', alignItems: 'center'}} >
                            <AccountCircleIcon style={{}}/>
                            <Button onClick={handleClick} id='profile' style={{color: 'white', fontSize: '18px'}}>Profile</Button>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} >
                            <PersonIcon style={{}}/>
                            <Button onClick={handleClick} id='mysubgreddiits' style={{color: 'white', fontSize: '18px'}}>My Sub Greddiits</Button>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} >
                            <PeopleIcon style={{}}/>
                            <Button onClick={handleClick} id='subgreddiits' style={{color: 'white', fontSize: '18px'}}>Sub Greddiits</Button>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} >
                            <BookmarkIcon style={{}}/>
                            <Button onClick={handleClick} id='savedposts' style={{color: 'white', fontSize: '18px'}}>Saved Posts</Button>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}} >
                            <LogoutIcon style={{}}/>
                            <Button onClick={handleClick} id='logout'style={{color: 'white', fontSize: '18px'}}>Logout</Button>
                        </div>
                    </Stack>

                </Toolbar>
            </AppBar>
        </>
    )
}