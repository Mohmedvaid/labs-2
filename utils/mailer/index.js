'use strict'
const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function (sendTo, subject, body) {
	if (sendTo.length == 0 || !subject || !body) return false
	let sendToString = sendTo.length === 1 ? sendTo[0] : sendTo.join(',')

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.zoho.com',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASS,
		},
	})

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"ZoomLabCare Support Team" <info@zoomlabcare.com>', // sender address
		to: sendToString, // list of receivers
		subject: subject, // Subject line
		html: body, // html body
	})

	console.log('Message sent: %s', info.messageId)
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
