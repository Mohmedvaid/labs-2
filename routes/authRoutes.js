const { Router } = require('express')
const authController = require('../controllers/authController')
const { isAdmin, isLoggedIn } = require('../middleware/authMiddleware')

const router = Router()

router.get('/register', isLoggedIn, isAdmin, authController.signup_get) //TODO - add middleware for isAdmin and logged in
router.post('/register', isLoggedIn, isAdmin, authController.signup_post) //TODO - add middleware for isAdmin and logged in
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)

module.exports = router
