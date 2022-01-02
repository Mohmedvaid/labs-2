$(document).ready(function () {
	let userType = JSON.parse(localStorage.getItem('userType'))
	let location = localStorage.getItem('location')

	console.log('userType', userType)
	console.log('userType', userType)
	if (userType.toLowerCase() === 'admin') {
		$(`#sideBarDashboardLink`).show()
	} else {
		$(`#sideBarDashboardLink`).hide()
	}

	// Ready ends
})
