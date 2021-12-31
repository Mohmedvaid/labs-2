const router = require('express').Router()
const locationDB = require('../models/Locations')
const Monoose = require('mongoose')

router.post('/api/location', (req, res) => {
	let location = req.body.name
	console.log(req.body.name)
	if (!location)
		return res.status(400).json({ error: 'No Location found', message: 'Location is required' })
	return locationDB
		.find({ name: req.body.name })
		.then((dup_key) => {
			if (dup_key.length !== 0)
				throw { error: 'Duplicate location', message: 'Location already added' }
			return
		})
		.then(() => new locationDB({ name:location }))
		.then((newLocation) => newLocation.save())
		.then((newLocation) => res.json(newLocation))
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

router.get('/api/location', (req, res) => {
	let location = req.body.location
	if (!location)
		return res.status(400).json({ error: 'No Location found', message: 'Location is required' })
	return locationDB
		.find({})
		.then((locations) => {
			return res.json(locations)
		})
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

// GET specific customer
router.get('/api/customer/:id', (req, res) => {
	let location = req.cookies.location
	if (location.toLowerCase() === 'all' && isValidMongoID(req.params.id)) {
		return locationDB
			.findOne({ _id: req.params.id })
			.then((customer) => res.json(customer))
			.catch((err) => {
				console.log(err)
				return res.status(400).json(err)
			})
	}
	return res.status(401).json({ error: 'Unauthorized' })
})

module.exports = router
