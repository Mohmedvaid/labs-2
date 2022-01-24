$(document).ready(function () {
	let userType = JSON.parse(localStorage.getItem('userType'))
	let location = localStorage.getItem('location')

	if (userType.toLowerCase() === 'admin') {
		$(`#sideBarDashboardLink`).show()
	} else {
		$(`#sideBarDashboardLink`).hide()
		$(`.breadcrumb`).hide()
	}

	// Ready ends
})
