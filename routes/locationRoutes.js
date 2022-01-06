const router = require('express').Router()
const locationDB = require('../models/Locations')
const Monoose = require('mongoose')

router.post('/api/location', (req, res) => {
	let location = req.body.name
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
	let userType = req.cookies.userType
	if(!userType || userType.toLowerCase() !== 'admin'){
		return res.status(401).json({ error: 'Unauthorized' })
	}
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


module.exports = router
