const router = require('express').Router()
const customerDB = require('../models/Customers')
const Monoose = require('mongoose')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images']
const QRCode = require('qrcode')
const domainName = 'http://localhost:3000'
const isValidMongoID = require('../helpers/isValidMongoID')
const multer = require('multer')
const uuid = require('uuid').v4
const { checkUser, isAdmin, requireAuth } = require('../middleware/authMiddleware')

//  Local uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${uuid()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// AWS uploads
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const path = require('path')

const s3 = new aws.S3({
	apiVersion: '2006-03-01',
})

const awsUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'cov-lab-bucket', // name of the bucket on aws
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname })
		},
		key: function (req, file, cb) {
			cb(null, `${uuid()}-${file.originalname}`)
		},
	}),
})

router.post('/api/customer',requireAuth ,awsUpload.single('idImage'), (req, res) => {
	let body = req.body
	let user = req.user
	console.log(req.user)
	let idImage = {
		name: req.file.originalname,
		assetType: req.file.mimetype,
		path: req.file.location,
		awsData: req.file,
	}
	let customer = {
		firstName: body.firstname,
		lastName: body.lastname,
		email: body.email,
		address: body.address,
		location: body.location.toLowerCase(),
		image: idImage,
		dob: body.dob,
		customerSignature: body.customerSignature,
		phone: body.phone,
		createdBy: user.id,
	}

	return customerDB
		.find({ email: customer.email })
		.then((dup_key) => {
			if (dup_key.length !== 0) throw { error: 'Duplicate email', message: 'Email already added' }
			return
		})
		.then(() => new customerDB(customer))
		.then(generateAndSaveQRCode)
		.then((newCustomer) => newCustomer.save())
		.then((newCustomer) => res.json(newCustomer))
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

function generateAndSaveQRCode(customer) {
	let qrCodeUrl = `${domainName}/myinfo/${customer._id}`
	if (!qrCodeUrl) throw { error: 'Public url is required' }
	return QRCode.toDataURL(qrCodeUrl).then((url) => {
		customer.qrCodeUrl = url
		return customer
	})
}

router.get('/api/customer', (req, res) => {
	const location = req.cookies.location
	const userType = req.cookies.userType
	let query
	console.log(location)
	if (location === undefined || userType === undefined) {
		return res.status(401).json({ error: 'Unauthorized' })
	}
	// FIX THIS BECAUSE LOCATION IS NOT A STRING BUT AN ARRAY
	if (userType.toLowerCase() === 'admin') {
		query = {}
	} else {
		query = { location: { $in: location } }
	}
	customerDB
		.find(query)
		.then((customer) => {
			console.log(customer)
			return res.json(customer)
		})
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

// GET specific customer
router.get('/api/customer/:id', (req, res) => {
	let location = req.cookies.location
	if (isValidMongoID(req.params.id)) {
		return customerDB
			.findOne({ _id: req.params.id })
			.then((customer) => res.json(customer))
			.catch((err) => {
				console.log(err)
				return res.status(400).json(err)
			})
	}
	return res.status(401).json({ error: 'Unauthorized' })
})

// UPDATE customer
router.put('/api/customer/:id', (req, res) => {
	let id = req.params.id,
		customerInfo = req.body
	console.log(req.file)
	res.json('success')
	customerDB
		.findOneAndUpdate({ _id: id }, customerInfo, { new: true })
		.then((customer) => {
			return res.json(customer)
		})
		.catch((err) => {
			res.json(err)
		})
})

// handle file uploads for customer (test results)
router.put('/api/customer/upload/:id', awsUpload.array('testResults'), (req, res) => {
	let customerID = req.params.id
	let assets = req.files.map((file) => {
		return {
			name: file.originalname,
			assetType: file.mimetype,
			path: file.location,
			awsData: file,
		}
	})

	customerDB
		.findOneAndUpdate(
			{ _id: customerID },
			{ $push: { testResults: { $each: assets } } },
			{ new: true }
		)
		.then((customer) => {
			return res.json(customer)
		})
		.catch((err) => {
			console.log(err)
			res.status(400).json(err)
		})
})

// function saveImage(customer, encodedImage) {
//   if (encodedImage === undefined || encodedImage === null) {
//     return null;
//   }
//   const image = JSON.parse(encodedImage);
//   // if (image != null || imageMimeTypes.includes(image.type)) {
//   // }
//   customer.image = new Buffer.from(image.data, 'base64');
//   customer.imageType = image.type;
//   return customer;
// }

// Edit permissions

module.exports = router
