$(document).ready(function () {
	let locationSelector = $(`.locationSelector`)
	let userLocations = JSON.parse(localStorage.getItem('location'))
	console.log('userLocations', userLocations)
	locationSelector.empty()
	locationSelector.append(`<option selected value="Select a Location">Select a Location</option>`)
	userLocations.forEach((location) => {
		locationSelector.append(
			$('<option>', {
				value: location,
				text: location,
			})
		)
	})
	// Ready ends
})
