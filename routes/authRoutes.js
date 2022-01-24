const { Router } = require('express')
const authController = require('../controllers/authController')
const { isAdmin, isLoggedIn } = require('../middleware/authMiddleware')
const router = Router()

router.post('/register', isAdmin, authController.signup_post)

router.get('/login', isLoggedIn, authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)

router.get('/forgot-password', authController.forgotPassword_get) // html
router.post('/forgot-password', authController.forgotPassword_post) // api

router.get('/reset-password', authController.resetPassword_get) // html
router.post('/reset-password', authController.resetPassword_post) // api

module.exports = router
