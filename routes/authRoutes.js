const { Router } = require('express')
const authController = require('../controllers/authController')
const path = require('path')
const { isAdmin, requireAuth, isLoggedIn } = require('../middleware/authMiddleware')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const router = Router()

router.get('/register', authController.signup_get) //TODO - add middleware for isAdmin and logged in
router.post('/register', authController.signup_post) //TODO - add middleware for isAdmin and logged in
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)

module.exports = router
