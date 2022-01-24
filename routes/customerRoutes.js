require('dotenv').config()
const router = require('express').Router()
const customerDB = require('../models/Customers')
const QRCode = require('qrcode')
const domainName = process.env.DOMAIN
const isValidMongoID = require('../helpers/isValidMongoID')
const multer = require('multer')
const uuid = require('uuid').v4
const { isAdmin, requireAuth } = require('../middleware/authMiddleware')

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

router.post('/api/customer', requireAuth, awsUpload.single('idImage'), (req, res) => {
	let body = req.body
	let user = req.user
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
	let query = {
		$or: [
			{ email: customer.email },
			{ phone: customer.phone },
			{ $and: [{ firstName: customer.firstName }, { lastName: customer.lastName }] },
		],
	}
	return customerDB
		.find(query)
		.sort({ createdAt: -1 })
		.exec()
		.then((dup_key) => {
			if (dup_key.length !== 0) {
				let todaysDate = new Date()
				let oldCustomerDate = new Date(dup_key[0].createdAt)
				let diffInTime = todaysDate.getTime() - oldCustomerDate.getTime()
				let diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24))
				if (diffInDays <= 15) {
					customer.isDuplicate = dup_key.length
				}
			}
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
	let qrCodeUrl = `http://${domainName}/myinfo?id=${customer._id}`
	if (!customer) throw { error: 'customer needed' }
	console.log(qrCodeUrl)
	return QRCode.toDataURL(qrCodeUrl).then((url) => {
		customer.qrCodeUrl = url
		return customer
	})
}

router.get('/api/customer', requireAuth, (req, res) => {
	const location = req.cookies.location
	const userType = req.cookies.userType
	let query
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
			return res.json(customer)
		})
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

// GET customers by users
router.get('/api/customers/byUser/:userID', requireAuth, isAdmin, (req, res) => {
	const userType = req.cookies.userType
	const fromDate = req.query.fromDate
	const toDate = req.query.toDate
	const userID = req.params.userID
	let query
	if (!fromDate) return res.status(400).json({ error: 'fromDate is required' })
	if (!toDate) return res.status(400).json({ error: 'toDate is required' })
	if (userType.toLowerCase() !== 'admin') return res.status(401).json({ error: 'Unauthorized' })
	query = {
		createdBy: userID,
		createdAt: {
			$gte: fromDate,
			$lte: toDate,
		},
	}
	customerDB
		.find(query)
		.then((customer) => {
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
	customerDB
		.findOneAndUpdate({ _id: id }, customerInfo, { new: true })
		.then((customer) => {
			return res.json(customer)
		})
		.catch((err) => {
			console.log(err)
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
		.findOneAndUpdate({ _id: customerID }, { $push: { testResults: { $each: assets } } }, { new: true })
		.then((customer) => {
			return res.json(customer)
		})
		.catch((err) => {
			console.log(err)
			res.status(400).json(err)
		})
})

router.delete('/api/customer/:id', (req, res) => {
	let id = req.params.id
	customerDB
		.findOneAndRemove({ _id: id })
		.then((customer) => {
			return res.json(customer)
		})
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

router.get('/api/myinfo/:id', (req, res) => {
	let id = req.params.id
	customerDB
		.findOne({ _id: id })
		.then((customer) => {
			if (!customer) return res.status(400).json({ error: 'customer not found' })
			return res.json(customer)
		})
		.catch((err) => {
			console.log(err)
			res.status(400).json(err)
		})
})

module.exports = router
