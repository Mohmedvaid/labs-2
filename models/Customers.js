const mongoose = require('mongoose')
const { isEmail } = require('validator')

const customerSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		unique: true,
		lowercase: true,
		validate: [isEmail, 'Please enter a valid email'],
	},
	address: {
		type: String,
		required: [true, 'Please enter a address'],
	},
	location: {
		type: String,
		enum: ['Chicago', 'Super', 'Skokie'],
	},
	firstName: {
		type: String,
		required: [true, 'Please enter a first name'],
	},
	lastName: {
		type: String,
		required: [true, 'Please enter a last name'],
	},
})

const Customer = mongoose.model('customer', customerSchema)

module.exports = Customer
