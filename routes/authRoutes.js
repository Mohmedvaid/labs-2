const { Router } = require('express');
const authController = require('../controllers/authController');
const path = require('path');
const { requireAuth, isLoggedIn } = require('../middleware/authMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = Router();

router.get('/register.html', isLoggedIn, authController.signup_get)
router.post('/register', authController.signup_post);
router.get('/login.html', isLoggedIn, authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get);

module.exports = router;
