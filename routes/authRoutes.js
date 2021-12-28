const { Router } = require('express')
const authController = require('../controllers/authController')
const path = require('path')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const router = Router()

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)

//html
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../views/html/home.html'))
})
router.get('/dashboard', requireAuth, (req, res) => {
	res.sendFile(path.join(__dirname, '../views/html/dashboard.html'))
})
router.get('/customers', requireAuth, (req, res) => {
	res.sendFile(path.join(__dirname, '../views/html/customers.html'))
})

router.get('/edit-customer', requireAuth, (req, res) => {
	const token = req.cookies.jwt
	jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
		if (err) {
			return res.redirect('/login')
		} else {
			let user = await User.findById(decodedToken.id)
			if (user.location.toLowerCase() === 'all') {
				return res.sendFile(path.join(__dirname, '../views/html/edit-customer.html'))
			} else {
				return res.redirect('/dashboard')
			}
		}
	})
	//res.sendFile(path.join(__dirname, '../views/html/edit-customer.html'))
})

module.exports = router
