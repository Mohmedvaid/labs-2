const jwt = require('jsonwebtoken')
const User = require('../models/User')

const return401 = (res) => {
	return res.status(401).send('<h1>Unauthorized</h1><br><p>Please <a href=/login> login</a> to continue</p>')
}

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt
	// check json web token exists & is verified
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				console.log(err.message)
				res.redirect('/login')
			} else {
				let user = await User.findById(decodedToken.id)
				if (!user) return return401(res)
				req.user = decodedToken
				next()
			}
		})
	} else {
		return return401(res)
	}
}

const isLoggedIn = (req, res, next) => {
	const token = req.cookies.jwt
	if (!token) return next()
	jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
		if (err) {
			console.log(err.message)
			return next()
		} else {
			let user = await User.findById(decodedToken.id)
			if (user.userType === 'admin') return res.redirect('/dashboard')
			else if (user.userType === 'user') return res.redirect('/customers')
			else return next()
		}
	})
}

// check current user
const checkUser = (req, res, next) => {
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
	try {
		const userType = req.cookies.userType
		const token = req.cookies.jwt
		// check json web token exists & is verified
		if (userType) {
			jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
				if (err) {
					console.log(err.message)
					return return401(res)
				} else {
					let user = await User.findById(decodedToken.id)
					if (!user)
						return res.status(401).send('<h1>Unauthorized</h1><br><p>Please <a href=/login> login</a> to continue</p>')
					if (user.userType === 'admin') next()
					else {
						return res.status(401).send('Unauthorized')
					}
				}
			})
		} else {
			return res.status(401).send('<h1>Unauthorized</h1><br><p>Please <a href=/login> login</a> to continue</p>')
		}
	} catch (err) {
		console.log(err)
		return res.status(500).send('Server Error')
	}
}

module.exports = { requireAuth, checkUser, isLoggedIn, isAdmin }
