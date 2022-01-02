let locationDB = require('./Locations')

function validateUserLocation(userLocation) {
	//console.log(location)
	return locationDB
		.find({ name: userLocation })
		.then((dbLocations) => {
			if (dbLocations.length === 0 || dbLocations.length !== userLocation.length) return false
			let tempLocations = [...dbLocations]
			dbLocations.forEach((dbLocation) => {
				tempLocations.splice(tempLocations.indexOf(dbLocation.name), 1)
			})

			console.log('templocation', tempLocations)
			if (tempLocations.length === 0) return true
			return false
		})
		.catch((err) => {
			console.log(err)
			return false
		})
}
function validateCustomerLocation(customerLocation) {
	return locationDB
		.findOne({ name: customerLocation })
		.then((dbLocations) => {
            console.log('dbLocations', dbLocations)
            console.log('customerLocation', customerLocation)
			if (!dbLocations) return false
			else if (dbLocations.name !== customerLocation) return false
			return true
		})
		.catch((err) => {
			console.log(err)
			return false
		})
}
module.exports = { validateLocation: validateUserLocation, validateCustomerLocation }
