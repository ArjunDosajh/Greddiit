const express = require('express')
const connectDB = require('./config/db')
const port = process.env.PORT || 8000
const colors = require('colors')
const cors = require('cors')

const app = express()
app.listen(port, () => console.log(`server started on port ${port}`.rainbow.underline))

app.use(cors({
    origin: "*",
}))

require('dotenv').config();

connectDB()


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/uploads', express.static('uploads'))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/subgreddiits', require('./routes/subgreddiitRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))