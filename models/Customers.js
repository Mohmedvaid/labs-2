const mongoose = require('mongoose')
const { isEmail } = require('validator')
const { validateLocation, validateCustomerLocation } = require('./helper')
const moment = require('moment-timezone')

const customerSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Please enter an email'],
			lowercase: true,
		},
		address: {
			type: String,
			required: [true, 'Please enter a address'],
		},
		location: {
			type: String,
			validate: {
				validator: validateCustomerLocation,
				message: () => 'Invalid location',
			},
		},
		firstName: {
			type: String,
			required: [true, 'Please enter a first name'],
		},
		lastName: {
			type: String,
			required: [true, 'Please enter a last name'],
		},
		phone: {
			type: String,
			required: [true, 'Please enter a phone number'],
		},
		image: {
			name: String,
			assetType: String,
			path: String,
			awsData: mongoose.Schema.Types.Mixed,
		},
		imageType: {
			type: String,
		},
		testData: {
			type: String,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		customerSignature: {
			type: String,
			required: true,
		},
		dob: {
			type: Date,
			required: true,
			get: formatDOB,
		},
		qrCodeUrl: {
			type: String,
			required: true,
		},
		testResults: [
			{
				name: String,
				assetType: String,
				path: String,
				awsData: mongoose.Schema.Types.Mixed,
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		isDuplicate: {
			type: Number,
			default: 0,
		},
	},
	{
		toJSON: {
			getters: true,
		},
	}
)

// function convertBufferToBase64(buffer) {
// 	//console.log("Image!!!", this.imageType);
// 	if (buffer != null && this.imageType != null) {
// 		return `data:${this.imageType};charset=utf-8;base64,${buffer.toString('base64')}`
// 	}
// }

// function convertToAsset(data) {
// 	if (data) {
// 		return `data:${this.imageType};charset=utf-8;base64,${buffer.toString('base64')}`
// 	}
// }

function formatDOB(dob) {
	return dob.toLocaleDateString('en-us')
}

const Customer = mongoose.model('customer', customerSchema)

module.exports = Customer
