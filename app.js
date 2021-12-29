const express = require('express')
//const router = require('express').Router();
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const customerRoutes = require('./routes/customerRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
require('dotenv').config()
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

// middleware
app.use(express.static('views/html'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// database connection
mongoose
	.connect(process.env.MONGODB_URI || 'mongodb://localhost/lab', {
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then((res) => console.log('Connected to db!'))

// routes
app.get('*', checkUser)

app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes)
app.use(customerRoutes)

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}!`)
})
