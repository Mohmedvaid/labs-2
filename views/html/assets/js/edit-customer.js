$(document).ready(function () {
	let customerID = window.location.search.substring(1)

	axios.get(`/api/customer/${customerID}`).then((response) => {
		console.log(response.data)
	})

	// Ready ends
})
