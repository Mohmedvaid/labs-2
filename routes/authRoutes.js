const { Router } = require('express')
const authController = require('../controllers/authController')
const path = require('path')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

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
	console.log(req)
	res.sendFile(path.join(__dirname, '../views/html/dashboard.html'))
})

module.exports = router
