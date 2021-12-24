const mongoose = require('mongoose')
const { isEmail } = require('validator')

const customerSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Please enter an email'],
			unique: true,
			lowercase: true,
			unique: true,
		},
		address: {
			type: String,
			required: [true, 'Please enter a address'],
		},
		location: {
			type: String,
			enum: ['chicago', 'super', 'skokie'],
		},
		firstName: {
			type: String,
			required: [true, 'Please enter a first name'],
		},
		lastName: {
			type: String,
			required: [true, 'Please enter a last name'],
		},
		image: {
			type: Buffer,
			get: convertBufferToBase64,
		},
		imageType: {
			type: String,
			required: [true, 'Please enter a image type'],
		},
		testData: {
			type: String,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: {
			getters: true,
		},
	}
)

customerSchema.virtual('idImagePath').get(function () {
	if (this.image != null && this.imageType != null) {
		return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
	}
})
function convertBufferToBase64(buffer) {
	if (buffer != null && this.imageType != null) {
		return `data:${this.imageType};charset=utf-8;base64,${buffer.toString('base64')}`
	}
}

const Customer = mongoose.model('customer', customerSchema)

module.exports = Customer
