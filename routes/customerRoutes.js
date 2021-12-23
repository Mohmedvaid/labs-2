const router = require('express').Router()

const db = require('../models/Customers')

router.post('/api/customer', ({ body }, res) => {
	let customer = {
		firstName: body.firstName,
		lastName: body.lastName,
		email: body.email,
		address: body.address,
		location: body.location,
	}
	return db
		.create(customer)
		.then((newCustomer) => res.json(newCustomer))
		.catch((err) => {
			console.log(err.message)
			return res.status(400).json(err)
		})
})

router.get('/api/customer', (req, res) => {
	db.find({})
		.then((customer) => {
			res.json(customer)
		})
		.catch((err) => {
			res.json(err)
		})
})

router.put('/api/customer/:id', (req, res) => {
	let id = req.params.id
	db.findOneAndUpdate({ _id: id }, { $push: { exercises: req.body } }, { new: true })
		.then((dbWorkout) => {
			console.log(dbWorkout)
			function totalDuration() {
				let totalDuration = 0
				dbWorkout.exercises.forEach((exercise) => {
					totalDuration += exercise.duration
					return totalDuration
				})
				db.findOneAndUpdate({ _id: id }, { totalDuration: totalDuration }).then(
					(updatedWorkout) => {
						res.json(updatedWorkout)
					}
				)
				// dbWorkout.totalDuration = totalDuration;
				// console.log("dbWorkout Duration in the func: "+ dbWorkout.totalDuration);
			}

			totalDuration()
			// console.log(dbWorkout)
			// .then(res.json(dbWorkout))
		})

		.catch((err) => {
			res.json(err)
		})
})

module.exports = router
