const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const tokenSchema = new mongoose.Schema({
	token: String,
	expires: Date,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
})

const PassReset = mongoose.model('PassReset', tokenSchema)

module.exports = PassReset
