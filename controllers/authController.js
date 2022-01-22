const User = require('../models/User')
const jwt = require('jsonwebtoken')
const path = require('path')
const mongoose = require('mongoose')
const sendMail = require('../utils/mailer')
const PassResetDB = require('../models/PassReset')

function isMongooseError(err) {
	if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.ValidatorError) return true
	return false
}

// handle errors
const handleErrors = (err, res) => {
	if (isMongooseError(err)) return res.status(400).json({ error: err.message })
	if (err.message === 'Invalid Credentials') return res.status(401).json({ error: err.message })
	if (err.message.includes('duplicate key error') && 'email' in err.keyValue)
		return res.status(400).json({ error: 'Email already registered', message: 'Email already registered' })
	console.log(err.message)
	return res.status(500).json({ error: 'ERROR', message: 'Something went wrong' })
}

// create json web token
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: maxAge,
	})
}

// controller actions
module.exports.signup_get = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/html/register.html'))
}

module.exports.login_get = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/html/login.html'))
}

module.exports.signup_post = async (req, res) => {
	const { email, password, location, firstName, lastName, userType } = req.body

	try {
		if (!email || !password || location.length === 0 || !firstName || !lastName)
			return res.status(400).json({ error: 'All the fields are required!' })
		if (password.length <= 5) return res.status(400).json({ error: 'Minimum password length is 6 characters' })
		const user = await User.create({ email, password, location, firstName, lastName, userType })
		const token = createToken(user._id)

		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
		res.cookie('location', user.location, { httpOnly: true, maxAge: maxAge * 1000 })
		res.cookie('userType', user.userType, { httpOnly: true, maxAge: maxAge * 1000 })
		console.log('new user created', user)
		res.status(201).json({
			user: user._id,
			location: user.location,
			firstName: user.firstName,
			lastName: user.lastName,
			userType: user.userType,
		})
	} catch (err) {
		console.log(err.message)
		return handleErrors(err, res)
	}
}

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.login(email, password)
		const token = createToken(user._id)

		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
		res.cookie('location', user.location, { httpOnly: true, maxAge: maxAge * 1000 })
		res.cookie('userType', user.userType, { httpOnly: true, maxAge: maxAge * 1000 })

		res.status(200).json({
			user: user._id,
			location: user.location,
			firstName: user.firstName,
			lastName: user.lastName,
			userType: user.userType,
		})
	} catch (err) {
		return handleErrors(err, res)
	}
}

module.exports.logout_get = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 })
	res.cookie('location', '', { maxAge: 1 })
	res.cookie('userType', '', { maxAge: 1 })

	res.redirect('/')
}

module.exports.forgotPassword_get = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/html/forgot-password.html'))
}

module.exports.forgotPassword_post = async (req, res) => {
	const { email } = req.body

	try {
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ error: 'Email not found', message: 'Email not found' })
		const token = createToken(user._id)
		const expires = Date.now() + 3600000 // 1 hour
		const newPassReset = await PassResetDB.create({
			user: user._id,
			token,
			expires,
		})
		let resetHTML = `
			<p>Hi, ${user.firstName}, <br><br>
			You requested password reset. Please click the link below to reset your password:<br><br>
			<a href="http://${process.env.DOMAIN}/reset-password?query=${token}">Reset Password</a>
			<br><br>
			http://${process.env.DOMAIN}/reset-password?query=${token}
			`
		await sendMail([user.email], 'Reset Password', resetHTML)

		res.status(200).json({ message: 'Email sent. Please note that email reset lint is only valid for 1 hour' })
	} catch (err) {
		console.log(err)
		return handleErrors(err, res)
	}
}

module.exports.resetPassword_get = (req, res) => {
	res.sendFile(path.join(__dirname, '../views/html/password-reset.html'))
}

module.exports.resetPassword_post = async (req, res) => {
	const { password, token } = req.body

	try {
		const passReset = await PassResetDB.findOne({ token })
		if (!passReset) return res.status(400).json({ error: 'Invalid token', message: 'Invalid token' })
		if (Date.now() > passReset.expires) return res.status(400).json({ error: 'Error', message: 'Token expired' })
		const user = await User.findById(passReset.user)
		if (!user) return res.status(401).json({ error: 'Error', message: 'User not found' })
		await user.setPassword(password)
		await user.save()
		await PassResetDB.findByIdAndDelete(passReset._id)
		res.status(200).json({ message: 'Password reset successfully' })
	} catch (err) {
		console.log(err)
		return handleErrors(err, res)
	}
}
