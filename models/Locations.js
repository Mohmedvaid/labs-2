const mongoose = require('mongoose')
const { isEmail } = require('validator')

const customerSchema = new mongoose.Schema(
	{
		location: {
			type: String,
			required: [true, 'Please enter an location'],
			unique: true,
			lowercase: true,
		},
	},
	{
		toJSON: {
			getters: true,
		},
	}
)

const Location = mongoose.model('location', locationSchema)

module.exports = Location
