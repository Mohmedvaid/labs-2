const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt
	// check json web token exists & is verified
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			if (err) {
				console.log(err.message)
				res.redirect('/login')
			} else {
				console.log(decodedToken)
				req.user = decodedToken
				next()
			}
		})
	} else {
		res.redirect('/login')
	}
}

const isLoggedIn = (req, res, next) => {
	const token = req.cookies.jwt
	console.log('token', token)
	if (!token) return next()
	jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
		if (err) {
			console.log(err.message)
			return next()
		} else {
			console.log(decodedToken)
			let user = await User.findById(decodedToken.id)
			if (user.userType === 'admin') return res.redirect('/dashboard')
			else if (user.userType === 'user') return res.redirect('/customers')
			else return next()
		}
	})
}

// check current user
const checkUser = (req, res, next) => {
	console.log('checkUser called')
	const token = req.cookies.jwt
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				res.locals.user = null
				next()
			} else {
				let user = await User.findById(decodedToken.id)
				res.locals.user = user
				next()
			}
		})
	} else {
		res.locals.user = null
		next()
	}
}
const isAdmin = (req, res, next) => {
	const userType = req.cookies.userType
	const token = req.cookies.jwt
	// check json web token exists & is verified
	console.log('userType', userType)
	if (userType) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				console.log(err.message)
				res.redirect('/login')
			} else {
				let user = await User.findById(decodedToken.id)
				if (user.userType === 'admin') next()
				else {
					res.status(401).send('Unauthorized')
				}
			}
		})
	} else {
		res.redirect('/login')
	}
}

module.exports = { requireAuth, checkUser, isLoggedIn, isAdmin }
