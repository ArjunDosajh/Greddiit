import React from 'react'
import Navbar from '../components/navbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';

import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AllSubgreddiitsPage() {
	if(!localStorage.getItem('user')) window.location.href = "http://localhost:3000/login"
	const [joinedSG, setJoinedSG] = React.useState()
	const [unjoinedSG, setUnjoinedSG] = React.useState()
	const [search, setSearch] = React.useState('')
	const [tagsObj, setTagsObj] = React.useState()

	const navigate = useNavigate()
	const user = JSON.parse(localStorage.getItem('user'))

	const config = {
		headers: { Authorization: `Bearer ${user.token}` }
	}

	React.useEffect(() => {
		if (!localStorage.getItem('user')) navigate('/login')
		getSubgreddiitsArr()
	}, [])

	// ------------------------ F I X     T H I S       F U N C T I O N-------------------------
	async function getFilteredSubgreddiitsArr() {
		let sgArr
		const baseUrl = 'http://localhost:8000/api/subgreddiits/filteredSubgreddiits'
		let url = baseUrl
		// console.log(tagsObj)
		let tempTagsArr = tagsObj.filter(el => el.on === true).map(el => el.tag)
		// console.log(tempTagsArr)

		await axios.post(url, {searchStr: search, selectedTagsArr: tempTagsArr, allTagsArr: tagsObj.map(el => el.tag)}, config)
		.then(res => sgArr = res.data)
		
		setJoinedSG(sgArr.filter(sg => JSON.parse(sg.followers).includes(JSON.parse(localStorage.getItem('user')).username)))
	    setUnjoinedSG(sgArr.filter(sg => !JSON.parse(sg.followers).includes(JSON.parse(localStorage.getItem('user')).username)))
	}
	// ------------------------ F I X     T H I S       F U N C T I O N-------------------------

	async function getSubgreddiitsArr() {
		let sgArr
		await axios.get('http://localhost:8000/api/subgreddiits/getAllSubgreddiits', config)
		.then(res => sgArr = res.data)
		let tagsArr = []
		sgArr.forEach(sg => {
			tagsArr = [...tagsArr, ...sg.tags]
		})
		let tagsArr2 = tagsArr.filter((tag, index) => tagsArr.indexOf(tag) === index)
		let tagsArr3 = []
		tagsArr2.forEach(tag => {
			tagsArr3.push({tag: tag, on: false})
		})
		setTagsObj(tagsArr3)
		setJoinedSG(sgArr.filter(sg => JSON.parse(sg.followers).includes(JSON.parse(localStorage.getItem('user')).username)))
	    setUnjoinedSG(sgArr.filter(sg => !JSON.parse(sg.followers).includes(JSON.parse(localStorage.getItem('user')).username)))
	}

	// if(!filteredArr) return null
	if(!joinedSG || !unjoinedSG) return null

	function handleSearch(e) {
		setSearch(e.target.value)
		getFilteredSubgreddiitsArr()
	}

	function handleTagSwitch(e) {
		let copy = [...tagsObj]
		for(let i=0; i<tagsObj.length; i++) {
			if(tagsObj[i].tag === e.target.id) {
				copy[i].on = !copy[i].on
			}
		}
		setTagsObj(copy)
		getFilteredSubgreddiitsArr()
	}

	async function joinSG(e) {
		console.log("join this sg!")
		let currSg
		await axios.post('http://localhost:8000/api/subgreddiits/getSubgreddiitById', {id: e.target.id}, config)
		.then(res => currSg = res.data)
		let arr = JSON.parse(currSg.requests)
		arr.push(user.username)
		await axios.put('http://localhost:8000/api/subgreddiits/updateSubgreddiit', {
			...currSg,
			requests: JSON.stringify(arr)
		}, config)
		getFilteredSubgreddiitsArr()
	}

	async function leaveSG(e) {
		console.log("leave this sg!")
		let currSg
		await axios.post('http://localhost:8000/api/subgreddiits/getSubgreddiitById', {id: e.target.id}, config)
		.then(res => currSg = res.data)
		let arr = JSON.parse(currSg.followers)
		arr.splice(arr.indexOf(user.username), 1)
		currSg.followers = JSON.stringify(arr)

		await axios.put('http://localhost:8000/api/subgreddiits/updateSubgreddiit', {
			...currSg,
			followers: JSON.stringify(arr)
		}, config)
		getFilteredSubgreddiitsArr()
	}

	async function openSG(e) {
		console.log("open this sg!")
		console.log(e.target.id)
		navigate(`/subgreddiitPage/${e.target.id}`)
	}

	return (
		<div>
			<Navbar />
			<Box style={{margin: '15px 0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<TextField 
					variant='standard'
					label='Search'
					style={{width: '600px'}}
					onChange={handleSearch}
					value={search}
					InputProps={{
						endAdornment: <InputAdornment position='end'><SearchIcon /></InputAdornment>
					}}
				/>

				<Accordion style={{margin: '20px', width: '800px'}}>
					<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
					>
						<Typography style={{margin: 'auto'}}>Filter By Tags</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Box>
							<Grid container spacing={0}>
								{tagsObj.map(tagObj => (
									<Grid item container md={2.4}  key={uuidv4()}>
										<FormGroup>
											<FormControlLabel labelPlacement="start" onChange={handleTagSwitch} control={<Switch checked={tagObj.on} id={tagObj.tag} />} label={tagObj.tag} />
										</FormGroup>
									</Grid>
								))}
							</Grid>
						</Box>
					</AccordionDetails>
				</Accordion>

			</Box>
			{joinedSG.length && <Typography variant='h3' align='center' fontWeight={900} style={{color: '#36454f'}}>Joined Subgreddits</Typography>}
			{joinedSG.map(sg => (
                <Container key={sg.name} style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: '20px', backgroundColor: 'white', marginTop: '30px', padding: '15px 60px',width: '50%', borderRadius: '20px' ,minHeight: '200px'}}>
                    <Typography variant='h4' align='center' style={{color: '#36454f'}}>{sg.name}</Typography>
                    <Divider style={{margin: '15px 0'}}/>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Description: </span>{sg.description}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Number of users: </span>{JSON.parse(sg.followers).length}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Number of posts: </span>{JSON.parse(sg.posts).length}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Banned Keywords: </span>{sg.bannedKeywords}</Typography>
                    <Typography variant='h6' style={{color: '#626262'}}>Tags: </Typography>
                    <Box style={{display: 'flex', gap: '7px'}}>
                        {sg.tags && sg.tags.map(
                            el => <Typography key={uuidv4()} variant='h6'>#{el}</Typography>
                        )}
                    </Box>
					<Box style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
						<Button id={sg._id} variant='contained' onClick={openSG}>Open Subgreddiit</Button>
						<Button id={sg._id} disabled={sg.owner === user.username} variant='outlined' onClick={leaveSG}>Leave Subgreddiit</Button>
					</Box>
                </Container>
            ))}
			{unjoinedSG.length && <Typography variant='h3' align='center' fontWeight={900} style={{marginTop: '30px', color: '#36454f'}}>Other Subgreddits</Typography>}
			{unjoinedSG.map(sg => (
                <Container key={sg.name} style={{boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px', borderRadius: '20px', backgroundColor: 'white', marginTop: '30px', padding: '15px 60px',width: '50%', borderRadius: '20px' ,minHeight: '200px'}}>
                    <Typography variant='h4' align='center' style={{color: '#36454f'}}>{sg.name}</Typography>
                    <Divider style={{margin: '15px 0'}}/>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Description: </span>{sg.description}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Number of users: </span>{JSON.parse(sg.followers).length}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Number of posts: </span>{JSON.parse(sg.posts).length}</Typography>
                    <Typography variant='h6'><span style={{color: '#626262'}}>Banned Keywords: </span>{sg.bannedKeywords}</Typography>
                    <Typography variant='h6' style={{color: '#626262'}}>Tags: </Typography>
                    <Box style={{display: 'flex', gap: '7px'}}>
                        {sg.tags && sg.tags.map(
                            el => <Typography key={uuidv4()} variant='h6'>#{el}</Typography>
                        )}
                    </Box>
					<Box style={{display: 'flex', justifyContent: 'center', gap: '15px'}}>
						<Button id={sg._id} variant='contained' onClick={openSG}>Open Subgreddiit</Button>
						{JSON.parse(sg.requests).includes(user.username) ?
						<Button id={sg._id} variant='outlined' disabled onClick={joinSG}>Request Sent</Button>
						: <Button id={sg._id} variant='outlined' onClick={joinSG}>Join Subgreddiit</Button>
						}
					</Box>
                </Container>
            ))}
		</div>
  )
}

export default AllSubgreddiitsPage