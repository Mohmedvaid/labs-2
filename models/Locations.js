const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema(
	{
		name: {
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
