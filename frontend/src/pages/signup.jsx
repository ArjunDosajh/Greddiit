import React from 'react'
import './signup.css'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import axios from 'axios'

export default function SignUpPage() {
    function Login() {
        function SignIn() {
            return (
                <div className='form-div'>
                    <TextField
                        style={{width: "30%", margin: '10px auto'}}
                        variant="outlined"
                        label="First Name"
                        type="text"
                        name='firstName'
                        onChange={handleChange}
                        value={formData.firstName}
                        required
                    ></TextField>
                    <TextField
                        style={{width: "30%", margin: '10px auto'}}
                        variant="outlined"
                        label="Last Name"
                        type="text"
                        name='lastName'
                        onChange={handleChange}
                        value={formData.lastName}
                        required
                    ></TextField>
                    <TextField
                        style={{width: "30%", margin: '10px auto'}}
                        variant="outlined"
                        label="Email"
                        type="email"
                        name='email'
                        onChange={handleChange}
                        value={formData.email}
                        required
                    ></TextField>
                    <TextField
                    style={{width: "30%", margin: '10px auto'}}
                        variant="outlined"
                        label="Age"
                        type="text"
                        name='age'
                        onChange={handleChange}
                        value={formData.age}
                        required
                    ></TextField>
                    <TextField
                        style={{width: "30%", margin: '10px auto'}}
                        variant="outlined"
                        label="Contact Number"
                        type="text"
                        name='contactNumber'
                        onChange={handleChange}
                        value={formData.contactNumber}
                        required
                    ></TextField>
                </div>
            )
        }

        const [formData, setFormData] = React.useState(
            {firstName: "", lastName: "", email: "", username: "", password: "", age: "", contactNumber: ""}
        )

        function handleChange(event) {
            setFormData(prevFormData => {
                return {
                    ...prevFormData,
                    [event.target.name]: event.target.value
                }
            })
        }

        const baseUrl = 'http://localhost:8000/api/users/'
        const navigate = useNavigate()
    
        async function handleSubmit(event) {
            event.preventDefault()

            if(login) {
                try {
                    await axios.post(baseUrl + 'login', {
                        username: formData.username,
                        password: formData.password
                    })
                    .then(res => {
                        const token = res.data.token
                        const id = res.data.id
                        const userObj = {id: id, username: formData.username, token: token}
                        localStorage.setItem('user', JSON.stringify(userObj))
                        navigate("/profile")
                    })
                } catch(err) {
                    console.log(err)
                }
            }

            else {
                await axios.post(baseUrl, {
                    ...formData,
                    followers: [],
                    following: []
                })
                .then(res => {
                    const {token, id} = res.data
                    const userObj = {id: id, username: formData.username, token: token}
                    localStorage.setItem('user', JSON.stringify(userObj))
                    navigate("/profile")
                })
            }
        }
        
        return (
            <div>
                <h1 id='title'>Greddiit</h1>
                {login && <h1 className='login-title'>Log in</h1>}
                {!login && <h1 className='login-title'>Sign in</h1>}
                <form onSubmit={handleSubmit}>
                    {!login && SignIn()}
                    <div className='form-div'>
                        <TextField
                            style={{width: "30%", margin: '10px auto'}}
                            variant="outlined"
                            label="Username"
                            name='username'
                            onChange={handleChange}
                            value={formData.username}
                            required
                        ></TextField>
                        <TextField
                            style={{width: "30%", margin: '10px auto'}}
                            variant="outlined"
                            label="Password"
                            type="password"
                            name='password'
                            onChange={handleChange}
                            value={formData.password}
                            required
                        ></TextField>
                        {login && <Button
                            disabled={formData.username === "" || formData.password === ""}
                            type='submit'
                            style={{width: "30%", margin: '10px auto', padding: '10px 10px'}}
                            variant='contained'>
                            Submit
                        </Button>}
                        {!login && <Button
                            disabled={formData.firstName === "" || formData.lastName === "" || formData.email === "" || formData.username === "" || formData.password === "" || formData.age === "" || formData.contactNumber === ""}
                            type='submit'
                            style={{width: "30%", margin: '10px auto', padding: '10px 10px'}}
                            variant='contained'>
                            Submit
                        </Button>}
                    </div>
                </form>
            </div>
        )
    }

    const [login, setLogin] = React.useState(true)

    function loginOrRegister() {
        setLogin(prevLogin => !prevLogin)
    }

    return (
        <div>
            <Login />
            <Typography align='center' variant='h6'>Click here to <span onClick={loginOrRegister} 
            className='login-or-register'>{login ? "Register" : "Login"}</span></Typography>
        </div>
    )
}